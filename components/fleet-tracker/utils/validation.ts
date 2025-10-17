// Documentation: /docs/fleet-tracker/validation.md

/**
 * Fleet Tracker Data Validation Utilities
 * 
 * Comprehensive validation functions for fleet tracking data models.
 * Ensures data integrity and prevents malformed data from causing issues.
 */

import { Vehicle, Geofence, Route, Alert, GeofenceViolation } from '../types';

// Coordinate validation
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Vehicle validation
export function validateVehicle(vehicle: any): vehicle is Vehicle {
  if (!vehicle || typeof vehicle !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'name', 'licensePlate', 'driver', 'position', 'status', 'vehicleType', 'lastUpdate'];
  
  for (const field of requiredFields) {
    if (!(field in vehicle)) {
      return false;
    }
  }

  // Validate driver object
  if (!vehicle.driver || typeof vehicle.driver !== 'object') {
    return false;
  }
  
  if (!vehicle.driver.id || !vehicle.driver.name) {
    return false;
  }

  // Validate position
  if (!vehicle.position || typeof vehicle.position !== 'object') {
    return false;
  }
  
  if (!isValidCoordinate(vehicle.position.lat, vehicle.position.lng)) {
    return false;
  }

  // Validate numeric fields
  const numericFields = ['accuracy', 'heading', 'speed'];
  for (const field of numericFields) {
    if (typeof vehicle.position[field] !== 'number' || isNaN(vehicle.position[field])) {
      return false;
    }
  }

  // Validate enums
  const validStatuses = ['active', 'inactive', 'maintenance', 'offline'];
  if (!validStatuses.includes(vehicle.status)) {
    return false;
  }

  const validTypes = ['truck', 'van', 'car', 'motorcycle'];
  if (!validTypes.includes(vehicle.vehicleType)) {
    return false;
  }

  // Validate timestamps
  if (!(vehicle.lastUpdate instanceof Date) && !Date.parse(vehicle.lastUpdate)) {
    return false;
  }

  return true;
}

// Geofence validation
export function validateGeofence(geofence: any): geofence is Geofence {
  if (!geofence || typeof geofence !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'name', 'type', 'geometry', 'rules', 'color', 'isActive'];
  
  for (const field of requiredFields) {
    if (!(field in geofence)) {
      return false;
    }
  }

  // Validate type
  const validTypes = ['inclusion', 'exclusion'];
  if (!validTypes.includes(geofence.type)) {
    return false;
  }

  // Validate geometry
  if (!geofence.geometry || typeof geofence.geometry !== 'object') {
    return false;
  }

  const validGeometryTypes = ['Polygon', 'Circle'];
  if (!validGeometryTypes.includes(geofence.geometry.type)) {
    return false;
  }

  // Validate coordinates
  if (geofence.geometry.type === 'Polygon') {
    if (!Array.isArray(geofence.geometry.coordinates)) {
      return false;
    }
    
    for (const coord of geofence.geometry.coordinates) {
      if (!Array.isArray(coord) || coord.length !== 2) {
        return false;
      }
      if (!isValidCoordinate(coord[0], coord[1])) {
        return false;
      }
    }
  } else if (geofence.geometry.type === 'Circle') {
    if (typeof geofence.geometry.radius !== 'number' || isNaN(geofence.geometry.radius) || geofence.geometry.radius <= 0) {
      return false;
    }
  }

  // Validate rules
  if (!geofence.rules || typeof geofence.rules !== 'object') {
    return false;
  }

  if (typeof geofence.rules.enterAlert !== 'boolean' || typeof geofence.rules.exitAlert !== 'boolean') {
    return false;
  }

  // Validate color (hex color)
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexColorRegex.test(geofence.color)) {
    return false;
  }

  return true;
}

// Route validation
export function validateRoute(route: any): route is Route {
  if (!route || typeof route !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'vehicleId', 'startTime', 'waypoints', 'distance', 'duration', 'status'];
  
  for (const field of requiredFields) {
    if (!(field in route)) {
      return false;
    }
  }

  // Validate timestamps
  if (!(route.startTime instanceof Date) && !Date.parse(route.startTime)) {
    return false;
  }

  if (route.endTime && !(route.endTime instanceof Date) && !Date.parse(route.endTime)) {
    return false;
  }

  // Validate waypoints
  if (!Array.isArray(route.waypoints)) {
    return false;
  }

  for (const waypoint of route.waypoints) {
    if (!waypoint || typeof waypoint !== 'object') {
      return false;
    }

    if (!isValidCoordinate(waypoint.lat, waypoint.lng)) {
      return false;
    }

    if (!(waypoint.timestamp instanceof Date) && !Date.parse(waypoint.timestamp)) {
      return false;
    }

    if (typeof waypoint.speed !== 'number' || typeof waypoint.heading !== 'number') {
      return false;
    }
  }

  // Validate numeric fields
  if (typeof route.distance !== 'number' || typeof route.duration !== 'number') {
    return false;
  }

  // Validate status
  const validStatuses = ['planned', 'active', 'completed', 'cancelled'];
  if (!validStatuses.includes(route.status)) {
    return false;
  }

  return true;
}

// Alert validation
export function validateAlert(alert: any): alert is Alert {
  if (!alert || typeof alert !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'type', 'vehicleId', 'message', 'severity', 'timestamp', 'acknowledged'];
  
  for (const field of requiredFields) {
    if (!(field in alert)) {
      return false;
    }
  }

  // Validate type
  const validTypes = ['geofence_enter', 'geofence_exit', 'speed_violation', 'offline', 'maintenance'];
  if (!validTypes.includes(alert.type)) {
    return false;
  }

  // Validate severity
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  if (!validSeverities.includes(alert.severity)) {
    return false;
  }

  // Validate timestamp
  if (!(alert.timestamp instanceof Date) && !Date.parse(alert.timestamp)) {
    return false;
  }

  // Validate acknowledged
  if (typeof alert.acknowledged !== 'boolean') {
    return false;
  }

  return true;
}

// Geofence violation validation
export function validateGeofenceViolation(violation: any): violation is GeofenceViolation {
  if (!violation || typeof violation !== 'object') {
    return false;
  }

  const requiredFields = ['id', 'vehicleId', 'geofenceId', 'type', 'timestamp', 'position'];
  
  for (const field of requiredFields) {
    if (!(field in violation)) {
      return false;
    }
  }

  // Validate type
  const validTypes = ['enter', 'exit'];
  if (!validTypes.includes(violation.type)) {
    return false;
  }

  // Validate timestamp
  if (!(violation.timestamp instanceof Date) && !Date.parse(violation.timestamp)) {
    return false;
  }

  // Validate position
  if (!violation.position || typeof violation.position !== 'object') {
    return false;
  }

  if (!isValidCoordinate(violation.position.lat, violation.position.lng)) {
    return false;
  }

  return true;
}

// Data sanitization functions
export function sanitizeVehicle(vehicle: any): Partial<Vehicle> {
  if (!validateVehicle(vehicle)) {
    throw new Error('Invalid vehicle data');
  }

  return {
    id: String(vehicle.id),
    name: String(vehicle.name),
    licensePlate: String(vehicle.licensePlate),
    driver: {
      id: String(vehicle.driver.id),
      name: String(vehicle.driver.name),
      phone: vehicle.driver.phone ? String(vehicle.driver.phone) : undefined,
    },
    position: {
      lat: Number(vehicle.position.lat),
      lng: Number(vehicle.position.lng),
      accuracy: Number(vehicle.position.accuracy),
      heading: Number(vehicle.position.heading),
      speed: Number(vehicle.position.speed),
      timestamp: new Date(vehicle.position.timestamp),
    },
    status: vehicle.status,
    vehicleType: vehicle.vehicleType,
    fuelLevel: vehicle.fuelLevel ? Number(vehicle.fuelLevel) : undefined,
    odometer: vehicle.odometer ? Number(vehicle.odometer) : undefined,
    lastUpdate: new Date(vehicle.lastUpdate),
  };
}

export function sanitizeGeofence(geofence: any): Partial<Geofence> {
  if (!validateGeofence(geofence)) {
    throw new Error('Invalid geofence data');
  }

  return {
    id: String(geofence.id),
    name: String(geofence.name),
    type: geofence.type,
    geometry: geofence.geometry,
    rules: {
      enterAlert: Boolean(geofence.rules.enterAlert),
      exitAlert: Boolean(geofence.rules.exitAlert),
      speedLimit: geofence.rules.speedLimit ? Number(geofence.rules.speedLimit) : undefined,
    },
    color: String(geofence.color),
    isActive: Boolean(geofence.isActive),
  };
}

// Error handling utilities
export class ValidationError extends Error {
  constructor(message: string, public field?: string, public value?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function createValidationError(message: string, field?: string, value?: any): ValidationError {
  return new ValidationError(message, field, value);
}

// Batch validation
export function validateVehicles(vehicles: any[]): { valid: Vehicle[]; invalid: any[] } {
  const valid: Vehicle[] = [];
  const invalid: any[] = [];

  for (const vehicle of vehicles) {
    if (validateVehicle(vehicle)) {
      valid.push(vehicle);
    } else {
      invalid.push(vehicle);
    }
  }

  return { valid, invalid };
}

export function validateGeofences(geofences: any[]): { valid: Geofence[]; invalid: any[] } {
  const valid: Geofence[] = [];
  const invalid: any[] = [];

  for (const geofence of geofences) {
    if (validateGeofence(geofence)) {
      valid.push(geofence);
    } else {
      invalid.push(geofence);
    }
  }

  return { valid, invalid };
}
