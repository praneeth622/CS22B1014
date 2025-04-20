import axios from 'axios';
import { User, Post, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTopUsers = async (): Promise<User[]> => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data.data;
};

export const getPopularPosts = async (): Promise<Post[]> => {
  const response = await api.get<ApiResponse<Post[]>>('/posts?type=popular');
  return response.data.data;
};

export const getLatestPosts = async (): Promise<Post[]> => {
  const response = await api.get<ApiResponse<Post[]>>('/posts?type=latest');
  return response.data.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await api.get<ApiResponse<Post>>(`/posts/${id}`);
  return response.data.data;
};

export default api; 