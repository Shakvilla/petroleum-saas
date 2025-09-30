'use client';

import React, { useEffect, useState } from 'react';
import { useRealtimeNotifications } from '@/hooks/utils/use-websocket';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RealtimeNotificationsProps {
  className?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function RealtimeNotifications({
  className,
  position = 'top-right',
  maxNotifications = 5,
  autoClose = true,
  autoCloseDelay = 5000,
}: RealtimeNotificationsProps) {
  const { notifications, removeNotification } = useRealtimeNotifications();

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  // Auto-close notifications
  useEffect(() => {
    if (!autoClose) return;

    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    });
  }, [notifications, autoClose, autoCloseDelay, removeNotification]);

  // Limit number of notifications
  const displayNotifications = notifications.slice(0, maxNotifications);

  if (displayNotifications.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed z-50 space-y-2',
        positionClasses[position],
        className
      )}
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {displayNotifications.map(notification => (
        <div
          key={notification.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
            'animate-in slide-in-from-right-2',
            getBgColor(notification.type)
          )}
          role="alert"
        >
          {getIcon(notification.type)}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-2">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// Notification toast variant
export function NotificationToast({
  notification,
  onClose,
}: {
  notification: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
  };
  onClose: (id: string) => void;
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
        'animate-in slide-in-from-right-2',
        getBgColor(notification.type)
      )}
      role="alert"
    >
      {getIcon(notification.type)}

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">
          {notification.title}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-2">
          {notification.timestamp.toLocaleTimeString()}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onClose(notification.id)}
        className="text-gray-400 hover:text-gray-600"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
