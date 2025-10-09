import { NextRequest } from 'next/server';
import type {
  Tank,
  Delivery,
  Transaction,
  Alert,
  User,
  Tenant,
  Vehicle,
} from '@/types';

// Import mock data
import tanksData from './data/tanks.json';
import deliveriesData from './data/deliveries.json';
import transactionsData from './data/transactions.json';
import alertsData from './data/alerts.json';
import settingsData from './data/settings.json';
import vehiclesData from './data/vehicles.json';
import usersData from './data/users.json';
import sessionsData from './data/sessions.json';

export interface MockApiOptions {
  delay?: number;
  errorRate?: number;
  tenantId?: string;
}

export class MockApiService {
  private static instance: MockApiService;
  private data: {
    tanks: Tank[];
    deliveries: Delivery[];
    transactions: Transaction[];
    alerts: Alert[];
    vehicles: Vehicle[];
    users: User[];
    sessions: any[];
    settings: any;
  };

  private constructor() {
    this.data = {
      tanks: tanksData.tanks as unknown as Tank[],
      deliveries: deliveriesData.deliveries as unknown as Delivery[],
      transactions: transactionsData.transactions as unknown as Transaction[],
      alerts: alertsData.alerts as unknown as Alert[],
      vehicles: vehiclesData.vehicles as Vehicle[],
      users: usersData.users as unknown as User[],
      sessions: sessionsData.sessions,
      settings: settingsData.settings,
    };
  }

  public static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  // Simulate network delay
  private async simulateDelay(delay: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Simulate random errors
  private shouldSimulateError(errorRate: number = 0): boolean {
    return Math.random() < errorRate;
  }

  // Filter data by tenant
  private filterByTenant<T extends { tenantId?: string }>(
    data: T[],
    tenantId?: string
  ): T[] {
    if (!tenantId) return data;
    // console.log('filtering by tenant data', data);
    const filteredData = data.filter(item => item.tenantId === tenantId);
    // console.log('filteredData', filteredData);

    return filteredData;
  }

  // Generic CRUD operations
  public async findMany<T extends { id: string; tenantId?: string }>(
    resource: string,
    options: MockApiOptions = {}
  ): Promise<T[]> {
    await this.simulateDelay(options.delay);

    if (this.shouldSimulateError(options.errorRate)) {
      throw new Error(`Failed to fetch ${resource}`);
    }

    const data = this.getResourceData<T>(resource);
    // console.log('find many data', data);

    return this.filterByTenant(data, options.tenantId);
  }

  public async findOne<T extends { id: string; tenantId?: string }>(
    resource: string,
    id: string,
    options: MockApiOptions = {}
  ): Promise<T | null> {
    await this.simulateDelay(options.delay);

    if (this.shouldSimulateError(options.errorRate)) {
      throw new Error(`Failed to fetch ${resource} with id ${id}`);
    }

    const data = this.getResourceData<T>(resource);
    const item = data.find(item => item.id === id);

    if (!item) return null;

    // Check tenant access
    if (
      options.tenantId &&
      item.tenantId &&
      item.tenantId !== options.tenantId
    ) {
      throw new Error('Access denied: Cross-tenant data access');
    }

    return item;
  }

  public async create<T extends { id: string; tenantId?: string }>(
    resource: string,
    data: Omit<T, 'id'>,
    options: MockApiOptions = {}
  ): Promise<T> {
    await this.simulateDelay(options.delay);

    if (this.shouldSimulateError(options.errorRate)) {
      throw new Error(`Failed to create ${resource}`);
    }

    const newItem = {
      ...data,
      id: this.generateId(),
      tenantId: options.tenantId || data.tenantId,
    } as T;

    this.getResourceData<T>(resource).push(newItem);
    return newItem;
  }

  public async update<T extends { id: string; tenantId?: string }>(
    resource: string,
    id: string,
    updates: Partial<T>,
    options: MockApiOptions = {}
  ): Promise<T | null> {
    await this.simulateDelay(options.delay);

    if (this.shouldSimulateError(options.errorRate)) {
      throw new Error(`Failed to update ${resource} with id ${id}`);
    }

    const data = this.getResourceData<T>(resource);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) return null;

    // Check tenant access
    const item = data[index];
    if (
      options.tenantId &&
      item.tenantId &&
      item.tenantId !== options.tenantId
    ) {
      throw new Error('Access denied: Cross-tenant data access');
    }

    data[index] = { ...item, ...updates } as T;
    return data[index];
  }

  public async delete<T extends { id: string; tenantId?: string }>(
    resource: string,
    id: string,
    options: MockApiOptions = {}
  ): Promise<boolean> {
    await this.simulateDelay(options.delay);

    if (this.shouldSimulateError(options.errorRate)) {
      throw new Error(`Failed to delete ${resource} with id ${id}`);
    }

    const data = this.getResourceData<T>(resource);
    const index = data.findIndex(item => item.id === id);

    if (index === -1) return false;

    // Check tenant access
    const item = data[index];
    if (
      options.tenantId &&
      item.tenantId &&
      item.tenantId !== options.tenantId
    ) {
      throw new Error('Access denied: Cross-tenant data access');
    }

    data.splice(index, 1);
    return true;
  }

  // Resource-specific methods
  public async getTanks(tenantId?: string): Promise<Tank[]> {
    // console.log('Getting tanks for tenant:', tenantId);
    return this.findMany<Tank>('tanks', { tenantId });
  }

  public async getStats(tenantId?: string): Promise<any> {
    return this.findMany<any>('stats', { tenantId });
  }

  public async getTank(id: string, tenantId?: string): Promise<Tank | null> {
    return this.findOne<Tank>('tanks', id, { tenantId });
  }

  public async getDeliveries(tenantId?: string): Promise<Delivery[]> {
    return this.findMany<Delivery>('deliveries', { tenantId });
  }

  public async getDelivery(
    id: string,
    tenantId?: string
  ): Promise<Delivery | null> {
    return this.findOne<Delivery>('deliveries', id, { tenantId });
  }

  public async getTransactions(tenantId?: string): Promise<Transaction[]> {
    return this.findMany<Transaction>('transactions', { tenantId });
  }

  public async getTransaction(
    id: string,
    tenantId?: string
  ): Promise<Transaction | null> {
    return this.findOne<Transaction>('transactions', id, { tenantId });
  }

  public async getAlerts(tenantId?: string): Promise<Alert[]> {
    return this.findMany<Alert>('alerts', { tenantId });
  }

  public async getAlert(id: string, tenantId?: string): Promise<Alert | null> {
    return this.findOne<Alert>('alerts', id, { tenantId });
  }

  public async getSettings(tenantId?: string): Promise<any> {
    await this.simulateDelay();
    return this.data.settings;
  }

  // Authentication methods
  public async authenticateUser(
    email: string,
    password: string
  ): Promise<{ user: User; session: any } | null> {
    await this.simulateDelay();

    const user = this.data.users.find(u => u.email === email);
    if (!user || !user.isActive) {
      return null;
    }

    // Mock password validation (in real app, this would be hashed)
    if (password !== 'admin123' && password !== 'password123') {
      return null;
    }

    // Create or update session
    const existingSession = this.data.sessions.find(s => s.userId === user.id);
    const session = existingSession || {
      id: this.generateId(),
      userId: user.id,
      tenantId: user.tenantId,
      token: this.generateJWT(user),
      refreshToken: this.generateRefreshToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true,
      ipAddress: '192.168.1.100',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    };

    if (!existingSession) {
      this.data.sessions.push(session);
    } else {
      session.lastActivity = new Date().toISOString();
    }

    return { user, session };
  }

  public async validateToken(token: string): Promise<User | null> {
    await this.simulateDelay();

    const session = this.data.sessions.find(
      s => s.token === token && s.isActive
    );
    if (!session) {
      return null;
    }

    // Check if token is expired
    if (new Date(session.expiresAt) < new Date()) {
      session.isActive = false;
      return null;
    }

    const user = this.data.users.find(u => u.id === session.userId);
    return user || null;
  }

  public async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; user: User } | null> {
    await this.simulateDelay();

    const session = this.data.sessions.find(
      s => s.refreshToken === refreshToken && s.isActive
    );
    if (!session) {
      return null;
    }

    const user = this.data.users.find(u => u.id === session.userId);
    if (!user) {
      return null;
    }

    // Generate new token
    session.token = this.generateJWT(user);
    session.refreshToken = this.generateRefreshToken();
    session.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    session.lastActivity = new Date().toISOString();

    return { token: session.token, user };
  }

  public async logout(token: string): Promise<boolean> {
    await this.simulateDelay();

    const session = this.data.sessions.find(s => s.token === token);
    if (session) {
      session.isActive = false;
      return true;
    }
    return false;
  }

  public async getUserProfile(userId: string): Promise<User | null> {
    await this.simulateDelay();
    return this.data.users.find(u => u.id === userId) || null;
  }

  public async updateUserProfile(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    await this.simulateDelay();

    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return null;
    }

    this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
    return this.data.users[userIndex];
  }

  private generateJWT(user: User): string {
    // Mock JWT generation
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      permissions: user.permissions,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Buffer.from(JSON.stringify(payload)).toString('base64')}.mock-signature`;
  }

  private generateRefreshToken(): string {
    return `refresh-${this.generateId()}-${Date.now()}`;
  }

  public async updateSettings(settings: any, tenantId?: string): Promise<any> {
    await this.simulateDelay();
    this.data.settings = { ...this.data.settings, ...settings };
    return this.data.settings;
  }

  // Dashboard data
  public async getDashboardData(tenantId?: string): Promise<any> {
    await this.simulateDelay();

    const stats = await this.getStats(tenantId);
    const tanks = await this.getTanks(tenantId);
    const deliveries = await this.getDeliveries(tenantId);
    const transactions = await this.getTransactions(tenantId);
    const alerts = await this.getAlerts(tenantId);

    // Calculate dashboard metrics
    const totalRevenue = transactions
      .filter(t => t.type === 'fuel_sale' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalVolume = tanks.reduce((sum, tank) => sum + tank.currentLevel, 0);
    const activeDeliveries = deliveries.filter(
      d => d.status === 'IN_PROGRESS'
    ).length;
    const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;

    return {
      overview: {
        totalRevenue,
        fuelInventory: totalVolume,
        activeDeliveries,
        dailySales: transactions
          .filter(
            t =>
              t.type === 'fuel_sale' && this.isToday(t.timestamp.toISOString())
          )
          .reduce((sum, t) => sum + t.amount, 0),
      },
      stats: {
        revenue: {
          current: totalRevenue,
          previous: totalRevenue * 0.9, // Mock previous data
          change: 12.5,
          trend: 'up',
        },
        inventory: {
          current: totalVolume,
          previous: totalVolume * 1.02,
          change: -2.3,
          trend: 'down',
        },
        deliveries: {
          current: activeDeliveries,
          previous: activeDeliveries - 1,
          change: 5.2,
          trend: 'up',
        },
        sales: {
          current: transactions
            .filter(
              t =>
                t.type === 'fuel_sale' &&
                this.isToday(t.timestamp.toISOString())
            )
            .reduce((sum, t) => sum + t.amount, 0),
          previous: 145200,
          change: 8.1,
          trend: 'up',
        },
      },
      tankLevels: tanks.map(tank => ({
        id: tank.id,
        name: tank.name,
        level: Math.round((tank.currentLevel / tank.capacity) * 100),
        capacity: tank.capacity,
        current: tank.currentLevel,
        status: this.getTankStatus(tank.currentLevel, tank.capacity),
      })),
      recentTransactions: transactions
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 5),
      alerts: alerts.filter(alert => alert.status === 'ACTIVE').slice(0, 5),
    };
  }

  // Helper methods
  private getResourceData<T>(resource: string): T[] {
    switch (resource) {
      case 'tanks':
        return this.data.tanks as T[];
      case 'deliveries':
        return this.data.deliveries as T[];
      case 'transactions':
        return this.data.transactions as T[];
      case 'alerts':
        return this.data.alerts as T[];
      case 'vehicles':
        return this.data.vehicles as T[];
      case 'users':
        return this.data.users as T[];
      case 'sessions':
        return this.data.sessions as T[];
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private isToday(timestamp: string): boolean {
    const today = new Date().toDateString();
    const date = new Date(timestamp).toDateString();
    return today === date;
  }

  private getTankStatus(current: number, capacity: number): string {
    const percentage = (current / capacity) * 100;
    if (percentage < 20) return 'critical';
    if (percentage < 50) return 'low';
    if (percentage < 80) return 'medium';
    return 'optimal';
  }
}

// Export singleton instance
export const mockApiService = MockApiService.getInstance();
