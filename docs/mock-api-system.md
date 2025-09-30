# Mock API System Documentation

## Overview

The mock API system provides a centralized way to serve realistic data for the petroleum SaaS application during development and testing. It replaces scattered mock data with a structured, tenant-aware service layer.

## Architecture

### Core Components

1. **Mock Data Files** (`lib/mock-api/data/`)
   - JSON files containing realistic mock data
   - Structured according to TypeScript interfaces
   - Tenant-scoped data with proper relationships

2. **Mock API Service** (`lib/mock-api/mock-api-service.ts`)
   - Centralized service for data operations
   - CRUD operations with tenant isolation
   - Realistic delays and error simulation
   - Dashboard data aggregation

3. **API Routes** (`app/api/tenants/[tenantId]/`)
   - Next.js API routes using the mock service
   - Consistent response format
   - Proper error handling and validation

## Data Structure

### Available Resources

- **Tanks**: Fuel storage tanks with levels, capacity, and status
- **Deliveries**: Fuel delivery operations with routes and drivers
- **Transactions**: Sales and purchase transactions
- **Alerts**: System alerts and notifications
- **Settings**: Company-wide configuration data
- **Vehicles**: Fleet vehicles with maintenance schedules
- **Users**: Tenant users with roles and permissions
- **Suppliers**: External fuel suppliers

### Tenant Isolation

All data includes `tenantId` fields to ensure proper multi-tenancy:

- Data is filtered by tenant in all operations
- Cross-tenant access is prevented
- Each tenant sees only their own data

## API Endpoints

### Core Resources

```
GET    /api/tenants/[tenantId]/tanks
POST   /api/tenants/[tenantId]/tanks
GET    /api/tenants/[tenantId]/tanks/[tankId]
PUT    /api/tenants/[tenantId]/tanks/[tankId]
DELETE /api/tenants/[tenantId]/tanks/[tankId]

GET    /api/tenants/[tenantId]/deliveries
POST   /api/tenants/[tenantId]/deliveries

GET    /api/tenants/[tenantId]/transactions
POST   /api/tenants/[tenantId]/transactions

GET    /api/tenants/[tenantId]/alerts
POST   /api/tenants/[tenantId]/alerts

GET    /api/tenants/[tenantId]/settings
PUT    /api/tenants/[tenantId]/settings
```

### Aggregated Data

```
GET    /api/tenants/[tenantId]/dashboard
GET    /api/tenants/[tenantId]/inventory
GET    /api/tenants/[tenantId]/fleet
GET    /api/tenants/[tenantId]/sales
GET    /api/tenants/[tenantId]/reports
GET    /api/tenants/[tenantId]/users
GET    /api/tenants/[tenantId]/suppliers
GET    /api/tenants/[tenantId]/distribution
```

## Response Format

All API responses follow a consistent format:

```json
{
  "data": <resource_data>,
  "meta": {
    "tenantId": "tenant-id",
    "total": <count>,
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

## Features

### Realistic Behavior

- **Network Delays**: Configurable delays to simulate real API calls
- **Error Simulation**: Optional error rates for testing error handling
- **Data Relationships**: Proper foreign key relationships between resources
- **Calculated Metrics**: Dashboard data with realistic calculations

### Development Features

- **Hot Reloading**: Changes to JSON files are reflected immediately
- **Type Safety**: Full TypeScript support with proper interfaces
- **Consistent Patterns**: All endpoints follow the same structure
- **Easy Extension**: Simple to add new resources and endpoints

## Usage Examples

### Fetching Tank Data

```typescript
const response = await fetch('/api/tenants/petromax-energy/tanks');
const { data: tanks } = await response.json();
```

### Creating a New Delivery

```typescript
const newDelivery = {
  vehicleId: 'vehicle-001',
  driverId: 'driver-001',
  fuelType: 'DIESEL',
  quantity: 5000,
  route: {
    name: 'Downtown Route',
    waypoints: [...],
    distance: 15.5,
    estimatedDuration: 45
  },
  scheduledAt: '2024-01-16T14:00:00Z'
};

const response = await fetch('/api/tenants/petromax-energy/deliveries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newDelivery)
});
```

### Dashboard Data

```typescript
const response = await fetch('/api/tenants/petromax-energy/dashboard');
const { data: dashboardData } = await response.json();
// Returns aggregated metrics, tank levels, recent transactions, alerts
```

## Configuration

### Mock Service Options

```typescript
const options = {
  delay: 100, // Network delay in milliseconds
  errorRate: 0.05, // 5% error rate for testing
  tenantId: 'tenant', // Tenant isolation
};
```

### Adding New Data

1. Create JSON file in `lib/mock-api/data/`
2. Add resource to mock service
3. Create API route in `app/api/tenants/[tenantId]/`
4. Update TypeScript interfaces

## Benefits

- **Consistent Development**: Same data structure across all environments
- **Realistic Testing**: Data relationships and calculations match production
- **Fast Iteration**: No database setup required for development
- **Easy Debugging**: Clear data structure and error messages
- **Team Collaboration**: Shared mock data ensures consistency

## Migration Path

When ready to move to real APIs:

1. Replace mock service calls with actual database queries
2. Update API routes to use real data sources
3. Keep the same response format for seamless transition
4. Mock data files can serve as seed data for development databases
