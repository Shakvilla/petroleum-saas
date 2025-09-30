/**
 * Loading Skeleton Component
 * 
 * Provides consistent loading states across the application with
 * customizable skeleton patterns for different content types.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const skeletonVariants = cva(
  'animate-pulse bg-neutral-200 rounded',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200',
        card: 'bg-neutral-200 rounded-lg',
        text: 'bg-neutral-200 rounded',
        avatar: 'bg-neutral-200 rounded-full',
        button: 'bg-neutral-200 rounded-md',
        input: 'bg-neutral-200 rounded-md',
        table: 'bg-neutral-200 rounded',
        chart: 'bg-neutral-200 rounded-lg',
      },
      size: {
        xs: 'h-2',
        sm: 'h-3',
        default: 'h-4',
        lg: 'h-6',
        xl: 'h-8',
        '2xl': 'h-12',
      },
      width: {
        full: 'w-full',
        '3/4': 'w-3/4',
        '1/2': 'w-1/2',
        '1/3': 'w-1/3',
        '1/4': 'w-1/4',
        auto: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      width: 'full',
    },
  }
);

export interface LoadingSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  lines?: number;
  spacing?: 'sm' | 'md' | 'lg';
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ className, variant, size, width, lines = 1, spacing = 'md', ...props }, ref) => {
    const spacingClass = {
      sm: 'space-y-1',
      md: 'space-y-2',
      lg: 'space-y-3',
    }[spacing];

    if (lines > 1) {
      return (
        <div ref={ref} className={cn('flex flex-col', spacingClass, className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(skeletonVariants({ variant, size, width }))}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant, size, width, className }))}
        {...props}
      />
    );
  }
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Pre-built skeleton components for common patterns
export const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { lines?: number }
>(({ className, lines = 3, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border border-neutral-200 rounded-lg', className)}
    {...props}
  >
    <LoadingSkeleton variant="text" size="lg" width="1/3" className="mb-4" />
    <LoadingSkeleton lines={lines} spacing="md" />
  </div>
));
CardSkeleton.displayName = 'CardSkeleton';

export const TableSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { rows?: number; columns?: number }
>(({ className, rows = 5, columns = 4, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-3', className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, index) => (
        <LoadingSkeleton key={index} variant="text" size="sm" width="1/4" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <LoadingSkeleton key={colIndex} variant="text" size="default" width="1/4" />
        ))}
      </div>
    ))}
  </div>
));
TableSkeleton.displayName = 'TableSkeleton';

export const AvatarSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }[size];

  return (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant: 'avatar' }), sizeClass, className)}
      {...props}
    />
  );
});
AvatarSkeleton.displayName = 'AvatarSkeleton';

export const ButtonSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClass = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  }[size];

  return (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant: 'button' }), sizeClass, className)}
      {...props}
    />
  );
});
ButtonSkeleton.displayName = 'ButtonSkeleton';

export const ChartSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 border border-neutral-200 rounded-lg', className)}
    {...props}
  >
    <LoadingSkeleton variant="text" size="lg" width="1/3" className="mb-4" />
    <LoadingSkeleton variant="chart" size="2xl" width="full" className="h-64" />
  </div>
));
ChartSkeleton.displayName = 'ChartSkeleton';

export { LoadingSkeleton, skeletonVariants };
