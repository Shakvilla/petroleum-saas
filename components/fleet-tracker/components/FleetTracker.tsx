// Documentation: /docs/fleet-tracker/components/FleetTracker.md

/**
 * Fleet Tracker Main Component
 * 
 * The main Fleet Tracker component that orchestrates all sub-components
 * and provides the complete fleet tracking functionality.
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FleetTrackerProps, Vehicle, Geofence, MapViewport } from '../types';
import { cn } from '@/lib/utils';
import MapContainer from './MapContainer';
import VehicleMarkers from './VehicleMarkers';
import GeofenceOverlay from './GeofenceOverlay';
import { useFleetData } from '../hooks/useFleetData';
import { useFleetAlerts } from '../hooks/useFleetAlerts';
import { useGeofenceMonitoring } from '../hooks/useGeofenceMonitoring';

// Main Fleet Tracker component with full map integration
const FleetTracker: React.FC<FleetTrackerProps> = ({
  apiEndpoint,
  websocketUrl,
  mapboxAccessToken,
  initialCenter = { lat: 40.7128, lng: -74.0060 },
  initialZoom = 10,
  mapStyle = 'light',
  features = {
    geofencing: true,
    routeHistory: true,
    realTimeUpdates: true,
    alerts: true,
    vehicleDetails: true,
  },
  className,
  height = '100vh',
  theme = 'auto',
  onVehicleSelect,
  onAlertTrigger,
  onGeofenceViolation,
  vehicles = [],
  geofences = [],
  routes = [],
  updateInterval = 5000,
  maxVehicles = 1000,
  enableClustering = true,
}) => {
  // State management
  const [mapViewport, setMapViewport] = useState<MapViewport>({
    center: [initialCenter.lng, initialCenter.lat],
    zoom: initialZoom,
    bearing: 0,
    pitch: 0,
  });
  const mapRef = useRef<any>(null);

  // Custom hooks for data management
  const fleetData = useFleetData({
    websocketUrl,
    apiEndpoint,
    updateInterval,
    maxVehicles,
    enableOfflineMode: true,
    enableAlerts: features.alerts,
    enableGeofencing: features.geofencing,
  });

  const alerts = useFleetAlerts({
    enableNotifications: true,
    enableSound: true,
    maxAlerts: 1000,
    autoMarkAsRead: false,
    autoMarkAsReadDelay: 30000,
  });

  const geofenceMonitoring = useGeofenceMonitoring({
    enableViolationDetection: features.geofencing,
    violationThreshold: 10,
    enableAlerts: features.alerts,
    enableNotifications: true,
    checkInterval: updateInterval,
  });

  // Start geofence monitoring when data is available
  useEffect(() => {
    if (fleetData.vehicles.length > 0 && fleetData.geofences.length > 0) {
      geofenceMonitoring.startMonitoring();
      
      // Check for violations
      const violations = geofenceMonitoring.checkViolations(fleetData.vehicles, fleetData.geofences);
      violations.forEach(violation => {
        geofenceMonitoring.addViolation(violation);
      });
    }
  }, [fleetData.vehicles, fleetData.geofences, geofenceMonitoring]);

  // Handle alert events
  useEffect(() => {
    const handleAlert = (event: CustomEvent) => {
      const alert = event.detail;
      alerts.addAlert(alert);
    };

    window.addEventListener('fleet-alert', handleAlert as EventListener);
    return () => {
      window.removeEventListener('fleet-alert', handleAlert as EventListener);
    };
  }, [alerts]);

  // Handle vehicle selection
  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    fleetData.selectVehicle(vehicle.id);
    onVehicleSelect?.(vehicle);
  }, [fleetData, onVehicleSelect]);

  // Handle geofence selection
  const handleGeofenceClick = useCallback((geofence: Geofence) => {
    fleetData.selectGeofence(geofence.id);
  }, [fleetData]);

  // Handle map load
  const handleMapLoad = useCallback((map: any) => {
    mapRef.current = map;
  }, []);

  // Handle viewport changes
  const handleViewportChange = useCallback((viewport: MapViewport) => {
    setMapViewport(viewport);
  }, []);

  // Handle vehicle hover
  const handleVehicleHover = useCallback((vehicle: Vehicle | null) => {
    // Could show tooltip or highlight vehicle
  }, []);

  // Handle geofence hover
  const handleGeofenceHover = useCallback((geofence: Geofence | null) => {
    // Could show tooltip or highlight geofence
  }, []);

  // Validate required props
  if (!apiEndpoint || !websocketUrl || !mapboxAccessToken) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Configuration Error
          </h3>
          <p className="text-gray-600">
            Missing required configuration. Please provide API endpoint, WebSocket URL, and Mapbox access token.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fleet-tracker-container relative bg-white rounded-lg shadow-sm border border-gray-200',
        className
      )}
      style={{ height }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fleet Tracker</h2>
          <p className="text-sm text-gray-600">
            Real-time vehicle tracking and monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              fleetData.isConnected ? 'bg-green-500' : 'bg-red-500'
            )}></div>
            <span className="text-sm text-gray-600">
              {fleetData.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {/* Vehicle Count */}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {fleetData.vehicles.length} vehicles
            </span>
          </div>
          
          {/* Geofence Count */}
          {features.geofencing && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {fleetData.geofences.length} geofences
              </span>
            </div>
          )}

          {/* Alert Count */}
          {features.alerts && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {alerts.stats.unread} alerts
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* Map Container */}
        <MapContainer
          accessToken={mapboxAccessToken}
          initialCenter={[initialCenter.lng, initialCenter.lat]}
          initialZoom={initialZoom}
          mapStyle={`mapbox://styles/mapbox/${mapStyle === 'light' ? 'light-v11' : 'dark-v11'}`}
          vehicles={fleetData.vehicles}
          geofences={features.geofencing ? fleetData.geofences : []}
          onMapLoad={handleMapLoad}
          onViewportChange={handleViewportChange}
          onVehicleClick={handleVehicleClick}
          onGeofenceClick={handleGeofenceClick}
          enableControls={true}
          enableClustering={enableClustering}
          enableGeofences={features.geofencing}
          className="absolute inset-0"
          height="100%"
        />

        {/* Vehicle Markers */}
        <VehicleMarkers
          map={mapRef.current}
          vehicles={fleetData.vehicles}
          selectedVehicleId={fleetData.selectedVehicleId}
          enableClustering={enableClustering}
          onVehicleClick={handleVehicleClick}
          onVehicleHover={handleVehicleHover}
        />

        {/* Geofence Overlay */}
        {features.geofencing && (
          <GeofenceOverlay
            map={mapRef.current}
            geofences={fleetData.geofences}
            selectedGeofenceId={fleetData.selectedGeofenceId}
            onGeofenceClick={handleGeofenceClick}
            onGeofenceHover={handleGeofenceHover}
          />
        )}

        {/* Vehicle Information Sidebar */}
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Vehicle Information</h4>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <p>Total Vehicles: {fleetData.vehicles.length}</p>
              {features.geofencing && <p>Geofences: {fleetData.geofences.length}</p>}
              {features.routeHistory && <p>Routes: {routes.length}</p>}
              {features.alerts && <p>Alerts: {alerts.stats.unread} unread</p>}
            </div>
            
            {/* Selected Vehicle Details */}
            {fleetData.selectedVehicleId && (
              <div className="pt-2 border-t border-gray-200">
                {(() => {
                  const vehicle = fleetData.vehicles.find(v => v.id === fleetData.selectedVehicleId);
                  return vehicle ? (
                    <div className="space-y-1">
                      <h5 className="font-medium text-gray-900">{vehicle.name}</h5>
                      <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                      <p className="text-sm text-gray-600">Driver: {vehicle.driver.name}</p>
                      <p className="text-sm text-gray-600">Status: {vehicle.status}</p>
                      <p className="text-sm text-gray-600">
                        Speed: {vehicle.position.speed > 0 ? `${vehicle.position.speed.toFixed(1)} km/h` : 'Stationary'}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
            
            {/* Connection Error */}
            {fleetData.error && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-red-600">
                  Error: {fleetData.error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Fleet Tracker v1.0.0</span>
          <div className="flex items-center space-x-4">
            <span>Update interval: {updateInterval}ms</span>
            <span>Zoom: {mapViewport.zoom.toFixed(1)}</span>
            <span>
              Center: {mapViewport.center[1].toFixed(4)}, {mapViewport.center[0].toFixed(4)}
            </span>
            {fleetData.lastUpdate && (
              <span>Last update: {fleetData.lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetTracker;
