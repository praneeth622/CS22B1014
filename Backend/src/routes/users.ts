import express from "express";
import { getCachedTopUsers } from "../services/api";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Only use pre-computed top users from cache
    const cachedTopUsers = getCachedTopUsers();
    
    if (cachedTopUsers) {
      return res.json({ topUsers: cachedTopUsers });
    }
    
    // If not in cache, return a friendly message rather than doing computation
    return res.status(503).json({ 
      error: "Data is still being loaded. Please try again in a moment.",
      message: "The server is still initializing the data cache. This happens only once after server start."
    });
    
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ error: "Failed to get top users." });
  }
});

export default router;
