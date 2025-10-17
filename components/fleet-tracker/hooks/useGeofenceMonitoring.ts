// Documentation: /docs/fleet-tracker/hooks/useGeofenceMonitoring.md

/**
 * useGeofenceMonitoring Hook
 * 
 * Custom hook for monitoring geofence violations and managing
 * geofence-related alerts and notifications.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Vehicle, Geofence, GeofenceViolation, Alert } from '../types';
import { validateGeofenceViolation } from '../utils/validation';

export interface UseGeofenceMonitoringOptions {
  enableViolationDetection?: boolean;
  violationThreshold?: number; // meters
  enableAlerts?: boolean;
  enableNotifications?: boolean;
  checkInterval?: number; // milliseconds
}

export interface UseGeofenceMonitoringReturn {
  // Violations
  violations: GeofenceViolation[];
  activeViolations: GeofenceViolation[];
  
  // Monitoring state
  isMonitoring: boolean;
  lastCheck: Date | null;
  
  // Statistics
  stats: {
    totalViolations: number;
    activeViolations: number;
    violationsByGeofence: Record<string, number>;
    violationsByVehicle: Record<string, number>;
  };
  
  // Actions
  startMonitoring: () => void;
  stopMonitoring: () => void;
  checkViolations: (vehicles: Vehicle[], geofences: Geofence[]) => GeofenceViolation[];
  addViolation: (violation: GeofenceViolation) => void;
  resolveViolation: (violationId: string) => void;
  clearViolations: () => void;
  
  // Geofence management
  addGeofence: (geofence: Geofence) => void;
  updateGeofence: (geofence: Geofence) => void;
  removeGeofence: (geofenceId: string) => void;
}

export const useGeofenceMonitoring = (options: UseGeofenceMonitoringOptions = {}): UseGeofenceMonitoringReturn => {
  const {
    enableViolationDetection = true,
    violationThreshold = 10, // 10 meters
    enableAlerts = true,
    enableNotifications = true,
    checkInterval = 5000, // 5 seconds
  } = options;

  // State
  const [violations, setViolations] = useState<GeofenceViolation[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [geofences, setGeofences] = useState<Geofence[]>([]);

  // Refs
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const violationHistoryRef = useRef<Map<string, GeofenceViolation[]>>(new Map());

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // Check for geofence violations
  const checkViolations = useCallback((vehicles: Vehicle[], geofences: Geofence[]): GeofenceViolation[] => {
    const newViolations: GeofenceViolation[] = [];

    vehicles.forEach(vehicle => {
      geofences.forEach(geofence => {
        if (!geofence.isActive) return;

        const distance = calculateDistance(
          vehicle.position.lat,
          vehicle.position.lng,
          geofence.geometry.coordinates[0][0],
          geofence.geometry.coordinates[0][1]
        );

        // Check if vehicle is inside geofence
        const isInside = isVehicleInsideGeofence(vehicle, geofence);
        const wasInside = wasVehicleInsideGeofence(vehicle.id, geofence.id);

        // Detect violations based on geofence type
        let violationType: 'entry' | 'exit' | null = null;

        if (geofence.type === 'restricted' && isInside && !wasInside) {
          violationType = 'entry'; // Entering restricted area
        } else if (geofence.type === 'required' && !isInside && wasInside) {
          violationType = 'exit'; // Exiting required area
        }

        if (violationType) {
          const violation: GeofenceViolation = {
            id: `violation_${vehicle.id}_${geofence.id}_${Date.now()}`,
            vehicleId: vehicle.id,
            geofenceId: geofence.id,
            violationType,
            timestamp: new Date(),
            position: {
              lat: vehicle.position.lat,
              lng: vehicle.position.lng,
              accuracy: vehicle.position.accuracy,
            },
            distance: distance,
            severity: distance < violationThreshold ? 'high' : 'medium',
            isResolved: false,
            resolvedAt: null,
          };

          if (validateGeofenceViolation(violation)) {
            newViolations.push(violation);
          }
        }

        // Update violation history
        updateViolationHistory(vehicle.id, geofence.id, isInside);
      });
    });

    return newViolations;
  }, [violationThreshold]);

  // Check if vehicle is inside geofence
  const isVehicleInsideGeofence = useCallback((vehicle: Vehicle, geofence: Geofence): boolean => {
    if (geofence.geometry.type === 'Circle') {
      const center = geofence.geometry.coordinates[0];
      const radius = geofence.geometry.radius || 1000;
      const distance = calculateDistance(
        vehicle.position.lat,
        vehicle.position.lng,
        center[0],
        center[1]
      );
      return distance <= radius;
    } else {
      // Polygon geofence - use point-in-polygon algorithm
      return isPointInPolygon(
        [vehicle.position.lng, vehicle.position.lat],
        geofence.geometry.coordinates.map(coord => [coord[1], coord[0]]) // Convert lat,lng to lng,lat
      );
    }
  }, []);

  // Point-in-polygon algorithm
  const isPointInPolygon = useCallback((point: [number, number], polygon: number[][]): boolean => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }, []);

  // Check if vehicle was previously inside geofence
  const wasVehicleInsideGeofence = useCallback((vehicleId: string, geofenceId: string): boolean => {
    const history = violationHistoryRef.current.get(`${vehicleId}_${geofenceId}`);
    return history ? history[history.length - 1]?.isInside || false : false;
  }, []);

  // Update violation history
  const updateViolationHistory = useCallback((vehicleId: string, geofenceId: string, isInside: boolean) => {
    const key = `${vehicleId}_${geofenceId}`;
    const history = violationHistoryRef.current.get(key) || [];
    
    history.push({
      timestamp: new Date(),
      isInside,
    });

    // Keep only last 10 entries
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    violationHistoryRef.current.set(key, history);
  }, []);

  // Add violation
  const addViolation = useCallback((violation: GeofenceViolation) => {
    if (!validateGeofenceViolation(violation)) {
      console.warn('Invalid violation data:', violation);
      return;
    }

    setViolations(prev => {
      // Check if violation already exists
      const exists = prev.some(v => v.id === violation.id);
      if (exists) return prev;

      return [violation, ...prev];
    });

    // Create alert if enabled
    if (enableAlerts) {
      const alert: Alert = {
        id: `alert_${violation.id}`,
        type: 'geofence_violation',
        severity: violation.severity === 'high' ? 'critical' : 'warning',
        message: `Vehicle ${violation.vehicleId} ${violation.violationType} geofence ${violation.geofenceId}`,
        timestamp: violation.timestamp,
        vehicleId: violation.vehicleId,
        geofenceId: violation.geofenceId,
        isRead: false,
        metadata: {
          violationId: violation.id,
          distance: violation.distance,
          position: violation.position,
        },
      };

      // Dispatch custom event for alert handling
      window.dispatchEvent(new CustomEvent('fleet-alert', { detail: alert }));
    }
  }, [enableAlerts]);

  // Resolve violation
  const resolveViolation = useCallback((violationId: string) => {
    setViolations(prev => 
      prev.map(violation => 
        violation.id === violationId 
          ? { ...violation, isResolved: true, resolvedAt: new Date() }
          : violation
      )
    );
  }, []);

  // Clear violations
  const clearViolations = useCallback(() => {
    setViolations([]);
  }, []);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    
    // Set up monitoring interval
    monitoringIntervalRef.current = setInterval(() => {
      setLastCheck(new Date());
    }, checkInterval);
  }, [isMonitoring, checkInterval]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
  }, []);

  // Add geofence
  const addGeofence = useCallback((geofence: Geofence) => {
    setGeofences(prev => {
      const exists = prev.some(g => g.id === geofence.id);
      if (exists) return prev;
      return [...prev, geofence];
    });
  }, []);

  // Update geofence
  const updateGeofence = useCallback((geofence: Geofence) => {
    setGeofences(prev => 
      prev.map(g => g.id === geofence.id ? geofence : g)
    );
  }, []);

  // Remove geofence
  const removeGeofence = useCallback((geofenceId: string) => {
    setGeofences(prev => prev.filter(g => g.id !== geofenceId));
    
    // Clear related violations
    setViolations(prev => prev.filter(v => v.geofenceId !== geofenceId));
  }, []);

  // Computed values
  const activeViolations = violations.filter(v => !v.isResolved);

  // Statistics
  const stats = {
    totalViolations: violations.length,
    activeViolations: activeViolations.length,
    violationsByGeofence: violations.reduce((acc, violation) => {
      acc[violation.geofenceId] = (acc[violation.geofenceId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    violationsByVehicle: violations.reduce((acc, violation) => {
      acc[violation.vehicleId] = (acc[violation.vehicleId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (monitoringIntervalRef.current) {
        clearInterval(monitoringIntervalRef.current);
      }
    };
  }, []);

  return {
    // Violations
    violations,
    activeViolations,
    
    // Monitoring state
    isMonitoring,
    lastCheck,
    
    // Statistics
    stats,
    
    // Actions
    startMonitoring,
    stopMonitoring,
    checkViolations,
    addViolation,
    resolveViolation,
    clearViolations,
    
    // Geofence management
    addGeofence,
    updateGeofence,
    removeGeofence,
  };
};
