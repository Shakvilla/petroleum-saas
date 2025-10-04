'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, UserX } from 'lucide-react';

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

interface UserDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: string) => void;
}

export function UserDeleteDialog({
  user,
  isOpen,
  onClose,
  onDelete,
}: UserDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Issue: #USER-DELETE-001
      await new Promise(resolve => setTimeout(resolve, 1000));

      onDelete(user.id);
      toast({
        title: 'User deleted successfully',
        description: `${user.name} has been removed from the system.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: 'Failed to delete user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';
  const isActive = user.status === 'ACTIVE';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <UserX className="h-5 w-5 text-red-600" />
            <span>Delete User</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{user.name}</strong>?
            </p>

            {isAdmin && (
              <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Warning: Admin User</p>
                  <p>
                    This user has administrative privileges. Deleting this user
                    may affect system access for other users.
                  </p>
                </div>
              </div>
            )}

            {isActive && (
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Active User</p>
                  <p>
                    This user is currently active and may be using the system.
                  </p>
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-700">
                <strong>This action cannot be undone.</strong> The user will be
                permanently removed from the system and will lose access to all
                resources.
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                <strong>User Details:</strong>
              </p>
              <ul className="mt-1 space-y-1">
                <li>• Name: {user.name}</li>
                <li>• Email: {user.email}</li>
                <li>• Role: {user.role}</li>
                <li>• Status: {user.status}</li>
                <li>
                  • Last Login:{' '}
                  {new Date(user.lastLoginAt).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
