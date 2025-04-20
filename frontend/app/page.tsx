'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopUsers, getPopularPosts, getLatestPosts } from './services/api';
import UserCard from './components/UserCard';
import PostCard from './components/PostCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import Skeleton from './components/Skeleton';
import Navbar from './components/Navbar';
import Link from 'next/link';

export default function Home() {
  const { 
    data: topUsers,
    isLoading: isLoadingUsers,
    error: usersError
  } = useQuery({
    queryKey: ['topUsers'],
    queryFn: getTopUsers
  });

  const { 
    data: popularPosts,
    isLoading: isLoadingPopular,
    error: popularError
  } = useQuery({
    queryKey: ['popularPosts'],
    queryFn: getPopularPosts
  });

  const { 
    data: latestPosts,
    isLoading: isLoadingLatest,
    error: latestError
  } = useQuery({
    queryKey: ['latestPosts'],
    queryFn: getLatestPosts
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 5 Most Engaging Users Section */}
            <div className="col-span-1">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top 5 Engaging Users</h2>
                  
                  <div className="space-y-4">
                    {isLoadingUsers ? (
                      <Skeleton type="user" count={5} />
                    ) : usersError ? (
                      <ErrorMessage message="Failed to load top users" />
                    ) : topUsers && topUsers.length > 0 ? (
                      topUsers.map(user => (
                        <UserCard key={user.id} user={user} />
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No users found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Posts Section */}
            <div className="col-span-1 lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg mb-6">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Popular Posts</h2>
                  
                  <div className="space-y-4">
                    {isLoadingPopular ? (
                      <Skeleton type="post" count={3} />
                    ) : popularError ? (
                      <ErrorMessage message="Failed to load popular posts" />
                    ) : popularPosts && popularPosts.length > 0 ? (
                      popularPosts.map(post => (
                        <PostCard key={post.id} post={post} type="popular" />
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No popular posts found</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Latest Posts Section */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Latest Posts</h2>
                  
                  <div className="space-y-4">
                    {isLoadingLatest ? (
                      <Skeleton type="post" count={3} />
                    ) : latestError ? (
                      <ErrorMessage message="Failed to load latest posts" />
                    ) : latestPosts && latestPosts.length > 0 ? (
                      latestPosts.map(post => (
                        <PostCard key={post.id} post={post} type="latest" />
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No latest posts found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Social Media Dashboard - {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
