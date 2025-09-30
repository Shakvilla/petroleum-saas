'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTouch } from '@/hooks/utils/use-mobile';

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

interface MobileGesturesProps {
  children: React.ReactNode;
  handlers: GestureHandlers;
  className?: string;
  threshold?: number;
  longPressDelay?: number;
  doubleTapDelay?: number;
}

export function MobileGestures({
  children,
  handlers,
  className,
  threshold = 50,
  longPressDelay = 500,
  doubleTapDelay = 300,
}: MobileGesturesProps) {
  const isTouch = useTouch();
  const elementRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTouch) return;

    const touch = e.touches[0];
    const startTime = Date.now();

    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: startTime,
    });

    // Start long press timer
    if (handlers.onLongPress) {
      const timer = setTimeout(() => {
        handlers.onLongPress?.();
      }, longPressDelay);
      setLongPressTimer(timer);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouch || !touchStart) return;

    // Cancel long press if user moves
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouch || !touchStart) return;

    // Cancel long press timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touch = e.changedTouches[0];
    const endTime = Date.now();

    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: endTime,
    });

    // Handle gestures
    handleGestures();
  };

  const handleGestures = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const deltaTime = touchEnd.time - touchStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check for swipe gestures
    if (distance > threshold && deltaTime < 300) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    } else if (distance < 10 && deltaTime < 200) {
      // Tap gesture
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTap;

      if (timeDiff < doubleTapDelay) {
        // Double tap
        handlers.onDoubleTap?.();
        setLastTap(0);
      } else {
        // Single tap
        handlers.onTap?.();
        setLastTap(currentTime);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
    };
  }, [longPressTimer]);

  if (!isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={elementRef}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
}

// Swipeable card component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  className,
}: SwipeableCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(
    null
  );

  const handleSwipeStart = () => {
    setIsSwiping(true);
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - (touchStart?.x || 0);

    setSwipeOffset(deltaX);
    setSwipeDirection(deltaX > 0 ? 'right' : 'left');
  };

  const handleSwipeEnd = () => {
    setIsSwiping(false);

    if (Math.abs(swipeOffset) > 100) {
      if (swipeDirection === 'left' && onSwipeLeft) {
        onSwipeLeft();
      } else if (swipeDirection === 'right' && onSwipeRight) {
        onSwipeRight();
      }
    }

    setSwipeOffset(0);
    setSwipeDirection(null);
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    handleSwipeStart();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left action */}
      {leftAction && (
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center',
            'transition-transform duration-200',
            swipeDirection === 'right' && swipeOffset > 0
              ? 'translate-x-0'
              : '-translate-x-full'
          )}
        >
          {leftAction}
        </div>
      )}

      {/* Right action */}
      {rightAction && (
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-20 bg-green-500 flex items-center justify-center',
            'transition-transform duration-200',
            swipeDirection === 'left' && swipeOffset < 0
              ? 'translate-x-0'
              : 'translate-x-full'
          )}
        >
          {rightAction}
        </div>
      )}

      {/* Main content */}
      <div
        className={cn(
          'relative bg-white transition-transform duration-200',
          className
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleSwipeMove}
        onTouchEnd={handleSwipeEnd}
      >
        {children}
      </div>
    </div>
  );
}

// Pull to refresh component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ y: number; scrollTop: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current) {
      touchStart.current = {
        y: e.touches[0].clientY,
        scrollTop: containerRef.current.scrollTop,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current || !containerRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStart.current.y;
    const scrollTop = containerRef.current.scrollTop;

    // Only allow pull to refresh when at the top
    if (scrollTop === 0 && deltaY > 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(deltaY * 0.5, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    touchStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 flex items-center justify-center',
          'transition-all duration-200',
          isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: `${Math.max(pullDistance, 60)}px`,
          transform: `translateY(${isPulling ? pullDistance - 60 : 0}px)`,
        }}
      >
        <div className="flex items-center gap-2 text-gray-600">
          {isRefreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600" />
              <span>Refreshing...</span>
            </>
          ) : (
            <>
              <div className="text-2xl">↓</div>
              <span>Pull to refresh</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}
