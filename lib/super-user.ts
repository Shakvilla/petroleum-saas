import type { User, Permission } from '@/types';
import { UserRole } from '@/types';

// All available resources in the system
const RESOURCES = [
  'tanks',
  'inventory',
  'deliveries',
  'vehicles',
  'users',
  'reports',
  'analytics',
  'transactions',
  'alerts',
  'iot',
  'tenant',
  'system',
  'settings',
  'suppliers',
  'fleet',
  'sales',
  'distribution',
  'dashboard',
  'notifications',
  'audit',
  'backup',
  'api',
  'integrations',
  'billing',
  'support',
] as const;

// All available actions
const ACTIONS = [
  'read',
  'create',
  'update',
  'delete',
  'admin',
  'export',
  'import',
  'approve',
  'reject',
  'manage',
  'configure',
  'monitor',
  'debug',
  'backup',
  'restore',
] as const;

// Generate all possible permissions
function generateAllPermissions(): Permission[] {
  const permissions: Permission[] = [];
  let id = 1;

  RESOURCES.forEach(resource => {
    ACTIONS.forEach(action => {
      permissions.push({
        id: `perm_${id++}`,
        name: `${action}_${resource}`,
        resource,
        action,
      });
    });
  });

  // Add wildcard permissions for super admin
  permissions.push(
    {
      id: `perm_${id++}`,
      name: 'admin_all',
      resource: '*',
      action: 'admin',
    },
    {
      id: `perm_${id++}`,
      name: 'read_all',
      resource: '*',
      action: 'read',
    },
    {
      id: `perm_${id++}`,
      name: 'create_all',
      resource: '*',
      action: 'create',
    },
    {
      id: `perm_${id++}`,
      name: 'update_all',
      resource: '*',
      action: 'update',
    },
    {
      id: `perm_${id++}`,
      name: 'delete_all',
      resource: '*',
      action: 'delete',
    }
  );

  return permissions;
}

// Super user with all permissions
export const SUPER_USER: User = {
  id: 'super-admin-001',
  email: 'admin@petromanager.com',
  name: 'Super Administrator',
  role: UserRole.ADMIN,
  permissions: generateAllPermissions(),
  tenantId: 'system',
  lastLoginAt: new Date(),
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
  },
  isActive: true,
};

// Alternative: Create a function to generate super user for any tenant
export function createSuperUserForTenant(
  tenantId: string,
  email?: string,
  name?: string
): User {
  return {
    id: `super-admin-${tenantId}-${Date.now()}`,
    email: email || `admin@${tenantId}.com`,
    name: name || `Super Admin - ${tenantId}`,
    role: UserRole.ADMIN,
    permissions: generateAllPermissions(),
    tenantId,
    lastLoginAt: new Date(),
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        inApp: true,
      },
    },
    isActive: true,
  };
}

// Utility function to check if a user has all permissions
export function isSuperUser(user: User): boolean {
  return user.permissions.some(
    perm => perm.resource === '*' && perm.action === 'admin'
  );
}

// Get permission count for a user
export function getPermissionCount(user: User): number {
  return user.permissions.length;
}

// Check if user has permission for a specific resource and action
export function hasUserPermission(
  user: User,
  resource: string,
  action: string
): boolean {
  return user.permissions.some(
    perm =>
      (perm.resource === resource || perm.resource === '*') &&
      (perm.action === action || perm.action === 'admin')
  );
}

// Export the permission arrays for reference
export { RESOURCES, ACTIONS };
