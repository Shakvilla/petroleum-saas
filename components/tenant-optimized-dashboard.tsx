'use client';

import React, { Suspense, lazy, memo } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { useTenantCache } from '@/lib/tenant-cache';
import { useTenantPerformanceMonitor } from '@/lib/tenant-performance-monitor';
import { ProtectedComponent } from '@/components/protected-component';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/error-boundary';

// Lazy load heavy components
const ModernTankOverview = lazy(() =>
  import('@/components/modern-tank-overview').then(module => ({
    default: module.ModernTankOverview,
  }))
);
const ModernInventoryChart = lazy(() =>
  import('@/components/modern-inventory-chart').then(module => ({
    default: module.ModernInventoryChart,
  }))
);
const ModernSalesChart = lazy(() =>
  import('@/components/modern-sales-chart').then(module => ({
    default: module.ModernSalesChart,
  }))
);
const ModernPredictiveAnalytics = lazy(() =>
  import('@/components/modern-predictive-analytics').then(module => ({
    default: module.ModernPredictiveAnalytics,
  }))
);
const ModernIotMonitoring = lazy(() =>
  import('@/components/modern-iot-monitoring').then(module => ({
    default: module.ModernIoTMonitoring,
  }))
);
const ModernAlertsPanel = lazy(() =>
  import('@/components/modern-alerts-panel').then(module => ({
    default: module.ModernAlertsPanel,
  }))
);
const ModernTransactions = lazy(() =>
  import('@/components/modern-transactions').then(module => ({
    default: module.ModernTransactions,
  }))
);

// Memoized components for performance
const DashboardCard = memo(
  ({
    title,
    children,
    className = '',
  }: {
    title: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
);

DashboardCard.displayName = 'DashboardCard';

// Loading skeleton component
const DashboardSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
));

DashboardSkeleton.displayName = 'DashboardSkeleton';

// Error fallback component
const DashboardErrorFallback = memo(
  ({ error, resetError }: { error: Error; resetError: () => void }) => (
    <Card className="col-span-full">
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Dashboard Error
        </h3>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </CardContent>
    </Card>
  )
);

DashboardErrorFallback.displayName = 'DashboardErrorFallback';

// Main dashboard component
export function TenantOptimizedDashboard() {
  const { tenant } = useTenant();
  const { get: getCache, set: setCache } = useTenantCache();
  const { recordMetric } = useTenantPerformanceMonitor();

  // Validate tenant context
  if (!tenant) {
    throw new Error(
      'TenantOptimizedDashboard must be used within a tenant context'
    );
  }

  // Load dashboard data with caching
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useTenantQuery(
    ['dashboard', 'overview'],
    async () => {
      // Check cache first
      const cached = getCache('dashboard-overview');
      if (cached) {
        recordMetric('cache_hit', 1, 'count', { type: 'dashboard' });
        return cached;
      }

      // Fetch from API
      const startTime = performance.now();
      const response = await fetch(`/api/tenants/${tenant.id}/dashboard`);
      const endTime = performance.now();

      recordMetric('api_response_time', endTime - startTime, 'ms', {
        endpoint: 'dashboard',
      });

      if (!response.ok) {
        throw new Error(`Failed to load dashboard: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache the result
      setCache('dashboard-overview', data, { ttl: 5 * 60 * 1000 }); // 5 minutes

      return data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Record dashboard load time
  React.useEffect(() => {
    if (dashboardData) {
      recordMetric('dashboard_load_time', performance.now(), 'ms');
    }
  }, [dashboardData, recordMetric]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <DashboardErrorFallback
        error={error as Error}
        resetError={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {tenant.name} Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your operations.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tank Overview */}
        <ProtectedComponent
          resource="tanks"
          action="read"
          fallback={<div>Access denied to tank data</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Tank overview failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard title="Tank Overview" className="lg:col-span-2">
                <ModernTankOverview
                  tenant={tenant?.id || 'default'}
                  searchTerm=""
                />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* Inventory Chart */}
        <ProtectedComponent
          resource="inventory"
          action="read"
          fallback={<div>Access denied to inventory data</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Inventory chart failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard title="Inventory Levels">
                <ModernInventoryChart />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* Sales Chart */}
        <ProtectedComponent
          resource="sales"
          action="read"
          fallback={<div>Access denied to sales data</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Sales chart failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard title="Sales Performance">
                <ModernSalesChart />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* Predictive Analytics */}
        <ProtectedComponent
          resource="analytics"
          action="read"
          fallback={<div>Predictive analytics not available in your plan</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Predictive analytics failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard
                title="Predictive Analytics"
                className="lg:col-span-2"
              >
                <ModernPredictiveAnalytics tenant={tenant?.id || 'default'} />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* IoT Monitoring */}
        <ProtectedComponent
          resource="iot"
          action="read"
          fallback={<div>Access denied to IoT data</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('IoT monitoring failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard title="IoT Monitoring">
                <ModernIotMonitoring tenant={tenant?.id || 'default'} />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* Alerts Panel */}
        <ProtectedComponent
          resource="alerts"
          action="read"
          fallback={<div>Access denied to alerts</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Alerts panel failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard title="Active Alerts">
                <ModernAlertsPanel />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>

        {/* Recent Transactions */}
        <ProtectedComponent
          resource="transactions"
          action="read"
          fallback={<div>Access denied to transactions</div>}
        >
          <ErrorBoundary
            fallback={
              <DashboardErrorFallback
                error={new Error('Transactions failed')}
                resetError={() => {}}
              />
            }
          >
            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
              <DashboardCard
                title="Recent Transactions"
                className="lg:col-span-3"
              >
                <ModernTransactions />
              </DashboardCard>
            </Suspense>
          </ErrorBoundary>
        </ProtectedComponent>
      </div>
    </div>
  );
}

// Export memoized version for performance
export default memo(TenantOptimizedDashboard);
