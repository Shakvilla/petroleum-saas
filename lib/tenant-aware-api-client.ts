import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

export interface APIError {
  code: string;
  message: string;
  tenantId?: string;
  context?: Record<string, any>;
}

export class TenantAPIError extends Error {
  public code: string;
  public tenantId?: string;
  public context?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    tenantId?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'TenantAPIError';
    this.code = code;
    this.tenantId = tenantId;
    this.context = context;
  }
}

export class TenantAwareAPIClient {
  private baseURL: string;
  private tenantId: string | null = null;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  // Set tenant context
  setTenant(tenantId: string) {
    this.tenantId = tenantId;
  }

  // Set default headers
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  // Get tenant-scoped URL
  private getTenantURL(endpoint: string): string {
    if (!this.tenantId) {
      throw new TenantAPIError(
        'No tenant context available',
        'NO_TENANT_CONTEXT'
      );
    }

    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;
    return `${this.baseURL}/tenants/${this.tenantId}/${cleanEndpoint}`;
  }

  // Validate response for tenant ownership
  private validateTenantResponse(
    response: any,
    expectedTenantId: string
  ): void {
    if (response && typeof response === 'object') {
      // Check if response has tenantId field
      if (response.tenantId && response.tenantId !== expectedTenantId) {
        throw new TenantAPIError(
          'Cross-tenant data access detected',
          'CROSS_TENANT_ACCESS',
          expectedTenantId,
          { responseTenantId: response.tenantId }
        );
      }

      // Check if response is an array with tenant data
      if (Array.isArray(response)) {
        const invalidItems = response.filter(
          item =>
            item &&
            typeof item === 'object' &&
            item.tenantId &&
            item.tenantId !== expectedTenantId
        );

        if (invalidItems.length > 0) {
          throw new TenantAPIError(
            'Cross-tenant data detected in array response',
            'CROSS_TENANT_ACCESS',
            expectedTenantId,
            { invalidItemCount: invalidItems.length }
          );
        }
      }
    }
  }

  // Core request method
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.tenantId) {
      throw new TenantAPIError(
        'No tenant context available for API request',
        'NO_TENANT_CONTEXT'
      );
    }

    const url = this.getTenantURL(endpoint);

    const headers = {
      'Content-Type': 'application/json',
      'X-Tenant-ID': this.tenantId,
      ...this.defaultHeaders,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle HTTP errors
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // If response is not JSON, use status text
          errorData = { message: response.statusText };
        }

        // Check for tenant-specific errors
        if (response.status === 403 && errorData.code === 'TENANT_MISMATCH') {
          throw new TenantAPIError(
            'Tenant mismatch in API response',
            'TENANT_MISMATCH',
            this.tenantId,
            errorData
          );
        }

        if (response.status === 404 && errorData.code === 'TENANT_NOT_FOUND') {
          throw new TenantAPIError(
            `Tenant '${this.tenantId}' not found`,
            'TENANT_NOT_FOUND',
            this.tenantId
          );
        }

        throw new TenantAPIError(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          errorData.code || 'HTTP_ERROR',
          this.tenantId,
          { status: response.status, ...errorData }
        );
      }

      const data = await response.json();

      // Validate tenant ownership
      this.validateTenantResponse(data, this.tenantId);

      return data;
    } catch (error) {
      if (error instanceof TenantAPIError) {
        throw error;
      }

      // Network or other errors
      throw new TenantAPIError(
        error instanceof Error ? error.message : 'Network error',
        'NETWORK_ERROR',
        this.tenantId,
        { originalError: error }
      );
    }
  }

  // CRUD operations
  async create<T>(resource: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async findMany<T>(
    resource: string,
    filters: Record<string, any> = {}
  ): Promise<T[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = queryString
      ? `/${resource}?${queryString}`
      : `/${resource}`;

    return this.request<T[]>(endpoint);
  }

  async findOne<T>(resource: string, id: string): Promise<T> {
    return this.request<T>(`/${resource}/${id}`);
  }

  async update<T>(resource: string, id: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(resource: string, id: string, data: any): Promise<T> {
    return this.request<T>(`/${resource}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(resource: string, id: string): Promise<void> {
    await this.request(`/${resource}/${id}`, {
      method: 'DELETE',
    });
  }

  // Batch operations
  async createMany<T>(resource: string, items: any[]): Promise<T[]> {
    return this.request<T[]>(`/${resource}/batch`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  async updateMany<T>(
    resource: string,
    updates: Array<{ id: string; data: any }>
  ): Promise<T[]> {
    return this.request<T[]>(`/${resource}/batch`, {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  async deleteMany(resource: string, ids: string[]): Promise<void> {
    await this.request(`/${resource}/batch`, {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // File upload
  async uploadFile<T>(
    resource: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<T> {
    if (!this.tenantId) {
      throw new TenantAPIError(
        'No tenant context available for file upload',
        'NO_TENANT_CONTEXT'
      );
    }

    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const url = this.getTenantURL(`/${resource}/upload`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Tenant-ID': this.tenantId,
        ...this.defaultHeaders,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new TenantAPIError(
        errorData.message || `Upload failed: ${response.statusText}`,
        errorData.code || 'UPLOAD_ERROR',
        this.tenantId
      );
    }

    const data = await response.json();
    this.validateTenantResponse(data, this.tenantId);

    return data;
  }
}

// Global API client instance
export const apiClient = new TenantAwareAPIClient();

// React hook for using the API client
export function useTenantAPI() {
  const { tenant } = useTenant();

  // Update API client tenant context when tenant changes
  useEffect(() => {
    if (tenant?.id) {
      apiClient.setTenant(tenant.id);
    }
  }, [tenant?.id]);

  return apiClient;
}

// Utility function to create tenant-scoped query keys
export function createTenantQueryKey(
  tenantId: string,
  baseKey: string[]
): string[] {
  return ['tenant', tenantId, ...baseKey];
}

// Utility function to validate tenant data
export function validateTenantData<T extends { tenantId?: string }>(
  data: T | T[],
  expectedTenantId: string
): T | T[] {
  if (Array.isArray(data)) {
    const invalidItems = data.filter(
      item => item.tenantId && item.tenantId !== expectedTenantId
    );

    if (invalidItems.length > 0) {
      throw new TenantAPIError(
        'Cross-tenant data detected',
        'CROSS_TENANT_ACCESS',
        expectedTenantId,
        { invalidItemCount: invalidItems.length }
      );
    }
  } else if (data.tenantId && data.tenantId !== expectedTenantId) {
    throw new TenantAPIError(
      'Cross-tenant data detected',
      'CROSS_TENANT_ACCESS',
      expectedTenantId,
      { dataTenantId: data.tenantId }
    );
  }

  return data;
}
