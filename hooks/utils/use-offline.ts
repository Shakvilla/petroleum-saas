import { useEffect, useState, useCallback } from 'react';

interface UseOfflineOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  checkInterval?: number;
}

interface UseOfflineReturn {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline: Date | null;
  lastOffline: Date | null;
  reconnect: () => void;
}

export function useOffline(options: UseOfflineOptions = {}): UseOfflineReturn {
  const { onOnline, onOffline, checkInterval = 5000 } = options;

  const [isOnline, setIsOnline] = useState(true);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [lastOffline, setLastOffline] = useState<Date | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok && !isOnline) {
        setIsOnline(true);
        setLastOnline(new Date());
        onOnline?.();
      }
    } catch (error) {
      if (isOnline) {
        setIsOnline(false);
        setLastOffline(new Date());
        onOffline?.();
      }
    }
  }, [isOnline, onOnline, onOffline]);

  const reconnect = useCallback(() => {
    checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    // Initial connection check
    checkConnection();

    // Set up online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
      onOnline?.();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOffline(new Date());
      onOffline?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connection check
    const interval = setInterval(checkConnection, checkInterval);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection, checkInterval, onOnline, onOffline]);

  return {
    isOnline,
    isOffline: !isOnline,
    lastOnline,
    lastOffline,
    reconnect,
  };
}

// Hook for offline queue management
export function useOfflineQueue() {
  const [queue, setQueue] = useState<
    Array<{
      id: string;
      action: string;
      data: any;
      timestamp: Date;
      retries: number;
    }>
  >([]);

  const addToQueue = useCallback((action: string, data: any) => {
    const item = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      data,
      timestamp: new Date(),
      retries: 0,
    };

    setQueue(prev => [...prev, item]);
    return item.id;
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const processQueue = useCallback(async () => {
    const items = [...queue];

    for (const item of items) {
      try {
        // Simulate API call
        await fetch(`/api/${item.action}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });

        removeFromQueue(item.id);
      } catch (error) {
        // Increment retry count
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id ? { ...q, retries: q.retries + 1 } : q
          )
        );

        // Remove item if max retries reached
        if (item.retries >= 3) {
          removeFromQueue(item.id);
        }
      }
    }
  }, [queue, removeFromQueue]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue,
  };
}

// Hook for offline storage
export function useOfflineStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Hook for offline sync
export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<Error | null>(null);

  const sync = useCallback(async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Get all offline data
      const offlineData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('offline_')) {
          const data = localStorage.getItem(key);
          if (data) {
            offlineData.push({ key, data: JSON.parse(data) });
          }
        }
      }

      // Sync with server
      for (const item of offlineData) {
        try {
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });

          // Remove from offline storage after successful sync
          localStorage.removeItem(item.key);
        } catch (error) {
          console.error(`Failed to sync item ${item.key}:`, error);
        }
      }

      setLastSync(new Date());
    } catch (error) {
      setSyncError(error as Error);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  return {
    isSyncing,
    lastSync,
    syncError,
    sync,
  };
}
