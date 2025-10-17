// Documentation: /docs/fleet-tracker/mock-data.md

/**
 * Fleet Tracker Mock Data Generators
 * 
 * Utility functions for generating realistic mock data for testing
 * and development purposes. Provides various scenarios and edge cases.
 */

import { Vehicle, Geofence, Route, Alert, GeofenceViolation } from '../types';

// Base coordinates for generating realistic locations
const BASE_COORDINATES = {
  // New York City area
  nyc: { lat: 40.7128, lng: -74.0060 },
  // Los Angeles area
  la: { lat: 34.0522, lng: -118.2437 },
  // Chicago area
  chicago: { lat: 41.8781, lng: -87.6298 },
  // Houston area
  houston: { lat: 29.7604, lng: -95.3698 },
};

// Vehicle types and their characteristics
const VEHICLE_TYPES = {
  truck: { maxSpeed: 80, fuelCapacity: 100, icon: '🚛' },
  van: { maxSpeed: 70, fuelCapacity: 60, icon: '🚐' },
  car: { maxSpeed: 120, fuelCapacity: 50, icon: '🚗' },
  motorcycle: { maxSpeed: 150, fuelCapacity: 20, icon: '🏍️' },
};

// Driver names for realistic data
const DRIVER_NAMES = [
  'John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Wilson',
  'David Brown', 'Emma Taylor', 'James Anderson', 'Maria Garcia',
  'Robert Miller', 'Jennifer Lee', 'William Jones', 'Amanda White',
  'Christopher Moore', 'Jessica Thompson', 'Daniel Clark', 'Ashley Lewis',
];

// Vehicle statuses with realistic probabilities
const VEHICLE_STATUSES = [
  { status: 'active', probability: 0.7 },
  { status: 'inactive', probability: 0.1 },
  { status: 'maintenance', probability: 0.15 },
  { status: 'offline', probability: 0.05 },
];

// Generate random vehicle
export function generateMockVehicle(
  id?: string,
  baseLocation: keyof typeof BASE_COORDINATES = 'nyc',
  vehicleType: keyof typeof VEHICLE_TYPES = 'truck'
): Vehicle {
  const vehicleId = id || `vehicle_${Math.random().toString(36).substr(2, 9)}`;
  const base = BASE_COORDINATES[baseLocation];
  const typeConfig = VEHICLE_TYPES[vehicleType];
  
  // Generate random position within 50km of base location
  const latOffset = (Math.random() - 0.5) * 0.5; // ~50km
  const lngOffset = (Math.random() - 0.5) * 0.5;
  
  const status = getWeightedRandomStatus();
  const isActive = status === 'active';
  
  return {
    id: vehicleId,
    name: `${vehicleType.toUpperCase()}-${vehicleId.slice(-4)}`,
    licensePlate: generateLicensePlate(),
    driver: {
      id: `driver_${Math.random().toString(36).substr(2, 9)}`,
      name: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
      phone: generatePhoneNumber(),
    },
    position: {
      lat: base.lat + latOffset,
      lng: base.lng + lngOffset,
      accuracy: Math.random() * 10 + 5, // 5-15 meters
      heading: Math.random() * 360,
      speed: isActive ? Math.random() * typeConfig.maxSpeed : 0,
      timestamp: new Date(Date.now() - Math.random() * 300000), // Within last 5 minutes
    },
    status,
    vehicleType,
    fuelLevel: Math.random() * 100,
    odometer: Math.floor(Math.random() * 500000) + 10000,
    lastUpdate: new Date(),
  };
}

// Generate multiple vehicles
export function generateMockVehicles(
  count: number,
  baseLocation: keyof typeof BASE_COORDINATES = 'nyc'
): Vehicle[] {
  const vehicles: Vehicle[] = [];
  const types = Object.keys(VEHICLE_TYPES) as (keyof typeof VEHICLE_TYPES)[];
  
  for (let i = 0; i < count; i++) {
    const vehicleType = types[Math.floor(Math.random() * types.length)];
    vehicles.push(generateMockVehicle(undefined, baseLocation, vehicleType));
  }
  
  return vehicles;
}

// Generate mock geofence
export function generateMockGeofence(
  id?: string,
  center?: { lat: number; lng: number },
  type: 'Polygon' | 'Circle' = 'Polygon'
): Geofence {
  const geofenceId = id || `geofence_${Math.random().toString(36).substr(2, 9)}`;
  const base = center || BASE_COORDINATES.nyc;
  
  let geometry;
  if (type === 'Circle') {
    geometry = {
      type: 'Circle' as const,
      coordinates: [],
      radius: Math.random() * 5000 + 1000, // 1-6km radius
    };
  } else {
    // Generate polygon coordinates
    const radius = Math.random() * 0.01 + 0.005; // ~500m to 1.5km
    const sides = 6 + Math.floor(Math.random() * 4); // 6-9 sides
    const coordinates: number[][] = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      const lat = base.lat + radius * Math.cos(angle);
      const lng = base.lng + radius * Math.sin(angle);
      coordinates.push([lat, lng]);
    }
    
    geometry = {
      type: 'Polygon' as const,
      coordinates,
    };
  }
  
  return {
    id: geofenceId,
    name: `Geofence ${geofenceId.slice(-4)}`,
    type: Math.random() > 0.5 ? 'inclusion' : 'exclusion',
    geometry,
    rules: {
      enterAlert: Math.random() > 0.3,
      exitAlert: Math.random() > 0.3,
      speedLimit: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 30 : undefined,
    },
    color: generateRandomColor(),
    isActive: Math.random() > 0.2,
  };
}

// Generate mock route
export function generateMockRoute(
  vehicleId: string,
  waypointCount: number = 10
): Route {
  const routeId = `route_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = new Date(Date.now() - Math.random() * 86400000); // Within last 24 hours
  
  const waypoints = [];
  let currentLat = BASE_COORDINATES.nyc.lat;
  let currentLng = BASE_COORDINATES.nyc.lng;
  
  for (let i = 0; i < waypointCount; i++) {
    // Move in random direction
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
    
    currentLat += latOffset;
    currentLng += lngOffset;
    
    waypoints.push({
      lat: currentLat,
      lng: currentLng,
      timestamp: new Date(startTime.getTime() + i * 300000), // 5 minutes apart
      speed: Math.random() * 60 + 20, // 20-80 km/h
      heading: Math.random() * 360,
    });
  }
  
  const endTime = new Date(startTime.getTime() + waypointCount * 300000);
  const totalDistance = calculateRouteDistance(waypoints);
  
  return {
    id: routeId,
    vehicleId,
    startTime,
    endTime,
    waypoints,
    distance: totalDistance,
    duration: (endTime.getTime() - startTime.getTime()) / 1000,
    status: Math.random() > 0.1 ? 'completed' : 'active',
  };
}

// Generate mock alert
export function generateMockAlert(
  vehicleId: string,
  type?: Alert['type']
): Alert {
  const alertId = `alert_${Math.random().toString(36).substr(2, 9)}`;
  const alertTypes: Alert['type'][] = [
    'geofence_enter', 'geofence_exit', 'speed_violation', 'offline', 'maintenance'
  ];
  
  const alertType = type || alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  const messages = {
    geofence_enter: 'Vehicle entered restricted area',
    geofence_exit: 'Vehicle exited allowed zone',
    speed_violation: 'Vehicle exceeded speed limit',
    offline: 'Vehicle is offline',
    maintenance: 'Vehicle requires maintenance',
  };
  
  return {
    id: alertId,
    type: alertType,
    vehicleId,
    geofenceId: alertType.includes('geofence') ? `geofence_${Math.random().toString(36).substr(2, 9)}` : undefined,
    message: messages[alertType],
    severity,
    timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
    acknowledged: Math.random() > 0.3,
    acknowledgedBy: Math.random() > 0.5 ? 'admin' : undefined,
  };
}

// Generate mock geofence violation
export function generateMockGeofenceViolation(
  vehicleId: string,
  geofenceId: string
): GeofenceViolation {
  const violationId = `violation_${Math.random().toString(36).substr(2, 9)}`;
  const base = BASE_COORDINATES.nyc;
  
  return {
    id: violationId,
    vehicleId,
    geofenceId,
    type: Math.random() > 0.5 ? 'enter' : 'exit',
    timestamp: new Date(Date.now() - Math.random() * 1800000), // Within last 30 minutes
    position: {
      lat: base.lat + (Math.random() - 0.5) * 0.01,
      lng: base.lng + (Math.random() - 0.5) * 0.01,
    },
    speed: Math.random() * 80 + 20,
  };
}

// Generate realistic fleet scenario
export function generateFleetScenario(
  vehicleCount: number = 20,
  geofenceCount: number = 5,
  alertCount: number = 8
): {
  vehicles: Vehicle[];
  geofences: Geofence[];
  alerts: Alert[];
  routes: Route[];
} {
  const vehicles = generateMockVehicles(vehicleCount);
  const geofences: Geofence[] = [];
  const alerts: Alert[] = [];
  const routes: Route[] = [];
  
  // Generate geofences
  for (let i = 0; i < geofenceCount; i++) {
    const location = Object.keys(BASE_COORDINATES)[Math.floor(Math.random() * Object.keys(BASE_COORDINATES).length)] as keyof typeof BASE_COORDINATES;
    geofences.push(generateMockGeofence(undefined, BASE_COORDINATES[location]));
  }
  
  // Generate alerts
  for (let i = 0; i < alertCount; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    alerts.push(generateMockAlert(vehicle.id));
  }
  
  // Generate routes for some vehicles
  const routeCount = Math.floor(vehicleCount * 0.3); // 30% of vehicles have routes
  for (let i = 0; i < routeCount; i++) {
    const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    routes.push(generateMockRoute(vehicle.id, Math.floor(Math.random() * 20) + 5));
  }
  
  return {
    vehicles,
    geofences,
    alerts,
    routes,
  };
}

// Utility functions
function getWeightedRandomStatus(): Vehicle['status'] {
  const random = Math.random();
  let cumulative = 0;
  
  for (const { status, probability } of VEHICLE_STATUSES) {
    cumulative += probability;
    if (random <= cumulative) {
      return status;
    }
  }
  
  return 'active';
}

function generateLicensePlate(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let plate = '';
  for (let i = 0; i < 3; i++) {
    plate += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 3; i++) {
    plate += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return plate;
}

function generatePhoneNumber(): string {
  const areaCode = Math.floor(Math.random() * 800) + 200; // 200-999
  const exchange = Math.floor(Math.random() * 800) + 200; // 200-999
  const number = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `(${areaCode}) ${exchange}-${number}`;
}

function generateRandomColor(): string {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

function calculateRouteDistance(waypoints: any[]): number {
  let totalDistance = 0;
  
  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const curr = waypoints[i];
    
    const distance = calculateHaversineDistance(
      prev.lat,
      prev.lng,
      curr.lat,
      curr.lng
    );
    
    totalDistance += distance;
  }
  
  return totalDistance;
}

function calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
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
