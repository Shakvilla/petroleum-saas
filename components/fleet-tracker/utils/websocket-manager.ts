// Documentation: /docs/fleet-tracker/websocket-manager.md

/**
 * WebSocket Manager for Fleet Tracker
 * 
 * Handles real-time WebSocket connections for fleet tracking data.
 * Provides connection management, reconnection logic, and message handling.
 */

import { WebSocketMessage, Vehicle, Alert, GeofenceViolation } from '../types';
import { transformWebSocketMessage, transformVehicleUpdateMessage, transformAlertMessage, transformGeofenceViolationMessage } from './transformers';

export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';

export interface WebSocketManagerConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  messageTimeout: number;
}

export interface WebSocketEventHandlers {
  onConnectionChange?: (state: WebSocketConnectionState) => void;
  onVehicleUpdate?: (vehicle: Vehicle) => void;
  onAlert?: (alert: Alert) => void;
  onGeofenceViolation?: (violation: GeofenceViolation) => void;
  onError?: (error: Error) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private config: WebSocketManagerConfig;
  private handlers: WebSocketEventHandlers;
  private connectionState: WebSocketConnectionState = 'disconnected';
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageQueue: any[] = [];
  private isManualDisconnect = false;

  constructor(config: WebSocketManagerConfig, handlers: WebSocketEventHandlers = {}) {
    this.config = config;
    this.handlers = handlers;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connectionState === 'connected' || this.connectionState === 'connecting') {
        resolve();
        return;
      }

      this.setConnectionState('connecting');
      this.isManualDisconnect = false;

      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.setConnectionState('connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.processMessageQueue();
          this.handlers.onConnectionChange?.(this.connectionState);
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          this.setConnectionState('disconnected');
          this.stopHeartbeat();
          this.handlers.onConnectionChange?.(this.connectionState);

          if (!this.isManualDisconnect && !event.wasClean) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          this.setConnectionState('error');
          this.handlers.onError?.(new Error(`WebSocket error: ${error}`));
          this.handlers.onConnectionChange?.(this.connectionState);
          reject(new Error(`WebSocket connection failed: ${error}`));
        };

      } catch (error) {
        this.setConnectionState('error');
        this.handlers.onError?.(error as Error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.isManualDisconnect = true;
    this.stopHeartbeat();
    this.clearReconnectTimer();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.setConnectionState('disconnected');
    this.handlers.onConnectionChange?.(this.connectionState);
  }

  /**
   * Send message to WebSocket server
   */
  public send(message: any): void {
    if (this.connectionState === 'connected' && this.ws) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        this.handlers.onError?.(error as Error);
        // Queue message for later if connection is lost
        this.messageQueue.push(message);
      }
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  /**
   * Get current connection state
   */
  public getConnectionState(): WebSocketConnectionState {
    return this.connectionState;
  }

  /**
   * Check if connected
   */
  public isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  /**
   * Get connection statistics
   */
  public getStats(): {
    connectionState: WebSocketConnectionState;
    reconnectAttempts: number;
    queuedMessages: number;
    isConnected: boolean;
  } {
    return {
      connectionState: this.connectionState,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length,
      isConnected: this.isConnected(),
    };
  }

  /**
   * Update event handlers
   */
  public updateHandlers(handlers: Partial<WebSocketEventHandlers>): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  private setConnectionState(state: WebSocketConnectionState): void {
    this.connectionState = state;
  }

  private handleMessage(data: string): void {
    try {
      const rawMessage = JSON.parse(data);
      const message = transformWebSocketMessage(rawMessage);

      // Handle different message types
      switch (message.type) {
        case 'vehicle_update':
          const vehicle = transformVehicleUpdateMessage(message);
          this.handlers.onVehicleUpdate?.(vehicle);
          break;

        case 'alert':
          const alert = transformAlertMessage(message);
          this.handlers.onAlert?.(alert);
          break;

        case 'geofence_violation':
          const violation = transformGeofenceViolationMessage(message);
          this.handlers.onGeofenceViolation?.(violation);
          break;

        case 'route_update':
          // Handle route updates
          this.handlers.onMessage?.(message);
          break;

        default:
          this.handlers.onMessage?.(message);
      }
    } catch (error) {
      this.handlers.onError?.(new Error(`Failed to parse WebSocket message: ${error}`));
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.handlers.onError?.(new Error('Max reconnection attempts reached'));
      return;
    }

    this.setConnectionState('reconnecting');
    this.handlers.onConnectionChange?.(this.connectionState);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect().catch((error) => {
        this.handlers.onError?.(error);
      });
    }, this.config.reconnectInterval);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping', timestamp: Date.now() });
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.disconnect();
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.messageQueue = [];
    this.handlers = {};
  }
}

// Default configuration
export const defaultWebSocketConfig: WebSocketManagerConfig = {
  url: 'ws://localhost:3001',
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
  heartbeatInterval: 30000,
  messageTimeout: 10000,
};

// Factory function to create WebSocket manager
export function createWebSocketManager(
  config: Partial<WebSocketManagerConfig> = {},
  handlers: WebSocketEventHandlers = {}
): WebSocketManager {
  const mergedConfig = { ...defaultWebSocketConfig, ...config };
  return new WebSocketManager(mergedConfig, handlers);
}
