import { http, HttpResponse } from 'msw';

// Mock API handlers
export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['admin'],
        permissions: [
          { resource: 'tanks', action: 'read' },
          { resource: 'tanks', action: 'write' },
          { resource: 'deliveries', action: 'read' },
          { resource: 'deliveries', action: 'write' },
        ],
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/auth/profile', () => {
    return HttpResponse.json({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      roles: ['admin'],
      permissions: [
        { resource: 'tanks', action: 'read' },
        { resource: 'tanks', action: 'write' },
        { resource: 'deliveries', action: 'read' },
        { resource: 'deliveries', action: 'write' },
      ],
    });
  }),

  // Tanks endpoints
  http.get('/api/tanks', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Tank A',
        capacity: 10000,
        currentLevel: 7500,
        product: 'Gasoline',
        location: 'Station 1',
        status: 'active',
        lastUpdated: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        name: 'Tank B',
        capacity: 8000,
        currentLevel: 3200,
        product: 'Diesel',
        location: 'Station 2',
        status: 'active',
        lastUpdated: '2024-01-15T09:15:00Z',
      },
    ]);
  }),

  http.get('/api/tanks/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Tank A',
      capacity: 10000,
      currentLevel: 7500,
      product: 'Gasoline',
      location: 'Station 1',
      status: 'active',
      lastUpdated: '2024-01-15T10:30:00Z',
      history: [
        {
          date: '2024-01-15T10:30:00Z',
          level: 7500,
          action: 'delivery',
          amount: 1000,
        },
        {
          date: '2024-01-14T08:00:00Z',
          level: 6500,
          action: 'sale',
          amount: 500,
        },
      ],
    });
  }),

  http.post('/api/tanks', () => {
    return HttpResponse.json({
      id: '3',
      name: 'New Tank',
      capacity: 5000,
      currentLevel: 0,
      product: 'Gasoline',
      location: 'Station 3',
      status: 'active',
      lastUpdated: new Date().toISOString(),
    });
  }),

  // Deliveries endpoints
  http.get('/api/deliveries', () => {
    return HttpResponse.json([
      {
        id: '1',
        tankId: '1',
        supplier: 'PetroSupply Co.',
        amount: 1000,
        scheduledDate: '2024-01-16T08:00:00Z',
        status: 'scheduled',
        driver: 'John Smith',
        vehicle: 'Truck-001',
      },
      {
        id: '2',
        tankId: '2',
        supplier: 'FuelCorp',
        amount: 800,
        scheduledDate: '2024-01-17T10:00:00Z',
        status: 'in-progress',
        driver: 'Jane Doe',
        vehicle: 'Truck-002',
      },
    ]);
  }),

  http.post('/api/deliveries', () => {
    return HttpResponse.json({
      id: '3',
      tankId: '1',
      supplier: 'New Supplier',
      amount: 500,
      scheduledDate: '2024-01-18T09:00:00Z',
      status: 'scheduled',
      driver: 'Bob Johnson',
      vehicle: 'Truck-003',
    });
  }),

  // Analytics endpoints
  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json({
      totalTanks: 5,
      totalCapacity: 45000,
      totalCurrentLevel: 28000,
      utilizationRate: 62.2,
      recentDeliveries: 12,
      recentSales: 8,
      alerts: [
        {
          id: '1',
          type: 'warning',
          message: 'Tank B is running low',
          tankId: '2',
          timestamp: '2024-01-15T11:00:00Z',
        },
      ],
    });
  }),

  http.get('/api/analytics/sales', () => {
    return HttpResponse.json({
      daily: [
        { date: '2024-01-15', amount: 1500, volume: 1200 },
        { date: '2024-01-14', amount: 1800, volume: 1400 },
        { date: '2024-01-13', amount: 1200, volume: 900 },
      ],
      weekly: [
        { week: '2024-W03', amount: 10500, volume: 8400 },
        { week: '2024-W02', amount: 11200, volume: 8900 },
        { week: '2024-W01', amount: 9800, volume: 7800 },
      ],
      monthly: [
        { month: '2024-01', amount: 45000, volume: 36000 },
        { month: '2023-12', amount: 42000, volume: 33500 },
        { month: '2023-11', amount: 48000, volume: 38500 },
      ],
    });
  }),

  // Reports endpoints
  http.get('/api/reports', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Monthly Sales Report',
        type: 'sales',
        status: 'completed',
        createdAt: '2024-01-15T10:00:00Z',
        fileUrl: '/reports/monthly-sales-2024-01.pdf',
      },
      {
        id: '2',
        name: 'Inventory Status Report',
        type: 'inventory',
        status: 'generating',
        createdAt: '2024-01-15T11:00:00Z',
      },
    ]);
  }),

  http.post('/api/reports', () => {
    return HttpResponse.json({
      id: '3',
      name: 'Custom Report',
      type: 'custom',
      status: 'generating',
      createdAt: new Date().toISOString(),
    });
  }),

  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }),

  // Sync endpoint
  http.post('/api/sync', () => {
    return HttpResponse.json({ success: true });
  }),
];

// Error handlers for testing error scenarios
export const errorHandlers = [
  http.get('/api/tanks', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }),

  http.post('/api/auth/login', () => {
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.get('/api/analytics/dashboard', () => {
    return HttpResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }),
];

// Network error handlers
export const networkErrorHandlers = [
  http.get('/api/tanks', () => {
    return HttpResponse.error();
  }),

  http.post('/api/auth/login', () => {
    return HttpResponse.error();
  }),
];
