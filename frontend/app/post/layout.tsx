'use client';

import Navbar from '../components/Navbar';
import { ReactNode } from 'react';

interface PostLayoutProps {
  children: ReactNode;
}

export default function PostLayout({ children }: PostLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      {children}
    </div>
  );
} 