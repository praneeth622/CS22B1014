'use client';

import { useQuery } from '@tanstack/react-query';
import { getPostById } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Link from 'next/link';
import Skeleton from '../../components/Skeleton';
import { useParams, useRouter } from 'next/navigation';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = Number(params.id);

  const { 
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !isNaN(postId)
  });

  if (!postId || isNaN(postId)) {
    return (
      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage message="Invalid post ID" />
          <div className="mt-4">
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Post Details</h1>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg animate-pulse">
              <div className="px-4 py-5 sm:p-6">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <ErrorMessage message="Failed to load post details" />
        ) : post ? (
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
              
              {post.author && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  By {post.author.name}
                </p>
              )}
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.body}</p>
              </div>
              
              {post.commentCount !== undefined && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Comments ({post.commentCount})
                  </h3>
                  
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This API endpoint doesn't return the full comments data. In a real application, we would fetch and display comments here.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Post not found</p>
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to homepage
          </Link>
        </div>
      </main>
    </>
  );
} 