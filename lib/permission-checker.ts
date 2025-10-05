import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useAuthStore } from '@/stores/auth-store';
import type { Tenant, User, Permission } from '@/types';

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  tenantRestrictions?: {
    plans: string[];
    tenantIds?: string[];
    userRoles?: string[];
  };
  rolloutPercentage?: number;
  conditions?: Record<string, any>;
}

export interface ResourcePermission {
  resource: string;
  actions: string[];
  conditions?: Record<string, any>;
}

export class PermissionChecker {
  private tenant: Tenant | null = null;
  private user: User | null = null;
  private featureFlags: Map<string, FeatureFlag> = new Map();

  constructor(tenant?: Tenant, user?: User) {
    this.tenant = tenant || null;
    this.user = user || null;
  }

  // Update context
  setTenant(tenant: Tenant) {
    this.tenant = tenant;
  }

  setUser(user: User) {
    this.user = user;
  }

  setFeatureFlags(flags: FeatureFlag[]) {
    this.featureFlags.clear();
    flags.forEach(flag => {
      this.featureFlags.set(flag.key, flag);
    });
  }

  // Permission checking methods
  hasPermission(resource: string, action: string): boolean {
    if (!this.user || !this.tenant) {
      return false;
    }

    // Check direct permissions
    const hasDirectPermission = this.user.permissions.some(
      permission =>
        permission.resource === resource && permission.action === action
    );

    if (hasDirectPermission) {
      return true;
    }

    // Check role-based permissions (if user has roles)
    // This would typically involve checking the user's roles against a role-permission mapping
    // For now, we'll assume permissions are directly assigned to users

    return false;
  }

  hasAnyPermission(
    permissions: Array<{ resource: string; action: string }>
  ): boolean {
    return permissions.some(({ resource, action }) =>
      this.hasPermission(resource, action)
    );
  }

  hasAllPermissions(
    permissions: Array<{ resource: string; action: string }>
  ): boolean {
    return permissions.every(({ resource, action }) =>
      this.hasPermission(resource, action)
    );
  }

  // Feature flag checking
  hasFeature(featureKey: string): boolean {
    if (!this.tenant || !this.user) {
      return false;
    }

    const flag = this.featureFlags.get(featureKey);
    if (!flag || !flag.enabled) {
      return false;
    }

    // Check tenant plan restrictions
    if (
      flag.tenantRestrictions?.plans &&
      !flag.tenantRestrictions.plans.includes(this.tenant.plan)
    ) {
      return false;
    }

    // Check tenant ID restrictions
    if (
      flag.tenantRestrictions?.tenantIds &&
      !flag.tenantRestrictions.tenantIds.includes(this.tenant.id)
    ) {
      return false;
    }

    // Check user role restrictions
    if (
      flag.tenantRestrictions?.userRoles &&
      !flag.tenantRestrictions.userRoles.includes(this.user.role)
    ) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage && flag.rolloutPercentage < 100) {
      const userHash = this.hashUser(this.user.id + this.tenant.id);
      if (userHash % 100 >= flag.rolloutPercentage) {
        return false;
      }
    }

    // Check custom conditions
    if (flag.conditions && !this.checkConditions(flag.conditions)) {
      return false;
    }

    return true;
  }

  // Resource access checking
  canAccess(resource: string): boolean {
    return this.hasPermission(resource, 'read');
  }

  canCreate(resource: string): boolean {
    return this.hasPermission(resource, 'create');
  }

  canUpdate(resource: string): boolean {
    return this.hasPermission(resource, 'update');
  }

  canDelete(resource: string): boolean {
    return this.hasPermission(resource, 'delete');
  }

  canAdmin(resource: string): boolean {
    return this.hasPermission(resource, 'admin');
  }

  // Get available features for current context
  getAvailableFeatures(): string[] {
    if (!this.tenant || !this.user) {
      return [];
    }

    return Array.from(this.featureFlags.keys()).filter(featureKey =>
      this.hasFeature(featureKey)
    );
  }

  // Get permissions for a specific resource
  getResourcePermissions(resource: string): string[] {
    if (!this.user) {
      return [];
    }

    const permissions = this.user.permissions
      .filter(permission => permission.resource === resource)
      .map(permission => permission.action);

    return [...new Set(permissions)]; // Remove duplicates
  }

  // Check if user has admin access
  isAdmin(): boolean {
    if (!this.user) {
      return false;
    }

    return (
      this.user.role === 'ADMIN' ||
      this.hasPermission('*', 'admin') ||
      this.hasPermission('system', 'admin')
    );
  }

  // Check if user can manage other users
  canManageUsers(): boolean {
    return (
      this.hasPermission('users', 'admin') ||
      this.hasPermission('users', 'update') ||
      this.isAdmin()
    );
  }

  // Check if user can access tenant settings
  canManageTenant(): boolean {
    return (
      this.hasPermission('tenant', 'admin') ||
      this.hasPermission('tenant', 'update') ||
      this.isAdmin()
    );
  }

  // Utility methods
  private checkConditions(conditions?: Record<string, any>): boolean {
    if (!conditions || !this.tenant || !this.user) {
      return true;
    }

    // Check tenant-specific conditions
    if (conditions.tenantId && conditions.tenantId !== this.tenant.id) {
      return false;
    }

    // TODO: Add plan property to Tenant interface
    // if (conditions.tenantPlan && conditions.tenantPlan !== this.tenant.plan) {
    //   return false;
    // }

    // Check user-specific conditions
    if (conditions.userRole && conditions.userRole !== this.user.role) {
      return false;
    }

    if (conditions.userId && conditions.userId !== this.user.id) {
      return false;
    }

    // Check time-based conditions
    if (conditions.businessHours) {
      const now = new Date();
      const currentHour = now.getHours();
      const businessStart = parseInt(conditions.businessHours.start);
      const businessEnd = parseInt(conditions.businessHours.end);

      if (currentHour < businessStart || currentHour > businessEnd) {
        return false;
      }
    }

    // Add more condition checks as needed
    return true;
  }

  private hashUser(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Validation methods
  validateAccess(resource: string, action: string): void {
    if (!this.hasPermission(resource, action)) {
      throw new Error(
        `Access denied: User does not have '${action}' permission for '${resource}'`
      );
    }
  }

  validateFeature(featureKey: string): void {
    if (!this.hasFeature(featureKey)) {
      throw new Error(
        `Feature not available: '${featureKey}' is not enabled for current tenant/user`
      );
    }
  }

  // Get permission summary
  getPermissionSummary(): {
    user: User | null;
    tenant: Tenant | null;
    permissions: Permission[];
    features: string[];
    isAdmin: boolean;
  } {
    return {
      user: this.user,
      tenant: this.tenant,
      permissions: this.user?.permissions || [],
      features: this.getAvailableFeatures(),
      isAdmin: this.isAdmin(),
    };
  }
}

// Global permission checker instance
export const permissionChecker = new PermissionChecker();

// React hook for using the permission checker
export function usePermissions() {
  const { tenant } = useTenant();
  const { user } = useAuthStore();

  // Update permission checker context
  useEffect(() => {
    if (tenant) {
      permissionChecker.setTenant(tenant);
    }
  }, [tenant]);

  useEffect(() => {
    if (user) {
      permissionChecker.setUser(user);
    }
  }, [user]);

  return {
    hasPermission: (resource: string, action: string) =>
      permissionChecker.hasPermission(resource, action),
    hasAnyPermission: (
      permissions: Array<{ resource: string; action: string }>
    ) => permissionChecker.hasAnyPermission(permissions),
    hasAllPermissions: (
      permissions: Array<{ resource: string; action: string }>
    ) => permissionChecker.hasAllPermissions(permissions),
    hasFeature: (featureKey: string) =>
      permissionChecker.hasFeature(featureKey),
    canAccess: (resource: string) => permissionChecker.canAccess(resource),
    canCreate: (resource: string) => permissionChecker.canCreate(resource),
    canUpdate: (resource: string) => permissionChecker.canUpdate(resource),
    canDelete: (resource: string) => permissionChecker.canDelete(resource),
    canAdmin: (resource: string) => permissionChecker.canAdmin(resource),
    getAvailableFeatures: () => permissionChecker.getAvailableFeatures(),
    getResourcePermissions: (resource: string) =>
      permissionChecker.getResourcePermissions(resource),
    isAdmin: () => permissionChecker.isAdmin(),
    canManageUsers: () => permissionChecker.canManageUsers(),
    canManageTenant: () => permissionChecker.canManageTenant(),
    validateAccess: (resource: string, action: string) =>
      permissionChecker.validateAccess(resource, action),
    validateFeature: (featureKey: string) =>
      permissionChecker.validateFeature(featureKey),
    getPermissionSummary: () => permissionChecker.getPermissionSummary(),
  };
}
