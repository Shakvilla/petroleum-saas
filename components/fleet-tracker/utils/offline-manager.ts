// Documentation: /docs/fleet-tracker/offline-manager.md

/**
 * Offline Data Manager for Fleet Tracker
 * 
 * Handles offline data storage, synchronization, and conflict resolution
 * for fleet tracking data. Provides seamless offline/online transitions.
 */

import { Vehicle, Alert, GeofenceViolation, Route } from '../types';
import { validateVehicle, validateAlert, validateGeofenceViolation, validateRoute } from './validation';

export interface OfflineManagerConfig {
  enableOfflineMode: boolean;
  storageKey: string;
  maxStorageSize: number;
  syncInterval: number;
  conflictResolution: 'server' | 'client' | 'timestamp';
  enableCompression: boolean;
}

export interface OfflineData {
  vehicles: Map<string, Vehicle>;
  alerts: Alert[];
  violations: GeofenceViolation[];
  routes: Route[];
  lastSync: number;
  version: number;
}

export interface SyncResult {
  success: boolean;
  conflicts: ConflictItem[];
  syncedItems: number;
  errors: string[];
}

export interface ConflictItem {
  id: string;
  type: 'vehicle' | 'alert' | 'violation' | 'route';
  localData: any;
  serverData: any;
  conflictType: 'timestamp' | 'version' | 'data';
}

export class OfflineManager {
  private config: OfflineManagerConfig;
  private isOnline = true;
  private offlineData: OfflineData;
  private syncQueue: any[] = [];
  private syncTimer: NodeJS.Timeout | null = null;
  private storage: Storage;

  constructor(config: OfflineManagerConfig) {
    this.config = config;
    this.storage = typeof window !== 'undefined' ? localStorage : new Map() as any;
    this.offlineData = this.loadOfflineData();
    
    if (this.config.enableOfflineMode) {
      this.startSyncTimer();
      this.setupOnlineOfflineListeners();
    }
  }

  /**
   * Set online/offline status
   */
  public setOnlineStatus(isOnline: boolean): void {
    this.isOnline = isOnline;
    
    if (isOnline) {
      this.syncWithServer();
    } else {
      this.startOfflineMode();
    }
  }

  /**
   * Store vehicle data offline
   */
  public storeVehicle(vehicle: Vehicle): void {
    if (!validateVehicle(vehicle)) {
      console.warn('Invalid vehicle data for offline storage:', vehicle);
      return;
    }

    this.offlineData.vehicles.set(vehicle.id, vehicle);
    this.saveOfflineData();

    if (!this.isOnline) {
      this.addToSyncQueue('vehicle', vehicle);
    }
  }

  /**
   * Store alert data offline
   */
  public storeAlert(alert: Alert): void {
    if (!validateAlert(alert)) {
      console.warn('Invalid alert data for offline storage:', alert);
      return;
    }

    this.offlineData.alerts.push(alert);
    this.saveOfflineData();

    if (!this.isOnline) {
      this.addToSyncQueue('alert', alert);
    }
  }

  /**
   * Store violation data offline
   */
  public storeViolation(violation: GeofenceViolation): void {
    if (!validateGeofenceViolation(violation)) {
      console.warn('Invalid violation data for offline storage:', violation);
      return;
    }

    this.offlineData.violations.push(violation);
    this.saveOfflineData();

    if (!this.isOnline) {
      this.addToSyncQueue('violation', violation);
    }
  }

  /**
   * Store route data offline
   */
  public storeRoute(route: Route): void {
    if (!validateRoute(route)) {
      console.warn('Invalid route data for offline storage:', route);
      return;
    }

    this.offlineData.routes.push(route);
    this.saveOfflineData();

    if (!this.isOnline) {
      this.addToSyncQueue('route', route);
    }
  }

  /**
   * Get offline data
   */
  public getOfflineData(): OfflineData {
    return { ...this.offlineData };
  }

  /**
   * Get vehicle from offline storage
   */
  public getVehicle(id: string): Vehicle | undefined {
    return this.offlineData.vehicles.get(id);
  }

  /**
   * Get all vehicles from offline storage
   */
  public getAllVehicles(): Vehicle[] {
    return Array.from(this.offlineData.vehicles.values());
  }

  /**
   * Get alerts from offline storage
   */
  public getAlerts(): Alert[] {
    return [...this.offlineData.alerts];
  }

  /**
   * Get violations from offline storage
   */
  public getViolations(): GeofenceViolation[] {
    return [...this.offlineData.violations];
  }

  /**
   * Get routes from offline storage
   */
  public getRoutes(): Route[] {
    return [...this.offlineData.routes];
  }

  /**
   * Sync with server
   */
  public async syncWithServer(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        conflicts: [],
        syncedItems: 0,
        errors: ['Not online'],
      };
    }

    const result: SyncResult = {
      success: true,
      conflicts: [],
      syncedItems: 0,
      errors: [],
    };

    try {
      // Sync queued items
      for (const item of this.syncQueue) {
        try {
          await this.syncItem(item);
          result.syncedItems++;
        } catch (error) {
          result.errors.push(`Failed to sync ${item.type}: ${error}`);
        }
      }

      // Clear sync queue on success
      if (result.errors.length === 0) {
        this.syncQueue = [];
        this.offlineData.lastSync = Date.now();
        this.offlineData.version++;
        this.saveOfflineData();
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Sync failed: ${error}`);
    }

    return result;
  }

  /**
   * Resolve conflicts
   */
  public resolveConflicts(conflicts: ConflictItem[], resolution: 'server' | 'client'): void {
    for (const conflict of conflicts) {
      const data = resolution === 'server' ? conflict.serverData : conflict.localData;
      
      switch (conflict.type) {
        case 'vehicle':
          this.offlineData.vehicles.set(conflict.id, data);
          break;
        case 'alert':
          const alertIndex = this.offlineData.alerts.findIndex(a => a.id === conflict.id);
          if (alertIndex >= 0) {
            this.offlineData.alerts[alertIndex] = data;
          }
          break;
        case 'violation':
          const violationIndex = this.offlineData.violations.findIndex(v => v.id === conflict.id);
          if (violationIndex >= 0) {
            this.offlineData.violations[violationIndex] = data;
          }
          break;
        case 'route':
          const routeIndex = this.offlineData.routes.findIndex(r => r.id === conflict.id);
          if (routeIndex >= 0) {
            this.offlineData.routes[routeIndex] = data;
          }
          break;
      }
    }

    this.saveOfflineData();
  }

  /**
   * Clear offline data
   */
  public clearOfflineData(): void {
    this.offlineData = {
      vehicles: new Map(),
      alerts: [],
      violations: [],
      routes: [],
      lastSync: 0,
      version: 0,
    };
    this.syncQueue = [];
    this.saveOfflineData();
  }

  /**
   * Get storage usage
   */
  public getStorageUsage(): {
    used: number;
    max: number;
    percentage: number;
  } {
    const data = JSON.stringify(this.offlineData);
    const used = new Blob([data]).size;
    const max = this.config.maxStorageSize;
    
    return {
      used,
      max,
      percentage: (used / max) * 100,
    };
  }

  private loadOfflineData(): OfflineData {
    try {
      const stored = this.storage.getItem(this.config.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Convert vehicles array back to Map
        const vehicles = new Map<string, Vehicle>();
        if (parsed.vehicles) {
          Object.entries(parsed.vehicles).forEach(([id, vehicle]) => {
            vehicles.set(id, vehicle as Vehicle);
          });
        }

        return {
          vehicles,
          alerts: parsed.alerts || [],
          violations: parsed.violations || [],
          routes: parsed.routes || [],
          lastSync: parsed.lastSync || 0,
          version: parsed.version || 0,
        };
      }
    } catch (error) {
      console.warn('Failed to load offline data:', error);
    }

    return {
      vehicles: new Map(),
      alerts: [],
      violations: [],
      routes: [],
      lastSync: 0,
      version: 0,
    };
  }

  private saveOfflineData(): void {
    try {
      // Convert Map to object for JSON serialization
      const vehiclesObj: Record<string, Vehicle> = {};
      this.offlineData.vehicles.forEach((vehicle, id) => {
        vehiclesObj[id] = vehicle;
      });

      const dataToSave = {
        ...this.offlineData,
        vehicles: vehiclesObj,
      };

      const json = JSON.stringify(dataToSave);
      
      // Check storage size limit
      if (json.length > this.config.maxStorageSize) {
        this.cleanupOldData();
        const cleanedJson = JSON.stringify({
          ...this.offlineData,
          vehicles: this.convertVehiclesToObject(),
        });
        
        if (cleanedJson.length <= this.config.maxStorageSize) {
          this.storage.setItem(this.config.storageKey, cleanedJson);
        }
      } else {
        this.storage.setItem(this.config.storageKey, json);
      }
    } catch (error) {
      console.warn('Failed to save offline data:', error);
    }
  }

  private convertVehiclesToObject(): Record<string, Vehicle> {
    const vehiclesObj: Record<string, Vehicle> = {};
    this.offlineData.vehicles.forEach((vehicle, id) => {
      vehiclesObj[id] = vehicle;
    });
    return vehiclesObj;
  }

  private cleanupOldData(): void {
    // Remove old alerts (keep last 100)
    if (this.offlineData.alerts.length > 100) {
      this.offlineData.alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      this.offlineData.alerts = this.offlineData.alerts.slice(0, 100);
    }

    // Remove old violations (keep last 50)
    if (this.offlineData.violations.length > 50) {
      this.offlineData.violations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      this.offlineData.violations = this.offlineData.violations.slice(0, 50);
    }

    // Remove old routes (keep last 20)
    if (this.offlineData.routes.length > 20) {
      this.offlineData.routes.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
      this.offlineData.routes = this.offlineData.routes.slice(0, 20);
    }
  }

  private addToSyncQueue(type: string, data: any): void {
    this.syncQueue.push({
      type,
      data,
      timestamp: Date.now(),
    });
  }

  private async syncItem(item: any): Promise<void> {
    // This would typically make an API call to sync the item
    // For now, we'll simulate the sync
    console.log(`Syncing ${item.type}:`, item.data);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private startSyncTimer(): void {
    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.syncQueue.length > 0) {
        this.syncWithServer();
      }
    }, this.config.syncInterval);
  }

  private setupOnlineOfflineListeners(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setOnlineStatus(true);
      });

      window.addEventListener('offline', () => {
        this.setOnlineStatus(false);
      });
    }
  }

  private startOfflineMode(): void {
    console.log('Starting offline mode');
    // Additional offline mode setup can be added here
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

// Default configuration
export const defaultOfflineManagerConfig: OfflineManagerConfig = {
  enableOfflineMode: true,
  storageKey: 'fleet-tracker-offline-data',
  maxStorageSize: 5 * 1024 * 1024, // 5MB
  syncInterval: 30000, // 30 seconds
  conflictResolution: 'timestamp',
  enableCompression: false,
};

// Factory function to create offline manager
export function createOfflineManager(config: Partial<OfflineManagerConfig> = {}): OfflineManager {
  const mergedConfig = { ...defaultOfflineManagerConfig, ...config };
  return new OfflineManager(mergedConfig);
}
