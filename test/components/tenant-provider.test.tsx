import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TenantProvider, useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

// Mock fetch
global.fetch = jest.fn();

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const mockTenant: Tenant = {
  id: 'test-tenant',
  name: 'Test Tenant',
  plan: 'premium',
  settings: {
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
  },
  branding: {
    logo: '/test-logo.png',
    favicon: '/test-favicon.ico',
    name: 'Test Tenant',
    tagline: 'Test Tagline',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
    },
    fonts: {
      primary: 'Inter',
      secondary: 'Inter',
    },
  },
  features: {
    predictive_analytics: true,
    iot_monitoring: true,
    advanced_reporting: true,
  },
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    surfaceColor: '#f8fafc',
    textColor: '#1e293b',
    textSecondaryColor: '#64748b',
    borderColor: '#e2e8f0',
    primaryFont: 'Inter',
    secondaryFont: 'Inter',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Test component that uses the tenant context
function TestComponent() {
  const { tenant, isLoading, error } = useTenant();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!tenant) return <div>No tenant</div>;

  return <div>Tenant: {tenant.name}</div>;
}

describe('TenantProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide tenant context to children', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTenant,
    });

    render(
      <TenantProvider initialTenantId="test-tenant">
        <TestComponent />
      </TenantProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Tenant: Test Tenant')).toBeInTheDocument();
    });
  });

  it('should handle tenant loading error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(
      <TenantProvider initialTenantId="nonexistent-tenant">
        <TestComponent />
      </TenantProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should handle network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(
      <TenantProvider initialTenantId="test-tenant">
        <TestComponent />
      </TenantProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should show error when no tenant ID is provided', async () => {
    render(
      <TenantProvider>
        <TestComponent />
      </TenantProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('should validate tenant data', async () => {
    const invalidTenant = { ...mockTenant, id: 'different-id' };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => invalidTenant,
    });

    render(
      <TenantProvider initialTenantId="test-tenant">
        <TestComponent />
      </TenantProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });
});

describe('useTenant hook', () => {
  it('should throw error when used outside TenantProvider', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTenant must be used within a TenantProvider');

    consoleSpy.mockRestore();
  });
});

describe('Tenant resolution strategies', () => {
  it('should resolve tenant from subdomain', () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'test-tenant.petromanager.com',
        pathname: '/',
      },
      writable: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTenant,
    });

    render(
      <TenantProvider>
        <TestComponent />
      </TenantProvider>
    );

    expect(fetch).toHaveBeenCalledWith('/api/tenants/test-tenant');
  });

  it('should resolve tenant from path', () => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'petromanager.com',
        pathname: '/test-tenant/dashboard',
      },
      writable: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTenant,
    });

    render(
      <TenantProvider>
        <TestComponent />
      </TenantProvider>
    );

    expect(fetch).toHaveBeenCalledWith('/api/tenants/test-tenant');
  });

  it('should handle custom domain', () => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'custom-domain.com',
        pathname: '/',
      },
      writable: true,
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTenant,
    });

    render(
      <TenantProvider>
        <TestComponent />
      </TenantProvider>
    );

    expect(fetch).toHaveBeenCalledWith('/api/tenants/custom-domain-com');
  });
});
