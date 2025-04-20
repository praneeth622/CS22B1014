import axios from "axios";
import cache from "./cache";

// Authentication token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ1MTM0MDcyLCJpYXQiOjE3NDUxMzM3NzIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJiNTBlNGYyLWY2ZjktNDdhYS05NjY4LTA2YWNkZGQ2YTI4NyIsInN1YiI6InByYW5lZXRoZGV2YXJhc2V0dHkzMUBnbWFpbC5jb20ifSwiZW1haWwiOiJwcmFuZWV0aGRldmFyYXNldHR5MzFAZ21haWwuY29tIiwibmFtZSI6InByYW5lZXRoIGRldmFyYXNldHR5Iiwicm9sbE5vIjoiY3MyMmIxMDE0IiwiYWNjZXNzQ29kZSI6IndjSEhycCIsImNsaWVudElEIjoiYmI1MGU0ZjItZjZmOS00N2FhLTk2NjgtMDZhY2RkZDZhMjg3IiwiY2xpZW50U2VjcmV0IjoiTkJXbU5RZGVaWFJHemRWdyJ9.KrN6iaJyGsI7ONhCcS4KcJPgg_rtsfBgfUr8ogH74no";

// Create axios instance with auth token
export const api = axios.create({
  baseURL: "http://20.244.56.144/evaluation-service",
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Add request logging
api.interceptors.request.use(request => {
  console.log(`API Request: ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
  return request;
});

// Add response logging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    return response;
  },
  error => {
    if (error.response) {
      console.error(`API Error ${error.response.status}: ${error.config.method?.toUpperCase()} ${error.config.url}`);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Authentication error. Please check your token.');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Preload all data during server startup
export const preloadAllData = async () => {
  console.log("Starting data preload...");
  try {
    // 1. Get all users
    console.log("Fetching all users...");
    const usersResponse = await api.get('/users');
    const users = usersResponse.data.users;
    cache.set('all_users', users);
    console.log(`Cached ${Object.keys(users).length} users`);
    
    // 2. Get all posts for each user
    const allPosts = [];
    console.log("Fetching posts for all users...");
    
    await Promise.all(Object.keys(users).map(async (userId) => {
      try {
        const postsResponse = await api.get(`/users/${userId}/posts`);
        const userPosts = postsResponse.data.posts || [];
        
        // Cache posts by user
        cache.set(`posts_user_${userId}`, userPosts);
        allPosts.push(...userPosts);
        
        console.log(`Cached ${userPosts.length} posts for user ${userId}`);
      } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
      }
    }));
    
    // Cache all posts
    cache.set('all_posts', allPosts);
    console.log(`Cached ${allPosts.length} total posts`);
    
    // 3. Get comments for all posts
    console.log("Fetching comments for all posts...");
    let totalComments = 0;
    
    await Promise.all(allPosts.map(async (post) => {
      try {
        const commentsResponse = await api.get(`/posts/${post.id}/comments`);
        const postComments = Array.isArray(commentsResponse.data) ? commentsResponse.data : [];
        
        // Cache comments by post
        cache.set(`comments_post_${post.id}`, postComments);
        totalComments += postComments.length;
        
        console.log(`Cached ${postComments.length} comments for post ${post.id}`);
      } catch (error) {
        console.error(`Error fetching comments for post ${post.id}:`, error);
      }
    }));
    
    console.log(`Cached ${totalComments} total comments`);
    
    // 4. Pre-compute top users
    console.log("Computing top users...");
    const commentCountMap = {};
    
    for (const userId of Object.keys(users)) {
      const userPosts = cache.get(`posts_user_${userId}`) || [];
      let totalComments = 0;
      
      for (const post of userPosts) {
        const comments = cache.get(`comments_post_${post.id}`) || [];
        totalComments += comments.length;
      }
      
      commentCountMap[userId] = totalComments;
    }
    
    const topFiveUsers = Object.entries(commentCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, commentCount]) => ({
        id,
        name: users[id],
        commentCount,
      }));
    
    cache.set('top_users', topFiveUsers);
    console.log("Top users computed and cached");
    
    // 5. Pre-compute popular posts
    console.log("Computing popular posts...");
    const postsWithComments = allPosts.map(post => {
      const comments = cache.get(`comments_post_${post.id}`) || [];
      return {
        ...post,
        commentCount: comments.length
      };
    });
    
    const sortedByComments = [...postsWithComments].sort((a, b) => b.commentCount - a.commentCount);
    const maxComments = sortedByComments[0]?.commentCount || 0;
    const popularPosts = sortedByComments.filter(post => post.commentCount === maxComments);
    
    cache.set('posts_popular', popularPosts);
    console.log("Popular posts computed and cached");
    
    // 6. Pre-compute latest posts
    console.log("Computing latest posts...");
    const latestPosts = [...allPosts]
      .sort((a, b) => b.id - a.id)
      .slice(0, 5);
    
    cache.set('posts_latest', latestPosts);
    console.log("Latest posts computed and cached");
    
    console.log("All data preloaded successfully!");
    return true;
  } catch (error) {
    console.error("Error during data preload:", error);
    return false;
  }
};

// Helper functions to access cached data
export const getCachedUsers = () => cache.get('all_users');
export const getCachedPosts = () => cache.get('all_posts');
export const getCachedPostsByUser = (userId) => cache.get(`posts_user_${userId}`);
export const getCachedCommentsByPost = (postId) => cache.get(`comments_post_${postId}`);
export const getCachedTopUsers = () => cache.get('top_users');
export const getCachedPopularPosts = () => cache.get('posts_popular');
export const getCachedLatestPosts = () => cache.get('posts_latest');
