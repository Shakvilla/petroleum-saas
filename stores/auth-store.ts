import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Permission } from '@/types';
import {
  MOCK_AUTH_STORE_STATE,
  mockLogin,
  mockLogout,
  mockRefreshToken,
  mockUpdateProfile,
} from '@/lib/mock-auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: Permission[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  hasPermission: (resource: string, action: string) => boolean;
  hasRole: (role: UserRole) => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - using mock data for development
      user: MOCK_AUTH_STORE_STATE.user,
      token: MOCK_AUTH_STORE_STATE.token,
      isAuthenticated: MOCK_AUTH_STORE_STATE.isAuthenticated,
      permissions: MOCK_AUTH_STORE_STATE.permissions,
      isLoading: MOCK_AUTH_STORE_STATE.isLoading,
      error: MOCK_AUTH_STORE_STATE.error,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          if (data.success) {
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
              permissions: data.data.user.permissions || [],
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Login failed');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
          });
        } catch (error) {
          console.warn('Logout error:', error);
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          permissions: [],
          error: null,
        });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: token }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Token refresh failed');
          }

          if (data.success) {
            set({
              token: data.data.token,
              user: data.data.user,
            });
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      updateProfile: async (profile: Partial<User>) => {
        const { user, token } = get();
        if (!user || !token) return;

        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Profile update failed');
          }

          if (data.success) {
            set({
              user: data.data,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Profile update failed');
          }
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error ? error.message : 'Profile update failed',
          });
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      setToken: (token: string) => {
        set({ token });
      },

      setPermissions: (permissions: Permission[]) => {
        set({ permissions });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      hasPermission: (resource: string, action: string) => {
        const { permissions } = get();
        return permissions.some(
          permission =>
            permission.resource === resource && permission.action === action
        );
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        permissions: state.permissions,
      }),
    }
  )
);
