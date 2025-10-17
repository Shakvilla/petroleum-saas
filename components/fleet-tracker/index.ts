// Documentation: /docs/fleet-tracker/index.md

/**
 * Fleet Tracker Component Exports
 * 
 * Main entry point for the Fleet Tracker component system.
 * Exports all public interfaces, components, and utilities.
 */

// Main component
export { default as FleetTracker } from './components/FleetTracker';

// Map Components
export { default as MapContainer } from './components/MapContainer';
export { default as VehicleMarkers } from './components/VehicleMarkers';
export { default as GeofenceOverlay } from './components/GeofenceOverlay';

// Custom Hooks
export { useFleetData } from './hooks/useFleetData';
export { useFleetAlerts } from './hooks/useFleetAlerts';
export { useGeofenceMonitoring } from './hooks/useGeofenceMonitoring';

// Type definitions
export type {
  Vehicle,
  Geofence,
  Route,
  Alert,
  GeofenceViolation,
  MapViewport,
  VehicleFilters,
  FleetTrackerState,
  FleetTrackerProps,
  WebSocketMessage,
  ApiResponse,
  FleetTrackerError,
  FleetTrackerConfig,
  VehicleStatus,
  VehicleType,
  AlertType,
  AlertSeverity,
  GeofenceType,
  RouteStatus,
  VehicleSelectHandler,
  AlertTriggerHandler,
  GeofenceViolationHandler,
  MapViewportChangeHandler,
  UseFleetTrackerReturn,
  MapContainerState,
  VehicleMarkersState,
  AlertsPanelState,
} from './types';

// Utility functions
export {
  // Validation
  isValidCoordinate,
  validateVehicle,
  validateGeofence,
  validateRoute,
  validateAlert,
  validateGeofenceViolation,
  sanitizeVehicle,
  sanitizeGeofence,
  ValidationError,
  createValidationError,
  validateVehicles,
  validateGeofences,
} from './utils/validation';

export {
  // Transformers
  transformApiResponse,
  transformVehicleFromApi,
  transformGeofenceFromApi,
  transformRouteFromApi,
  transformAlertFromApi,
  transformWebSocketMessage,
  transformVehicleUpdateMessage,
  transformAlertMessage,
  transformGeofenceViolationMessage,
  normalizeVehicleData,
  normalizeGeofenceData,
  convertCoordinatesToGeoJSON,
  convertGeoJSONToCoordinates,
  groupWaypointsByTime,
  calculateRouteStatistics,
  transformVehiclesFromApi,
  transformGeofencesFromApi,
  transformRoutesFromApi,
  transformAlertsFromApi,
} from './utils/transformers';

export {
  // Mock data generators
  generateMockVehicle,
  generateMockVehicles,
  generateMockGeofence,
  generateMockRoute,
  generateMockAlert,
  generateMockGeofenceViolation,
  generateFleetScenario,
} from './utils/mock-data';

// Configuration
export {
  fleetTrackerConfig,
  validateConfig,
  featureFlags,
  environmentSettings,
  apiEndpoints,
  mapStyles,
  defaultMapSettings,
  performanceThresholds,
  validateEnvironment,
  getFleetTrackerConfig,
  getFeatureFlags,
  getEnvironmentSettings,
} from '../../../lib/fleet-tracker/config';

// Hooks (will be created in later tasks)
// export { useFleetTracker } from './hooks/use-fleet-tracker';
// export { useWebSocket } from './hooks/use-websocket';
// export { useVehicleData } from './hooks/use-vehicle-data';

// Stores (will be created in later tasks)
// export { useFleetTrackerStore } from './stores/fleet-tracker-store';

// Components (will be created in later tasks)
// export { MapContainer } from './components/MapContainer';
// export { VehicleMarkers } from './components/VehicleMarkers';
// export { GeofenceOverlay } from './components/GeofenceOverlay';
// export { VehicleInfoPanel } from './components/VehicleInfoPanel';
// export { AlertsPanel } from './components/AlertsPanel';
// export { ControlsPanel } from './components/ControlsPanel';

// Constants
export const FLEET_TRACKER_VERSION = '1.0.0';
export const FLEET_TRACKER_NAME = 'Fleet Tracker';

// Default configuration
export const DEFAULT_FLEET_TRACKER_PROPS = {
  apiEndpoint: 'http://localhost:3000/api',
  websocketUrl: 'ws://localhost:3001',
  mapboxAccessToken: '',
  initialCenter: { lat: 40.7128, lng: -74.0060 },
  initialZoom: 10,
  mapStyle: 'light' as const,
  features: {
    geofencing: true,
    routeHistory: true,
    realTimeUpdates: true,
    alerts: true,
    vehicleDetails: true,
  },
  className: '',
  height: '100vh',
  theme: 'auto' as const,
  updateInterval: 5000,
  maxVehicles: 1000,
  enableClustering: true,
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_VEHICLE_DATA: 'Invalid vehicle data provided',
  INVALID_GEOFENCE_DATA: 'Invalid geofence data provided',
  INVALID_ROUTE_DATA: 'Invalid route data provided',
  INVALID_ALERT_DATA: 'Invalid alert data provided',
  WEBSOCKET_CONNECTION_FAILED: 'Failed to connect to WebSocket server',
  MAP_INITIALIZATION_FAILED: 'Failed to initialize map',
  API_REQUEST_FAILED: 'API request failed',
  INVALID_COORDINATES: 'Invalid coordinates provided',
  MISSING_REQUIRED_PROPS: 'Missing required props',
  CONFIGURATION_ERROR: 'Configuration error',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  VEHICLE_UPDATED: 'Vehicle updated successfully',
  GEOFENCE_CREATED: 'Geofence created successfully',
  ALERT_ACKNOWLEDGED: 'Alert acknowledged successfully',
  ROUTE_LOADED: 'Route loaded successfully',
  WEBSOCKET_CONNECTED: 'WebSocket connected successfully',
  MAP_LOADED: 'Map loaded successfully',
} as const;
