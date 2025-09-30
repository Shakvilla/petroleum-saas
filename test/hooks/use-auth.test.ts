import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin, useLogout, useUser } from '@/hooks/api/use-auth';
import { useAuthStore } from '@/stores/auth-store';

// Mock the auth store
jest.mock('@/stores/auth-store');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useAuth hooks', () => {
  const mockSetUser = jest.fn();
  const mockSetToken = jest.fn();
  const mockSetPermissions = jest.fn();
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useAuthStore as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      permissions: [],
      setUser: mockSetUser,
      setToken: mockSetToken,
      setPermissions: mockSetPermissions,
      logout: mockLogout,
    });

    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useLogin', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [{ resource: 'tanks', action: 'read' }],
        },
        token: 'mock-token',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'john@example.com',
        password: 'password',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user);
      expect(mockSetToken).toHaveBeenCalledWith(mockResponse.token);
      expect(mockSetPermissions).toHaveBeenCalledWith(mockResponse.user.permissions);
    });

    it('should handle login error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        email: 'john@example.com',
        password: 'wrong-password',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockSetToken).not.toHaveBeenCalled();
    });
  });

  describe('useLogout', () => {
    it('should logout successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockLogout).toHaveBeenCalled();
    });

    it('should handle logout error gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useLogout(), {
        wrapper: createWrapper(),
      });

      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should still logout locally even if API call fails
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('useUser', () => {
    it('should return user data when authenticated', () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['admin'],
        permissions: [{ resource: 'tanks', action: 'read' }],
      };

      (useAuthStore as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        permissions: mockUser.permissions,
      });

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return null when not authenticated', () => {
      (useAuthStore as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        permissions: [],
      });

      const { result } = renderHook(() => useUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
