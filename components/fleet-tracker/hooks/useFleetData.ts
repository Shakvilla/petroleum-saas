// Documentation: /docs/fleet-tracker/hooks/useFleetData.md

/**
 * useFleetData Hook
 * 
 * Custom hook for managing real-time fleet data synchronization.
 * Handles WebSocket connections, data processing, and state updates.
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Vehicle, Geofence, Alert, WebSocketMessage } from '../types';
import { WebSocketManager } from '../utils/websocket-manager';
import { DataProcessor } from '../utils/data-processor';
import { OfflineManager } from '../utils/offline-manager';
import { validateVehicle, validateGeofence, validateAlert } from '../utils/validation';

export interface UseFleetDataOptions {
  websocketUrl: string;
  apiEndpoint: string;
  updateInterval?: number;
  maxVehicles?: number;
  enableOfflineMode?: boolean;
  enableAlerts?: boolean;
  enableGeofencing?: boolean;
}

export interface UseFleetDataReturn {
  // Data
  vehicles: Vehicle[];
  geofences: Geofence[];
  alerts: Alert[];
  
  // State
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  
  // Statistics
  stats: {
    totalVehicles: number;
    activeVehicles: number;
    totalAlerts: number;
    unreadAlerts: number;
    dataProcessed: number;
    connectionUptime: number;
  };
  
  // Actions
  refreshData: () => Promise<void>;
  clearAlerts: () => void;
  markAlertAsRead: (alertId: string) => void;
  selectVehicle: (vehicleId: string | null) => void;
  selectGeofence: (geofenceId: string | null) => void;
  
  // Selected items
  selectedVehicleId: string | null;
  selectedGeofenceId: string | null;
  
  // Connection management
  reconnect: () => void;
  disconnect: () => void;
}

export const useFleetData = (options: UseFleetDataOptions): UseFleetDataReturn => {
  const {
    websocketUrl,
    apiEndpoint,
    updateInterval = 5000,
    maxVehicles = 1000,
    enableOfflineMode = true,
    enableAlerts = true,
    enableGeofencing = true,
  } = options;

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(null);

  // Refs for managers
  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const dataProcessorRef = useRef<DataProcessor | null>(null);
  const offlineManagerRef = useRef<OfflineManager | null>(null);
  const connectionStartTimeRef = useRef<Date | null>(null);
  const statsRef = useRef({
    totalVehicles: 0,
    activeVehicles: 0,
    totalAlerts: 0,
    unreadAlerts: 0,
    dataProcessed: 0,
    connectionUptime: 0,
  });

  // Initialize managers
  useEffect(() => {
    if (!websocketUrl || !apiEndpoint) {
      setError('Missing required configuration: websocketUrl and apiEndpoint');
      setIsLoading(false);
      return;
    }

    try {
      // Initialize WebSocket manager
      wsManagerRef.current = new WebSocketManager({
        url: websocketUrl,
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
        heartbeatInterval: 30000,
      });

      // Initialize data processor
      dataProcessorRef.current = new DataProcessor({
        updateInterval,
        maxCacheSize: maxVehicles * 2,
        batchSize: 50,
      });

      // Initialize offline manager if enabled
      if (enableOfflineMode) {
        offlineManagerRef.current = new OfflineManager({
          maxStorageSize: 50 * 1024 * 1024, // 50MB
          syncInterval: 10000,
        });
      }

      // Set up WebSocket event handlers
      wsManagerRef.current.on('connected', () => {
        setIsConnected(true);
        setError(null);
        connectionStartTimeRef.current = new Date();
        setIsLoading(false);
      });

      wsManagerRef.current.on('disconnected', () => {
        setIsConnected(false);
      });

      wsManagerRef.current.on('error', (error) => {
        setError(error.message);
        setIsLoading(false);
      });

      wsManagerRef.current.on('message', (message: WebSocketMessage) => {
        if (dataProcessorRef.current) {
          dataProcessorRef.current.processMessage(message);
          statsRef.current.dataProcessed++;
        }
      });

      // Set up data processor event handlers
      if (dataProcessorRef.current) {
        dataProcessorRef.current.on('vehicleUpdate', (vehicle: Vehicle) => {
          if (validateVehicle(vehicle)) {
            setVehicles(prev => {
              const existingIndex = prev.findIndex(v => v.id === vehicle.id);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = vehicle;
                return updated;
              } else {
                return [...prev, vehicle];
              }
            });
            
            // Store in offline manager if enabled
            if (offlineManagerRef.current) {
              offlineManagerRef.current.storeVehicle(vehicle);
            }
            
            setLastUpdate(new Date());
          }
        });

        dataProcessorRef.current.on('geofenceUpdate', (geofence: Geofence) => {
          if (validateGeofence(geofence)) {
            setGeofences(prev => {
              const existingIndex = prev.findIndex(g => g.id === geofence.id);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = geofence;
                return updated;
              } else {
                return [...prev, geofence];
              }
            });
            
            setLastUpdate(new Date());
          }
        });

        dataProcessorRef.current.on('alert', (alert: Alert) => {
          if (validateAlert(alert)) {
            setAlerts(prev => [alert, ...prev]);
            statsRef.current.totalAlerts++;
            statsRef.current.unreadAlerts++;
            setLastUpdate(new Date());
          }
        });
      }

      // Connect WebSocket
      wsManagerRef.current.connect();
      setIsLoading(true);

    } catch (err) {
      setError(`Failed to initialize fleet data: ${err}`);
      setIsLoading(false);
    }

    return () => {
      wsManagerRef.current?.disconnect();
    };
  }, [websocketUrl, apiEndpoint, updateInterval, maxVehicles, enableOfflineMode, enableAlerts, enableGeofencing]);

  // Update statistics
  useEffect(() => {
    const updateStats = () => {
      statsRef.current.totalVehicles = vehicles.length;
      statsRef.current.activeVehicles = vehicles.filter(v => v.status === 'active').length;
      statsRef.current.unreadAlerts = alerts.filter(a => !a.isRead).length;
      
      if (connectionStartTimeRef.current) {
        statsRef.current.connectionUptime = Date.now() - connectionStartTimeRef.current.getTime();
      }
    };

    updateStats();
  }, [vehicles, alerts]);

  // Refresh data from API
  const refreshData = useCallback(async () => {
    if (!apiEndpoint) return;

    try {
      setIsLoading(true);
      setError(null);

      // Fetch vehicles
      const vehiclesResponse = await fetch(`${apiEndpoint}/vehicles`);
      if (vehiclesResponse.ok) {
        const vehiclesData = await vehiclesResponse.json();
        const validVehicles = vehiclesData.filter(validateVehicle);
        setVehicles(validVehicles);
      }

      // Fetch geofences if enabled
      if (enableGeofencing) {
        const geofencesResponse = await fetch(`${apiEndpoint}/geofences`);
        if (geofencesResponse.ok) {
          const geofencesData = await geofencesResponse.json();
          const validGeofences = geofencesData.filter(validateGeofence);
          setGeofences(validGeofences);
        }
      }

      // Fetch alerts if enabled
      if (enableAlerts) {
        const alertsResponse = await fetch(`${apiEndpoint}/alerts`);
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json();
          const validAlerts = alertsData.filter(validateAlert);
          setAlerts(validAlerts);
        }
      }

      setLastUpdate(new Date());
    } catch (err) {
      setError(`Failed to refresh data: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, enableGeofencing, enableAlerts]);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
    statsRef.current.totalAlerts = 0;
    statsRef.current.unreadAlerts = 0;
  }, []);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  }, []);

  // Select vehicle
  const selectVehicle = useCallback((vehicleId: string | null) => {
    setSelectedVehicleId(vehicleId);
    if (vehicleId) {
      setSelectedGeofenceId(null);
    }
  }, []);

  // Select geofence
  const selectGeofence = useCallback((geofenceId: string | null) => {
    setSelectedGeofenceId(geofenceId);
    if (geofenceId) {
      setSelectedVehicleId(null);
    }
  }, []);

  // Reconnect WebSocket
  const reconnect = useCallback(() => {
    if (wsManagerRef.current) {
      wsManagerRef.current.connect();
    }
  }, []);

  // Disconnect WebSocket
  const disconnect = useCallback(() => {
    if (wsManagerRef.current) {
      wsManagerRef.current.disconnect();
    }
  }, []);

  return {
    // Data
    vehicles,
    geofences,
    alerts,
    
    // State
    isConnected,
    isLoading,
    error,
    lastUpdate,
    
    // Statistics
    stats: statsRef.current,
    
    // Actions
    refreshData,
    clearAlerts,
    markAlertAsRead,
    selectVehicle,
    selectGeofence,
    
    // Selected items
    selectedVehicleId,
    selectedGeofenceId,
    
    // Connection management
    reconnect,
    disconnect,
  };
};
