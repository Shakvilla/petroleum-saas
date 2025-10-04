import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { useTenant } from '@/components/tenant-provider';
import {
  useTenantAPI,
  createTenantQueryKey,
  validateTenantData,
} from '@/lib/tenant-aware-api-client';
import { queryKeys } from '@/lib/query-client';

// Enhanced query keys with tenant scoping
export const tenantQueryKeys = {
  // Auth queries
  auth: {
    user: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['auth', 'user']),
    permissions: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['auth', 'permissions']),
  },

  // Tenant queries
  tenant: {
    current: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['tenant', 'current']),
    settings: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['tenant', 'settings']),
    branding: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['tenant', 'branding']),
    features: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['tenant', 'features']),
  },

  // Tank queries
  tanks: {
    all: (tenantId: string) => createTenantQueryKey(tenantId, ['tanks']),
    list: (tenantId: string, filters?: any) =>
      createTenantQueryKey(tenantId, ['tanks', 'list', filters]),
    detail: (tenantId: string, id: string) =>
      createTenantQueryKey(tenantId, ['tanks', 'detail', id]),
    levels: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['tanks', 'levels']),
  },

  // Delivery queries
  deliveries: {
    all: (tenantId: string) => createTenantQueryKey(tenantId, ['deliveries']),
    list: (tenantId: string, filters?: any) =>
      createTenantQueryKey(tenantId, ['deliveries', 'list', filters]),
    detail: (tenantId: string, id: string) =>
      createTenantQueryKey(tenantId, ['deliveries', 'detail', id]),
    active: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['deliveries', 'active']),
  },

  // Vehicle queries
  vehicles: {
    all: (tenantId: string) => createTenantQueryKey(tenantId, ['vehicles']),
    list: (tenantId: string, filters?: any) =>
      createTenantQueryKey(tenantId, ['vehicles', 'list', filters]),
    detail: (tenantId: string, id: string) =>
      createTenantQueryKey(tenantId, ['vehicles', 'detail', id]),
    status: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['vehicles', 'status']),
  },

  // Analytics queries
  analytics: {
    dashboard: (tenantId: string) =>
      createTenantQueryKey(tenantId, ['analytics', 'dashboard']),
    sales: (tenantId: string, period: string) =>
      createTenantQueryKey(tenantId, ['analytics', 'sales', period]),
    inventory: (tenantId: string, period: string) =>
      createTenantQueryKey(tenantId, ['analytics', 'inventory', period]),
    performance: (tenantId: string, period: string) =>
      createTenantQueryKey(tenantId, ['analytics', 'performance', period]),
  },

  // Reports queries
  reports: {
    list: (tenantId: string) => createTenantQueryKey(tenantId, ['reports']),
    detail: (tenantId: string, id: string) =>
      createTenantQueryKey(tenantId, ['reports', 'detail', id]),
    generate: (tenantId: string, type: string) =>
      createTenantQueryKey(tenantId, ['reports', 'generate', type]),
  },
} as const;

// Hook for tenant-scoped queries
export function useTenantQuery<TData = unknown, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  if (!tenant) {
    throw new Error('useTenantQuery must be used within a tenant context');
  }

  const tenantScopedKey = createTenantQueryKey(tenant.id, queryKey);

  return useQuery({
    queryKey: tenantScopedKey,
    queryFn: async () => {
      const data = await queryFn();
      return validateTenantData(data as any, tenant.id) as TData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

// Hook for tenant-scoped mutations
export function useTenantMutation<
  TData = unknown,
  TVariables = unknown,
  TError = Error,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  if (!tenant) {
    throw new Error('useTenantMutation must be used within a tenant context');
  }

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const data = await mutationFn(variables);
      return validateTenantData(data as any, tenant.id) as TData;
    },
    onSuccess: (data, variables, context, meta) => {
      // Invalidate all tenant queries on successful mutation
      queryClient.invalidateQueries({
        queryKey: ['tenant', tenant.id],
      });

      // Call the original onSuccess if provided
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, context, meta);
      }
    },
    ...options,
  });
}

// Specific hooks for common operations

// Tanks
export function useTanks(filters?: any) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['tanks', 'list', filters],
    () => apiClient.findMany('tanks', filters),
    {
      enabled: !!tenant,
    }
  );
}

export function useTank(id: string) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['tanks', 'detail', id],
    () => apiClient.findOne('tanks', id),
    {
      enabled: !!tenant && !!id,
    }
  );
}

export function useCreateTank() {
  const apiClient = useTenantAPI();

  return useTenantMutation((data: any) => apiClient.create('tanks', data));
}

export function useUpdateTank() {
  const apiClient = useTenantAPI();

  return useTenantMutation(({ id, data }: { id: string; data: any }) =>
    apiClient.update('tanks', id, data)
  );
}

export function useDeleteTank() {
  const apiClient = useTenantAPI();

  return useTenantMutation((id: string) => apiClient.delete('tanks', id));
}

// Deliveries
export function useDeliveries(filters?: any) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['deliveries', 'list', filters],
    () => apiClient.findMany('deliveries', filters),
    {
      enabled: !!tenant,
    }
  );
}

export function useDelivery(id: string) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['deliveries', 'detail', id],
    () => apiClient.findOne('deliveries', id),
    {
      enabled: !!tenant && !!id,
    }
  );
}

export function useCreateDelivery() {
  const apiClient = useTenantAPI();

  return useTenantMutation((data: any) => apiClient.create('deliveries', data));
}

// Vehicles
export function useVehicles(filters?: any) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['vehicles', 'list', filters],
    () => apiClient.findMany('vehicles', filters),
    {
      enabled: !!tenant,
    }
  );
}

export function useVehicle(id: string) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['vehicles', 'detail', id],
    () => apiClient.findOne('vehicles', id),
    {
      enabled: !!tenant && !!id,
    }
  );
}

// Analytics
export function useDashboardAnalytics() {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['analytics', 'dashboard'],
    () => apiClient.findOne('analytics', 'dashboard'),
    {
      enabled: !!tenant,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );
}

export function useSalesAnalytics(period: string) {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['analytics', 'sales', period],
    () => apiClient.findOne('analytics', `sales/${period}`),
    {
      enabled: !!tenant && !!period,
    }
  );
}

// Tenant management
export function useTenantSettings() {
  const { tenant } = useTenant();
  const apiClient = useTenantAPI();

  return useTenantQuery(
    ['tenant', 'settings'],
    () => apiClient.findOne('tenant', 'settings'),
    {
      enabled: !!tenant,
    }
  );
}

export function useUpdateTenantSettings() {
  const apiClient = useTenantAPI();

  return useTenantMutation((data: any) =>
    apiClient.patch('tenant', 'settings', data)
  );
}

// Cache management utilities
export function useTenantCache() {
  const { tenant } = useTenant();
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    if (tenant) {
      queryClient.invalidateQueries({
        queryKey: ['tenant', tenant.id],
      });
    }
  };

  const invalidateResource = (resource: string) => {
    if (tenant) {
      queryClient.invalidateQueries({
        queryKey: ['tenant', tenant.id, resource],
      });
    }
  };

  const clearAll = () => {
    if (tenant) {
      queryClient.removeQueries({
        queryKey: ['tenant', tenant.id],
      });
    }
  };

  return {
    invalidateAll,
    invalidateResource,
    clearAll,
  };
}
