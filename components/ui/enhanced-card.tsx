/**
 * Enhanced Card Component
 * 
 * Extends the existing shadcn/ui Card with consistent design system patterns
 * and additional variants for better visual hierarchy.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const enhancedCardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'shadow-sm border-neutral-200',
        elevated: 'shadow-md hover:shadow-lg border-neutral-200',
        flat: 'shadow-none border-0 bg-neutral-50',
        outlined: 'shadow-none border-2 border-neutral-200',
        interactive: 'shadow-sm border-neutral-200 hover:shadow-md hover:border-neutral-300 cursor-pointer',
        success: 'shadow-sm border-green-200 bg-green-50',
        warning: 'shadow-sm border-yellow-200 bg-yellow-50',
        error: 'shadow-sm border-red-200 bg-red-50',
        info: 'shadow-sm border-blue-200 bg-blue-50',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:shadow-md hover:border-neutral-300',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: false,
    },
  }
);

export interface EnhancedCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedCardVariants> {
  asChild?: boolean;
}

const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(enhancedCardVariants({ variant, padding, hover, className }))}
      {...props}
    />
  )
);
EnhancedCard.displayName = 'EnhancedCard';

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

const EnhancedCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-neutral-900',
      className
    )}
    {...props}
  />
));
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

const EnhancedCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-neutral-600', className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = 'EnhancedCardDescription';

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
EnhancedCardContent.displayName = 'EnhancedCardContent';

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = 'EnhancedCardFooter';

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  enhancedCardVariants,
};
