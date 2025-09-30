import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth-store';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('AuthStore', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset store state
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.permissions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['admin'],
        permissions: [{ resource: 'tanks', action: 'read' }],
      };

      const mockToken = 'mock-jwt-token';

      await act(async () => {
        await result.current.login('john@example.com', 'password');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.permissions).toEqual(mockUser.permissions);
      expect(result.current.token).toBe(mockToken);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle login error', async () => {
      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login('invalid@example.com', 'wrong-password');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [],
        });
        result.current.setToken('mock-token');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.permissions).toEqual([]);
      expect(result.current.token).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user data', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['admin'],
        permissions: [],
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('setToken', () => {
    it('should set token', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockToken = 'mock-jwt-token';

      act(() => {
        result.current.setToken(mockToken);
      });

      expect(result.current.token).toBe(mockToken);
    });
  });

  describe('setPermissions', () => {
    it('should set permissions', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockPermissions = [
        { resource: 'tanks', action: 'read' },
        { resource: 'tanks', action: 'write' },
      ];

      act(() => {
        result.current.setPermissions(mockPermissions);
      });

      expect(result.current.permissions).toEqual(mockPermissions);
    });
  });

  describe('hasPermission', () => {
    it('should return true when user has permission', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockPermissions = [
        { resource: 'tanks', action: 'read' },
        { resource: 'tanks', action: 'write' },
      ];

      act(() => {
        result.current.setPermissions(mockPermissions);
      });

      expect(result.current.hasPermission('tanks', 'read')).toBe(true);
      expect(result.current.hasPermission('tanks', 'write')).toBe(true);
    });

    it('should return false when user does not have permission', () => {
      const { result } = renderHook(() => useAuthStore());

      const mockPermissions = [{ resource: 'tanks', action: 'read' }];

      act(() => {
        result.current.setPermissions(mockPermissions);
      });

      expect(result.current.hasPermission('tanks', 'write')).toBe(false);
      expect(result.current.hasPermission('deliveries', 'read')).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [],
        });
        result.current.setToken('mock-token');
      });

      const updatedProfile = {
        name: 'John Updated',
        email: 'john.updated@example.com',
      };

      await act(async () => {
        await result.current.updateProfile(updatedProfile);
      });

      expect(result.current.user?.name).toBe('John Updated');
      expect(result.current.user?.email).toBe('john.updated@example.com');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle profile update error', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [],
        });
        result.current.setToken('invalid-token');
      });

      const updatedProfile = {
        name: 'John Updated',
      };

      await act(async () => {
        await result.current.updateProfile(updatedProfile);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Profile update failed');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [],
        });
        result.current.setToken('old-token');
      });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.token).toBe('new-mock-token');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle token refresh error', async () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.setUser({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin'],
          permissions: [],
        });
        result.current.setToken('invalid-token');
      });

      await act(async () => {
        await result.current.refreshToken();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Token refresh failed');
    });
  });
});
