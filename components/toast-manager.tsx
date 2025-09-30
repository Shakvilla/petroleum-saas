'use client';

import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useUIStore } from '@/stores/ui-store';

export function ToastManager() {
  const { toast } = useToast();
  const { notifications, hideNotification } = useUIStore();

  // Handle notifications from UI store
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.type === 'success') {
        toast({
          title: notification.title,
          description: notification.description,
          variant: 'default',
        });
      } else if (notification.type === 'error') {
        toast({
          title: notification.title,
          description: notification.description,
          variant: 'destructive',
        });
      } else if (notification.type === 'warning') {
        toast({
          title: notification.title,
          description: notification.description,
          variant: 'destructive',
        });
      } else if (notification.type === 'info') {
        toast({
          title: notification.title,
          description: notification.description,
        });
      }

      // Hide notification after showing
      hideNotification(notification.id);
    });
  }, [notifications, toast, hideNotification]);

  return <Toaster />;
}

// Hook for showing notifications
export function useNotifications() {
  const { showNotification } = useUIStore();

  const showSuccess = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showNotification({
      type: 'success',
      title,
      description,
      duration,
    });
  };

  const showError = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showNotification({
      type: 'error',
      title,
      description,
      duration,
    });
  };

  const showWarning = (
    title: string,
    description?: string,
    duration?: number
  ) => {
    showNotification({
      type: 'warning',
      title,
      description,
      duration,
    });
  };

  const showInfo = (title: string, description?: string, duration?: number) => {
    showNotification({
      type: 'info',
      title,
      description,
      duration,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
