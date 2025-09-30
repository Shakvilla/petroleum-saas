/**
 * Enhanced Badge Component
 * 
 * Extends the existing shadcn/ui Badge with consistent design system patterns
 * and semantic status variants for better visual communication.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const enhancedBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200',
        secondary: 'border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        destructive: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
        outline: 'text-neutral-700 border-neutral-300',
        success: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        // Status variants
        active: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        inactive: 'border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        pending: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        error: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
        // Role variants
        admin: 'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200',
        manager: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        operator: 'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        viewer: 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      dot: {
        true: 'pl-1.5',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      dot: false,
    },
  }
);

export interface EnhancedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof enhancedBadgeVariants> {
  dot?: boolean;
  dotColor?: string;
}

const EnhancedBadge = React.forwardRef<HTMLDivElement, EnhancedBadgeProps>(
  ({ className, variant, size, dot, dotColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(enhancedBadgeVariants({ variant, size, dot, className }))}
        {...props}
      >
        {dot && (
          <div
            className="mr-1 h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: dotColor || 'currentColor' }}
          />
        )}
        {children}
      </div>
    );
  }
);

EnhancedBadge.displayName = 'EnhancedBadge';

// Utility function to get badge variant from status
export const getBadgeVariantFromStatus = (status: string): VariantProps<typeof enhancedBadgeVariants>['variant'] => {
  const statusMap: Record<string, VariantProps<typeof enhancedBadgeVariants>['variant']> = {
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    error: 'error',
    success: 'success',
    warning: 'warning',
    info: 'info',
    admin: 'admin',
    manager: 'manager',
    operator: 'operator',
    viewer: 'viewer',
  };
  
  return statusMap[status.toLowerCase()] || 'default';
};

// Utility function to get badge variant from role
export const getBadgeVariantFromRole = (role: string): VariantProps<typeof enhancedBadgeVariants>['variant'] => {
  const roleMap: Record<string, VariantProps<typeof enhancedBadgeVariants>['variant']> = {
    admin: 'admin',
    administrator: 'admin',
    manager: 'manager',
    operator: 'operator',
    viewer: 'viewer',
  };
  
  return roleMap[role.toLowerCase()] || 'default';
};

export { EnhancedBadge, enhancedBadgeVariants };
