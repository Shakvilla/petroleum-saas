// Documentation: /docs/fleet-tracker/tests/basic-setup.test.md

/**
 * Basic Fleet Tracker Setup Tests
 * 
 * Simple tests to verify that the basic setup is working correctly.
 */

import { describe, it, expect } from '@jest/globals';

// Direct imports from individual files
import { validateVehicle, isValidCoordinate } from '../../../components/fleet-tracker/utils/validation';
import { generateMockVehicle } from '../../../components/fleet-tracker/utils/mock-data';
import { fleetTrackerConfig } from '../../../lib/fleet-tracker/config';

describe('Fleet Tracker Basic Setup', () => {
  describe('Validation Functions', () => {
    it('should validate coordinates correctly', () => {
      expect(isValidCoordinate(40.7128, -74.0060)).toBe(true);
      expect(isValidCoordinate(200, -74.0060)).toBe(false);
      expect(isValidCoordinate(40.7128, 200)).toBe(false);
      expect(isValidCoordinate(NaN, -74.0060)).toBe(false);
    });

    it('should validate vehicle data', () => {
      const mockVehicle = generateMockVehicle();
      expect(validateVehicle(mockVehicle)).toBe(true);
    });

    it('should reject invalid vehicle data', () => {
      const invalidVehicle = {
        id: 'test',
        // Missing required fields
      };
      
      expect(validateVehicle(invalidVehicle)).toBe(false);
    });
  });

  describe('Mock Data Generation', () => {
    it('should generate valid mock vehicle', () => {
      const vehicle = generateMockVehicle();
      
      expect(vehicle).toBeDefined();
      expect(vehicle.id).toBeDefined();
      expect(vehicle.name).toBeDefined();
      expect(vehicle.position).toBeDefined();
      expect(vehicle.position.lat).toBeGreaterThanOrEqual(-90);
      expect(vehicle.position.lat).toBeLessThanOrEqual(90);
      expect(vehicle.position.lng).toBeGreaterThanOrEqual(-180);
      expect(vehicle.position.lng).toBeLessThanOrEqual(180);
    });
  });

  describe('Configuration', () => {
    it('should have configuration defined', () => {
      expect(fleetTrackerConfig).toBeDefined();
      expect(fleetTrackerConfig.mapbox).toBeDefined();
      expect(fleetTrackerConfig.websocket).toBeDefined();
      expect(fleetTrackerConfig.api).toBeDefined();
      expect(fleetTrackerConfig.performance).toBeDefined();
    });

    it('should have valid configuration structure', () => {
      expect(typeof fleetTrackerConfig.mapbox.accessToken).toBe('string');
      expect(typeof fleetTrackerConfig.websocket.url).toBe('string');
      expect(typeof fleetTrackerConfig.api.baseUrl).toBe('string');
      expect(typeof fleetTrackerConfig.performance.updateInterval).toBe('number');
    });
  });

  describe('Type Definitions', () => {
    it('should have proper vehicle structure', () => {
      const vehicle = generateMockVehicle();
      
      // Check required fields
      expect(vehicle.id).toBeDefined();
      expect(vehicle.name).toBeDefined();
      expect(vehicle.licensePlate).toBeDefined();
      expect(vehicle.driver).toBeDefined();
      expect(vehicle.driver.id).toBeDefined();
      expect(vehicle.driver.name).toBeDefined();
      expect(vehicle.position).toBeDefined();
      expect(vehicle.status).toBeDefined();
      expect(vehicle.vehicleType).toBeDefined();
      expect(vehicle.lastUpdate).toBeDefined();
      
      // Check position structure
      expect(vehicle.position.lat).toBeDefined();
      expect(vehicle.position.lng).toBeDefined();
      expect(vehicle.position.accuracy).toBeDefined();
      expect(vehicle.position.heading).toBeDefined();
      expect(vehicle.position.speed).toBeDefined();
      expect(vehicle.position.timestamp).toBeDefined();
    });
  });
});
