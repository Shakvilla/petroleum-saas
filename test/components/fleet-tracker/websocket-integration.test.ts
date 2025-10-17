// Documentation: /docs/fleet-tracker/tests/websocket-integration.test.md

/**
 * WebSocket Integration Tests
 * 
 * Tests for WebSocket functionality including connection, reconnection,
 * message handling, and error scenarios.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { WebSocketManager, createWebSocketManager } from '../../../components/fleet-tracker/utils/websocket-manager';
import { DataProcessor, createDataProcessor } from '../../../components/fleet-tracker/utils/data-processor';
import { OfflineManager, createOfflineManager } from '../../../components/fleet-tracker/utils/offline-manager';
import { generateMockVehicle, generateMockAlert } from '../../../components/fleet-tracker/utils/mock-data';

// Mock WebSocket
class MockWebSocket {
  public onopen: ((event: Event) => void) | null = null;
  public onclose: ((event: CloseEvent) => void) | null = null;
  public onmessage: ((event: MessageEvent) => void) | null = null;
  public onerror: ((event: Event) => void) | null = null;
  public readyState = WebSocket.CONNECTING;
  public url: string;

  constructor(url: string) {
    this.url = url;
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.(new Event('open'));
    }, 10);
  }

  send(data: string): void {
    // Mock send implementation
  }

  close(code?: number, reason?: string): void {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close', { code, reason }));
  }
}

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

describe('WebSocket Integration Tests', () => {
  let websocketManager: WebSocketManager;
  let dataProcessor: DataProcessor;
  let offlineManager: OfflineManager;
  let mockHandlers: any;

  beforeEach(() => {
    mockHandlers = {
      onConnectionChange: jest.fn(),
      onVehicleUpdate: jest.fn(),
      onAlert: jest.fn(),
      onGeofenceViolation: jest.fn(),
      onError: jest.fn(),
      onMessage: jest.fn(),
    };

    websocketManager = createWebSocketManager({
      url: 'ws://localhost:3001',
      reconnectInterval: 100,
      maxReconnectAttempts: 3,
    }, mockHandlers);

    dataProcessor = createDataProcessor({
      updateInterval: 100,
      maxVehicles: 100,
      enableThrottling: false,
    });

    offlineManager = createOfflineManager({
      enableOfflineMode: true,
      storageKey: 'test-offline-data',
    });
  });

  afterEach(() => {
    websocketManager.destroy();
    dataProcessor.destroy();
    offlineManager.destroy();
  });

  describe('WebSocket Manager', () => {
    it('should connect successfully', async () => {
      await websocketManager.connect();
      
      expect(websocketManager.isConnected()).toBe(true);
      expect(mockHandlers.onConnectionChange).toHaveBeenCalledWith('connected');
    });

    it('should handle connection errors', async () => {
      // Mock connection failure
      const originalWebSocket = global.WebSocket;
      global.WebSocket = jest.fn().mockImplementation(() => {
        throw new Error('Connection failed');
      });

      await expect(websocketManager.connect()).rejects.toThrow();
      
      expect(mockHandlers.onError).toHaveBeenCalled();
      
      // Restore original WebSocket
      global.WebSocket = originalWebSocket;
    });

    it('should send messages when connected', async () => {
      await websocketManager.connect();
      
      const testMessage = { type: 'test', data: 'test data' };
      websocketManager.send(testMessage);
      
      // Message should be sent without error
      expect(websocketManager.isConnected()).toBe(true);
    });

    it('should queue messages when disconnected', () => {
      const testMessage = { type: 'test', data: 'test data' };
      websocketManager.send(testMessage);
      
      const stats = websocketManager.getStats();
      expect(stats.queuedMessages).toBe(1);
    });

    it('should handle reconnection', async () => {
      await websocketManager.connect();
      
      // Simulate connection loss
      websocketManager.disconnect();
      expect(websocketManager.isConnected()).toBe(false);
      
      // Reconnect
      await websocketManager.connect();
      expect(websocketManager.isConnected()).toBe(true);
    });

    it('should process different message types', async () => {
      await websocketManager.connect();
      
      const mockWs = websocketManager as any;
      
      // Test vehicle update message
      const vehicleMessage = {
        type: 'vehicle_update',
        data: generateMockVehicle(),
        timestamp: new Date().toISOString(),
      };
      
      mockWs.handleMessage(JSON.stringify(vehicleMessage));
      expect(mockHandlers.onVehicleUpdate).toHaveBeenCalled();
      
      // Test alert message
      const alertMessage = {
        type: 'alert',
        data: generateMockAlert('test-vehicle'),
        timestamp: new Date().toISOString(),
      };
      
      mockWs.handleMessage(JSON.stringify(alertMessage));
      expect(mockHandlers.onAlert).toHaveBeenCalled();
    });
  });

  describe('Data Processor', () => {
    it('should process vehicle updates', () => {
      const vehicle = generateMockVehicle();
      dataProcessor.processVehicleUpdate(vehicle);
      
      const processedData = dataProcessor.getProcessedData();
      expect(processedData.vehicles.has(vehicle.id)).toBe(true);
    });

    it('should validate vehicle data', () => {
      const invalidVehicle = { id: 'test' }; // Missing required fields
      dataProcessor.processVehicleUpdate(invalidVehicle as any);
      
      const processedData = dataProcessor.getProcessedData();
      expect(processedData.vehicles.size).toBe(0);
    });

    it('should process alerts', () => {
      const alert = generateMockAlert('test-vehicle');
      dataProcessor.processAlert(alert);
      
      const alerts = dataProcessor.getAlerts();
      expect(alerts).toContain(alert);
    });

    it('should handle batch processing', async () => {
      const messages = [
        { type: 'vehicle_update', data: generateMockVehicle() },
        { type: 'alert', data: generateMockAlert('test-vehicle') },
      ];
      
      messages.forEach(message => {
        dataProcessor.processWebSocketMessage(message as any);
      });
      
      // Wait for batch processing timer (updateInterval * 2 = 200ms)
      await new Promise(resolve => setTimeout(resolve, 250));
      
      const stats = dataProcessor.getStats();
      // Batch processing should have occurred
      expect(stats.batchedUpdates).toBeGreaterThan(0);
    });

    it('should calculate priority correctly', () => {
      const slowVehicle = generateMockVehicle();
      slowVehicle.position.speed = 5;
      
      const fastVehicle = generateMockVehicle();
      fastVehicle.position.speed = 100;
      
      dataProcessor.processVehicleUpdate(slowVehicle);
      dataProcessor.processVehicleUpdate(fastVehicle);
      
      const processedData = dataProcessor.getProcessedData();
      expect(processedData.vehicles.size).toBe(2);
    });

    it('should cleanup cache when size limit reached', () => {
      const config = { cacheSize: 2 };
      dataProcessor.updateConfig(config);
      
      // Add more vehicles than cache size
      for (let i = 0; i < 5; i++) {
        const vehicle = generateMockVehicle();
        dataProcessor.processVehicleUpdate(vehicle);
      }
      
      const processedData = dataProcessor.getProcessedData();
      expect(processedData.vehicles.size).toBeLessThanOrEqual(2);
    });
  });

  describe('Offline Manager', () => {
    it('should store data offline', () => {
      const vehicle = generateMockVehicle();
      offlineManager.storeVehicle(vehicle);
      
      const storedVehicle = offlineManager.getVehicle(vehicle.id);
      expect(storedVehicle).toEqual(vehicle);
    });

    it('should handle offline/online transitions', () => {
      const vehicle = generateMockVehicle();
      
      // Store while offline
      offlineManager.setOnlineStatus(false);
      offlineManager.storeVehicle(vehicle);
      
      // Go online
      offlineManager.setOnlineStatus(true);
      
      const offlineData = offlineManager.getOfflineData();
      expect(offlineData.vehicles.has(vehicle.id)).toBe(true);
    });

    it('should validate stored data', () => {
      const invalidVehicle = { id: 'test' }; // Missing required fields
      offlineManager.storeVehicle(invalidVehicle as any);
      
      const storedVehicle = offlineManager.getVehicle('test');
      expect(storedVehicle).toBeUndefined();
    });

    it('should handle storage limits', () => {
      const config = { maxStorageSize: 1000 }; // Very small limit
      const smallOfflineManager = createOfflineManager(config);
      
      // Try to store data that exceeds limit
      for (let i = 0; i < 10; i++) {
        const vehicle = generateMockVehicle();
        smallOfflineManager.storeVehicle(vehicle);
      }
      
      const usage = smallOfflineManager.getStorageUsage();
      expect(usage.percentage).toBeLessThanOrEqual(100);
      
      smallOfflineManager.destroy();
    });

    it('should clear offline data', () => {
      const vehicle = generateMockVehicle();
      offlineManager.storeVehicle(vehicle);
      
      expect(offlineManager.getVehicle(vehicle.id)).toBeDefined();
      
      offlineManager.clearOfflineData();
      expect(offlineManager.getVehicle(vehicle.id)).toBeUndefined();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complete data flow', async () => {
      // Connect WebSocket
      await websocketManager.connect();
      
      // Process vehicle update
      const vehicle = generateMockVehicle();
      dataProcessor.processVehicleUpdate(vehicle);
      
      // Store offline
      offlineManager.storeVehicle(vehicle);
      
      // Verify data flow
      expect(dataProcessor.getVehicle(vehicle.id)).toEqual(vehicle);
      expect(offlineManager.getVehicle(vehicle.id)).toEqual(vehicle);
    });

    it('should handle connection loss gracefully', async () => {
      await websocketManager.connect();
      
      const vehicle = generateMockVehicle();
      
      // Simulate connection loss
      offlineManager.setOnlineStatus(false);
      websocketManager.disconnect();
      
      // Data should still be processable
      dataProcessor.processVehicleUpdate(vehicle);
      offlineManager.storeVehicle(vehicle);
      
      expect(dataProcessor.getVehicle(vehicle.id)).toEqual(vehicle);
      expect(offlineManager.getVehicle(vehicle.id)).toEqual(vehicle);
    });

    it('should handle high-frequency updates', () => {
      const vehicle = generateMockVehicle();
      
      // Send many updates quickly
      for (let i = 0; i < 100; i++) {
        const updatedVehicle = { ...vehicle, lastUpdate: new Date() };
        dataProcessor.processVehicleUpdate(updatedVehicle);
      }
      
      const stats = dataProcessor.getStats();
      expect(stats.totalUpdates).toBe(100);
    });
  });
});
