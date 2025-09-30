import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    url = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socket?.connected) return;

    setIsConnecting(true);
    setError(null);

    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setIsConnecting(false);
      setError(null);
      reconnectCount.current = 0;
      onConnect?.();
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      setIsConnecting(false);
      onDisconnect?.();
      
      // Attempt to reconnect if not manually disconnected
      if (reason !== 'io client disconnect' && reconnectCount.current < reconnectAttempts) {
        reconnectCount.current++;
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, reconnectInterval);
      }
    });

    newSocket.on('connect_error', (err) => {
      setIsConnecting(false);
      setError(err);
      onError?.(err);
    });

    setSocket(newSocket);
  }, [url, reconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError, socket]);

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, [socket]);

  const emit = useCallback((event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('WebSocket not connected. Cannot emit event:', event);
    }
  }, [socket]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
}

// Hook for real-time data updates
export function useRealtimeData<T>(
  event: string,
  initialData: T,
  options: UseWebSocketOptions = {}
): {
  data: T;
  isConnected: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T>(initialData);
  const { socket, isConnected, error, on, off } = useWebSocket(options);

  useEffect(() => {
    if (!socket) return;

    const handleData = (newData: T) => {
      setData(newData);
    };

    on(event, handleData);

    return () => {
      off(event, handleData);
    };
  }, [socket, event, on, off]);

  return {
    data,
    isConnected,
    error,
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications(options: UseWebSocketOptions = {}) {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
  }>>([]);

  const { socket, on, off } = useWebSocket(options);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification: {
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
    }) => {
      const newNotification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    };

    on('notification', handleNotification);

    return () => {
      off('notification', handleNotification);
    };
  }, [socket, on, off]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    removeNotification,
  };
}
