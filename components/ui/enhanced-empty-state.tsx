/**
 * Enhanced Empty State Component
 * 
 * Provides consistent empty state patterns across the application
 * with customizable icons, actions, and messaging.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  FileText, 
  Users, 
  Package, 
  AlertTriangle, 
  Plus,
  RefreshCw,
  Home
} from 'lucide-react';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center p-8',
  {
    variants: {
      variant: {
        default: 'text-neutral-600',
        error: 'text-red-600',
        warning: 'text-yellow-600',
        info: 'text-blue-600',
      },
      size: {
        sm: 'p-4',
        default: 'p-8',
        lg: 'p-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

export interface EnhancedEmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  showIcon?: boolean;
}

const EnhancedEmptyState = React.forwardRef<HTMLDivElement, EnhancedEmptyStateProps>(
  (
    {
      className,
      variant,
      size,
      icon,
      title,
      description,
      action,
      secondaryAction,
      showIcon = true,
      ...props
    },
    ref
  ) => {
    const getDefaultIcon = () => {
      switch (variant) {
        case 'error':
          return <AlertTriangle className="h-12 w-12 text-red-400" />;
        case 'warning':
          return <AlertTriangle className="h-12 w-12 text-yellow-400" />;
        case 'info':
          return <FileText className="h-12 w-12 text-blue-400" />;
        default:
          return <FileText className="h-12 w-12 text-neutral-400" />;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(emptyStateVariants({ variant, size, className }))}
        {...props}
      >
        {showIcon && (
          <div className="mb-4">
            {icon || getDefaultIcon()}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-neutral-600 mb-6 max-w-md">
            {description}
          </p>
        )}
        
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {action && (
              <Button
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                {action.icon}
                {action.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                variant={secondaryAction.variant || 'outline'}
                onClick={secondaryAction.onClick}
                className="flex items-center gap-2"
              >
                {secondaryAction.icon}
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

EnhancedEmptyState.displayName = 'EnhancedEmptyState';

// Pre-built empty state components for common use cases
export const NoDataEmptyState = React.forwardRef<
  HTMLDivElement,
  Omit<EnhancedEmptyStateProps, 'icon' | 'title' | 'description'> & {
    title?: string;
    description?: string;
    onCreate?: () => void;
    onRefresh?: () => void;
  }
>(({ title = 'No data available', description = 'There is no data to display at the moment.', onCreate, onRefresh, ...props }, ref) => (
  <EnhancedEmptyState
    ref={ref}
    icon={<FileText className="h-12 w-12 text-neutral-400" />}
    title={title}
    description={description}
    action={onCreate ? {
      label: 'Create New',
      onClick: onCreate,
      icon: <Plus className="h-4 w-4" />,
    } : undefined}
    secondaryAction={onRefresh ? {
      label: 'Refresh',
      onClick: onRefresh,
      variant: 'outline',
      icon: <RefreshCw className="h-4 w-4" />,
    } : undefined}
    {...props}
  />
));
NoDataEmptyState.displayName = 'NoDataEmptyState';

export const NoSearchResultsEmptyState = React.forwardRef<
  HTMLDivElement,
  Omit<EnhancedEmptyStateProps, 'icon' | 'title' | 'description'> & {
    searchTerm?: string;
    onClearSearch?: () => void;
    onNewSearch?: () => void;
  }
>(({ searchTerm, onClearSearch, onNewSearch, ...props }, ref) => (
  <EnhancedEmptyState
    ref={ref}
    icon={<Search className="h-12 w-12 text-neutral-400" />}
    title="No results found"
    description={searchTerm ? `No results found for "${searchTerm}". Try adjusting your search terms.` : 'No results found for your search.'}
    action={onNewSearch ? {
      label: 'New Search',
      onClick: onNewSearch,
      icon: <Search className="h-4 w-4" />,
    } : undefined}
    secondaryAction={onClearSearch ? {
      label: 'Clear Search',
      onClick: onClearSearch,
      variant: 'outline',
    } : undefined}
    {...props}
  />
));
NoSearchResultsEmptyState.displayName = 'NoSearchResultsEmptyState';

export const ErrorEmptyState = React.forwardRef<
  HTMLDivElement,
  Omit<EnhancedEmptyStateProps, 'icon' | 'variant'> & {
    title?: string;
    description?: string;
    onRetry?: () => void;
    onGoHome?: () => void;
  }
>(({ title = 'Something went wrong', description = 'We encountered an error while loading the data.', onRetry, onGoHome, ...props }, ref) => (
  <EnhancedEmptyState
    ref={ref}
    variant="error"
    icon={<AlertTriangle className="h-12 w-12 text-red-400" />}
    title={title}
    description={description}
    action={onRetry ? {
      label: 'Try Again',
      onClick: onRetry,
      icon: <RefreshCw className="h-4 w-4" />,
    } : undefined}
    secondaryAction={onGoHome ? {
      label: 'Go Home',
      onClick: onGoHome,
      variant: 'outline',
      icon: <Home className="h-4 w-4" />,
    } : undefined}
    {...props}
  />
));
ErrorEmptyState.displayName = 'ErrorEmptyState';

export const NoPermissionsEmptyState = React.forwardRef<
  HTMLDivElement,
  Omit<EnhancedEmptyStateProps, 'icon' | 'variant'> & {
    title?: string;
    description?: string;
    onGoHome?: () => void;
  }
>(({ title = 'Access Denied', description = "You don't have permission to view this content.", onGoHome, ...props }, ref) => (
  <EnhancedEmptyState
    ref={ref}
    variant="warning"
    icon={<AlertTriangle className="h-12 w-12 text-yellow-400" />}
    title={title}
    description={description}
    action={onGoHome ? {
      label: 'Go Home',
      onClick: onGoHome,
      icon: <Home className="h-4 w-4" />,
    } : undefined}
    {...props}
  />
));
NoPermissionsEmptyState.displayName = 'NoPermissionsEmptyState';

export { EnhancedEmptyState, emptyStateVariants };
