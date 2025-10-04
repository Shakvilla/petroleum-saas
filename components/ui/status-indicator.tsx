/**
 * Status Indicator Component
 *
 * Provides consistent status visualization across the application
 * with semantic colors and clear visual hierarchy.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Clock, Minus } from 'lucide-react';

const statusIndicatorVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        success: 'bg-green-100 text-green-800 border border-green-200',
        error: 'bg-red-100 text-red-800 border border-red-200',
        warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        info: 'bg-blue-100 text-blue-800 border border-blue-200',
        neutral: 'bg-gray-100 text-gray-800 border border-gray-200',
        // Status variants
        active: 'bg-green-100 text-green-800 border border-green-200',
        inactive: 'bg-gray-100 text-gray-800 border border-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        // Role variants
        admin: 'bg-purple-100 text-purple-800 border border-purple-200',
        manager: 'bg-blue-100 text-blue-800 border border-blue-200',
        operator: 'bg-green-100 text-green-800 border border-green-200',
        viewer: 'bg-gray-100 text-gray-800 border border-gray-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
      showIcon: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'default',
      showIcon: true,
    },
  }
);

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  label: string;
  showIcon?: boolean;
  customIcon?: React.ReactNode;
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  (
    { className, variant, size, showIcon, customIcon, label, ...props },
    ref
  ) => {
    const getIcon = () => {
      if (customIcon) return customIcon;

      if (!showIcon) return null;

      switch (variant) {
        case 'success':
        case 'active':
          return <CheckCircle className="h-3 w-3" />;
        case 'error':
          return <XCircle className="h-3 w-3" />;
        case 'warning':
        case 'pending':
          return <AlertCircle className="h-3 w-3" />;
        case 'info':
        case 'manager':
          return <AlertCircle className="h-3 w-3" />;
        case 'admin':
          return <CheckCircle className="h-3 w-3" />;
        case 'operator':
          return <CheckCircle className="h-3 w-3" />;
        case 'inactive':
        case 'viewer':
        case 'neutral':
        default:
          return <Minus className="h-3 w-3" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          statusIndicatorVariants({ variant, size, showIcon, className })
        )}
        {...props}
      >
        {getIcon()}
        <span>{label}</span>
      </div>
    );
  }
);

StatusIndicator.displayName = 'StatusIndicator';

// Utility function to get status variant from status string
export const getStatusVariant = (
  status: string
): VariantProps<typeof statusIndicatorVariants>['variant'] => {
  const statusMap: Record<
    string,
    VariantProps<typeof statusIndicatorVariants>['variant']
  > = {
    // Status values
    active: 'active',
    inactive: 'inactive',
    pending: 'pending',
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    neutral: 'neutral',
    // Role values
    admin: 'admin',
    administrator: 'admin',
    manager: 'manager',
    operator: 'operator',
    viewer: 'viewer',
    // Common variations
    enabled: 'active',
    disabled: 'inactive',
    running: 'active',
    stopped: 'inactive',
    completed: 'success',
    failed: 'error',
    processing: 'pending',
  };

  return statusMap[status.toLowerCase()] || 'neutral';
};

// Utility function to get status label from status string
export const getStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    neutral: 'Neutral',
    admin: 'Admin',
    administrator: 'Admin',
    manager: 'Manager',
    operator: 'Operator',
    viewer: 'Viewer',
    enabled: 'Enabled',
    disabled: 'Disabled',
    running: 'Running',
    stopped: 'Stopped',
    completed: 'Completed',
    failed: 'Failed',
    processing: 'Processing',
  };

  return labelMap[status.toLowerCase()] || status;
};

// Pre-built status indicators for common use cases
export const UserStatusIndicator = React.forwardRef<
  HTMLDivElement,
  Omit<StatusIndicatorProps, 'variant'> & { status: string }
>(({ status, ...props }, ref) => (
  <StatusIndicator ref={ref} variant={getStatusVariant(status)} {...props} />
));
UserStatusIndicator.displayName = 'UserStatusIndicator';

export const SystemStatusIndicator = React.forwardRef<
  HTMLDivElement,
  Omit<StatusIndicatorProps, 'variant'> & { status: string }
>(({ status, label, ...props }, ref) => (
  <StatusIndicator
    ref={ref}
    variant={getStatusVariant(status)}
    label={label || getStatusLabel(status)}
    {...props}
  />
));
SystemStatusIndicator.displayName = 'SystemStatusIndicator';

export { StatusIndicator, statusIndicatorVariants };
