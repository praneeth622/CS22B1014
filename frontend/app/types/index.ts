export interface User {
  id: string;
  name: string;
  commentCount: number;
  username?: string;
  email?: string;
  avatar?: string;
}

export interface Post {
  id: number;
  userid: number;
  content: string;
  commentCount?: number;
  author?: User;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface TopUsersResponse {
  topUsers: User[];
}

export interface PostsResponse {
  posts: Post[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
} 