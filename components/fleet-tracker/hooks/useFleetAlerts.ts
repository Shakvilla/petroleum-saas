// Documentation: /docs/fleet-tracker/hooks/useFleetAlerts.md

/**
 * useFleetAlerts Hook
 * 
 * Custom hook for managing real-time alerts and notifications.
 * Handles alert processing, filtering, and user interactions.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, AlertType, AlertSeverity } from '../types';
import { validateAlert } from '../utils/validation';

export interface UseFleetAlertsOptions {
  enableNotifications?: boolean;
  enableSound?: boolean;
  maxAlerts?: number;
  autoMarkAsRead?: boolean;
  autoMarkAsReadDelay?: number;
}

export interface UseFleetAlertsReturn {
  // Alerts
  alerts: Alert[];
  unreadAlerts: Alert[];
  criticalAlerts: Alert[];
  
  // Filtering
  filteredAlerts: Alert[];
  activeFilters: AlertFilters;
  
  // Statistics
  stats: {
    total: number;
    unread: number;
    critical: number;
    byType: Record<AlertType, number>;
    bySeverity: Record<AlertSeverity, number>;
  };
  
  // Actions
  addAlert: (alert: Alert) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  deleteAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  
  // Filtering
  setFilters: (filters: Partial<AlertFilters>) => void;
  clearFilters: () => void;
  
  // Notifications
  showNotification: (alert: Alert) => void;
  enableNotifications: () => void;
  disableNotifications: () => void;
}

export interface AlertFilters {
  type?: AlertType[];
  severity?: AlertSeverity[];
  isRead?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
}

const defaultFilters: AlertFilters = {
  type: undefined,
  severity: undefined,
  isRead: undefined,
  dateRange: undefined,
  searchTerm: undefined,
};

export const useFleetAlerts = (options: UseFleetAlertsOptions = {}): UseFleetAlertsReturn => {
  const {
    enableNotifications = true,
    enableSound = true,
    maxAlerts = 1000,
    autoMarkAsRead = false,
    autoMarkAsReadDelay = 30000, // 30 seconds
  } = options;

  // State
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeFilters, setActiveFilters] = useState<AlertFilters>(defaultFilters);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Refs
  const autoMarkTimerRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Initialize notifications
  useEffect(() => {
    if (enableNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      } else {
        setNotificationPermission(Notification.permission);
      }
    }
  }, [enableNotifications]);

  // Filter alerts based on active filters
  const filteredAlerts = alerts.filter(alert => {
    // Type filter
    if (activeFilters.type && activeFilters.type.length > 0) {
      if (!activeFilters.type.includes(alert.type)) return false;
    }

    // Severity filter
    if (activeFilters.severity && activeFilters.severity.length > 0) {
      if (!activeFilters.severity.includes(alert.severity)) return false;
    }

    // Read status filter
    if (activeFilters.isRead !== undefined) {
      if (alert.isRead !== activeFilters.isRead) return false;
    }

    // Date range filter
    if (activeFilters.dateRange) {
      const alertDate = new Date(alert.timestamp);
      if (alertDate < activeFilters.dateRange.start || alertDate > activeFilters.dateRange.end) {
        return false;
      }
    }

    // Search term filter
    if (activeFilters.searchTerm) {
      const searchLower = activeFilters.searchTerm.toLowerCase();
      const matchesSearch = 
        alert.message.toLowerCase().includes(searchLower) ||
        alert.vehicleId?.toLowerCase().includes(searchLower) ||
        alert.geofenceId?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Computed values
  const unreadAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');

  // Statistics
  const stats = {
    total: alerts.length,
    unread: unreadAlerts.length,
    critical: criticalAlerts.length,
    byType: alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<AlertType, number>),
    bySeverity: alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>),
  };

  // Add alert
  const addAlert = useCallback((alert: Alert) => {
    if (!validateAlert(alert)) {
      console.warn('Invalid alert data:', alert);
      return;
    }

    setAlerts(prev => {
      // Check if alert already exists (prevent duplicates)
      const exists = prev.some(a => a.id === alert.id);
      if (exists) return prev;

      // Add new alert at the beginning
      const newAlerts = [alert, ...prev];
      
      // Limit total alerts
      if (newAlerts.length > maxAlerts) {
        return newAlerts.slice(0, maxAlerts);
      }
      
      return newAlerts;
    });

    // Show notification if enabled
    if (enableNotifications && !alert.isRead) {
      showNotification(alert);
    }

    // Auto-mark as read if enabled
    if (autoMarkAsRead && !alert.isRead) {
      const timer = setTimeout(() => {
        markAsRead(alert.id);
      }, autoMarkAsReadDelay);
      
      autoMarkTimerRef.current.set(alert.id, timer);
    }
  }, [enableNotifications, autoMarkAsRead, autoMarkAsReadDelay, maxAlerts]);

  // Mark alert as read
  const markAsRead = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );

    // Clear auto-mark timer if it exists
    const timer = autoMarkTimerRef.current.get(alertId);
    if (timer) {
      clearTimeout(timer);
      autoMarkTimerRef.current.delete(alertId);
    }
  }, []);

  // Mark all alerts as read
  const markAllAsRead = useCallback(() => {
    setAlerts(prev => 
      prev.map(alert => ({ ...alert, isRead: true }))
    );

    // Clear all auto-mark timers
    autoMarkTimerRef.current.forEach(timer => clearTimeout(timer));
    autoMarkTimerRef.current.clear();
  }, []);

  // Delete alert
  const deleteAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));

    // Clear auto-mark timer if it exists
    const timer = autoMarkTimerRef.current.get(alertId);
    if (timer) {
      clearTimeout(timer);
      autoMarkTimerRef.current.delete(alertId);
    }
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);

    // Clear all auto-mark timers
    autoMarkTimerRef.current.forEach(timer => clearTimeout(timer));
    autoMarkTimerRef.current.clear();
  }, []);

  // Set filters
  const setFilters = useCallback((filters: Partial<AlertFilters>) => {
    setActiveFilters(prev => ({ ...prev, ...filters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setActiveFilters(defaultFilters);
  }, []);

  // Show notification
  const showNotification = useCallback((alert: Alert) => {
    if (!enableNotifications || notificationPermission !== 'granted') return;

    const notification = new Notification(`Fleet Alert: ${alert.type}`, {
      body: alert.message,
      icon: '/favicon.ico',
      tag: alert.id,
      requireInteraction: alert.severity === 'critical',
    });

    // Play sound if enabled
    if (enableSound) {
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(() => {
          // Fallback to system beep
          console.log('\u0007'); // ASCII bell character
        });
      } catch (err) {
        console.log('\u0007'); // Fallback to system beep
      }
    }

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close notification after 5 seconds (except critical)
    if (alert.severity !== 'critical') {
      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }, [enableNotifications, enableSound, notificationPermission]);

  // Enable notifications
  const enableNotificationsCallback = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Disable notifications
  const disableNotificationsCallback = useCallback(() => {
    setNotificationPermission('denied');
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      autoMarkTimerRef.current.forEach(timer => clearTimeout(timer));
      autoMarkTimerRef.current.clear();
    };
  }, []);

  return {
    // Alerts
    alerts,
    unreadAlerts,
    criticalAlerts,
    
    // Filtering
    filteredAlerts,
    activeFilters,
    
    // Statistics
    stats,
    
    // Actions
    addAlert,
    markAsRead,
    markAllAsRead,
    deleteAlert,
    clearAllAlerts,
    
    // Filtering
    setFilters,
    clearFilters,
    
    // Notifications
    showNotification,
    enableNotifications: enableNotificationsCallback,
    disableNotifications: disableNotificationsCallback,
  };
};
