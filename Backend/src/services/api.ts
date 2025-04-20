import axios from "axios";
import cache from "./cache";
import fs from "fs";
import path from "path";

// Define interfaces for better type safety
interface User {
  [key: string]: string;
}

interface Post {
  id: number;
  userid: number | string;
  content: string;
  commentCount?: number;
}

interface Comment {
  id: number;
  postid: number;
  content: string;
}

interface TopUser {
  id: string;
  name: string;
  commentCount: number;
}

interface RawData {
  users: User;
  posts: Record<string, Post[]>;  // userId -> posts
  comments: Record<number, Comment[]>;  // postId -> comments
  timestamp: number;
}

// Authentication token
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ1MTM2MzU1LCJpYXQiOjE3NDUxMzYwNTUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJiNTBlNGYyLWY2ZjktNDdhYS05NjY4LTA2YWNkZGQ2YTI4NyIsInN1YiI6InByYW5lZXRoZGV2YXJhc2V0dHkzMUBnbWFpbC5jb20ifSwiZW1haWwiOiJwcmFuZWV0aGRldmFyYXNldHR5MzFAZ21haWwuY29tIiwibmFtZSI6InByYW5lZXRoIGRldmFyYXNldHR5Iiwicm9sbE5vIjoiY3MyMmIxMDE0IiwiYWNjZXNzQ29kZSI6IndjSEhycCIsImNsaWVudElEIjoiYmI1MGU0ZjItZjZmOS00N2FhLTk2NjgtMDZhY2RkZDZhMjg3IiwiY2xpZW50U2VjcmV0IjoiTkJXbU5RZGVaWFJHemRWdyJ9.AekTPaC3PxtlyGKZa0jULsLYWEm3kKPyv3LqABl7GOE";

// File path for storing raw data
const DATA_FILE_PATH = path.join(__dirname, '../../data/raw_data.json');

// Create axios instance with auth token
export const api = axios.create({
  baseURL: "http://20.244.56.144/evaluation-service",
  timeout: 10000,
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
      
      if (error.response.status === 401 || error.response.status === 403) {
        console.error('Authentication error. Please check your token.');
      } else if (error.response.status === 503 || error.response.status === 429) {
        console.error('Server overloaded or rate limited. Using cached data if available.');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Load data from file if exists
const loadRawDataFromFile = (): RawData | null => {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      return JSON.parse(data) as RawData;
    }
  } catch (error) {
    console.error('Error loading data from file:', error);
  }
  return null;
};

// Save data to file
const saveRawDataToFile = (data: RawData): void => {
  try {
    // Ensure directory exists
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
    console.log('Data saved to file successfully');
  } catch (error) {
    console.error('Error saving data to file:', error);
  }
};

// Fetch all data at once and store
export const fetchAndStoreAllData = async (): Promise<boolean> => {
  console.log("Starting full data load process...");
  
  // Check if we have recently cached data (less than 1 hour old)
  const cachedData = loadRawDataFromFile();
  const ONE_HOUR = 60 * 60 * 1000; // in milliseconds
  
  if (cachedData && (Date.now() - cachedData.timestamp < ONE_HOUR)) {
    console.log("Using recently cached data from file");
    populateCacheFromRawData(cachedData);
    return true;
  }
  
  try {
    // 1. Get all users (first API call)
    console.log("Fetching all users...");
    const usersResponse = await api.get('/users');
    const users: User = usersResponse.data.users;
    
    const rawData: RawData = {
      users,
      posts: {},
      comments: {},
      timestamp: Date.now()
    };
    
    // 2. Get all posts for each user (second set of API calls)
    console.log("Fetching posts for all users...");
    
    // To reduce load, process users sequentially with delays
    for (const userId of Object.keys(users)) {
      try {
        const postsResponse = await api.get(`/users/${userId}/posts`);
        const userPosts: Post[] = postsResponse.data.posts || [];
        rawData.posts[userId] = userPosts;
        console.log(`Fetched ${userPosts.length} posts for user ${userId}`);
        
        // Add a small delay between user requests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error fetching posts for user ${userId}:`, error);
        rawData.posts[userId] = [];
      }
    }
    
    // 3. Get comments for all posts (third set of API calls)
    console.log("Fetching comments for all posts...");
    
    // Get all posts across all users
    const allPosts: Post[] = Object.values(rawData.posts).flat();
    
    // Process posts in small batches
    const BATCH_SIZE = 5;
    for (let i = 0; i < allPosts.length; i += BATCH_SIZE) {
      const batch = allPosts.slice(i, i + BATCH_SIZE);
      
      // Process each post in the batch
      for (const post of batch) {
        try {
          const commentsResponse = await api.get(`/posts/${post.id}/comments`);
          const postComments: Comment[] = Array.isArray(commentsResponse.data) 
            ? commentsResponse.data 
            : [];
          
          rawData.comments[post.id] = postComments;
          console.log(`Fetched ${postComments.length} comments for post ${post.id}`);
        } catch (error) {
          console.error(`Error fetching comments for post ${post.id}:`, error);
          rawData.comments[post.id] = [];
        }
      }
      
      // Add a delay between batches
      if (i + BATCH_SIZE < allPosts.length) {
        console.log(`Waiting before processing next batch of posts...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Save the raw data
    saveRawDataToFile(rawData);
    
    // Populate the in-memory cache
    populateCacheFromRawData(rawData);
    
    console.log("All data fetched and stored successfully!");
    return true;
  } catch (error) {
    console.error("Error during data fetch:", error);
    return false;
  }
};

// Populate the in-memory cache from raw data
const populateCacheFromRawData = (rawData: RawData): void => {
  console.log("Populating cache from raw data...");
  
  // Cache users
  cache.set('all_users', rawData.users);
  
  // Cache posts by user
  for (const [userId, posts] of Object.entries(rawData.posts)) {
    cache.set(`posts_user_${userId}`, posts);
  }
  
  // Cache all posts
  const allPosts = Object.values(rawData.posts).flat();
  cache.set('all_posts', allPosts);
  
  // Cache comments by post
  for (const [postId, comments] of Object.entries(rawData.comments)) {
    cache.set(`comments_post_${parseInt(postId)}`, comments);
  }
  
  // Compute and cache derived data
  
  // 1. Top users
  const commentCountMap: Record<string, number> = {};
  
  for (const userId of Object.keys(rawData.users)) {
    const userPosts = rawData.posts[userId] || [];
    let totalComments = 0;
    
    for (const post of userPosts) {
      const comments = rawData.comments[post.id] || [];
      totalComments += comments.length;
    }
    
    commentCountMap[userId] = totalComments;
  }
  
  const topFiveUsers: TopUser[] = Object.entries(commentCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, commentCount]) => ({
      id,
      name: rawData.users[id],
      commentCount,
    }));
  
  cache.set('top_users', topFiveUsers);
  
  // 2. Popular posts
  const postsWithComments = allPosts.map(post => {
    const comments = rawData.comments[post.id] || [];
    return {
      ...post,
      commentCount: comments.length
    };
  });
  
  const sortedByComments = [...postsWithComments].sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
  const maxComments = sortedByComments[0]?.commentCount || 0;
  const popularPosts = sortedByComments.filter(post => post.commentCount === maxComments);
  
  cache.set('posts_popular', popularPosts);
  
  // 3. Latest posts
  const latestPosts = [...allPosts]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);
  
  cache.set('posts_latest', latestPosts);
  
  console.log("Cache populated successfully!");
};

// Helper functions to access cached data
export const getCachedUsers = (): User | null => cache.get<User>('all_users');
export const getCachedPosts = (): Post[] | null => cache.get<Post[]>('all_posts');
export const getCachedPostsByUser = (userId: string): Post[] | null => cache.get<Post[]>(`posts_user_${userId}`);
export const getCachedCommentsByPost = (postId: number): Comment[] | null => cache.get<Comment[]>(`comments_post_${postId}`);
export const getCachedTopUsers = (): TopUser[] | null => cache.get<TopUser[]>('top_users');
export const getCachedPopularPosts = (): Post[] | null => cache.get<Post[]>('posts_popular');
export const getCachedLatestPosts = (): Post[] | null => cache.get<Post[]>('posts_latest');
