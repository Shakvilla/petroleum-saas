'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { updateUserSchema } from '@/lib/validation-schemas';
import type { z } from 'zod';

type UpdateUserForm = z.infer<typeof updateUserSchema>;

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

interface UserEditDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function UserEditDialog({
  user,
  isOpen,
  onClose,
  onSave,
}: UserEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'VIEWER',
      status: user?.status || 'ACTIVE',
    },
  });

  const watchedRole = watch('role');

  // Reset form when user changes
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserForm) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Issue: #USER-EDIT-001
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser: User = {
        ...user,
        ...data,
      };

      onSave(updatedUser);
      toast({
        title: 'User updated successfully',
        description: `${data.name || user.name} has been updated.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isDirty) {
      // TODO: Add confirmation dialog for unsaved changes
      if (
        confirm('You have unsaved changes. Are you sure you want to close?')
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions for {user.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={watchedRole}
              onValueChange={value => setValue('role', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">Admin</Badge>
                    <span>Full system access</span>
                  </div>
                </SelectItem>
                <SelectItem value="MANAGER">
                  <div className="flex items-center space-x-2">
                    <Badge variant="default">Manager</Badge>
                    <span>Management access</span>
                  </div>
                </SelectItem>
                <SelectItem value="OPERATOR">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Operator</Badge>
                    <span>Operational access</span>
                  </div>
                </SelectItem>
                <SelectItem value="VIEWER">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Viewer</Badge>
                    <span>Read-only access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={watch('status')}
              onValueChange={value => setValue('status', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                    <span>User can access the system</span>
                  </div>
                </SelectItem>
                <SelectItem value="INACTIVE">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Inactive</Badge>
                    <span>User cannot access the system</span>
                  </div>
                </SelectItem>
                <SelectItem value="PENDING">
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Pending
                    </Badge>
                    <span>Awaiting activation</span>
                  </div>
                </SelectItem>
                <SelectItem value="SUSPENDED">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">Suspended</Badge>
                    <span>Account suspended</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
