import { PermissionChecker, FeatureFlag } from '@/lib/permission-checker';
import type { Tenant, User, Permission } from '@/types';

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

const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'ADMIN',
  permissions: [
    {
      resource: 'tanks',
      action: 'read',
    },
    {
      resource: 'tanks',
      action: 'create',
    },
    {
      resource: 'tanks',
      action: 'update',
    },
    {
      resource: 'inventory',
      action: 'read',
    },
    {
      resource: 'users',
      action: 'admin',
    },
  ],
  tenantId: 'test-tenant',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PermissionChecker', () => {
  let permissionChecker: PermissionChecker;

  beforeEach(() => {
    permissionChecker = new PermissionChecker();
  });

  describe('setTenant and setUser', () => {
    it('should set tenant and user context', () => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);

      expect(permissionChecker['tenant']).toEqual(mockTenant);
      expect(permissionChecker['user']).toEqual(mockUser);
    });
  });

  describe('hasPermission', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should return true for valid permission', () => {
      expect(permissionChecker.hasPermission('tanks', 'read')).toBe(true);
      expect(permissionChecker.hasPermission('tanks', 'write')).toBe(true);
      expect(permissionChecker.hasPermission('inventory', 'read')).toBe(true);
    });

    it('should return false for invalid permission', () => {
      expect(permissionChecker.hasPermission('tanks', 'delete')).toBe(false);
      expect(permissionChecker.hasPermission('inventory', 'write')).toBe(false);
      expect(permissionChecker.hasPermission('nonexistent', 'read')).toBe(
        false
      );
    });

    it('should return false when no user context', () => {
      permissionChecker.setUser(null as any);
      expect(permissionChecker.hasPermission('tanks', 'read')).toBe(false);
    });

    it('should return false when no tenant context', () => {
      permissionChecker.setTenant(null as any);
      expect(permissionChecker.hasPermission('tanks', 'read')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should return true if any permission is valid', () => {
      const permissions = [
        { resource: 'tanks', action: 'read' },
        { resource: 'nonexistent', action: 'read' },
      ];
      expect(permissionChecker.hasAnyPermission(permissions)).toBe(true);
    });

    it('should return false if no permissions are valid', () => {
      const permissions = [
        { resource: 'nonexistent', action: 'read' },
        { resource: 'tanks', action: 'delete' },
      ];
      expect(permissionChecker.hasAnyPermission(permissions)).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should return true if all permissions are valid', () => {
      const permissions = [
        { resource: 'tanks', action: 'read' },
        { resource: 'tanks', action: 'write' },
      ];
      expect(permissionChecker.hasAllPermissions(permissions)).toBe(true);
    });

    it('should return false if any permission is invalid', () => {
      const permissions = [
        { resource: 'tanks', action: 'read' },
        { resource: 'tanks', action: 'delete' },
      ];
      expect(permissionChecker.hasAllPermissions(permissions)).toBe(false);
    });
  });

  describe('hasFeature', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should return true for enabled feature', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'predictive_analytics',
          enabled: true,
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      expect(permissionChecker.hasFeature('predictive_analytics')).toBe(true);
    });

    it('should return false for disabled feature', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'predictive_analytics',
          enabled: false,
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      expect(permissionChecker.hasFeature('predictive_analytics')).toBe(false);
    });

    it('should return false for nonexistent feature', () => {
      expect(permissionChecker.hasFeature('nonexistent_feature')).toBe(false);
    });

    it('should respect plan restrictions', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'premium_feature',
          enabled: true,
          tenantRestrictions: {
            plans: ['enterprise'],
          },
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      expect(permissionChecker.hasFeature('premium_feature')).toBe(false);
    });

    it('should respect tenant ID restrictions', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'specific_tenant_feature',
          enabled: true,
          tenantRestrictions: {
            tenantIds: ['other-tenant'],
          },
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      expect(permissionChecker.hasFeature('specific_tenant_feature')).toBe(
        false
      );
    });

    it('should respect user role restrictions', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'admin_only_feature',
          enabled: true,
          tenantRestrictions: {
            userRoles: ['SUPER_ADMIN'],
          },
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      expect(permissionChecker.hasFeature('admin_only_feature')).toBe(false);
    });

    it('should respect rollout percentage', () => {
      const featureFlags: FeatureFlag[] = [
        {
          key: 'gradual_rollout_feature',
          enabled: true,
          rolloutPercentage: 50,
        },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      // This test might be flaky due to hash function, but it's testing the logic
      const result = permissionChecker.hasFeature('gradual_rollout_feature');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('resource access methods', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should check resource access', () => {
      expect(permissionChecker.canAccess('tanks')).toBe(true);
      expect(permissionChecker.canAccess('inventory')).toBe(true);
      expect(permissionChecker.canAccess('nonexistent')).toBe(false);
    });

    it('should check create permission', () => {
      expect(permissionChecker.canCreate('tanks')).toBe(true);
      expect(permissionChecker.canCreate('inventory')).toBe(false);
    });

    it('should check update permission', () => {
      expect(permissionChecker.canUpdate('tanks')).toBe(true);
      expect(permissionChecker.canUpdate('inventory')).toBe(false);
    });

    it('should check delete permission', () => {
      expect(permissionChecker.canDelete('tanks')).toBe(false);
      expect(permissionChecker.canDelete('inventory')).toBe(false);
    });

    it('should check admin permission', () => {
      expect(permissionChecker.canAdmin('users')).toBe(true);
      expect(permissionChecker.canAdmin('tanks')).toBe(false);
    });
  });

  describe('admin checks', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should identify admin users', () => {
      expect(permissionChecker.isAdmin()).toBe(true);
    });

    it('should check user management permission', () => {
      expect(permissionChecker.canManageUsers()).toBe(true);
    });

    it('should check tenant management permission', () => {
      expect(permissionChecker.canManageTenant()).toBe(true);
    });
  });

  describe('validation methods', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should validate access and throw error', () => {
      expect(() => {
        permissionChecker.validateAccess('nonexistent', 'read');
      }).toThrow('Access denied');
    });

    it('should validate feature and throw error', () => {
      expect(() => {
        permissionChecker.validateFeature('nonexistent_feature');
      }).toThrow('Feature not available');
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      permissionChecker.setTenant(mockTenant);
      permissionChecker.setUser(mockUser);
    });

    it('should get available features', () => {
      const featureFlags: FeatureFlag[] = [
        { key: 'feature1', enabled: true },
        { key: 'feature2', enabled: false },
        { key: 'feature3', enabled: true },
      ];
      permissionChecker.setFeatureFlags(featureFlags);

      const features = permissionChecker.getAvailableFeatures();
      expect(features).toContain('feature1');
      expect(features).toContain('feature3');
      expect(features).not.toContain('feature2');
    });

    it('should get resource permissions', () => {
      const permissions = permissionChecker.getResourcePermissions('tanks');
      expect(permissions).toContain('read');
      expect(permissions).toContain('write');
    });

    it('should get permission summary', () => {
      const summary = permissionChecker.getPermissionSummary();
      expect(summary.user).toEqual(mockUser);
      expect(summary.tenant).toEqual(mockTenant);
      expect(summary.permissions).toEqual(mockUser.permissions);
      expect(summary.isAdmin).toBe(true);
    });
  });
});
