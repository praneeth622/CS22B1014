import express from "express";
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
    // Only use pre-computed posts from cache
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
    
    // If not in cache, return a friendly message rather than doing computation
    return res.status(503).json({ 
      error: "Data is still being loaded. Please try again in a moment.",
      message: "The server is still initializing the data cache. This happens only once after server start."
    });
    
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

export default router;