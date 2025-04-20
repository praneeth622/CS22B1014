import { api } from "../services/api";
import cache from "../services/cache";

export const getCommentsByPost = async (postId: number) => {
  const cacheKey = `comments_${postId}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const res = await api.get(`/posts/${postId}/comments`);
  const comments = res.data.comments || [];
  
  cache.set(cacheKey, comments);
  return comments;
};
