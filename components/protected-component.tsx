'use client';

import React from 'react';
import { usePermissions } from '@/lib/permission-checker';

interface ProtectedComponentProps {
  resource: string;
  action?: string;
  feature?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  requireAll?: boolean;
  permissions?: Array<{ resource: string; action: string }>;
}

export function ProtectedComponent({
  resource,
  action = 'read',
  feature,
  fallback = null,
  children,
  requireAll = false,
  permissions = [],
}: ProtectedComponentProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasFeature } =
    usePermissions();

  // Check feature access first
  if (feature && !hasFeature(feature)) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (resource && action && !hasPermission(resource, action)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

interface FeatureGateProps {
  feature: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({
  feature,
  fallback = null,
  children,
  showUpgrade = false,
}: FeatureGateProps) {
  const { hasFeature } = usePermissions();

  if (!hasFeature(feature)) {
    if (showUpgrade) {
      return (
        <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Feature Not Available
          </h3>
          <p className="text-gray-600 mb-4">
            This feature is not available in your current plan.
          </p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Upgrade Plan
          </button>
        </div>
      );
    }

    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionGateProps {
  resource: string;
  action: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  showAccessDenied?: boolean;
}

export function PermissionGate({
  resource,
  action,
  fallback = null,
  children,
  showAccessDenied = false,
}: PermissionGateProps) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(resource, action)) {
    if (showAccessDenied) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Access Denied
          </h3>
          <p className="text-red-600">
            You don't have permission to {action} {resource}.
          </p>
        </div>
      );
    }

    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component for protecting entire components
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  resource: string,
  action: string = 'read',
  fallback?: React.ReactNode
) {
  return function ProtectedComponentWrapper(props: T) {
    return (
      <PermissionGate resource={resource} action={action} fallback={fallback}>
        <Component {...props} />
      </PermissionGate>
    );
  };
}

// Higher-order component for feature gating
export function withFeature<T extends object>(
  Component: React.ComponentType<T>,
  feature: string,
  fallback?: React.ReactNode
) {
  return function FeatureGatedComponent(props: T) {
    return (
      <FeatureGate feature={feature} fallback={fallback}>
        <Component {...props} />
      </FeatureGate>
    );
  };
}

// Utility component for conditional rendering based on permissions
interface ConditionalRenderProps {
  condition: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function ConditionalRender({
  condition,
  fallback = null,
  children,
}: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

// Hook for permission-based conditional rendering
export function usePermissionRender() {
  const { hasPermission, hasFeature } = usePermissions();

  return {
    renderIfPermission: (
      resource: string,
      action: string,
      children: React.ReactNode,
      fallback?: React.ReactNode
    ) => (hasPermission(resource, action) ? children : fallback),
    renderIfFeature: (
      feature: string,
      children: React.ReactNode,
      fallback?: React.ReactNode
    ) => (hasFeature(feature) ? children : fallback),
  };
}
