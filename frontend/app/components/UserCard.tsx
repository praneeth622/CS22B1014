'use client';

import { User } from '../types';
import Image from 'next/image';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4">
      <div className="relative w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
            {user.name.charAt(0)}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
        {user.engagementScore !== undefined && (
          <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            Engagement: {user.engagementScore.toFixed(1)}
          </div>
        )}
      </div>
    </div>
  );
} 