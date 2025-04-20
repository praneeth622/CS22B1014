import { api } from "../services/api";
import cache from "../services/cache";

export const getPostsByUser = async (userId: string) => {
  const cacheKey = `posts_${userId}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  const res = await api.get(`/users/${userId}/posts`);
  const posts = res.data.posts || [];
  
  cache.set(cacheKey, posts);
  return posts;
};
