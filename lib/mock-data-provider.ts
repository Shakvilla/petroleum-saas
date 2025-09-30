import { MOCK_COMPANY_DATA } from './mock-company';

// Mock data provider for all components
export class MockDataProvider {
  private static instance: MockDataProvider;
  private data: typeof MOCK_COMPANY_DATA;

  private constructor() {
    this.data = MOCK_COMPANY_DATA;
  }

  static getInstance(): MockDataProvider {
    if (!MockDataProvider.instance) {
      MockDataProvider.instance = new MockDataProvider();
    }
    return MockDataProvider.instance;
  }

  // Tank data methods
  getTanks() {
    return Promise.resolve(this.data.tanks);
  }

  getTank(id: string) {
    const tank = this.data.tanks.find(t => t.id === id);
    return Promise.resolve(tank || null);
  }

  createTank(tankData: any) {
    const newTank = {
      id: `tank-${Date.now()}`,
      ...tankData,
      lastUpdated: new Date(),
    };
    this.data.tanks.push(newTank);
    return Promise.resolve(newTank);
  }

  updateTank(id: string, updates: any) {
    const tankIndex = this.data.tanks.findIndex(t => t.id === id);
    if (tankIndex !== -1) {
      this.data.tanks[tankIndex] = {
        ...this.data.tanks[tankIndex],
        ...updates,
        lastUpdated: new Date(),
      };
      return Promise.resolve(this.data.tanks[tankIndex]);
    }
    return Promise.reject(new Error('Tank not found'));
  }

  deleteTank(id: string) {
    const tankIndex = this.data.tanks.findIndex(t => t.id === id);
    if (tankIndex !== -1) {
      this.data.tanks.splice(tankIndex, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Tank not found'));
  }

  // Delivery data methods
  getDeliveries() {
    return Promise.resolve(this.data.deliveries);
  }

  getDelivery(id: string) {
    const delivery = this.data.deliveries.find(d => d.id === id);
    return Promise.resolve(delivery || null);
  }

  createDelivery(deliveryData: any) {
    const newDelivery = {
      id: `delivery-${Date.now()}`,
      ...deliveryData,
      status: 'SCHEDULED',
      scheduledAt: new Date(),
    };
    this.data.deliveries.push(newDelivery);
    return Promise.resolve(newDelivery);
  }

  updateDelivery(id: string, updates: any) {
    const deliveryIndex = this.data.deliveries.findIndex(d => d.id === id);
    if (deliveryIndex !== -1) {
      this.data.deliveries[deliveryIndex] = {
        ...this.data.deliveries[deliveryIndex],
        ...updates,
      };
      return Promise.resolve(this.data.deliveries[deliveryIndex]);
    }
    return Promise.reject(new Error('Delivery not found'));
  }

  deleteDelivery(id: string) {
    const deliveryIndex = this.data.deliveries.findIndex(d => d.id === id);
    if (deliveryIndex !== -1) {
      this.data.deliveries.splice(deliveryIndex, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Delivery not found'));
  }

  // Vehicle data methods
  getVehicles() {
    return Promise.resolve(this.data.vehicles);
  }

  getVehicle(id: string) {
    const vehicle = this.data.vehicles.find(v => v.id === id);
    return Promise.resolve(vehicle || null);
  }

  createVehicle(vehicleData: any) {
    const newVehicle = {
      id: `vehicle-${Date.now()}`,
      ...vehicleData,
      status: 'ACTIVE',
    };
    this.data.vehicles.push(newVehicle);
    return Promise.resolve(newVehicle);
  }

  updateVehicle(id: string, updates: any) {
    const vehicleIndex = this.data.vehicles.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
      this.data.vehicles[vehicleIndex] = {
        ...this.data.vehicles[vehicleIndex],
        ...updates,
      };
      return Promise.resolve(this.data.vehicles[vehicleIndex]);
    }
    return Promise.reject(new Error('Vehicle not found'));
  }

  deleteVehicle(id: string) {
    const vehicleIndex = this.data.vehicles.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
      this.data.vehicles.splice(vehicleIndex, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Vehicle not found'));
  }

  // Dashboard data methods
  getDashboardData() {
    return Promise.resolve(this.data.dashboard);
  }

  getDashboardAnalytics(period: string = '30d') {
    // Mock analytics data based on period
    const baseData = this.data.dashboard;
    const multiplier = period === '7d' ? 0.3 : period === '90d' ? 2.5 : 1;

    return Promise.resolve({
      ...baseData,
      totalRevenue: Math.round(baseData.totalRevenue * multiplier),
      dailySales: Math.round(baseData.dailySales * multiplier),
      monthlyGrowth: baseData.monthlyGrowth + (Math.random() - 0.5) * 5,
    });
  }

  // Transaction data methods
  getTransactions(limit: number = 10) {
    return Promise.resolve(this.data.transactions.slice(0, limit));
  }

  getTransaction(id: string) {
    const transaction = this.data.transactions.find(t => t.id === id);
    return Promise.resolve(transaction || null);
  }

  createTransaction(transactionData: any) {
    const newTransaction = {
      id: `tx-${Date.now()}`,
      ...transactionData,
      timestamp: new Date(),
      status: 'completed',
    };
    this.data.transactions.unshift(newTransaction);
    return Promise.resolve(newTransaction);
  }

  // Alert data methods
  getAlerts() {
    return Promise.resolve(this.data.alerts);
  }

  getAlert(id: string) {
    const alert = this.data.alerts.find(a => a.id === id);
    return Promise.resolve(alert || null);
  }

  createAlert(alertData: any) {
    const newAlert = {
      id: `alert-${Date.now()}`,
      ...alertData,
      timestamp: new Date(),
      status: 'active',
    };
    this.data.alerts.unshift(newAlert);
    return Promise.resolve(newAlert);
  }

  updateAlert(id: string, updates: any) {
    const alertIndex = this.data.alerts.findIndex(a => a.id === id);
    if (alertIndex !== -1) {
      this.data.alerts[alertIndex] = {
        ...this.data.alerts[alertIndex],
        ...updates,
      };
      return Promise.resolve(this.data.alerts[alertIndex]);
    }
    return Promise.reject(new Error('Alert not found'));
  }

  deleteAlert(id: string) {
    const alertIndex = this.data.alerts.findIndex(a => a.id === id);
    if (alertIndex !== -1) {
      this.data.alerts.splice(alertIndex, 1);
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Alert not found'));
  }

  // Sales analytics methods
  getSalesData(period: string = '30d') {
    const baseRevenue = this.data.dashboard.totalRevenue;
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const dailyAverage = baseRevenue / 30;

    const salesData = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      revenue: Math.round(dailyAverage * (0.8 + Math.random() * 0.4)),
      volume: Math.round(dailyAverage * 0.4 * (0.8 + Math.random() * 0.4)),
    }));

    return Promise.resolve(salesData);
  }

  // Inventory analytics methods
  getInventoryData() {
    const inventoryData = this.data.tanks.map(tank => ({
      id: tank.id,
      name: tank.name,
      type: tank.type,
      currentLevel: tank.currentLevel,
      capacity: tank.capacity,
      percentage: Math.round((tank.currentLevel / tank.capacity) * 100),
      status: tank.status,
      lastUpdated: tank.lastUpdated,
    }));

    return Promise.resolve(inventoryData);
  }

  // Fleet analytics methods
  getFleetData() {
    const fleetData = this.data.vehicles.map(vehicle => ({
      id: vehicle.id,
      name: vehicle.name,
      type: vehicle.type,
      status: vehicle.status,
      fuelLevel: vehicle.fuelLevel,
      driver: vehicle.driver,
      currentLocation: vehicle.currentLocation,
      lastMaintenance: vehicle.lastMaintenance,
      nextMaintenance: vehicle.nextMaintenance,
    }));

    return Promise.resolve(fleetData);
  }

  // IoT monitoring data
  getIoTData() {
    const iotData = this.data.tanks.map(tank => ({
      id: tank.id,
      name: tank.name,
      sensors: [
        {
          type: 'temperature',
          value: tank.temperature,
          unit: '°C',
          status: tank.temperature > 25 ? 'warning' : 'normal',
        },
        {
          type: 'pressure',
          value: tank.pressure,
          unit: 'PSI',
          status: tank.pressure > 15 ? 'warning' : 'normal',
        },
        {
          type: 'level',
          value: tank.currentLevel,
          unit: 'L',
          status: tank.status === 'CRITICAL' ? 'critical' : 'normal',
        },
      ],
      lastUpdated: tank.lastUpdated,
    }));

    return Promise.resolve(iotData);
  }

  // Predictive analytics data
  getPredictiveData() {
    const predictiveData = {
      demandForecast: [
        { date: '2024-02-01', predicted: 45000, actual: null },
        { date: '2024-02-02', predicted: 47000, actual: null },
        { date: '2024-02-03', predicted: 43000, actual: null },
        { date: '2024-02-04', predicted: 49000, actual: null },
        { date: '2024-02-05', predicted: 46000, actual: null },
      ],
      maintenanceSchedule: [
        {
          vehicleId: 'vehicle-001',
          type: 'routine',
          scheduledDate: '2024-02-15',
          priority: 'medium',
        },
        {
          vehicleId: 'vehicle-002',
          type: 'inspection',
          scheduledDate: '2024-02-20',
          priority: 'low',
        },
      ],
      riskAssessment: [
        { factor: 'Low Kerosene Level', risk: 'high', impact: 'operational' },
        { factor: 'Vehicle Maintenance Due', risk: 'medium', impact: 'safety' },
        { factor: 'Weather Conditions', risk: 'low', impact: 'delivery' },
      ],
    };

    return Promise.resolve(predictiveData);
  }

  // Reset all data to initial state
  resetData() {
    this.data = MOCK_COMPANY_DATA;
    return Promise.resolve(true);
  }

  // Get all data
  getAllData() {
    return Promise.resolve(this.data);
  }
}

// Export singleton instance
export const mockDataProvider = MockDataProvider.getInstance();

// Export utility functions
export const getMockData = (resource: string, id?: string) => {
  switch (resource) {
    case 'tanks':
      return id ? mockDataProvider.getTank(id) : mockDataProvider.getTanks();
    case 'deliveries':
      return id
        ? mockDataProvider.getDelivery(id)
        : mockDataProvider.getDeliveries();
    case 'vehicles':
      return id
        ? mockDataProvider.getVehicle(id)
        : mockDataProvider.getVehicles();
    case 'dashboard':
      return mockDataProvider.getDashboardData();
    case 'transactions':
      return id
        ? mockDataProvider.getTransaction(id)
        : mockDataProvider.getTransactions();
    case 'alerts':
      return id ? mockDataProvider.getAlert(id) : mockDataProvider.getAlerts();
    case 'analytics':
      return mockDataProvider.getDashboardAnalytics();
    case 'sales':
      return mockDataProvider.getSalesData();
    case 'inventory':
      return mockDataProvider.getInventoryData();
    case 'fleet':
      return mockDataProvider.getFleetData();
    case 'iot':
      return mockDataProvider.getIoTData();
    case 'predictive':
      return mockDataProvider.getPredictiveData();
    default:
      return Promise.resolve(null);
  }
};
