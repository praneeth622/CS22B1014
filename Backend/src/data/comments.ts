import { api, getCachedCommentsByPost } from "../services/api";
import cache from "../services/cache";

interface Comment {
  id: number;
  postid: number;
  content: string;
}

export const getCommentsByPost = async (postId: number): Promise<Comment[]> => {
  // First check if we have it in cache
  const cachedComments = getCachedCommentsByPost(postId);
  if (cachedComments) {
    return cachedComments;
  }
  
  // If not in cache, fetch from API
  try {
    const res = await api.get(`/posts/${postId}/comments`);
    // API returns array directly, not {comments: [...]}
    const comments: Comment[] = Array.isArray(res.data) ? res.data : [];
    
    // Cache for future use
    cache.set(`comments_post_${postId}`, comments);
    
    return comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return []; // Return empty array instead of failing
  }
};
