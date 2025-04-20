'use client';

interface SkeletonProps {
  type: 'user' | 'post';
  count?: number;
}

export default function Skeleton({ type, count = 1 }: SkeletonProps) {
  const renderUserSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center space-x-4 animate-pulse">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  const renderPostSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 animate-pulse">
      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
    </div>
  );

  const skeletons = Array(count).fill(null).map((_, index) => (
    <div key={index}>
      {type === 'user' ? renderUserSkeleton() : renderPostSkeleton()}
    </div>
  ));

  return <>{skeletons}</>;
} 