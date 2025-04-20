'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  fullPage?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  fullPage = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };
  
  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-green-500',
    accent: 'border-purple-500'
  };
  
  const containerClasses = fullPage 
    ? 'fixed inset-0 flex justify-center items-center bg-white/80 dark:bg-gray-900/80 z-50' 
    : 'flex justify-center items-center py-8';
  
  return (
    <div className={containerClasses}>
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-t-transparent ${colorClasses[color]}`}></div>
        <div className={`${sizeClasses[size]} animate-ping absolute inset-0 rounded-full border border-t-transparent ${colorClasses[color]} opacity-20`}></div>
      </div>
    </div>
  );
} 