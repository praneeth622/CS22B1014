import axios from 'axios';
import { User, Post, TopUsersResponse, PostsResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTopUsers = async (): Promise<User[]> => {
  const response = await api.get<TopUsersResponse>('/users');
  return response.data.topUsers;
};

export const getPopularPosts = async (): Promise<Post[]> => {
  const response = await api.get<PostsResponse>('/posts?type=popular');
  return response.data.posts;
};

export const getLatestPosts = async (): Promise<Post[]> => {
  const response = await api.get<PostsResponse>('/posts?type=latest');
  return response.data.posts;
};

export const getPostById = async (id: number): Promise<Post> => {
  // Since we don't have the exact endpoint structure for single post,
  // we'll fetch the popular posts and find the matching one
  const posts = await getPopularPosts();
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    // Try in latest posts if not found in popular
    const latestPosts = await getLatestPosts();
    const latestPost = latestPosts.find(p => p.id === id);
    
    if (!latestPost) {
      throw new Error('Post not found');
    }
    
    return latestPost;
  }
  
  return post;
};

export default api; 