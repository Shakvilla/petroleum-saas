// Documentation: /docs/fleet-tracker/transformers.md

/**
 * Fleet Tracker Data Transformation Utilities
 * 
 * Functions for transforming data between different formats and structures.
 * Handles API responses, WebSocket messages, and data normalization.
 */

import { Vehicle, Geofence, Route, Alert, GeofenceViolation, WebSocketMessage, ApiResponse } from '../types';

// API Response Transformers
export function transformApiResponse<T>(response: any): ApiResponse<T> {
  return {
    success: Boolean(response.success),
    data: response.data,
    error: response.error || null,
    timestamp: new Date(response.timestamp || Date.now()),
  };
}

export function transformVehicleFromApi(apiVehicle: any): Vehicle {
  return {
    id: String(apiVehicle.id),
    name: String(apiVehicle.name || apiVehicle.vehicle_name),
    licensePlate: String(apiVehicle.license_plate || apiVehicle.licensePlate),
    driver: {
      id: String(apiVehicle.driver?.id || apiVehicle.driver_id),
      name: String(apiVehicle.driver?.name || apiVehicle.driver_name),
      phone: apiVehicle.driver?.phone || apiVehicle.driver_phone,
    },
    position: {
      lat: Number(apiVehicle.position?.lat || apiVehicle.latitude),
      lng: Number(apiVehicle.position?.lng || apiVehicle.longitude),
      accuracy: Number(apiVehicle.position?.accuracy || apiVehicle.accuracy || 0),
      heading: Number(apiVehicle.position?.heading || apiVehicle.heading || 0),
      speed: Number(apiVehicle.position?.speed || apiVehicle.speed || 0),
      timestamp: new Date(apiVehicle.position?.timestamp || apiVehicle.timestamp),
    },
    status: apiVehicle.status || 'offline',
    vehicleType: apiVehicle.vehicle_type || apiVehicle.type || 'truck',
    fuelLevel: apiVehicle.fuel_level ? Number(apiVehicle.fuel_level) : undefined,
    odometer: apiVehicle.odometer ? Number(apiVehicle.odometer) : undefined,
    lastUpdate: new Date(apiVehicle.last_update || apiVehicle.updated_at),
  };
}

export function transformGeofenceFromApi(apiGeofence: any): Geofence {
  return {
    id: String(apiGeofence.id),
    name: String(apiGeofence.name),
    type: apiGeofence.type || 'inclusion',
    geometry: {
      type: apiGeofence.geometry?.type || 'Polygon',
      coordinates: apiGeofence.geometry?.coordinates || apiGeofence.coordinates || [],
      radius: apiGeofence.geometry?.radius || apiGeofence.radius,
    },
    rules: {
      enterAlert: Boolean(apiGeofence.rules?.enter_alert || apiGeofence.enter_alert),
      exitAlert: Boolean(apiGeofence.rules?.exit_alert || apiGeofence.exit_alert),
      speedLimit: apiGeofence.rules?.speed_limit || apiGeofence.speed_limit,
    },
    color: String(apiGeofence.color || '#3b82f6'),
    isActive: Boolean(apiGeofence.is_active !== false),
  };
}

export function transformRouteFromApi(apiRoute: any): Route {
  return {
    id: String(apiRoute.id),
    vehicleId: String(apiRoute.vehicle_id),
    startTime: new Date(apiRoute.start_time),
    endTime: apiRoute.end_time ? new Date(apiRoute.end_time) : undefined,
    waypoints: (apiRoute.waypoints || []).map((waypoint: any) => ({
      lat: Number(waypoint.lat || waypoint.latitude),
      lng: Number(waypoint.lng || waypoint.longitude),
      timestamp: new Date(waypoint.timestamp),
      speed: Number(waypoint.speed || 0),
      heading: Number(waypoint.heading || 0),
    })),
    distance: Number(apiRoute.distance || 0),
    duration: Number(apiRoute.duration || 0),
    status: apiRoute.status || 'planned',
  };
}

export function transformAlertFromApi(apiAlert: any): Alert {
  return {
    id: String(apiAlert.id),
    type: apiAlert.type || 'offline',
    vehicleId: String(apiAlert.vehicle_id),
    geofenceId: apiAlert.geofence_id ? String(apiAlert.geofence_id) : undefined,
    message: String(apiAlert.message),
    severity: apiAlert.severity || 'medium',
    timestamp: new Date(apiAlert.timestamp || apiAlert.created_at),
    acknowledged: Boolean(apiAlert.acknowledged),
    acknowledgedBy: apiAlert.acknowledged_by ? String(apiAlert.acknowledged_by) : undefined,
  };
}

// WebSocket Message Transformers
export function transformWebSocketMessage(message: any): WebSocketMessage {
  return {
    type: message.type || 'vehicle_update',
    data: message.data || message,
    timestamp: new Date(message.timestamp || Date.now()),
  };
}

export function transformVehicleUpdateMessage(message: any): Vehicle {
  const data = message.data || message;
  return transformVehicleFromApi(data);
}

export function transformAlertMessage(message: any): Alert {
  const data = message.data || message;
  return transformAlertFromApi(data);
}

export function transformGeofenceViolationMessage(message: any): GeofenceViolation {
  const data = message.data || message;
  return {
    id: String(data.id || `violation_${Date.now()}`),
    vehicleId: String(data.vehicle_id),
    geofenceId: String(data.geofence_id),
    type: data.type || 'enter',
    timestamp: new Date(data.timestamp || Date.now()),
    position: {
      lat: Number(data.position?.lat || data.latitude),
      lng: Number(data.position?.lng || data.longitude),
    },
    speed: data.speed ? Number(data.speed) : undefined,
  };
}

// Data Normalization
export function normalizeVehicleData(vehicle: any): Vehicle {
  // Handle different API response formats
  if (vehicle.position) {
    return vehicle;
  }

  // Transform flat structure to nested structure
  return {
    ...vehicle,
    position: {
      lat: vehicle.lat || vehicle.latitude,
      lng: vehicle.lng || vehicle.longitude,
      accuracy: vehicle.accuracy || 0,
      heading: vehicle.heading || 0,
      speed: vehicle.speed || 0,
      timestamp: new Date(vehicle.timestamp || vehicle.updated_at),
    },
  };
}

export function normalizeGeofenceData(geofence: any): Geofence {
  // Handle different coordinate formats
  if (geofence.coordinates && !geofence.geometry) {
    return {
      ...geofence,
      geometry: {
        type: 'Polygon',
        coordinates: geofence.coordinates,
      },
    };
  }

  return geofence;
}

// Coordinate Transformations
export function convertCoordinatesToGeoJSON(coordinates: number[][]): any {
  return {
    type: 'FeatureCollection',
    features: coordinates.map((coord, index) => ({
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: [coord[1], coord[0]], // GeoJSON uses [lng, lat]
      },
      properties: {
        index,
      },
    })),
  };
}

export function convertGeoJSONToCoordinates(geoJson: any): number[][] {
  if (!geoJson.features) {
    return [];
  }

  return geoJson.features.map((feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    return [lat, lng]; // Convert back to [lat, lng]
  });
}

// Time-based Transformations
export function groupWaypointsByTime(waypoints: any[], intervalMinutes: number = 5): any[][] {
  if (!waypoints.length) return [];

  const groups: any[][] = [];
  let currentGroup: any[] = [waypoints[0]];
  let lastTime = new Date(waypoints[0].timestamp).getTime();

  for (let i = 1; i < waypoints.length; i++) {
    const currentTime = new Date(waypoints[i].timestamp).getTime();
    const timeDiff = (currentTime - lastTime) / (1000 * 60); // Convert to minutes

    if (timeDiff <= intervalMinutes) {
      currentGroup.push(waypoints[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [waypoints[i]];
    }

    lastTime = currentTime;
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

export function calculateRouteStatistics(waypoints: any[]): {
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  totalDuration: number;
} {
  if (!waypoints.length) {
    return {
      totalDistance: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      totalDuration: 0,
    };
  }

  let totalDistance = 0;
  let totalSpeed = 0;
  let maxSpeed = 0;
  const startTime = new Date(waypoints[0].timestamp).getTime();
  const endTime = new Date(waypoints[waypoints.length - 1].timestamp).getTime();

  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    
    // Calculate distance using Haversine formula (simplified)
    const distance = calculateDistance(
      prev.lat,
      prev.lng,
      curr.lat,
      curr.lng
    );
    
    totalDistance += distance;
    totalSpeed += curr.speed || 0;
    maxSpeed = Math.max(maxSpeed, curr.speed || 0);
  }

  const totalDuration = (endTime - startTime) / 1000; // Convert to seconds
  const averageSpeed = waypoints.length > 1 ? totalSpeed / (waypoints.length - 1) : 0;

  return {
    totalDistance,
    averageSpeed,
    maxSpeed,
    totalDuration,
  };
}

// Utility function for distance calculation
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Batch Transformers
export function transformVehiclesFromApi(apiVehicles: any[]): Vehicle[] {
  return apiVehicles.map(transformVehicleFromApi);
}

export function transformGeofencesFromApi(apiGeofences: any[]): Geofence[] {
  return apiGeofences.map(transformGeofenceFromApi);
}

export function transformRoutesFromApi(apiRoutes: any[]): Route[] {
  return apiRoutes.map(transformRouteFromApi);
}

export function transformAlertsFromApi(apiAlerts: any[]): Alert[] {
  return apiAlerts.map(transformAlertFromApi);
}
