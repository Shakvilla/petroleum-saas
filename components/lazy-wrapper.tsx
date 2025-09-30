'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { useLazyLoading } from '@/hooks/utils/use-lazy-loading';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  className?: string;
}

export function LazyWrapper({
  children,
  fallback = <DefaultFallback />,
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true,
  className,
}: LazyWrapperProps) {
  const { ref, isVisible } = useLazyLoading({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <div ref={ref} className={className}>
      {isVisible ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

function DefaultFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    );
  };
}

// Dynamic import wrapper with lazy loading
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function LazyWrapperComponent(props: React.ComponentProps<T>) {
    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyWrapper>
    );
  };
}
