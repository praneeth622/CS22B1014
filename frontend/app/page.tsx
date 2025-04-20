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
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullPage color="primary" size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Welcome to SocialApp
            </h1>
            <p className="text-blue-100 mb-6 text-lg">
              Discover trending posts and top users in our community
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 5 Most Engaging Users Section */}
            <div className="col-span-1">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Top Engaging Users
                </h2>
                
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
              
              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {topUsers?.length || 0}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Users</span>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {(popularPosts?.length || 0) + (latestPosts?.length || 0)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Posts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Sections */}
            <div className="col-span-1 lg:col-span-2">
              {/* Popular Posts Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Popular Posts
                </h2>
                
                <div className="space-y-4">
                  {isLoadingPopular ? (
                    <Skeleton type="post" count={3} />
                  ) : popularError ? (
                    <ErrorMessage message="Failed to load popular posts" />
                  ) : popularPosts && popularPosts.length > 0 ? (
                    popularPosts.slice(0, 5).map(post => (
                      <PostCard key={post.id} post={post} type="popular" />
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No popular posts found</p>
                  )}
                </div>
              </div>

              {/* Latest Posts Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Latest Posts
                </h2>
                
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
      </main>

      <footer className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">SocialApp</span>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Social Media Dashboard - {new Date().getFullYear()} © All Rights Reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
