'use client';

import React from 'react';
import { useOffline } from '@/hooks/utils/use-offline';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
  showReconnectButton?: boolean;
  position?: 'top' | 'bottom' | 'fixed';
}

export function OfflineIndicator({
  className,
  showReconnectButton = true,
  position = 'fixed',
}: OfflineIndicatorProps) {
  const { isOnline, isOffline, lastOffline, reconnect } = useOffline({
    onOffline: () => {
      // Show notification when going offline
      console.log('Connection lost');
    },
    onOnline: () => {
      // Show notification when coming back online
      console.log('Connection restored');
    },
  });

  if (isOnline) return null;

  const positionClasses = {
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
    fixed: 'fixed top-0 left-0 right-0 z-50',
  };

  return (
    <div
      className={cn(
        'bg-red-600 text-white px-4 py-2 flex items-center justify-between',
        'shadow-lg',
        positionClasses[position],
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm font-medium">You're offline</span>
        {lastOffline && (
          <span className="text-xs opacity-75">
            Since {lastOffline.toLocaleTimeString()}
          </span>
        )}
      </div>

      {showReconnectButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={reconnect}
          className="text-white hover:bg-red-700"
          aria-label="Try to reconnect"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Online indicator (shows when connection is restored)
export function OnlineIndicator({ className }: { className?: string }) {
  const { isOnline, lastOnline } = useOffline();
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (isOnline && lastOnline) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, lastOnline]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-green-600 text-white px-4 py-2',
        'flex items-center justify-center gap-2',
        'shadow-lg animate-in slide-in-from-top-2',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Wifi className="h-4 w-4" />
      <span className="text-sm font-medium">Connection restored</span>
    </div>
  );
}

// Connection status component
export function ConnectionStatus({ className }: { className?: string }) {
  const { isOnline, isOffline, lastOnline, lastOffline } = useOffline();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          isOnline ? 'bg-green-500' : 'bg-red-500'
        )}
        aria-label={isOnline ? 'Online' : 'Offline'}
      />

      <span className="text-xs text-gray-600">
        {isOnline ? 'Online' : 'Offline'}
      </span>

      {(lastOnline || lastOffline) && (
        <span className="text-xs text-gray-500">
          {isOnline
            ? `Since ${lastOnline?.toLocaleTimeString()}`
            : `Since ${lastOffline?.toLocaleTimeString()}`}
        </span>
      )}
    </div>
  );
}
