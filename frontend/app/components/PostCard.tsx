'use client';

import { Post } from '../types';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
  type?: 'popular' | 'latest';
}

export default function PostCard({ post, type = 'latest' }: PostCardProps) {
  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  };

  return (
    <Link href={`/post/${post.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          Post #{post.id}
        </h3>
        
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {truncateText(post.content, 120)}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            User ID: {post.userid}
          </div>
          
          {type === 'popular' && post.commentCount !== undefined && (
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
              </svg>
              {post.commentCount} comments
            </div>
          )}
          
          {type === 'latest' && (
            <div className="text-xs text-green-600 dark:text-green-400">
              Latest
            </div>
          )}
        </div>
      </div>
    </Link>
  );
} 