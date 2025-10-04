import type { User, Tenant } from '@/types';
import { UserRole } from '@/types';
import { SUPER_USER } from './super-user';

// Mock Company: PetroMax Energy Solutions
export const MOCK_COMPANY: Tenant = {
  id: 'petromax-energy',
  name: 'PetroMax Energy Solutions',
  domain: 'petromax-energy.com',
  settings: {
    timezone: 'America/New_York',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    businessHours: {
      start: '06:00',
      end: '22:00',
      days: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    },
  },
  branding: {
    logo: '/logos/petromax-logo.png',
    primaryColor: '#1e40af', // Blue-800
    secondaryColor: '#3b82f6', // Blue-500
    favicon: '/favicons/petromax-favicon.ico',
  },
  features: {
    realTimeUpdates: true,
    advancedAnalytics: true,
    mobileApp: true,
    apiAccess: true,
  },
};

// Mock Administrator Account
export const MOCK_ADMIN: User = {
  id: 'admin-petromax-001',
  email: 'admin@petromax-energy.com',
  name: 'Sarah Johnson',
  role: UserRole.ADMIN,
  permissions: SUPER_USER.permissions, // Full access to all permissions
  tenantId: MOCK_COMPANY.id,
  lastLoginAt: new Date(),
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
  },
  isActive: true,
};

// Mock Company Data for Dashboard
export const MOCK_COMPANY_DATA = {
  // Tank Data
  tanks: [
    {
      id: 'tank-001',
      name: 'Premium Gasoline Tank A',
      type: 'GASOLINE',
      capacity: 50000,
      currentLevel: 39000,
      status: 'ACTIVE',
      location: {
        id: 'loc-001',
        name: 'Main Distribution Center',
        address: '123 Energy Drive, Houston, TX 77001',
        coordinates: { lat: 29.7604, lng: -95.3698 },
      },
      lastUpdated: new Date(),
      temperature: 22.5,
      pressure: 14.7,
      supplier: 'ExxonMobil',
      costPerLiter: 0.85,
      reorderPoint: 10000,
      maxLevel: 48000,
      minLevel: 5000,
    },
    {
      id: 'tank-002',
      name: 'Diesel Tank B',
      type: 'DIESEL',
      capacity: 75000,
      currentLevel: 45000,
      status: 'ACTIVE',
      location: {
        id: 'loc-001',
        name: 'Main Distribution Center',
        address: '123 Energy Drive, Houston, TX 77001',
        coordinates: { lat: 29.7604, lng: -95.3698 },
      },
      lastUpdated: new Date(),
      temperature: 24.1,
      pressure: 14.9,
      supplier: 'Shell',
      costPerLiter: 0.92,
      reorderPoint: 15000,
      maxLevel: 72000,
      minLevel: 8000,
    },
    {
      id: 'tank-003',
      name: 'Kerosene Tank C',
      type: 'KEROSENE',
      capacity: 25000,
      currentLevel: 8000,
      status: 'CRITICAL',
      location: {
        id: 'loc-002',
        name: 'Secondary Storage Facility',
        address: '456 Fuel Avenue, Dallas, TX 75201',
        coordinates: { lat: 32.7767, lng: -96.797 },
      },
      lastUpdated: new Date(),
      temperature: 20.8,
      pressure: 14.5,
      supplier: 'Chevron',
      costPerLiter: 1.15,
      reorderPoint: 5000,
      maxLevel: 24000,
      minLevel: 2500,
    },
  ],

  // Delivery Data
  deliveries: [
    {
      id: 'delivery-001',
      vehicleId: 'vehicle-001',
      driverId: 'driver-001',
      route: {
        id: 'route-001',
        name: 'Houston Downtown Route',
        waypoints: [
          {
            id: 'wp-001',
            name: 'Start Depot',
            address: '123 Energy Drive, Houston, TX',
            coordinates: { lat: 29.7604, lng: -95.3698 },
            order: 1,
          },
          {
            id: 'wp-002',
            name: 'Downtown Station',
            address: '789 Main Street, Houston, TX',
            coordinates: { lat: 29.7604, lng: -95.3698 },
            order: 2,
          },
        ],
        distance: 25.5,
        estimatedDuration: 45,
      },
      status: 'IN_PROGRESS',
      scheduledAt: new Date(),
      startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      fuelType: 'GASOLINE',
      quantity: 5000,
    },
    {
      id: 'delivery-002',
      vehicleId: 'vehicle-002',
      driverId: 'driver-002',
      route: {
        id: 'route-002',
        name: 'Dallas Suburbs Route',
        waypoints: [
          {
            id: 'wp-003',
            name: 'Start Depot',
            address: '456 Fuel Avenue, Dallas, TX',
            coordinates: { lat: 32.7767, lng: -96.797 },
            order: 1,
          },
          {
            id: 'wp-004',
            name: 'Suburban Station',
            address: '321 Oak Street, Dallas, TX',
            coordinates: { lat: 32.7767, lng: -96.797 },
            order: 2,
          },
        ],
        distance: 18.2,
        estimatedDuration: 35,
      },
      status: 'SCHEDULED',
      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      fuelType: 'DIESEL',
      quantity: 7500,
    },
  ],

  // Vehicle Data
  vehicles: [
    {
      id: 'vehicle-001',
      name: 'Tanker Truck Alpha',
      type: 'TANKER',
      capacity: 10000,
      status: 'ACTIVE',
      currentLocation: {
        lat: 29.7604,
        lng: -95.3698,
      },
      fuelLevel: 85,
      driver: 'John Smith',
      lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextMaintenance: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
    },
    {
      id: 'vehicle-002',
      name: 'Tanker Truck Beta',
      type: 'TANKER',
      capacity: 12000,
      status: 'ACTIVE',
      currentLocation: {
        lat: 32.7767,
        lng: -96.797,
      },
      fuelLevel: 92,
      driver: 'Mike Johnson',
      lastMaintenance: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      nextMaintenance: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000), // 27 days from now
    },
  ],

  // Dashboard Analytics
  dashboard: {
    totalRevenue: 2847392,
    fuelInventory: 92000,
    activeDeliveries: 2,
    dailySales: 156847,
    monthlyGrowth: 12.5,
    inventoryTrend: -2.3,
    deliveryEfficiency: 94.2,
    customerSatisfaction: 4.8,
  },

  // Recent Transactions
  transactions: [
    {
      id: 'tx-001',
      type: 'sale',
      amount: 12500,
      volume: 5000,
      customer: 'ABC Transport',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'completed',
    },
    {
      id: 'tx-002',
      type: 'delivery',
      amount: 8500,
      volume: 3400,
      supplier: 'PetroSupply Co',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      status: 'completed',
    },
    {
      id: 'tx-003',
      type: 'sale',
      amount: 18900,
      volume: 7560,
      customer: 'XYZ Logistics',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      status: 'completed',
    },
  ],

  // Alerts
  alerts: [
    {
      id: 'alert-001',
      type: 'warning',
      title: 'Low Kerosene Level',
      message: 'Kerosene tank is at 32% capacity - reorder recommended',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      priority: 'high',
      status: 'active',
    },
    {
      id: 'alert-002',
      type: 'info',
      title: 'Delivery Scheduled',
      message: 'Diesel delivery arriving at 2:00 PM today',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      priority: 'medium',
      status: 'active',
    },
    {
      id: 'alert-003',
      type: 'success',
      title: 'Maintenance Completed',
      message: 'Tanker Truck Alpha maintenance completed successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      priority: 'low',
      status: 'resolved',
    },
  ],
};

// Utility function to get mock data by resource
export const getMockData = (resource: string) => {
  switch (resource) {
    case 'tanks':
      return MOCK_COMPANY_DATA.tanks;
    case 'deliveries':
      return MOCK_COMPANY_DATA.deliveries;
    case 'vehicles':
      return MOCK_COMPANY_DATA.vehicles;
    case 'dashboard':
      return MOCK_COMPANY_DATA.dashboard;
    case 'transactions':
      return MOCK_COMPANY_DATA.transactions;
    case 'alerts':
      return MOCK_COMPANY_DATA.alerts;
    default:
      return null;
  }
};

// Export all mock data
export { MOCK_COMPANY as MOCK_TENANT, MOCK_ADMIN as MOCK_USER };
