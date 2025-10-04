'use client';

import React, { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { UsersTable } from './users-table';
import { UserEditDialog } from './user-edit-dialog';
import { UserDeleteDialog } from './user-delete-dialog';
import { UserViewDialog } from './user-view-dialog';
import { UserCreateDialog } from './user-create-dialog';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  lastLoginAt: string;
  createdAt: string;
  permissions: Array<{
    resource: string;
    action: string;
  }>;
  tenantId: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  roleDistribution: {
    ADMIN: number;
    MANAGER: number;
    OPERATOR: number;
    VIEWER: number;
  };
}

interface UsersData {
  users: User[];
  stats: UserStats;
}

export const UsersPageContent: React.FC = () => {
  const { tenant } = useTenant();
  const [usersData, setUsersData] = useState<UsersData | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users data from API
  const {
    data,
    isLoading,
    error: queryError,
  } = useTenantQuery(
    ['users', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${tenant?.id}/users`);
      if (!response.ok) throw new Error('Failed to load users data');
      return response.json();
    },
    {
      enabled: !!tenant?.id,
    }
  );

  useEffect(() => {
    if (data) {
      setUsersData(data.data);
      setLoading(false);
    }
    if (queryError) {
      setError(queryError.message);
      setLoading(false);
    }
  }, [data, queryError]);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSaveUser = (updatedUser: User) => {
    // TODO: Update user in the list
    // Issue: #USER-UPDATE-LIST-001
    console.log('User updated:', updatedUser);
  };

  const handleDeleteConfirm = (userId: string) => {
    // TODO: Remove user from the list
    // Issue: #USER-DELETE-LIST-001
    console.log('User deleted:', userId);
  };

  const handleCreateConfirm = (newUser: User) => {
    // TODO: Add user to the list
    // Issue: #USER-ADD-LIST-001
    console.log('User created:', newUser);
  };

  if (loading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading users: {error}</div>
        <div className="text-sm text-gray-600">Tenant ID: {tenant?.id}</div>
      </div>
    );
  }

  if (!usersData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">No users data available</div>
      </div>
    );
  }

  const { users, stats } = usersData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage team members and access permissions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TenantAwareCard>
          <TenantAwareCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TenantAwareCardTitle className="text-sm font-medium">
              Total Users
            </TenantAwareCardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </TenantAwareCardContent>
        </TenantAwareCard>

        <TenantAwareCard>
          <TenantAwareCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TenantAwareCardTitle className="text-sm font-medium">
              Active Users
            </TenantAwareCardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </TenantAwareCardContent>
        </TenantAwareCard>

        <TenantAwareCard>
          <TenantAwareCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TenantAwareCardTitle className="text-sm font-medium">
              Inactive Users
            </TenantAwareCardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
            <p className="text-xs text-muted-foreground">Disabled accounts</p>
          </TenantAwareCardContent>
        </TenantAwareCard>

        <TenantAwareCard>
          <TenantAwareCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <TenantAwareCardTitle className="text-sm font-medium">
              Administrators
            </TenantAwareCardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <div className="text-2xl font-bold">
              {stats.roleDistribution.ADMIN}
            </div>
            <p className="text-xs text-muted-foreground">Admin users</p>
          </TenantAwareCardContent>
        </TenantAwareCard>
      </div>

      {/* Role Distribution */}
      <TenantAwareCard>
        <TenantAwareCardHeader>
          <TenantAwareCardTitle>Role Distribution</TenantAwareCardTitle>
        </TenantAwareCardHeader>
        <TenantAwareCardContent>
          <div className="flex flex-wrap gap-2">
            <TenantAwareBadge variant="admin">
              Admin: {stats.roleDistribution.ADMIN}
            </TenantAwareBadge>
            <TenantAwareBadge variant="manager">
              Manager: {stats.roleDistribution.MANAGER}
            </TenantAwareBadge>
            <TenantAwareBadge variant="operator">
              Operator: {stats.roleDistribution.OPERATOR}
            </TenantAwareBadge>
            <TenantAwareBadge variant="viewer">
              Viewer: {stats.roleDistribution.VIEWER}
            </TenantAwareBadge>
          </div>
        </TenantAwareCardContent>
      </TenantAwareCard>

      {/* Users Table */}
      <TenantAwareCard>
        <TenantAwareCardHeader>
          <TenantAwareCardTitle>Users</TenantAwareCardTitle>
        </TenantAwareCardHeader>
        <TenantAwareCardContent>
          <UsersTable
            data={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            onCreate={handleCreateUser}
          />
        </TenantAwareCardContent>
      </TenantAwareCard>

      {/* User Dialogs */}
      <UserEditDialog
        user={selectedUser}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveUser}
      />

      <UserDeleteDialog
        user={selectedUser}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDeleteConfirm}
      />

      <UserViewDialog
        user={selectedUser}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
      />

      <UserCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleCreateConfirm}
        tenantId={tenant?.id || ''}
      />
    </div>
  );
};
