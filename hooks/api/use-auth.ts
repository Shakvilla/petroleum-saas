import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { queryKeys, invalidateQueries } from '@/lib/query-client';
import type { User, LoginCredentials } from '@/types';

// Mock API functions - replace with actual API calls
const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  refreshToken: async (): Promise<{ token: string; user: User }> => {
    const response = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  getProfile: async (): Promise<User> => {
    const response = await fetch('/api/auth/profile');

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  updateProfile: async (profile: Partial<User>): Promise<User> => {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Profile update failed');
    }

    return response.json();
  },
};

// Hook for user profile
export function useUser() {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    initialData: user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for login
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setToken, setPermissions } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      setUser(data.user);
      setToken(data.token);
      setPermissions(data.user.permissions || []);

      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
    onError: error => {
      console.error('Login error:', error);
    },
  });
}

// Hook for logout
export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: error => {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      logout();
      queryClient.clear();
    },
  });
}

// Hook for token refresh
export function useRefreshToken() {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.refreshToken,
    onSuccess: data => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: error => {
      console.error('Token refresh error:', error);
    },
  });
}

// Hook for profile update
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: updatedUser => {
      setUser(updatedUser);
      queryClient.setQueryData(queryKeys.auth.user, updatedUser);
    },
    onError: error => {
      console.error('Profile update error:', error);
    },
  });
}

// Hook for checking permissions
export function usePermissions() {
  const { permissions } = useAuthStore();

  const hasPermission = (resource: string, action: string): boolean => {
    return permissions.some(
      permission =>
        permission.resource === resource && permission.action === action
    );
  };

  const hasAnyPermission = (
    permissions: Array<{ resource: string; action: string }>
  ): boolean => {
    return permissions.some(({ resource, action }) =>
      hasPermission(resource, action)
    );
  };

  const hasAllPermissions = (
    permissions: Array<{ resource: string; action: string }>
  ): boolean => {
    return permissions.every(({ resource, action }) =>
      hasPermission(resource, action)
    );
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
