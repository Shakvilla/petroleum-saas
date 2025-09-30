/**
 * Mobile Optimization Components
 *
 * Provides mobile-first components and utilities for better touch interactions
 * and responsive design patterns.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/components/ui/use-mobile';

const mobileOptimizedVariants = cva('transition-all duration-200', {
  variants: {
    touchTarget: {
      minimum: 'min-h-[44px] min-w-[44px]',
      comfortable: 'min-h-[48px] min-w-[48px]',
      large: 'min-h-[56px] min-w-[56px]',
    },
    spacing: {
      sm: 'p-2',
      default: 'p-3',
      lg: 'p-4',
    },
  },
  defaultVariants: {
    touchTarget: 'comfortable',
    spacing: 'default',
  },
});

export interface MobileOptimizedProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mobileOptimizedVariants> {
  children: React.ReactNode;
}

const MobileOptimized = React.forwardRef<HTMLDivElement, MobileOptimizedProps>(
  ({ className, touchTarget, spacing, children, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
      <div
        ref={ref}
        className={cn(
          mobileOptimizedVariants({ touchTarget, spacing }),
          isMobile && 'touch-manipulation',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileOptimized.displayName = 'MobileOptimized';

// Mobile-optimized button component
export interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();

    const variantClasses = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
      outline:
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      ghost:
        'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    };

    const sizeClasses = {
      sm: 'h-10 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-14 px-6 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isMobile && 'touch-manipulation min-h-[44px]',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MobileButton.displayName = 'MobileButton';

// Mobile-optimized input component
export interface MobileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500 focus-visible:ring-red-500',
            isMobile && 'min-h-[44px] text-base',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-gray-600">{helperText}</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

MobileInput.displayName = 'MobileInput';

// Mobile-optimized card component
export interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

const MobileCard = React.forwardRef<HTMLDivElement, MobileCardProps>(
  ({ className, interactive = false, children, ...props }, ref) => {
    const isMobile = useIsMobile();

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-white shadow-sm transition-all duration-200',
          interactive && 'hover:shadow-md hover:border-gray-300 cursor-pointer',
          isMobile && 'touch-manipulation',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MobileCard.displayName = 'MobileCard';

// Mobile-optimized list component
export interface MobileListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{
    id: string;
    content: React.ReactNode;
    onClick?: () => void;
  }>;
  emptyMessage?: string;
}

const MobileList = React.forwardRef<HTMLDivElement, MobileListProps>(
  (
    { className, items, emptyMessage = 'No items available', ...props },
    ref
  ) => {
    const isMobile = useIsMobile();

    if (items.length === 0) {
      return (
        <div
          ref={ref}
          className={cn('text-center py-8 text-gray-500', className)}
          {...props}
        >
          {emptyMessage}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {items.map(item => (
          <div
            key={item.id}
            className={cn(
              'rounded-lg border bg-white p-4 shadow-sm transition-all duration-200',
              item.onClick &&
                'hover:shadow-md hover:border-gray-300 cursor-pointer',
              isMobile && 'touch-manipulation min-h-[44px]'
            )}
            onClick={item.onClick}
            role={item.onClick ? 'button' : undefined}
            tabIndex={item.onClick ? 0 : undefined}
            onKeyDown={
              item.onClick
                ? e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      item.onClick?.();
                    }
                  }
                : undefined
            }
          >
            {item.content}
          </div>
        ))}
      </div>
    );
  }
);

MobileList.displayName = 'MobileList';

// Mobile-optimized grid component
export interface MobileGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const MobileGrid = React.forwardRef<HTMLDivElement, MobileGridProps>(
  (
    {
      className,
      children,
      columns = { mobile: 1, tablet: 2, desktop: 3 },
      gap = 'md',
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();

    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    };

    const gridClasses = cn(
      'grid',
      `grid-cols-${columns.mobile}`,
      `md:grid-cols-${columns.tablet}`,
      `lg:grid-cols-${columns.desktop}`,
      gapClasses[gap],
      className
    );

    return (
      <div ref={ref} className={gridClasses} {...props}>
        {children}
      </div>
    );
  }
);

MobileGrid.displayName = 'MobileGrid';

export {
  MobileOptimized,
  MobileButton,
  MobileInput,
  MobileCard,
  MobileList,
  MobileGrid,
  mobileOptimizedVariants,
};
