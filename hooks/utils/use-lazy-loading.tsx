'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseLazyLoadingReturn {
  ref: React.RefObject<HTMLElement | null>;
  isVisible: boolean;
  hasBeenVisible: boolean;
}

export function useLazyLoading(
  options: UseLazyLoadingOptions = {}
): UseLazyLoadingReturn {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);
        if (!hasBeenVisible) {
          setHasBeenVisible(true);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [triggerOnce, hasBeenVisible]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleIntersection, threshold, rootMargin]);

  return {
    ref,
    isVisible,
    hasBeenVisible,
  };
}

// Hook for preloading components
export function usePreload<T extends () => Promise<any>>(
  importFn: T,
  condition: boolean = true
) {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (condition && !isPreloaded) {
      importFn().then(() => {
        setIsPreloaded(true);
      });
    }
  }, [importFn, condition, isPreloaded]);

  return isPreloaded;
}

// Hook for component preloading with intersection observer
export function usePreloadOnVisible<T extends () => Promise<any>>(
  importFn: T,
  options: UseLazyLoadingOptions = {}
) {
  const { ref, isVisible } = useLazyLoading(options);
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (isVisible && !isPreloaded) {
      importFn().then(() => {
        setIsPreloaded(true);
      });
    }
  }, [isVisible, isPreloaded, importFn]);

  return { ref, isPreloaded };
}
