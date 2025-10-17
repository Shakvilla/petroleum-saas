// Documentation: /docs/fleet-tracker/config.md

/**
 * Fleet Tracker Configuration
 * 
 * Centralized configuration management for the Fleet Tracker component.
 * Handles environment-specific settings and feature flags.
 */

import { FleetTrackerConfig } from '../components/fleet-tracker/types';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

// Default configuration
const defaultConfig: FleetTrackerConfig = {
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
    style: 'mapbox://styles/mapbox/streets-v12',
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 30000,
  },
  performance: {
    updateInterval: 5000, // 5 seconds
    maxVehicles: 1000,
    enableClustering: true,
  },
};

// Development configuration
const developmentConfig: Partial<FleetTrackerConfig> = {
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZGV2LXVzZXIiLCJhIjoiY2x4ZGV2dGVzdCJ9.example',
    style: 'mapbox://styles/mapbox/light-v11',
  },
  websocket: {
    url: 'ws://localhost:3001',
    reconnectInterval: 2000,
    maxReconnectAttempts: 5,
  },
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000,
  },
  performance: {
    updateInterval: 2000, // Faster updates for development
    maxVehicles: 100,
    enableClustering: false, // Disable clustering for easier debugging
  },
};

// Production configuration
const productionConfig: Partial<FleetTrackerConfig> = {
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
    style: 'mapbox://styles/mapbox/streets-v12',
  },
  websocket: {
    url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://api.petroleum-saas.com/ws',
    reconnectInterval: 10000,
    maxReconnectAttempts: 20,
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.petroleum-saas.com',
    timeout: 30000,
  },
  performance: {
    updateInterval: 10000, // Slower updates for production
    maxVehicles: 5000,
    enableClustering: true,
  },
};

// Test configuration
const testConfig: Partial<FleetTrackerConfig> = {
  mapbox: {
    accessToken: 'test-token',
    style: 'mapbox://styles/mapbox/light-v11',
  },
  websocket: {
    url: 'ws://localhost:3001',
    reconnectInterval: 100,
    maxReconnectAttempts: 1,
  },
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 5000,
  },
  performance: {
    updateInterval: 1000,
    maxVehicles: 10,
    enableClustering: false,
  },
};

// Merge configurations based on environment
function getConfig(): FleetTrackerConfig {
  let config = { ...defaultConfig };

  if (isDevelopment) {
    config = { ...config, ...developmentConfig };
  } else if (isProduction) {
    config = { ...config, ...productionConfig };
  } else if (isTest) {
    config = { ...config, ...testConfig };
  }

  return config;
}

// Export the configuration
export const fleetTrackerConfig = getConfig();

// Configuration validation
export function validateConfig(config: FleetTrackerConfig): boolean {
  // Validate Mapbox access token
  if (!config.mapbox.accessToken || config.mapbox.accessToken === '') {
    console.warn('Mapbox access token is not configured');
    return false;
  }

  // Validate WebSocket URL
  if (!config.websocket.url || config.websocket.url === '') {
    console.warn('WebSocket URL is not configured');
    return false;
  }

  // Validate API base URL
  if (!config.api.baseUrl || config.api.baseUrl === '') {
    console.warn('API base URL is not configured');
    return false;
  }

  // Validate performance settings
  if (config.performance.updateInterval < 1000) {
    console.warn('Update interval is too low, may cause performance issues');
  }

  if (config.performance.maxVehicles < 1) {
    console.warn('Max vehicles must be at least 1');
    return false;
  }

  return true;
}

// Feature flags
export const featureFlags = {
  // Enable/disable specific features
  enableGeofencing: process.env.NEXT_PUBLIC_ENABLE_GEOFENCING !== 'false',
  enableRouteHistory: process.env.NEXT_PUBLIC_ENABLE_ROUTE_HISTORY !== 'false',
  enableRealTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== 'false',
  enableAlerts: process.env.NEXT_PUBLIC_ENABLE_ALERTS !== 'false',
  enableVehicleDetails: process.env.NEXT_PUBLIC_ENABLE_VEHICLE_DETAILS !== 'false',
  
  // Performance features
  enableClustering: process.env.NEXT_PUBLIC_ENABLE_CLUSTERING !== 'false',
  enableCaching: process.env.NEXT_PUBLIC_ENABLE_CACHING !== 'false',
  enableOfflineMode: process.env.NEXT_PUBLIC_ENABLE_OFFLINE !== 'false',
  
  // Development features
  enableDebugMode: isDevelopment && process.env.NEXT_PUBLIC_DEBUG === 'true',
  enableMockData: isDevelopment && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
  enablePerformanceMonitoring: isDevelopment && process.env.NEXT_PUBLIC_MONITOR_PERFORMANCE === 'true',
};

// Environment-specific settings
export const environmentSettings = {
  isDevelopment,
  isProduction,
  isTest,
  
  // Logging
  logLevel: isDevelopment ? 'debug' : isProduction ? 'error' : 'warn',
  
  // Caching
  cacheEnabled: !isTest,
  cacheTimeout: isDevelopment ? 60000 : 300000, // 1 min dev, 5 min prod
  
  // Error reporting
  errorReportingEnabled: isProduction,
  errorReportingUrl: process.env.NEXT_PUBLIC_ERROR_REPORTING_URL,
  
  // Analytics
  analyticsEnabled: isProduction,
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
};

// API endpoints
export const apiEndpoints = {
  vehicles: '/vehicles',
  vehicle: (id: string) => `/vehicles/${id}`,
  vehiclePosition: (id: string) => `/vehicles/${id}/position`,
  vehicleRoute: (id: string) => `/vehicles/${id}/route`,
  
  geofences: '/geofences',
  geofence: (id: string) => `/geofences/${id}`,
  
  alerts: '/alerts',
  alert: (id: string) => `/alerts/${id}`,
  acknowledgeAlert: (id: string) => `/alerts/${id}/acknowledge`,
  
  routes: '/routes',
  route: (id: string) => `/routes/${id}`,
  
  // WebSocket events
  websocket: {
    vehicleUpdate: 'vehicle_update',
    alert: 'alert',
    geofenceViolation: 'geofence_violation',
    routeUpdate: 'route_update',
  },
};

// Map styles
export const mapStyles = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  street: 'mapbox://styles/mapbox/streets-v12',
  outdoor: 'mapbox://styles/mapbox/outdoors-v12',
};

// Default map settings
export const defaultMapSettings = {
  center: [0, 0] as [number, number],
  zoom: 2,
  bearing: 0,
  pitch: 0,
  minZoom: 1,
  maxZoom: 20,
};

// Performance thresholds
export const performanceThresholds = {
  maxVehiclesWithoutClustering: 100,
  maxVehiclesWithClustering: 1000,
  updateIntervalMin: 1000, // 1 second
  updateIntervalMax: 60000, // 1 minute
  cacheSizeLimit: 1000,
  memoryWarningThreshold: 50 * 1024 * 1024, // 50MB
};

// Validation function
export function validateEnvironment(): boolean {
  const configValid = validateConfig(fleetTrackerConfig);
  
  if (!configValid) {
    console.error('Fleet Tracker configuration is invalid');
    return false;
  }
  
  // Check required environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    return false;
  }
  
  return true;
}

// Export configuration getter
export function getFleetTrackerConfig(): FleetTrackerConfig {
  return fleetTrackerConfig;
}

// Export feature flags getter
export function getFeatureFlags() {
  return featureFlags;
}

// Export environment settings getter
export function getEnvironmentSettings() {
  return environmentSettings;
}
