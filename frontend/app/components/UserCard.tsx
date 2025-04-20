'use client';

import { User } from '../types';
import Image from 'next/image';
import { useState } from 'react';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getRandomGradient = (name: string) => {
    // Generate a consistent gradient based on the name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-teal-500',
      'from-yellow-500 to-orange-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-blue-500',
      'from-cyan-500 to-blue-500',
      'from-violet-500 to-purple-500',
      'from-fuchsia-500 to-pink-500',
    ];
    
    return gradients[hash % gradients.length];
  };
  
  return (
    <div 
      className="card relative overflow-hidden transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${getRandomGradient(user.name)} opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-5' : ''}`} />
      <div className="p-4 flex items-center space-x-4 relative z-10">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getRandomGradient(user.name)} text-white text-lg font-bold`}>
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p>
          {user.commentCount !== undefined && (
            <div className="mt-1 flex items-center">
              <span className="badge badge-primary text-xs py-0.5 px-2 flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span>{user.commentCount}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 