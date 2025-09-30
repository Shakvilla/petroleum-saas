'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { useTenantStore } from '@/stores/tenant-store';
import type { Tenant } from '@/types';

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  initialTenantId?: string;
}

export function TenantProvider({
  children,
  fallback = <div>Loading tenant...</div>,
  initialTenantId,
}: TenantProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {
    current: tenant,
    setTenant,
    setLoading,
    setError: setStoreError,
    clearError,
  } = useTenantStore();

  // Tenant resolution strategies
  const resolveTenantId = useCallback((): string | null => {
    if (initialTenantId) return initialTenantId;

    if (typeof window === 'undefined') return null;

    const hostname = window.location.hostname;
    const pathname = window.location.pathname;

    // Strategy 1: Subdomain-based (tenant.petromanager.com)
    if (hostname.includes('.')) {
      const subdomain = hostname.split('.')[0];
      if (
        subdomain !== 'www' &&
        subdomain !== 'app' &&
        subdomain !== 'localhost'
      ) {
        return subdomain;
      }
    }

    // Strategy 2: Path-based (/tenant/...)
    const pathMatch = pathname.match(/^\/([^\/]+)/);
    if (pathMatch) {
      const segment = pathMatch[1];
      // Skip non-tenant path segments
      if (
        segment !== 'api' &&
        segment !== '_next' &&
        segment !== 'auth' &&
        segment !== 'tenant-selection' &&
        segment !== 'favicon.ico' &&
        segment !== 'robots.txt' &&
        segment !== 'sitemap.xml'
      ) {
        return segment;
      }
    }

    // Strategy 3: Custom domain (check against known custom domains)
    // This would typically involve a lookup against a custom domain registry
    if (hostname !== 'localhost' && !hostname.includes('petromanager.com')) {
      // For now, use the full hostname as tenant ID for custom domains
      return hostname.replace(/\./g, '-');
    }

    return null;
  }, [initialTenantId]);

  // Load tenant data
  const loadTenant = useCallback(
    async (tenantId: string) => {
      setIsLoading(true);
      setError(null);
      clearError();

      try {
        // Mock tenant data - replace with actual API call
        const response = await fetch(`/api/tenants/${tenantId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Tenant '${tenantId}' not found`);
          }
          throw new Error(`Failed to load tenant: ${response.statusText}`);
        }

        const tenantData: Tenant = await response.json();

        // Validate tenant data
        if (!tenantData.id || tenantData.id !== tenantId) {
          throw new Error('Invalid tenant data received');
        }

        setTenant(tenantData);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load tenant';
        setError(errorMessage);
        setStoreError(errorMessage);
        console.error('Tenant loading error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [setTenant, setStoreError, clearError]
  );

  // Switch to a different tenant
  const switchTenant = useCallback(
    async (tenantId: string) => {
      if (tenant?.id === tenantId) return;

      try {
        await loadTenant(tenantId);

        // Update URL to reflect new tenant
        const currentPath = window.location.pathname;
        const newPath = currentPath.startsWith(`/${tenant?.id}`)
          ? currentPath.replace(`/${tenant?.id}`, `/${tenantId}`)
          : `/${tenantId}${currentPath}`;

        router.push(newPath);
      } catch (err) {
        console.error('Failed to switch tenant:', err);
        throw err;
      }
    },
    [tenant?.id, loadTenant, router]
  );

  // Refresh current tenant data
  const refreshTenant = useCallback(async () => {
    if (!tenant?.id) return;
    await loadTenant(tenant.id);
  }, [tenant?.id, loadTenant]);

  // Clear tenant context
  const clearTenant = useCallback(() => {
    setTenant(null as any);
    setError(null);
    clearError();
  }, [setTenant, clearError]);

  // Initialize tenant on mount
  useEffect(() => {
    const initializeTenant = async () => {
      const tenantId = resolveTenantId();

      if (!tenantId) {
        setIsLoading(false);
        return;
      }

      if (tenant?.id === tenantId) {
        setIsLoading(false);
        return;
      }

      await loadTenant(tenantId);
    };

    initializeTenant();
  }, [resolveTenantId, tenant?.id, loadTenant]);

  // Handle tenant validation
  useEffect(() => {
    if (tenant && typeof window !== 'undefined') {
      const currentTenantId = resolveTenantId();
      if (currentTenantId && tenant.id !== currentTenantId) {
        // Optionally reload the correct tenant
        loadTenant(currentTenantId);
      }
    }
  }, [tenant, resolveTenantId, loadTenant]);

  const contextValue: TenantContextType = {
    tenant,
    isLoading,
    error,
    switchTenant,
    refreshTenant,
    clearTenant,
  };

  // Always provide the context, even when loading
  return (
    <TenantContext.Provider value={contextValue}>
      {isLoading ? fallback : children}
    </TenantContext.Provider>
  );
}

// Hook for components that require a tenant
export function useRequiredTenant() {
  const { tenant } = useTenant();

  if (!tenant) {
    throw new Error('Component requires tenant context but none is available');
  }

  return tenant;
}

// Hook for tenant-aware routing
export function useTenantRouter() {
  const { tenant } = useTenant();
  const router = useRouter();

  const push = useCallback(
    (path: string) => {
      if (!tenant) {
        console.warn('Cannot navigate without tenant context');
        return;
      }

      const tenantPath = path.startsWith('/')
        ? `/${tenant.id}${path}`
        : `/${tenant.id}/${path}`;
      router.push(tenantPath);
    },
    [tenant, router]
  );

  const replace = useCallback(
    (path: string) => {
      if (!tenant) {
        console.warn('Cannot navigate without tenant context');
        return;
      }

      const tenantPath = path.startsWith('/')
        ? `/${tenant.id}${path}`
        : `/${tenant.id}/${path}`;
      router.replace(tenantPath);
    },
    [tenant, router]
  );

  return { push, replace, tenant };
}
