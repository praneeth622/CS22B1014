import { Router, Request, Response } from "express";
import { getUsers } from "../data/users";
import { getPostsByUser } from "../data/posts";
import { getCommentsByPost } from "../data/comments";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { type } = req.query;

  try {
    const users = await getUsers();
    let allPosts: any[] = [];

    await Promise.all(
      Object.keys(users).map(async (userId) => {
        const posts = await getPostsByUser(userId);
        allPosts.push(...posts);
      })
    );

    if (type === "latest") {
      allPosts.sort((a, b) => b.id - a.id);
      return res.json({ posts: allPosts.slice(0, 5) });
    }

    if (type === "popular") {
      const commentCounts: Record<number, number> = {};

      await Promise.all(
        allPosts.map(async (post) => {
          const comments = await getCommentsByPost(post.id);
          commentCounts[post.id] = comments.length;
        })
      );

      const maxComments = Math.max(...Object.values(commentCounts));
      const popularPosts = allPosts.filter(
        (post) => commentCounts[post.id] === maxComments
      );

      return res.json({ posts: popularPosts });
    }

    return res.status(400).json({ error: "Invalid type query." });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

export default router;
