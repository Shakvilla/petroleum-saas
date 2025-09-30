import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton = forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      loadingText = 'Loading...',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Button
        className={cn(
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200',
          'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed',
          className
        )}
        variant={variant}
        size={size}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <span className="sr-only">{loadingText}</span>
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              <span>{loadingText}</span>
            </div>
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
