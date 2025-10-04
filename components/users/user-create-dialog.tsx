'use client';

import { useState } from 'react';
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
import { createUserSchema } from '@/lib/validation-schemas';
import type { z } from 'zod';

type CreateUserForm = z.infer<typeof createUserSchema>;

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

interface UserCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: User) => void;
  tenantId: string;
}

export function UserCreateDialog({
  isOpen,
  onClose,
  onCreate,
  tenantId,
}: UserCreateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'VIEWER',
      password: '',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: CreateUserForm) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Issue: #USER-CREATE-001
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock user data
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'ACTIVE',
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        permissions: data.permissions || [],
        tenantId,
      };

      onCreate(newUser);
      toast({
        title: 'User created successfully',
        description: `${data.name} has been added to the system.`,
      });

      // Reset form and close dialog
      reset();
      onClose();
    } catch (error) {
      toast({
        title: 'Error creating user',
        description: 'Failed to create user. Please try again.',
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
        reset();
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription>
            Add a new user to your organization. They will receive an email
            invitation to set up their account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
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
            <Label htmlFor="email">Email Address *</Label>
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
            <Label htmlFor="role">Role *</Label>
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
            <Label htmlFor="password">Temporary Password *</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter temporary password"
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500">
              The user will be required to change this password on first login.
            </p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The new user will receive an email
              invitation with login instructions. They will need to use the
              temporary password provided above for their first login.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
