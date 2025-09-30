import type { User, UserRole } from '@/types';
import { MOCK_ADMIN, MOCK_COMPANY } from './mock-company';

// Mock authentication data for PetroMax Energy Solutions
export const MOCK_AUTH_DATA = {
  // Admin user with full permissions
  admin: MOCK_ADMIN,

  // Mock JWT token (for development only)
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG1pbi1wZXRyb21heC0wMDEiLCJ0ZW5hbnRJZCI6InBldHJvbWF4LWVuZXJneSIsInJvbGUiOiJBRE1JTiIsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzA2MTk4NDAwLCJleHAiOjE3MDY4MDMyMDB9.mock-signature',

  // Mock refresh token
  refreshToken: 'refresh-mock-token-petromax-admin-001',

  // Session data
  session: {
    id: 'session-petromax-001',
    userId: MOCK_ADMIN.id,
    tenantId: MOCK_COMPANY.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    createdAt: new Date(),
    lastActivity: new Date(),
  },
};

// Mock login response
const MOCK_LOGIN_RESPONSE = {
  user: MOCK_ADMIN,
  token: MOCK_AUTH_DATA.token,
  refreshToken: MOCK_AUTH_DATA.refreshToken,
  session: MOCK_AUTH_DATA.session,
  permissions: MOCK_ADMIN.permissions,
  tenant: MOCK_COMPANY,
};

// Mock auth store initial state
const MOCK_AUTH_STORE_STATE = {
  user: MOCK_ADMIN,
  token: MOCK_AUTH_DATA.token,
  isAuthenticated: true,
  permissions: MOCK_ADMIN.permissions,
  isLoading: false,
  error: null,
};

// Utility function to simulate login
export const mockLogin = async (email: string, password: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === MOCK_ADMIN.email && password === 'admin123') {
    return {
      success: true,
      data: MOCK_LOGIN_RESPONSE,
    };
  }

  return {
    success: false,
    error: 'Invalid credentials',
  };
};

// Utility function to simulate token refresh
export const mockRefreshToken = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    success: true,
    data: {
      token: MOCK_AUTH_DATA.token,
      refreshToken: MOCK_AUTH_DATA.refreshToken,
    },
  };
};

// Utility function to simulate logout
export const mockLogout = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));

  return {
    success: true,
    message: 'Logged out successfully',
  };
};

// Mock user profile update
export const mockUpdateProfile = async (updates: Partial<User>) => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const updatedUser = { ...MOCK_ADMIN, ...updates };

  return {
    success: true,
    data: updatedUser,
  };
};

// Export all mock auth data
export { MOCK_LOGIN_RESPONSE, MOCK_AUTH_STORE_STATE };
