import express from "express";
import { getUsers } from "../data/users";
import { getPostsByUser } from "../data/posts";
import { getCommentsByPost } from "../data/comments";
import cache from "../services/cache";
import { getCachedTopUsers } from "../services/api";

interface TopUser {
  id: string;
  name: string;
  commentCount: number;
}

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if we have pre-computed top users
    const cachedTopUsers = getCachedTopUsers();
    
    if (cachedTopUsers) {
      return res.json({ topUsers: cachedTopUsers });
    }
    
    // If not pre-computed, check if we have it in route cache
    const cacheKey = "top_users";
    const routeCachedTopUsers = cache.get<TopUser[]>(cacheKey);
    
    if (routeCachedTopUsers) {
      return res.json({ topUsers: routeCachedTopUsers });
    }

    // If not in cache, compute
    const users = await getUsers();
    if (!users || typeof users !== 'object') {
      console.error("Invalid users response:", users);
      return res.status(500).json({ error: "Invalid users data from API" });
    }

    // Create a map to store comment counts for each user
    const commentCountMap: { [userId: string]: number } = {};

    // Process each user's posts and comments
    await Promise.all(
      Object.keys(users).map(async (userId) => {
        try {
          const posts = await getPostsByUser(userId);
          
          if (!Array.isArray(posts)) {
            console.error(`Invalid posts response for user ${userId}:`, posts);
            commentCountMap[userId] = 0;
            return;
          }
          
          let totalComments = 0;

          // Count comments for each post
          await Promise.all(
            posts.map(async (post: any) => {
              try {
                if (!post || !post.id) {
                  console.warn("Invalid post object:", post);
                  return;
                }
                
                const comments = await getCommentsByPost(post.id);
                totalComments += Array.isArray(comments) ? comments.length : 0;
              } catch (postError) {
                console.error(`Error processing post ${post?.id} for user ${userId}:`, postError);
              }
            })
          );

          commentCountMap[userId] = totalComments;
        } catch (userError) {
          console.error(`Error processing user ${userId}:`, userError);
          commentCountMap[userId] = 0;
        }
      })
    );

    // Sort users by comment count and take top 5
    const topFiveUsers = Object.entries(commentCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, commentCount]) => ({
        id,
        name: users[id],
        commentCount,
      }));

    // Cache the results
    cache.set(cacheKey, topFiveUsers);
    
    res.json({ topUsers: topFiveUsers });
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ error: "Failed to get top users." });
  }
});

export default router;
