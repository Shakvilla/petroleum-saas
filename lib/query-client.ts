import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408, 429
        if (
          error?.status >= 400 &&
          error?.status < 500 &&
          ![408, 429].includes(error?.status)
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

// Query key factory for consistent key generation
export const queryKeys = {
  // Auth queries
  auth: {
    user: ['auth', 'user'] as const,
    permissions: ['auth', 'permissions'] as const,
  },

  // Tenant queries
  tenant: {
    current: ['tenant', 'current'] as const,
    settings: ['tenant', 'settings'] as const,
    branding: ['tenant', 'branding'] as const,
  },

  // Tank queries
  tanks: {
    all: ['tanks'] as const,
    list: (filters?: any) => ['tanks', 'list', filters] as const,
    detail: (id: string) => ['tanks', 'detail', id] as const,
    levels: ['tanks', 'levels'] as const,
  },

  // Delivery queries
  deliveries: {
    all: ['deliveries'] as const,
    list: (filters?: any) => ['deliveries', 'list', filters] as const,
    detail: (id: string) => ['deliveries', 'detail', id] as const,
    active: ['deliveries', 'active'] as const,
  },

  // Vehicle queries
  vehicles: {
    all: ['vehicles'] as const,
    list: (filters?: any) => ['vehicles', 'list', filters] as const,
    detail: (id: string) => ['vehicles', 'detail', id] as const,
    status: ['vehicles', 'status'] as const,
  },

  // Analytics queries
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    sales: (period: string) => ['analytics', 'sales', period] as const,
    inventory: (period: string) => ['analytics', 'inventory', period] as const,
    performance: (period: string) =>
      ['analytics', 'performance', period] as const,
  },

  // Reports queries
  reports: {
    list: ['reports'] as const,
    detail: (id: string) => ['reports', 'detail', id] as const,
    generate: (type: string) => ['reports', 'generate', type] as const,
  },
} as const;

// Cache invalidation helpers
export const invalidateQueries = {
  auth: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.user }),
  tenant: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.tenant.current }),
  tanks: () => queryClient.invalidateQueries({ queryKey: queryKeys.tanks.all }),
  deliveries: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.deliveries.all }),
  vehicles: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all }),
  analytics: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.dashboard }),
  reports: () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.reports.list }),
} as const;
