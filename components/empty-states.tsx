'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FileText,
  Search,
  AlertTriangle,
  Plus,
  RefreshCw,
  Home,
  Package,
  Truck,
  BarChart3,
  Users,
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
        <CardTitle className="mb-2 text-lg">{title}</CardTitle>
        <CardDescription className="mb-6 max-w-sm">
          {description}
        </CardDescription>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          {action && <Button onClick={action.onClick}>{action.label}</Button>}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Specific empty states for different contexts
export function NoDataEmptyState({
  title = 'No data available',
  description = 'There is no data to display at the moment.',
  action,
}: Partial<EmptyStateProps>) {
  return (
    <EmptyState
      icon={<FileText className="h-6 w-6 text-gray-400" />}
      title={title}
      description={description}
      action={action}
    />
  );
}

export function NoSearchResultsEmptyState({
  searchTerm,
  onClearSearch,
  onNewSearch,
}: {
  searchTerm?: string;
  onClearSearch?: () => void;
  onNewSearch?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6 text-gray-400" />}
      title="No results found"
      description={
        searchTerm
          ? `No results found for "${searchTerm}". Try adjusting your search terms.`
          : 'No results found. Try adjusting your search terms.'
      }
      action={
        onClearSearch
          ? {
              label: 'Clear Search',
              onClick: onClearSearch,
            }
          : undefined
      }
      secondaryAction={
        onNewSearch
          ? {
              label: 'New Search',
              onClick: onNewSearch,
            }
          : undefined
      }
    />
  );
}

export function ErrorEmptyState({
  title = 'Something went wrong',
  description = 'We encountered an error while loading the data.',
  onRetry,
  onGoHome,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-6 w-6 text-red-400" />}
      title={title}
      description={description}
      action={
        onRetry
          ? {
              label: 'Try Again',
              onClick: onRetry,
            }
          : undefined
      }
      secondaryAction={
        onGoHome
          ? {
              label: 'Go Home',
              onClick: onGoHome,
            }
          : undefined
      }
    />
  );
}

export function NoPermissionsEmptyState({
  title = 'Access Denied',
  description = "You don't have permission to view this content.",
  onGoHome,
}: {
  title?: string;
  description?: string;
  onGoHome?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertTriangle className="h-6 w-6 text-yellow-400" />}
      title={title}
      description={description}
      action={
        onGoHome
          ? {
              label: 'Go Home',
              onClick: onGoHome,
            }
          : undefined
      }
    />
  );
}

// Context-specific empty states
export function NoTanksEmptyState({
  onCreateTank,
}: {
  onCreateTank?: () => void;
}) {
  return (
    <EmptyState
      icon={<Package className="h-6 w-6 text-blue-400" />}
      title="No tanks found"
      description="Get started by adding your first storage tank to track fuel inventory."
      action={
        onCreateTank
          ? {
              label: 'Add Tank',
              onClick: onCreateTank,
            }
          : undefined
      }
    />
  );
}

export function NoDeliveriesEmptyState({
  onCreateDelivery,
}: {
  onCreateDelivery?: () => void;
}) {
  return (
    <EmptyState
      icon={<Truck className="h-6 w-6 text-green-400" />}
      title="No deliveries scheduled"
      description="Schedule your first delivery to start tracking fuel distribution."
      action={
        onCreateDelivery
          ? {
              label: 'Schedule Delivery',
              onClick: onCreateDelivery,
            }
          : undefined
      }
    />
  );
}

export function NoAnalyticsEmptyState({
  onGenerateReport,
}: {
  onGenerateReport?: () => void;
}) {
  return (
    <EmptyState
      icon={<BarChart3 className="h-6 w-6 text-purple-400" />}
      title="No analytics data"
      description="Generate reports to view analytics and insights about your operations."
      action={
        onGenerateReport
          ? {
              label: 'Generate Report',
              onClick: onGenerateReport,
            }
          : undefined
      }
    />
  );
}

export function NoUsersEmptyState({
  onInviteUser,
}: {
  onInviteUser?: () => void;
}) {
  return (
    <EmptyState
      icon={<Users className="h-6 w-6 text-indigo-400" />}
      title="No team members"
      description="Invite team members to collaborate on your petroleum operations."
      action={
        onInviteUser
          ? {
              label: 'Invite User',
              onClick: onInviteUser,
            }
          : undefined
      }
    />
  );
}
