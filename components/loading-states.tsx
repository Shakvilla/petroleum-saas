'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

// Skeleton loaders for different content types
export function CardSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-64 w-full" />
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Progress indicators
export function LoadingSpinner({
  size = 'default',
}: {
  size?: 'sm' | 'default' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return <Loader2 className={`animate-spin ${sizeClasses[size]}`} />;
}

export function LoadingProgress({
  progress,
  message,
}: {
  progress?: number;
  message?: string;
}) {
  return (
    <div className="space-y-2">
      {message && <p className="text-sm text-gray-600">{message}</p>}
      <Progress value={progress} className="w-full" />
    </div>
  );
}

// Button loading state
export function LoadingButton({
  loading,
  children,
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${props.className} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Page loading overlay
export function PageLoadingOverlay({
  message = 'Loading...',
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium text-gray-900">{message}</p>
      </div>
    </div>
  );
}

// Inline loading state
export function InlineLoading({ message }: { message?: string }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <LoadingSpinner size="sm" />
      {message && <span>{message}</span>}
    </div>
  );
}
