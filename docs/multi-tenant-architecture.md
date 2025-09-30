# Multi-Tenant Architecture Documentation

## Overview

This document provides comprehensive documentation for the multi-tenant architecture implementation in the petroleum SaaS application. The architecture ensures complete data isolation, security, and scalability across multiple tenants.

## Architecture Components

### 1. Tenant Context Management

#### TenantProvider Component

The `TenantProvider` component provides tenant context throughout the application using React Context.

```tsx
import { TenantProvider } from '@/components/tenant-provider';

function App() {
  return (
    <TenantProvider initialTenantId="tenant-id">
      <YourApp />
    </TenantProvider>
  );
}
```

#### Tenant Resolution Strategies

The system supports three tenant resolution strategies:

1. **Subdomain-based**: `tenant.petromanager.com`
2. **Path-based**: `/tenant/dashboard`
3. **Custom domain**: `custom-domain.com`

#### Usage Hooks

```tsx
import {
  useTenant,
  useRequiredTenant,
  useTenantRouter,
} from '@/components/tenant-provider';

function MyComponent() {
  const { tenant, isLoading, error } = useTenant();
  const requiredTenant = useRequiredTenant(); // Throws if no tenant
  const { push, replace } = useTenantRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Welcome to {tenant.name}</div>;
}
```

### 2. Tenant-Aware API Client

#### Basic Usage

```tsx
import { useTenantAPI } from '@/lib/tenant-aware-api-client';

function MyComponent() {
  const apiClient = useTenantAPI();

  const handleCreate = async data => {
    try {
      const result = await apiClient.create('tanks', data);
      console.log('Created:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => handleCreate({ name: 'New Tank' })}>
      Create Tank
    </button>
  );
}
```

#### CRUD Operations

```tsx
// Create
const tank = await apiClient.create('tanks', {
  name: 'Tank 1',
  capacity: 1000,
});

// Read
const tanks = await apiClient.findMany('tanks', { status: 'active' });
const tank = await apiClient.findOne('tanks', 'tank-id');

// Update
const updatedTank = await apiClient.update('tanks', 'tank-id', { level: 80 });

// Delete
await apiClient.delete('tanks', 'tank-id');

// Batch operations
const tanks = await apiClient.createMany('tanks', [
  { name: 'Tank 1' },
  { name: 'Tank 2' },
]);
```

#### File Upload

```tsx
const file = new File(['content'], 'document.pdf');
const result = await apiClient.uploadFile('documents', file, {
  category: 'reports',
});
```

### 3. Tenant-Scoped Queries

#### React Query Integration

```tsx
import { useTenantQuery, useTenantMutation } from '@/hooks/use-tenant-query';

function TanksList() {
  const { data: tanks, isLoading } = useTenantQuery(
    ['tanks'],
    () => apiClient.findMany('tanks'),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const createTank = useTenantMutation(data => apiClient.create('tanks', data));

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {tanks?.map(tank => (
        <div key={tank.id}>{tank.name}</div>
      ))}
    </div>
  );
}
```

#### Pre-built Hooks

```tsx
import {
  useTanks,
  useTank,
  useCreateTank,
  useDashboardAnalytics,
} from '@/hooks/use-tenant-query';

function Dashboard() {
  const { data: tanks } = useTanks();
  const { data: analytics } = useDashboardAnalytics();
  const createTank = useCreateTank();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Tanks: {tanks?.length}</p>
    </div>
  );
}
```

### 4. Permission-Based Access Control

#### Permission Checker

```tsx
import { usePermissions } from '@/lib/permission-checker';

function MyComponent() {
  const { hasPermission, hasFeature, canAccess, canCreate, isAdmin } =
    usePermissions();

  if (!hasPermission('tanks', 'read')) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      {canCreate('tanks') && <button>Create Tank</button>}
      {hasFeature('predictive_analytics') && <PredictiveAnalytics />}
    </div>
  );
}
```

#### Protected Components

```tsx
import {
  ProtectedComponent,
  FeatureGate,
  PermissionGate,
} from '@/components/protected-component';

function Dashboard() {
  return (
    <div>
      <PermissionGate resource="tanks" action="read">
        <TanksList />
      </PermissionGate>

      <FeatureGate feature="predictive_analytics">
        <PredictiveAnalytics />
      </FeatureGate>

      <ProtectedComponent
        resource="users"
        action="admin"
        fallback={<div>Admin access required</div>}
      >
        <UserManagement />
      </ProtectedComponent>
    </div>
  );
}
```

#### Higher-Order Components

```tsx
import { withPermission, withFeature } from '@/components/protected-component';

const ProtectedTanksList = withPermission(
  TanksList,
  'tanks',
  'read',
  <div>Access denied to tanks</div>
);

const FeatureGatedAnalytics = withFeature(
  PredictiveAnalytics,
  'predictive_analytics',
  <div>Feature not available</div>
);
```

### 5. Tenant-Specific Theming

#### Theme Manager

```tsx
import { useTenantTheme } from '@/lib/tenant-theme';

function ThemedComponent() {
  const { theme, branding } = useTenantTheme();

  return (
    <div
      style={{
        backgroundColor: theme?.colors.primary,
        color: theme?.colors.text,
      }}
    >
      <img src={branding?.logo} alt={branding?.name} />
      <h1>{branding?.name}</h1>
    </div>
  );
}
```

#### CSS Variables

The theme system automatically injects CSS variables:

```css
:root {
  --tenant-primary: #3b82f6;
  --tenant-secondary: #64748b;
  --tenant-accent: #f59e0b;
  --tenant-background: #ffffff;
  --tenant-text: #1e293b;
  /* ... more variables */
}
```

### 6. Data Isolation and Security

#### Tenant-Safe Data List

```tsx
import { TenantSafeDataList } from '@/components/tenant-safe-data-list';

function TanksManagement() {
  return (
    <TenantSafeDataList
      resource="tanks"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'level', label: 'Level', render: value => `${value}%` },
        { key: 'status', label: 'Status' },
      ]}
      searchFields={['name', 'location']}
      onItemClick={tank => console.log('Selected:', tank)}
      onItemEdit={tank => console.log('Edit:', tank)}
      exportable={true}
      refreshable={true}
    />
  );
}
```

#### Data Validation

```tsx
import { validateTenantData } from '@/lib/tenant-aware-api-client';

function processData(data: any[], tenantId: string) {
  try {
    const validated = validateTenantData(data, tenantId);
    return validated;
  } catch (error) {
    console.error('Cross-tenant data detected:', error);
    return [];
  }
}
```

### 7. Error Handling

#### Tenant Error Handler

```tsx
import { useTenantErrorHandler } from '@/lib/tenant-error-handler';

function MyComponent() {
  const { handleError, handleAPIError, handleCrossTenantAccess } =
    useTenantErrorHandler();

  const handleAction = async () => {
    try {
      await apiClient.create('tanks', data);
    } catch (error) {
      handleError(error, {
        resource: 'tanks',
        action: 'create',
      });
    }
  };

  return <button onClick={handleAction}>Create</button>;
}
```

#### Error Boundaries

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### 8. Performance Optimization

#### Tenant Cache

```tsx
import { useTenantCache } from '@/lib/tenant-cache';

function MyComponent() {
  const { set, get, has, clear } = useTenantCache();

  const loadData = async () => {
    if (has('tanks-data')) {
      return get('tanks-data');
    }

    const data = await apiClient.findMany('tanks');
    set('tanks-data', data, { ttl: 5 * 60 * 1000 }); // 5 minutes
    return data;
  };

  return <div>Data loaded</div>;
}
```

#### Performance Monitoring

```tsx
import { useTenantPerformanceMonitor } from '@/lib/tenant-performance-monitor';

function MyComponent() {
  const { recordMetric } = useTenantPerformanceMonitor();

  const handleAction = async () => {
    const startTime = performance.now();

    try {
      await apiClient.create('tanks', data);
      recordMetric('tank_creation_time', performance.now() - startTime, 'ms');
    } catch (error) {
      recordMetric('tank_creation_error', 1, 'count');
    }
  };

  return <button onClick={handleAction}>Create</button>;
}
```

## Best Practices

### 1. Component Design

- Always use tenant context hooks instead of props
- Wrap components with permission checks
- Use error boundaries for graceful error handling
- Implement loading states for better UX

### 2. Data Fetching

- Use tenant-scoped query keys
- Implement proper error handling
- Cache data appropriately
- Validate tenant ownership

### 3. Security

- Never trust client-side data
- Validate all inputs
- Use permission checks for sensitive operations
- Log security incidents

### 4. Performance

- Use lazy loading for heavy components
- Implement proper caching strategies
- Monitor performance metrics
- Optimize bundle size

## Migration Guide

### From Single-Tenant to Multi-Tenant

1. **Wrap your app with TenantProvider**

```tsx
// Before
function App() {
  return <YourApp />;
}

// After
function App() {
  return (
    <TenantProvider>
      <YourApp />
    </TenantProvider>
  );
}
```

2. **Update API calls to use tenant-aware client**

```tsx
// Before
const response = await fetch('/api/tanks');

// After
const apiClient = useTenantAPI();
const tanks = await apiClient.findMany('tanks');
```

3. **Add permission checks**

```tsx
// Before
<button onClick={createTank}>Create Tank</button>

// After
<PermissionGate resource="tanks" action="create">
  <button onClick={createTank}>Create Tank</button>
</PermissionGate>
```

4. **Update routing**

```tsx
// Before
router.push('/dashboard');

// After
const { push } = useTenantRouter();
push('/dashboard');
```

## Troubleshooting

### Common Issues

1. **"No tenant context available"**
   - Ensure component is wrapped with TenantProvider
   - Check tenant resolution in middleware

2. **"Cross-tenant data access detected"**
   - Verify API responses include correct tenantId
   - Check data validation logic

3. **Permission denied errors**
   - Verify user permissions in auth store
   - Check permission checker configuration

4. **Theme not applying**
   - Ensure tenant has theme configuration
   - Check CSS variable injection

### Debug Tools

```tsx
// Debug tenant context
console.log('Tenant:', useTenant());

// Debug permissions
console.log('Permissions:', usePermissions().getPermissionSummary());

// Debug cache
console.log('Cache stats:', useTenantCache().getStats());
```

## API Reference

### TenantProvider Props

- `children`: React.ReactNode
- `fallback?`: React.ReactNode
- `initialTenantId?`: string

### useTenant Return

- `tenant`: Tenant | null
- `isLoading`: boolean
- `error`: string | null
- `switchTenant`: (tenantId: string) => Promise<void>
- `refreshTenant`: () => Promise<void>
- `clearTenant`: () => void

### API Client Methods

- `create(resource, data)`: Promise<T>
- `findMany(resource, filters?)`: Promise<T[]>
- `findOne(resource, id)`: Promise<T>
- `update(resource, id, data)`: Promise<T>
- `delete(resource, id)`: Promise<void>
- `uploadFile(resource, file, data?)`: Promise<T>

### Permission Methods

- `hasPermission(resource, action)`: boolean
- `hasFeature(feature)`: boolean
- `canAccess(resource)`: boolean
- `canCreate(resource)`: boolean
- `canUpdate(resource)`: boolean
- `canDelete(resource)`: boolean
- `isAdmin()`: boolean

## Security Considerations

1. **Data Isolation**: All data is automatically scoped to the current tenant
2. **Permission Enforcement**: Access control is enforced at multiple levels
3. **Input Validation**: All inputs are validated and sanitized
4. **Error Handling**: Security incidents are logged and monitored
5. **Headers**: Security headers are automatically added for tenant isolation

## Performance Considerations

1. **Caching**: Tenant-scoped caching prevents data leaks
2. **Lazy Loading**: Heavy components are loaded on demand
3. **Query Optimization**: React Query is configured for optimal performance
4. **Monitoring**: Performance metrics are tracked per tenant
5. **Bundle Size**: Code splitting reduces initial load time
