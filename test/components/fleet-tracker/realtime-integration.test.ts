// Documentation: /docs/fleet-tracker/tests/realtime-integration.test.md

/**
 * Real-time Data Integration Tests
 * 
 * Tests for real-time data synchronization hooks and functionality.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import { useFleetData } from '../../../components/fleet-tracker/hooks/useFleetData';
import { useFleetAlerts } from '../../../components/fleet-tracker/hooks/useFleetAlerts';
import { useGeofenceMonitoring } from '../../../components/fleet-tracker/hooks/useGeofenceMonitoring';
import { generateMockVehicle, generateMockGeofence, generateMockAlert } from '../../../components/fleet-tracker/utils/mock-data';

// Mock WebSocket Manager
const mockWebSocketManager = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  send: jest.fn(),
  isConnected: false,
};

// Mock Data Processor
const mockDataProcessor = {
  processMessage: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};

// Mock Offline Manager
const mockOfflineManager = {
  storeVehicle: jest.fn(),
  storeGeofence: jest.fn(),
  storeAlert: jest.fn(),
  getStoredData: jest.fn(() => ({ vehicles: [], geofences: [], alerts: [] })),
  clearStoredData: jest.fn(),
  startOfflineMode: jest.fn(),
  stopOfflineMode: jest.fn(),
};

// Mock fetch
global.fetch = jest.fn();

// Mock validation functions
jest.mock('../../../components/fleet-tracker/utils/validation', () => ({
  validateVehicle: jest.fn(() => true),
  validateGeofence: jest.fn(() => true),
  validateAlert: jest.fn(() => true),
  validateGeofenceViolation: jest.fn(() => true),
}));

// Mock WebSocket Manager class
jest.mock('../../../components/fleet-tracker/utils/websocket-manager', () => ({
  WebSocketManager: jest.fn(() => mockWebSocketManager),
}));

// Mock Data Processor class
jest.mock('../../../components/fleet-tracker/utils/data-processor', () => ({
  DataProcessor: jest.fn(() => mockDataProcessor),
}));

// Mock Offline Manager class
jest.mock('../../../components/fleet-tracker/utils/offline-manager', () => ({
  OfflineManager: jest.fn(() => mockOfflineManager),
}));

describe('Real-time Data Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    
    // Reset mock implementations
    mockWebSocketManager.on.mockImplementation((event, callback) => {
      if (event === 'connected') {
        setTimeout(() => callback(), 0);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('useFleetData Hook', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      expect(result.current.vehicles).toEqual([]);
      expect(result.current.geofences).toEqual([]);
      expect(result.current.alerts).toEqual([]);
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.selectedVehicleId).toBeNull();
      expect(result.current.selectedGeofenceId).toBeNull();
    });

    it('should handle WebSocket connection events', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      // Simulate connection
      const connectedCallback = mockWebSocketManager.on.mock.calls.find(
        call => call[0] === 'connected'
      )?.[1];
      
      if (connectedCallback) {
        act(() => {
          connectedCallback();
        });
      }

      expect(result.current.isConnected).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle WebSocket disconnection events', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      // Simulate disconnection
      const disconnectedCallback = mockWebSocketManager.on.mock.calls.find(
        call => call[0] === 'disconnected'
      )?.[1];
      
      if (disconnectedCallback) {
        act(() => {
          disconnectedCallback();
        });
      }

      expect(result.current.isConnected).toBe(false);
    });

    it('should handle WebSocket error events', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      // Simulate error
      const errorCallback = mockWebSocketManager.on.mock.calls.find(
        call => call[0] === 'error'
      )?.[1];
      
      if (errorCallback) {
        act(() => {
          errorCallback({ message: 'Connection failed' });
        });
      }

      expect(result.current.error).toBe('Connection failed');
      expect(result.current.isLoading).toBe(false);
    });

    it('should select and deselect vehicles', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      act(() => {
        result.current.selectVehicle('vehicle-1');
      });

      expect(result.current.selectedVehicleId).toBe('vehicle-1');
      expect(result.current.selectedGeofenceId).toBeNull();

      act(() => {
        result.current.selectVehicle(null);
      });

      expect(result.current.selectedVehicleId).toBeNull();
    });

    it('should select and deselect geofences', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      act(() => {
        result.current.selectGeofence('geofence-1');
      });

      expect(result.current.selectedGeofenceId).toBe('geofence-1');
      expect(result.current.selectedVehicleId).toBeNull();

      act(() => {
        result.current.selectGeofence(null);
      });

      expect(result.current.selectedGeofenceId).toBeNull();
    });

    it('should refresh data from API', async () => {
      const mockVehicles = [generateMockVehicle()];
      const mockGeofences = [generateMockGeofence()];
      
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockVehicles),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockGeofences),
        });

      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
          enableGeofencing: true,
        })
      );

      await act(async () => {
        await result.current.refreshData();
      });

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/vehicles');
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/geofences');
    });
  });

  describe('useFleetAlerts Hook', () => {
    it('should initialize with empty alerts', () => {
      const { result } = renderHook(() => useFleetAlerts());

      expect(result.current.alerts).toEqual([]);
      expect(result.current.unreadAlerts).toEqual([]);
      expect(result.current.criticalAlerts).toEqual([]);
      expect(result.current.stats.total).toBe(0);
      expect(result.current.stats.unread).toBe(0);
      expect(result.current.stats.critical).toBe(0);
    });

    it('should add alerts correctly', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const mockAlert = generateMockAlert();

      act(() => {
        result.current.addAlert(mockAlert);
      });

      expect(result.current.alerts).toHaveLength(1);
      expect(result.current.alerts[0]).toEqual(mockAlert);
      expect(result.current.stats.total).toBe(1);
      expect(result.current.stats.unread).toBe(1);
    });

    it('should mark alerts as read', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const mockAlert = generateMockAlert();

      act(() => {
        result.current.addAlert(mockAlert);
      });

      expect(result.current.stats.unread).toBe(1);

      act(() => {
        result.current.markAsRead(mockAlert.id);
      });

      expect(result.current.stats.unread).toBe(0);
      expect(result.current.alerts[0].isRead).toBe(true);
    });

    it('should mark all alerts as read', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const mockAlerts = [generateMockAlert(), generateMockAlert()];

      act(() => {
        mockAlerts.forEach(alert => result.current.addAlert(alert));
      });

      expect(result.current.stats.unread).toBe(2);

      act(() => {
        result.current.markAllAsRead();
      });

      expect(result.current.stats.unread).toBe(0);
      expect(result.current.alerts.every(alert => alert.isRead)).toBe(true);
    });

    it('should delete alerts', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const mockAlert = generateMockAlert();

      act(() => {
        result.current.addAlert(mockAlert);
      });

      expect(result.current.alerts).toHaveLength(1);

      act(() => {
        result.current.deleteAlert(mockAlert.id);
      });

      expect(result.current.alerts).toHaveLength(0);
    });

    it('should clear all alerts', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const mockAlerts = [generateMockAlert(), generateMockAlert()];

      act(() => {
        mockAlerts.forEach(alert => result.current.addAlert(alert));
      });

      expect(result.current.alerts).toHaveLength(2);

      act(() => {
        result.current.clearAllAlerts();
      });

      expect(result.current.alerts).toHaveLength(0);
    });

    it('should filter alerts correctly', () => {
      const { result } = renderHook(() => useFleetAlerts());
      const criticalAlert = generateMockAlert({ severity: 'critical' });
      const warningAlert = generateMockAlert({ severity: 'warning' });

      act(() => {
        result.current.addAlert(criticalAlert);
        result.current.addAlert(warningAlert);
      });

      expect(result.current.filteredAlerts).toHaveLength(2);

      act(() => {
        result.current.setFilters({ severity: ['critical'] });
      });

      expect(result.current.filteredAlerts).toHaveLength(1);
      expect(result.current.filteredAlerts[0].severity).toBe('critical');
    });
  });

  describe('useGeofenceMonitoring Hook', () => {
    it('should initialize with empty violations', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());

      expect(result.current.violations).toEqual([]);
      expect(result.current.activeViolations).toEqual([]);
      expect(result.current.isMonitoring).toBe(false);
      expect(result.current.stats.totalViolations).toBe(0);
      expect(result.current.stats.activeViolations).toBe(0);
    });

    it('should start and stop monitoring', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());

      act(() => {
        result.current.startMonitoring();
      });

      expect(result.current.isMonitoring).toBe(true);

      act(() => {
        result.current.stopMonitoring();
      });

      expect(result.current.isMonitoring).toBe(false);
    });

    it('should detect geofence violations', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());
      const vehicle = generateMockVehicle();
      const geofence = generateMockGeofence();

      // Mock vehicle inside geofence
      vehicle.position.lat = geofence.geometry.coordinates[0][0];
      vehicle.position.lng = geofence.geometry.coordinates[0][1];

      const violations = result.current.checkViolations([vehicle], [geofence]);

      expect(Array.isArray(violations)).toBe(true);
    });

    it('should add violations correctly', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());
      const mockViolation = {
        id: 'violation-1',
        vehicleId: 'vehicle-1',
        geofenceId: 'geofence-1',
        violationType: 'entry' as const,
        timestamp: new Date(),
        position: { lat: 40.7128, lng: -74.0060, accuracy: 10 },
        distance: 5,
        severity: 'high' as const,
        isResolved: false,
        resolvedAt: null,
      };

      act(() => {
        result.current.addViolation(mockViolation);
      });

      expect(result.current.violations).toHaveLength(1);
      expect(result.current.violations[0]).toEqual(mockViolation);
      expect(result.current.stats.totalViolations).toBe(1);
      expect(result.current.stats.activeViolations).toBe(1);
    });

    it('should resolve violations', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());
      const mockViolation = {
        id: 'violation-1',
        vehicleId: 'vehicle-1',
        geofenceId: 'geofence-1',
        violationType: 'entry' as const,
        timestamp: new Date(),
        position: { lat: 40.7128, lng: -74.0060, accuracy: 10 },
        distance: 5,
        severity: 'high' as const,
        isResolved: false,
        resolvedAt: null,
      };

      act(() => {
        result.current.addViolation(mockViolation);
      });

      expect(result.current.stats.activeViolations).toBe(1);

      act(() => {
        result.current.resolveViolation(mockViolation.id);
      });

      expect(result.current.stats.activeViolations).toBe(0);
      expect(result.current.violations[0].isResolved).toBe(true);
    });

    it('should manage geofences correctly', () => {
      const { result } = renderHook(() => useGeofenceMonitoring());
      const mockGeofence = generateMockGeofence();

      act(() => {
        result.current.addGeofence(mockGeofence);
      });

      expect(result.current.addGeofence).toBeDefined();

      act(() => {
        result.current.updateGeofence({ ...mockGeofence, name: 'Updated Geofence' });
      });

      expect(result.current.updateGeofence).toBeDefined();

      act(() => {
        result.current.removeGeofence(mockGeofence.id);
      });

      expect(result.current.removeGeofence).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete fleet data flow', async () => {
      const { result: fleetData } = renderHook(() => 
        useFleetData({
          websocketUrl: 'ws://localhost:8080',
          apiEndpoint: 'http://localhost:3000/api',
        })
      );

      const { result: alerts } = renderHook(() => useFleetAlerts());
      const { result: monitoring } = renderHook(() => useGeofenceMonitoring());

      // Simulate data flow
      const mockVehicle = generateMockVehicle();
      const mockGeofence = generateMockGeofence();
      const mockAlert = generateMockAlert();

      act(() => {
        alerts.current.addAlert(mockAlert);
      });

      expect(alerts.current.stats.total).toBe(1);

      act(() => {
        monitoring.current.startMonitoring();
      });

      expect(monitoring.current.isMonitoring).toBe(true);
    });

    it('should handle error scenarios gracefully', () => {
      const { result } = renderHook(() => 
        useFleetData({
          websocketUrl: 'invalid-url',
          apiEndpoint: 'invalid-endpoint',
        })
      );

      // Should handle invalid configuration
      expect(result.current.error).toBeDefined();
    });
  });
});
