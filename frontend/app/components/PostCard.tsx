'use client';

import { Post } from '../types';
import Link from 'next/link';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  type?: 'popular' | 'latest';
}

export default function PostCard({ post, type = 'latest' }: PostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return `${text.substring(0, length)}...`;
  };
  
  // Generate a consistent color based on the post id
  const getPostColor = (id: number) => {
    const colors = [
      'border-blue-500 dark:border-blue-400',
      'border-green-500 dark:border-green-400',
      'border-purple-500 dark:border-purple-400',
      'border-yellow-500 dark:border-yellow-400',
      'border-red-500 dark:border-red-400',
      'border-indigo-500 dark:border-indigo-400',
      'border-pink-500 dark:border-pink-400',
      'border-cyan-500 dark:border-cyan-400',
    ];
    
    return colors[id % colors.length];
  };
  
  // Extract a topic from the content
  const getTopic = (content: string) => {
    if (!content) return 'General';
    
    const match = content.match(/about\s+(\w+)/i);
    return match ? match[1].charAt(0).toUpperCase() + match[1].slice(1) : 'General';
  };
  
  const topic = getTopic(post.content);

  return (
    <Link href={`/post/${post.id}`}>
      <div 
        className={`card border-l-4 ${getPostColor(post.id)} relative p-5 transition-all duration-300`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute top-3 right-3">
          {type === 'popular' && post.commentCount !== undefined && (
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-full px-2 py-1">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
              </svg>
              {post.commentCount}
            </div>
          )}
          
          {type === 'latest' && (
            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-full px-2 py-1">
              New
            </div>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
            {topic}
          </span>
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
          Post #{post.id}
        </h3>
        
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {truncateText(post.content, 120)}
        </div>
        
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            User ID: {post.userid}
          </div>
          
          <div className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-blue-500 dark:text-blue-400">View details →</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 