import { api, getCachedPostsByUser } from "../services/api";
import cache from "../services/cache";

interface Post {
  id: number;
  userid: number | string;
  content: string;
}

export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  // First check if we have it in cache
  const cachedPosts = getCachedPostsByUser(userId);
  if (cachedPosts) {
    return cachedPosts;
  }
  
  // If not in cache, fetch from API
  try {
    const res = await api.get(`/users/${userId}/posts`);
    const posts: Post[] = res.data.posts || [];
    
    // Cache for future use
    cache.set(`posts_user_${userId}`, posts);
    
    return posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
};
