import {
  TenantAwareAPIClient,
  TenantAPIError,
} from '@/lib/tenant-aware-api-client';

// Mock fetch
global.fetch = jest.fn();

describe('TenantAwareAPIClient', () => {
  let apiClient: TenantAwareAPIClient;

  beforeEach(() => {
    apiClient = new TenantAwareAPIClient();
    jest.clearAllMocks();
  });

  describe('setTenant', () => {
    it('should set tenant context', () => {
      apiClient.setTenant('test-tenant');
      expect(apiClient['tenantId']).toBe('test-tenant');
    });
  });

  describe('request', () => {
    beforeEach(() => {
      apiClient.setTenant('test-tenant');
    });

    it('should make request with tenant context', async () => {
      const mockResponse = { data: 'test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.request('/test');

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Tenant-ID': 'test-tenant',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no tenant context', async () => {
      const newClient = new TenantAwareAPIClient();

      await expect(newClient.request('/test')).rejects.toThrow(
        'No tenant context available for API request'
      );
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        url: '/api/tenants/test-tenant/test',
        json: async () => ({ message: 'Resource not found' }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow(TenantAPIError);
    });

    it('should handle tenant mismatch error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: async () => ({
          code: 'TENANT_MISMATCH',
          message: 'Tenant mismatch',
        }),
      });

      await expect(apiClient.request('/test')).rejects.toThrow(
        'Tenant mismatch in API response'
      );
    });

    it('should validate tenant ownership in response', async () => {
      const responseWithWrongTenant = {
        data: 'test',
        tenantId: 'wrong-tenant',
      };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithWrongTenant,
      });

      await expect(apiClient.request('/test')).rejects.toThrow(
        'Cross-tenant data access detected'
      );
    });

    it('should validate array response for tenant ownership', async () => {
      const responseWithWrongTenant = [
        { id: 1, tenantId: 'test-tenant' },
        { id: 2, tenantId: 'wrong-tenant' },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithWrongTenant,
      });

      await expect(apiClient.request('/test')).rejects.toThrow(
        'Cross-tenant data detected in array response'
      );
    });
  });

  describe('CRUD operations', () => {
    beforeEach(() => {
      apiClient.setTenant('test-tenant');
    });

    it('should create resource', async () => {
      const mockData = { name: 'Test Resource' };
      const mockResponse = { id: 1, ...mockData };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.create('resources', mockData);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should find many resources', async () => {
      const mockResponse = [
        { id: 1, name: 'Resource 1' },
        { id: 2, name: 'Resource 2' },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.findMany('resources', {
        status: 'active',
      });

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources?status=active',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should find one resource', async () => {
      const mockResponse = { id: 1, name: 'Test Resource' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.findOne('resources', '1');

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/1',
        expect.any(Object)
      );
      expect(result).toEqual(mockResponse);
    });

    it('should update resource', async () => {
      const mockData = { name: 'Updated Resource' };
      const mockResponse = { id: 1, ...mockData };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.update('resources', '1', mockData);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(mockData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should delete resource', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.delete('resources', '1');

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('batch operations', () => {
    beforeEach(() => {
      apiClient.setTenant('test-tenant');
    });

    it('should create many resources', async () => {
      const mockItems = [{ name: 'Item 1' }, { name: 'Item 2' }];
      const mockResponse = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.createMany('resources', mockItems);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/batch',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ items: mockItems }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should update many resources', async () => {
      const mockUpdates = [
        { id: '1', data: { name: 'Updated 1' } },
        { id: '2', data: { name: 'Updated 2' } },
      ];
      const mockResponse = [
        { id: 1, name: 'Updated 1' },
        { id: 2, name: 'Updated 2' },
      ];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.updateMany('resources', mockUpdates);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/batch',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ updates: mockUpdates }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should delete many resources', async () => {
      const mockIds = ['1', '2', '3'];

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.deleteMany('resources', mockIds);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/resources/batch',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ ids: mockIds }),
        })
      );
    });
  });

  describe('file upload', () => {
    beforeEach(() => {
      apiClient.setTenant('test-tenant');
    });

    it('should upload file', async () => {
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });
      const mockResponse = { id: 1, filename: 'test.txt' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiClient.uploadFile('documents', mockFile);

      expect(fetch).toHaveBeenCalledWith(
        '/api/tenants/test-tenant/documents/upload',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'X-Tenant-ID': 'test-tenant',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when no tenant context for upload', async () => {
      const newClient = new TenantAwareAPIClient();
      const mockFile = new File(['test content'], 'test.txt', {
        type: 'text/plain',
      });

      await expect(newClient.uploadFile('documents', mockFile)).rejects.toThrow(
        'No tenant context available for file upload'
      );
    });
  });
});

describe('TenantAPIError', () => {
  it('should create error with context', () => {
    const error = new TenantAPIError(
      'Test error',
      'TEST_ERROR',
      'test-tenant',
      { resource: 'test' }
    );

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.tenantId).toBe('test-tenant');
    expect(error.context).toEqual({ resource: 'test' });
  });
});
