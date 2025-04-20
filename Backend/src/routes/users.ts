import express from "express";
import { getUsers } from "../data/users";
import { getPostsByUser } from "../data/posts";
import { getCommentsByPost } from "../data/comments";
import cache from "../services/cache";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Check if we have cached top users
    const cacheKey = "top_users";
    const cachedTopUsers = cache.get(cacheKey);
    
    if (cachedTopUsers) {
      return res.json({ topUsers: cachedTopUsers });
    }

    const users = await getUsers();
    const commentCountMap: { [userId: string]: number } = {};

    await Promise.all(
      Object.keys(users).map(async (userId) => {
        const posts = await getPostsByUser(userId);
        let totalComments = 0;

        await Promise.all(
          posts.map(async (post: any) => {
            const comments = await getCommentsByPost(post.id);
            totalComments += comments.length;
          })
        );

        commentCountMap[userId] = totalComments;
      })
    );

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
