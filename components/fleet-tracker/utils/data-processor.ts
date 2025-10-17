// Documentation: /docs/fleet-tracker/data-processor.md

/**
 * Real-time Data Processing Pipeline
 * 
 * Handles real-time data processing, throttling, batching, and caching
 * for fleet tracking data. Provides efficient data management and
 * performance optimization.
 */

import { Vehicle, Alert, GeofenceViolation, WebSocketMessage } from '../types';
import { validateVehicle, validateAlert, validateGeofenceViolation } from './validation';

export interface DataProcessorConfig {
  updateInterval: number;
  maxVehicles: number;
  enableThrottling: boolean;
  throttleInterval: number;
  batchSize: number;
  cacheSize: number;
  enableClustering: boolean;
}

export interface DataProcessorStats {
  totalUpdates: number;
  throttledUpdates: number;
  batchedUpdates: number;
  cacheHits: number;
  cacheMisses: number;
  averageProcessingTime: number;
}

export interface VehicleUpdate {
  vehicle: Vehicle;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
}

export interface ProcessedData {
  vehicles: Map<string, Vehicle>;
  alerts: Alert[];
  violations: GeofenceViolation[];
  lastUpdate: number;
}

export class DataProcessor {
  private config: DataProcessorConfig;
  private vehicleCache = new Map<string, Vehicle>();
  private alertCache = new Map<string, Alert>();
  private violationCache = new Map<string, GeofenceViolation>();
  private updateQueue: VehicleUpdate[] = [];
  private batchQueue: any[] = [];
  private stats: DataProcessorStats;
  private processingTimer: NodeJS.Timeout | null = null;
  private batchTimer: NodeJS.Timeout | null = null;
  private lastProcessTime = 0;

  constructor(config: DataProcessorConfig) {
    this.config = config;
    this.stats = {
      totalUpdates: 0,
      throttledUpdates: 0,
      batchedUpdates: 0,
      cacheHits: 0,
      cacheMisses: 0,
      averageProcessingTime: 0,
    };

    this.startProcessing();
  }

  /**
   * Process vehicle update
   */
  public processVehicleUpdate(vehicle: Vehicle): void {
    const startTime = Date.now();
    
    // Validate vehicle data
    if (!validateVehicle(vehicle)) {
      console.warn('Invalid vehicle data received:', vehicle);
      return;
    }

    this.stats.totalUpdates++;

    // Check if update should be throttled
    if (this.config.enableThrottling && this.shouldThrottleUpdate(vehicle)) {
      this.stats.throttledUpdates++;
      return;
    }

    // Add to update queue
    const priority = this.calculatePriority(vehicle);
    this.updateQueue.push({
      vehicle,
      timestamp: Date.now(),
      priority,
    });

    // Process immediately for high priority updates
    if (priority === 'high') {
      this.processUpdateQueue();
    }

    // Update processing time stats
    const processingTime = Date.now() - startTime;
    this.updateAverageProcessingTime(processingTime);
  }

  /**
   * Process alert
   */
  public processAlert(alert: Alert): void {
    if (!validateAlert(alert)) {
      console.warn('Invalid alert data received:', alert);
      return;
    }

    this.alertCache.set(alert.id, alert);
    this.cleanupCache('alert');
  }

  /**
   * Process geofence violation
   */
  public processGeofenceViolation(violation: GeofenceViolation): void {
    if (!validateGeofenceViolation(violation)) {
      console.warn('Invalid geofence violation data received:', violation);
      return;
    }

    this.violationCache.set(violation.id, violation);
    this.cleanupCache('violation');
  }

  /**
   * Process WebSocket message
   */
  public processWebSocketMessage(message: WebSocketMessage): void {
    this.batchQueue.push(message);

    // Process batch if it reaches the batch size
    if (this.batchQueue.length >= this.config.batchSize) {
      this.processBatch();
    }
  }

  /**
   * Get processed data
   */
  public getProcessedData(): ProcessedData {
    return {
      vehicles: new Map(this.vehicleCache),
      alerts: Array.from(this.alertCache.values()),
      violations: Array.from(this.violationCache.values()),
      lastUpdate: this.lastProcessTime,
    };
  }

  /**
   * Get vehicle by ID
   */
  public getVehicle(id: string): Vehicle | undefined {
    const vehicle = this.vehicleCache.get(id);
    if (vehicle) {
      this.stats.cacheHits++;
    } else {
      this.stats.cacheMisses++;
    }
    return vehicle;
  }

  /**
   * Get all vehicles
   */
  public getAllVehicles(): Vehicle[] {
    return Array.from(this.vehicleCache.values());
  }

  /**
   * Get alerts
   */
  public getAlerts(): Alert[] {
    return Array.from(this.alertCache.values());
  }

  /**
   * Get violations
   */
  public getViolations(): GeofenceViolation[] {
    return Array.from(this.violationCache.values());
  }

  /**
   * Get processing statistics
   */
  public getStats(): DataProcessorStats {
    return { ...this.stats };
  }

  /**
   * Clear all data
   */
  public clearData(): void {
    this.vehicleCache.clear();
    this.alertCache.clear();
    this.violationCache.clear();
    this.updateQueue = [];
    this.batchQueue = [];
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<DataProcessorConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart processing with new config
    this.stopProcessing();
    this.startProcessing();
  }

  private startProcessing(): void {
    // Process update queue at regular intervals
    this.processingTimer = setInterval(() => {
      this.processUpdateQueue();
    }, this.config.updateInterval);

    // Process batch queue at regular intervals
    this.batchTimer = setInterval(() => {
      this.processBatch();
    }, this.config.updateInterval * 2);
  }

  private stopProcessing(): void {
    if (this.processingTimer) {
      clearInterval(this.processingTimer);
      this.processingTimer = null;
    }

    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }
  }

  private processUpdateQueue(): void {
    if (this.updateQueue.length === 0) return;

    // Sort by priority and timestamp
    this.updateQueue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.timestamp - a.timestamp;
    });

    // Process updates (limit to prevent blocking)
    const maxUpdates = Math.min(this.updateQueue.length, 50);
    for (let i = 0; i < maxUpdates; i++) {
      const update = this.updateQueue.shift();
      if (update) {
        this.vehicleCache.set(update.vehicle.id, update.vehicle);
      }
    }

    this.lastProcessTime = Date.now();
    this.cleanupCache('vehicle');
  }

  private processBatch(): void {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue.splice(0, this.config.batchSize);
    this.stats.batchedUpdates += batch.length;

    // Process batch items
    for (const message of batch) {
      switch (message.type) {
        case 'vehicle_update':
          if (message.data) {
            this.processVehicleUpdate(message.data);
          }
          break;
        case 'alert':
          if (message.data) {
            this.processAlert(message.data);
          }
          break;
        case 'geofence_violation':
          if (message.data) {
            this.processGeofenceViolation(message.data);
          }
          break;
      }
    }
  }

  private shouldThrottleUpdate(vehicle: Vehicle): boolean {
    const existingVehicle = this.vehicleCache.get(vehicle.id);
    if (!existingVehicle) return false;

    const timeDiff = vehicle.lastUpdate.getTime() - existingVehicle.lastUpdate.getTime();
    const positionDiff = this.calculateDistance(
      existingVehicle.position.lat,
      existingVehicle.position.lng,
      vehicle.position.lat,
      vehicle.position.lng
    );

    // Throttle if update is too frequent and position hasn't changed much
    return timeDiff < this.config.throttleInterval && positionDiff < 10; // 10 meters
  }

  private calculatePriority(vehicle: Vehicle): 'high' | 'medium' | 'low' {
    const existingVehicle = this.vehicleCache.get(vehicle.id);
    
    if (!existingVehicle) return 'high';
    
    // High priority for status changes
    if (vehicle.status !== existingVehicle.status) return 'high';
    
    // High priority for high speed vehicles
    if (vehicle.position.speed > 80) return 'high';
    
    // Medium priority for moving vehicles
    if (vehicle.position.speed > 5) return 'medium';
    
    // Low priority for stationary vehicles
    return 'low';
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private cleanupCache(type: 'vehicle' | 'alert' | 'violation'): void {
    const maxSize = this.config.cacheSize;
    
    switch (type) {
      case 'vehicle':
        if (this.vehicleCache.size > maxSize) {
          const entries = Array.from(this.vehicleCache.entries());
          entries.sort((a, b) => b[1].lastUpdate.getTime() - a[1].lastUpdate.getTime());
          
          // Keep only the most recent entries
          this.vehicleCache.clear();
          entries.slice(0, maxSize).forEach(([id, vehicle]) => {
            this.vehicleCache.set(id, vehicle);
          });
        }
        break;
        
      case 'alert':
        if (this.alertCache.size > maxSize) {
          const entries = Array.from(this.alertCache.entries());
          entries.sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime());
          
          this.alertCache.clear();
          entries.slice(0, maxSize).forEach(([id, alert]) => {
            this.alertCache.set(id, alert);
          });
        }
        break;
        
      case 'violation':
        if (this.violationCache.size > maxSize) {
          const entries = Array.from(this.violationCache.entries());
          entries.sort((a, b) => b[1].timestamp.getTime() - a[1].timestamp.getTime());
          
          this.violationCache.clear();
          entries.slice(0, maxSize).forEach(([id, violation]) => {
            this.violationCache.set(id, violation);
          });
        }
        break;
    }
  }

  private updateAverageProcessingTime(time: number): void {
    const totalTime = this.stats.averageProcessingTime * this.stats.totalUpdates;
    this.stats.averageProcessingTime = (totalTime + time) / (this.stats.totalUpdates + 1);
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    this.stopProcessing();
    this.clearData();
  }
}

// Default configuration
export const defaultDataProcessorConfig: DataProcessorConfig = {
  updateInterval: 1000,
  maxVehicles: 1000,
  enableThrottling: true,
  throttleInterval: 2000,
  batchSize: 10,
  cacheSize: 500,
  enableClustering: true,
};

// Factory function to create data processor
export function createDataProcessor(config: Partial<DataProcessorConfig> = {}): DataProcessor {
  const mergedConfig = { ...defaultDataProcessorConfig, ...config };
  return new DataProcessor(mergedConfig);
}
