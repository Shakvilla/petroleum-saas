// Documentation: /docs/fleet-tracker/types.md

/**
 * Fleet Tracker Type Definitions
 * 
 * Core type definitions for the Fleet Tracker component system.
 * These types define the data models and interfaces used throughout
 * the fleet tracking functionality.
 */

// Vehicle Data Model
export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  driver: {
    id: string;
    name: string;
    phone?: string;
  };
  position: {
    lat: number;
    lng: number;
    accuracy: number;
    heading: number;
    speed: number;
    timestamp: Date;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
  vehicleType: 'truck' | 'van' | 'car' | 'motorcycle';
  fuelLevel?: number;
  odometer?: number;
  lastUpdate: Date;
}

// Geofence Model
export interface Geofence {
  id: string;
  name: string;
  type: 'inclusion' | 'exclusion';
  geometry: {
    type: 'Polygon' | 'Circle';
    coordinates: number[][];
    radius?: number; // for circles
  };
  rules: {
    enterAlert: boolean;
    exitAlert: boolean;
    speedLimit?: number;
  };
  color: string;
  isActive: boolean;
}

// Route Data Model
export interface Route {
  id: string;
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
  waypoints: {
    lat: number;
    lng: number;
    timestamp: Date;
    speed: number;
    heading: number;
  }[];
  distance: number;
  duration: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

// Alert Model
export interface Alert {
  id: string;
  type: 'geofence_enter' | 'geofence_exit' | 'speed_violation' | 'offline' | 'maintenance';
  vehicleId: string;
  geofenceId?: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

// Geofence Violation Model
export interface GeofenceViolation {
  id: string;
  vehicleId: string;
  geofenceId: string;
  type: 'enter' | 'exit';
  timestamp: Date;
  position: {
    lat: number;
    lng: number;
  };
  speed?: number;
}

// Map Viewport State
export interface MapViewport {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
}

// Vehicle Filters
export interface VehicleFilters {
  status: string[];
  type: string[];
  driver: string[];
  search: string;
}

// Fleet Tracker State
export interface FleetTrackerState {
  // Map State
  map: any | null; // MapboxMap | null
  viewport: MapViewport;
  
  // Vehicle State
  vehicles: Map<string, Vehicle>;
  selectedVehicle: string | null;
  vehicleFilters: VehicleFilters;
  
  // Geofence State
  geofences: Map<string, Geofence>;
  activeGeofences: Set<string>;
  
  // Alert State
  alerts: Alert[];
  unreadAlerts: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  activePanel: 'vehicles' | 'alerts' | 'geofences' | 'routes';
}

// Component Props Interface
export interface FleetTrackerProps {
  // Core Configuration
  apiEndpoint: string;
  websocketUrl: string;
  mapboxAccessToken: string;
  
  // Display Options
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  mapStyle?: 'light' | 'dark' | 'satellite' | 'street';
  
  // Feature Toggles
  features?: {
    geofencing: boolean;
    routeHistory: boolean;
    realTimeUpdates: boolean;
    alerts: boolean;
    vehicleDetails: boolean;
  };
  
  // Styling
  className?: string;
  height?: string | number;
  theme?: 'light' | 'dark' | 'auto';
  
  // Event Handlers
  onVehicleSelect?: (vehicle: Vehicle) => void;
  onAlertTrigger?: (alert: Alert) => void;
  onGeofenceViolation?: (violation: GeofenceViolation) => void;
  
  // Data Sources
  vehicles?: Vehicle[];
  geofences?: Geofence[];
  routes?: Route[];
  
  // Performance Options
  updateInterval?: number; // milliseconds
  maxVehicles?: number;
  enableClustering?: boolean;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'vehicle_update' | 'alert' | 'geofence_violation' | 'route_update';
  data: any;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// Error Types
export interface FleetTrackerError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Configuration Types
export interface FleetTrackerConfig {
  mapbox: {
    accessToken: string;
    style: string;
  };
  websocket: {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  performance: {
    updateInterval: number;
    maxVehicles: number;
    enableClustering: boolean;
  };
}

// Utility Types
export type VehicleStatus = Vehicle['status'];
export type VehicleType = Vehicle['vehicleType'];
export type AlertType = Alert['type'];
export type AlertSeverity = Alert['severity'];
export type GeofenceType = Geofence['type'];
export type RouteStatus = Route['status'];

// Event Handler Types
export type VehicleSelectHandler = (vehicle: Vehicle) => void;
export type AlertTriggerHandler = (alert: Alert) => void;
export type GeofenceViolationHandler = (violation: GeofenceViolation) => void;
export type MapViewportChangeHandler = (viewport: MapViewport) => void;

// Hook Return Types
export interface UseFleetTrackerReturn {
  vehicles: Map<string, Vehicle>;
  selectedVehicle: Vehicle | null;
  alerts: Alert[];
  isLoading: boolean;
  error: string | null;
  selectVehicle: (vehicleId: string) => void;
  clearSelection: () => void;
  acknowledgeAlert: (alertId: string) => void;
  refreshData: () => Promise<void>;
}

// Component State Types
export interface MapContainerState {
  map: any | null;
  isLoaded: boolean;
  error: string | null;
}

export interface VehicleMarkersState {
  markers: Map<string, any>;
  clusters: any[];
  isUpdating: boolean;
}

export interface AlertsPanelState {
  alerts: Alert[];
  unreadCount: number;
  isExpanded: boolean;
  filter: {
    severity: AlertSeverity[];
    type: AlertType[];
    acknowledged: boolean | null;
  };
}
