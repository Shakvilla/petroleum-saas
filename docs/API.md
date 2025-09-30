# API Documentation

This document provides comprehensive API documentation for the Petroleum Management System frontend integration.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Client](#api-client)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [WebSocket Integration](#websocket-integration)
- [Testing](#testing)
- [Examples](#examples)

## Overview

The Petroleum Management System uses a RESTful API with WebSocket support for real-time updates. The frontend integrates with the API using React Query for caching and state management.

### Base Configuration

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const WS_BASE_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';
```

### API Versioning

All API endpoints are versioned using the URL path:

- `v1`: Current stable version
- `v2`: Beta version (when available)

## Authentication

### Authentication Flow

1. **Login**: POST `/api/v1/auth/login`
2. **Token Storage**: Store JWT token securely
3. **Request Headers**: Include token in Authorization header
4. **Token Refresh**: Automatic token refresh on expiry
5. **Logout**: POST `/api/v1/auth/logout`

### Implementation

```typescript
// hooks/api/use-auth.ts
export function useLogin() {
  const queryClient = useQueryClient();
  const { setUser, setToken } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
    },
    onSuccess: data => {
      setUser(data.user);
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });
}
```

### Token Management

```typescript
// lib/auth.ts
export class AuthManager {
  private static TOKEN_KEY = 'auth_token';

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
```

## API Client

### Base Client

```typescript
// lib/api-client.ts
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = AuthManager.getToken();

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### Error Handling

```typescript
// lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response): ApiError {
    return new ApiError(
      response.status,
      `HTTP ${response.status}: ${response.statusText}`,
      response
    );
  }
}
```

## Endpoints

### Authentication Endpoints

#### POST `/api/v1/auth/login`

Login with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "permissions": ["read:tanks", "write:tanks"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/v1/auth/logout`

Logout and invalidate token.

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/v1/auth/me`

Get current user information.

**Response:**

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin",
    "permissions": ["read:tanks", "write:tanks"]
  }
}
```

### Tank Management Endpoints

#### GET `/api/v1/tanks`

Get all tanks with optional filtering.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term
- `status`: Filter by status
- `location`: Filter by location

**Response:**

```json
{
  "data": [
    {
      "id": "tank-1",
      "name": "Main Storage Tank",
      "capacity": 50000,
      "currentLevel": 35000,
      "status": "active",
      "location": "Warehouse A",
      "lastUpdated": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET `/api/v1/tanks/:id`

Get specific tank details.

**Response:**

```json
{
  "id": "tank-1",
  "name": "Main Storage Tank",
  "capacity": 50000,
  "currentLevel": 35000,
  "status": "active",
  "location": "Warehouse A",
  "specifications": {
    "material": "Steel",
    "diameter": "10m",
    "height": "15m"
  },
  "history": [
    {
      "timestamp": "2024-01-01T12:00:00Z",
      "level": 35000,
      "action": "delivery",
      "amount": 5000
    }
  ]
}
```

#### POST `/api/v1/tanks`

Create a new tank.

**Request:**

```json
{
  "name": "New Storage Tank",
  "capacity": 30000,
  "location": "Warehouse B",
  "specifications": {
    "material": "Steel",
    "diameter": "8m",
    "height": "12m"
  }
}
```

#### PUT `/api/v1/tanks/:id`

Update tank information.

**Request:**

```json
{
  "name": "Updated Tank Name",
  "status": "maintenance"
}
```

#### DELETE `/api/v1/tanks/:id`

Delete a tank.

**Response:**

```json
{
  "message": "Tank deleted successfully"
}
```

### Delivery Management Endpoints

#### GET `/api/v1/deliveries`

Get all deliveries.

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page
- `status`: Filter by status
- `dateFrom`: Start date filter
- `dateTo`: End date filter

**Response:**

```json
{
  "data": [
    {
      "id": "delivery-1",
      "tankId": "tank-1",
      "amount": 5000,
      "status": "completed",
      "scheduledDate": "2024-01-01T10:00:00Z",
      "completedDate": "2024-01-01T11:30:00Z",
      "driver": "John Smith",
      "vehicle": "Truck-001"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### POST `/api/v1/deliveries`

Create a new delivery.

**Request:**

```json
{
  "tankId": "tank-1",
  "amount": 5000,
  "scheduledDate": "2024-01-01T10:00:00Z",
  "driver": "John Smith",
  "vehicle": "Truck-001"
}
```

### Analytics Endpoints

#### GET `/api/v1/analytics/dashboard`

Get dashboard analytics data.

**Response:**

```json
{
  "summary": {
    "totalTanks": 25,
    "totalCapacity": 1250000,
    "currentLevel": 875000,
    "utilization": 70.0
  },
  "recentActivity": [
    {
      "id": "activity-1",
      "type": "delivery",
      "description": "Delivery to Tank A",
      "timestamp": "2024-01-01T12:00:00Z",
      "amount": 5000
    }
  ],
  "alerts": [
    {
      "id": "alert-1",
      "type": "warning",
      "message": "Tank B level below 20%",
      "timestamp": "2024-01-01T11:00:00Z"
    }
  ]
}
```

#### GET `/api/v1/analytics/reports`

Get analytics reports.

**Query Parameters:**

- `type`: Report type (inventory, deliveries, performance)
- `period`: Time period (daily, weekly, monthly)
- `startDate`: Start date
- `endDate`: End date

**Response:**

```json
{
  "report": {
    "type": "inventory",
    "period": "monthly",
    "data": [
      {
        "date": "2024-01-01",
        "level": 35000,
        "deliveries": 5,
        "withdrawals": 3
      }
    ],
    "summary": {
      "totalDeliveries": 25,
      "totalWithdrawals": 15,
      "averageLevel": 32000
    }
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

### Error Handling in React

```typescript
// hooks/api/use-tanks.ts
export function useTanks() {
  return useQuery({
    queryKey: ['tanks'],
    queryFn: () => apiClient.get<Tank[]>('/api/v1/tanks'),
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry on client errors
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
      }
      return failureCount < 3;
    },
    onError: error => {
      if (error instanceof ApiError && error.status === 401) {
        // Handle unauthorized
        AuthManager.removeToken();
        window.location.href = '/login';
      }
    },
  });
}
```

## Rate Limiting

### Rate Limit Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### Client-Side Rate Limiting

```typescript
// lib/rate-limiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 15 * 60 * 1000
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const userRequests = this.requests.get(identifier) || [];
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }
}
```

## WebSocket Integration

### Connection Setup

```typescript
// hooks/use-websocket.ts
export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(WS_BASE_URL, {
      auth: {
        token: AuthManager.getToken(),
      },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected };
}
```

### Real-time Updates

```typescript
// hooks/use-realtime-tanks.ts
export function useRealtimeTanks() {
  const queryClient = useQueryClient();
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    const handleTankUpdate = (data: TankUpdate) => {
      queryClient.setQueryData(['tanks', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['tanks'] });
    };

    socket.on('tank:update', handleTankUpdate);

    return () => {
      socket.off('tank:update', handleTankUpdate);
    };
  }, [socket, queryClient]);
}
```

### WebSocket Events

#### Client to Server

- `join:room` - Join a specific room
- `leave:room` - Leave a room
- `tank:subscribe` - Subscribe to tank updates
- `delivery:subscribe` - Subscribe to delivery updates

#### Server to Client

- `tank:update` - Tank level or status update
- `delivery:status` - Delivery status change
- `alert:new` - New system alert
- `notification:new` - New notification

## Testing

### API Mocking

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/v1/tanks', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'tank-1',
          name: 'Test Tank',
          capacity: 50000,
          currentLevel: 35000,
          status: 'active',
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });
  }),

  http.post('/api/v1/tanks', () => {
    return HttpResponse.json({
      id: 'tank-2',
      name: 'New Tank',
      capacity: 30000,
      currentLevel: 0,
      status: 'active',
    });
  }),
];
```

### Integration Testing

```typescript
// test/integration/tanks.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TanksList } from '@/components/TanksList';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('TanksList Integration', () => {
  it('displays tanks from API', async () => {
    const queryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <TanksList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Tank')).toBeInTheDocument();
    });
  });
});
```

## Examples

### Complete Tank Management

```typescript
// components/TankManagement.tsx
export function TankManagement() {
  const { data: tanks, isLoading, error } = useTanks();
  const createTankMutation = useCreateTank();
  const updateTankMutation = useUpdateTank();
  const deleteTankMutation = useDeleteTank();

  const handleCreateTank = async (tankData: CreateTankData) => {
    try {
      await createTankMutation.mutateAsync(tankData);
      toast.success('Tank created successfully');
    } catch (error) {
      toast.error('Failed to create tank');
    }
  };

  const handleUpdateTank = async (id: string, updates: UpdateTankData) => {
    try {
      await updateTankMutation.mutateAsync({ id, updates });
      toast.success('Tank updated successfully');
    } catch (error) {
      toast.error('Failed to update tank');
    }
  };

  const handleDeleteTank = async (id: string) => {
    if (confirm('Are you sure you want to delete this tank?')) {
      try {
        await deleteTankMutation.mutateAsync(id);
        toast.success('Tank deleted successfully');
      } catch (error) {
        toast.error('Failed to delete tank');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tanks</div>;

  return (
    <div>
      <h1>Tank Management</h1>
      <TankForm onSubmit={handleCreateTank} />
      <TanksList
        tanks={tanks}
        onUpdate={handleUpdateTank}
        onDelete={handleDeleteTank}
      />
    </div>
  );
}
```

### Real-time Dashboard

```typescript
// components/Dashboard.tsx
export function Dashboard() {
  const { data: analytics } = useAnalytics();
  const { isConnected } = useWebSocket();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Tanks"
          value={analytics?.summary.totalTanks}
          icon={<TankIcon />}
        />
        <MetricCard
          title="Total Capacity"
          value={analytics?.summary.totalCapacity}
          format="number"
          icon={<CapacityIcon />}
        />
        <MetricCard
          title="Current Level"
          value={analytics?.summary.currentLevel}
          format="number"
          icon={<LevelIcon />}
        />
        <MetricCard
          title="Utilization"
          value={analytics?.summary.utilization}
          format="percentage"
          icon={<UtilizationIcon />}
        />
      </div>

      <RecentActivity activities={analytics?.recentActivity} />
      <AlertsPanel alerts={analytics?.alerts} />
    </div>
  );
}
```

### Form with Validation

```typescript
// components/TankForm.tsx
export function TankForm({ onSubmit }: TankFormProps) {
  const form = useForm<TankFormData>({
    resolver: zodResolver(tankSchema),
    defaultValues: {
      name: '',
      capacity: 0,
      location: '',
    },
  });

  const handleSubmit = (data: TankFormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name">Tank Name</label>
          <input
            id="name"
            {...form.register('name')}
            className="w-full p-2 border rounded"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="capacity">Capacity (liters)</label>
          <input
            id="capacity"
            type="number"
            {...form.register('capacity', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {form.formState.errors.capacity && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.capacity.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            {...form.register('location')}
            className="w-full p-2 border rounded"
          />
          {form.formState.errors.location && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {form.formState.isSubmitting ? 'Creating...' : 'Create Tank'}
        </button>
      </div>
    </form>
  );
}
```

This API documentation provides comprehensive guidance for integrating with the Petroleum Management System API. For additional support or questions, please refer to the development team or create an issue in the project repository.
