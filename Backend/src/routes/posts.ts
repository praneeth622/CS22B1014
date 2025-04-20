import express from "express";
import { getUsers } from "../data/users";
import { getPostsByUser } from "../data/posts";
import { getCommentsByPost } from "../data/comments";
import cache from "../services/cache";
import { getCachedLatestPosts, getCachedPopularPosts } from "../services/api";

interface Post {
  id: number;
  userid: number | string;
  content: string;
  commentCount?: number;
}

const router = express.Router();

router.get("/", async (req, res) => {
  const { type } = req.query;

  if (!type || (type !== "latest" && type !== "popular")) {
    return res.status(400).json({ error: "Invalid type parameter. Use 'popular' or 'latest'." });
  }

  try {
    // Check if we have pre-computed data
    if (type === "latest") {
      const cachedLatestPosts = getCachedLatestPosts();
      if (cachedLatestPosts) {
        return res.json({ posts: cachedLatestPosts });
      }
    } else if (type === "popular") {
      const cachedPopularPosts = getCachedPopularPosts();
      if (cachedPopularPosts) {
        return res.json({ posts: cachedPopularPosts });
      }
    }
    
    // Check if we have it in route cache
    const cacheKey = `posts_${type}`;
    const cachedPosts = cache.get(cacheKey);
    
    if (cachedPosts) {
      return res.json({ posts: cachedPosts });
    }

    // If not cached, fetch all posts
    const users = await getUsers();
    let allPosts: Post[] = [];

    await Promise.all(
      Object.keys(users).map(async (userId) => {
        const posts = await getPostsByUser(userId);
        if (Array.isArray(posts)) {
          allPosts.push(...posts);
        }
      })
    );

    let result: Post[] = [];

    if (type === "latest") {
      // Sort by post ID (assuming higher IDs are more recent)
      result = allPosts
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
    } else if (type === "popular") {
      // Get comment counts for all posts
      const postsWithComments: Post[] = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await getCommentsByPost(post.id);
          return {
            ...post,
            commentCount: Array.isArray(comments) ? comments.length : 0,
          };
        })
      );

      // Sort by comment count in descending order
      postsWithComments.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
      const maxComments = postsWithComments[0]?.commentCount || 0;
      
      result = postsWithComments.filter(post => post.commentCount === maxComments);
    }

    // Cache the results
    cache.set(cacheKey, result);
    
    return res.json({ posts: result });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

export default router;