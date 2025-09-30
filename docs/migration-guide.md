# Migration Guide: Single-Tenant to Multi-Tenant

This guide will help you migrate your existing single-tenant petroleum SaaS application to a fully multi-tenant architecture.

## Prerequisites

- Existing single-tenant application
- Understanding of React, Next.js, and TypeScript
- Access to your codebase and development environment

## Migration Steps

### Step 1: Update Dependencies

Add the new multi-tenant dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0"
  }
}
```

### Step 2: Update Type Definitions

Add tenant-related types to your `types/index.ts`:

```typescript
export interface Tenant {
  id: string;
  name: string;
  plan: 'basic' | 'standard' | 'premium' | 'enterprise';
  settings: TenantSettings;
  branding: BrandingConfig;
  features: FeatureFlags;
  theme?: TenantTheme;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  timezone: string;
  currency: string;
  language: string;
}

export interface BrandingConfig {
  logo: string;
  favicon: string;
  name: string;
  tagline?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
}

export interface FeatureFlags {
  predictive_analytics: boolean;
  iot_monitoring: boolean;
  advanced_reporting: boolean;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: Permission[];
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Step 3: Update App Layout

Wrap your application with the `TenantProvider`:

```tsx
// app/layout.tsx
import { TenantProvider } from '@/components/tenant-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TenantProvider>{children}</TenantProvider>
      </body>
    </html>
  );
}
```

### Step 4: Update API Calls

Replace direct fetch calls with the tenant-aware API client:

```tsx
// Before
const fetchTanks = async () => {
  const response = await fetch('/api/tanks');
  return response.json();
};

// After
import { useTenantAPI } from '@/lib/tenant-aware-api-client';

const useTanks = () => {
  const apiClient = useTenantAPI();

  return useQuery({
    queryKey: ['tanks'],
    queryFn: () => apiClient.findMany('tanks'),
  });
};
```

### Step 5: Update Components

Add tenant context and permission checks to your components:

```tsx
// Before
function TanksList() {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    fetchTanks().then(setTanks);
  }, []);

  return (
    <div>
      {tanks.map(tank => (
        <div key={tank.id}>{tank.name}</div>
      ))}
    </div>
  );
}

// After
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { ProtectedComponent } from '@/components/protected-component';

function TanksList() {
  const { tenant } = useTenant();
  const { data: tanks, isLoading } = useTenantQuery(['tanks'], () =>
    apiClient.findMany('tanks')
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <ProtectedComponent resource="tanks" action="read">
      <div>
        {tanks?.map(tank => (
          <div key={tank.id}>{tank.name}</div>
        ))}
      </div>
    </ProtectedComponent>
  );
}
```

### Step 6: Update Routing

Replace Next.js router with tenant-aware routing:

```tsx
// Before
import { useRouter } from 'next/navigation';

function Navigation() {
  const router = useRouter();

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return <button onClick={goToDashboard}>Dashboard</button>;
}

// After
import { useTenantRouter } from '@/components/tenant-provider';

function Navigation() {
  const { push } = useTenantRouter();

  const goToDashboard = () => {
    push('/dashboard');
  };

  return <button onClick={goToDashboard}>Dashboard</button>;
}
```

### Step 7: Add Permission Checks

Wrap sensitive components with permission gates:

```tsx
// Before
function UserManagement() {
  return (
    <div>
      <h1>User Management</h1>
      <UserList />
      <CreateUserForm />
    </div>
  );
}

// After
import { PermissionGate } from '@/components/protected-component';

function UserManagement() {
  return (
    <PermissionGate resource="users" action="admin">
      <div>
        <h1>User Management</h1>
        <UserList />
        <CreateUserForm />
      </div>
    </PermissionGate>
  );
}
```

### Step 8: Update State Management

Replace global state with tenant-scoped state:

```tsx
// Before
const useTanksStore = create(set => ({
  tanks: [],
  setTanks: tanks => set({ tanks }),
}));

// After
import { useTenantStore } from '@/stores/tenant-store';

const useTanksStore = create(set => ({
  tanks: [],
  setTanks: tanks => set({ tanks }),
  clearTanks: () => set({ tanks: [] }),
}));
```

### Step 9: Update Error Handling

Replace generic error handling with tenant-aware error handling:

```tsx
// Before
try {
  await fetch('/api/tanks');
} catch (error) {
  console.error('Error:', error);
}

// After
import { useTenantErrorHandler } from '@/lib/tenant-error-handler';

const { handleError } = useTenantErrorHandler();

try {
  await apiClient.findMany('tanks');
} catch (error) {
  handleError(error, { resource: 'tanks', action: 'read' });
}
```

### Step 10: Update Theming

Replace static themes with dynamic tenant themes:

```tsx
// Before
const theme = {
  primary: '#3b82f6',
  secondary: '#64748b',
};

// After
import { useTenantTheme } from '@/lib/tenant-theme';

function ThemedComponent() {
  const { theme } = useTenantTheme();

  return (
    <div
      style={{
        backgroundColor: theme?.colors.primary,
      }}
    >
      Content
    </div>
  );
}
```

## Component Migration Examples

### Dashboard Component

```tsx
// Before
function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(setStats);
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <StatsCards stats={stats} />
      <TanksList />
    </div>
  );
}

// After
function Dashboard() {
  const { tenant } = useTenant();
  const { data: stats } = useTenantQuery(['dashboard', 'stats'], () =>
    apiClient.findOne('dashboard', 'stats')
  );

  return (
    <div>
      <h1>{tenant?.name} Dashboard</h1>
      <ProtectedComponent resource="dashboard" action="read">
        <StatsCards stats={stats} />
      </ProtectedComponent>
      <ProtectedComponent resource="tanks" action="read">
        <TanksList />
      </ProtectedComponent>
    </div>
  );
}
```

### Form Component

```tsx
// Before
function CreateTankForm() {
  const [formData, setFormData] = useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch('/api/tanks', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      <button type="submit">Create</button>
    </form>
  );
}

// After
function CreateTankForm() {
  const [formData, setFormData] = useState({});
  const apiClient = useTenantAPI();
  const { handleError } = useTenantErrorHandler();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await apiClient.create('tanks', formData);
    } catch (error) {
      handleError(error, { resource: 'tanks', action: 'create' });
    }
  };

  return (
    <PermissionGate resource="tanks" action="create">
      <form onSubmit={handleSubmit}>
        <input
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <button type="submit">Create</button>
      </form>
    </PermissionGate>
  );
}
```

## Testing Migration

### Update Unit Tests

```tsx
// Before
import { render, screen } from '@testing-library/react';
import { TanksList } from './TanksList';

test('renders tanks list', () => {
  render(<TanksList />);
  expect(screen.getByText('Tank 1')).toBeInTheDocument();
});

// After
import { render, screen } from '@testing-library/react';
import { TenantProvider } from '@/components/tenant-provider';
import { TanksList } from './TanksList';

const mockTenant = {
  id: 'test-tenant',
  name: 'Test Tenant',
  // ... other tenant properties
};

test('renders tanks list', () => {
  render(
    <TenantProvider initialTenantId="test-tenant">
      <TanksList />
    </TenantProvider>
  );
  expect(screen.getByText('Tank 1')).toBeInTheDocument();
});
```

### Update Integration Tests

```tsx
// Before
test('creates new tank', async () => {
  render(<CreateTankForm />);

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'New Tank' },
  });

  fireEvent.click(screen.getByText('Create'));

  await waitFor(() => {
    expect(screen.getByText('Tank created')).toBeInTheDocument();
  });
});

// After
test('creates new tank', async () => {
  render(
    <TenantProvider initialTenantId="test-tenant">
      <CreateTankForm />
    </TenantProvider>
  );

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'New Tank' },
  });

  fireEvent.click(screen.getByText('Create'));

  await waitFor(() => {
    expect(screen.getByText('Tank created')).toBeInTheDocument();
  });
});
```

## Deployment Considerations

### Environment Variables

Add tenant-related environment variables:

```env
# Tenant configuration
NEXT_PUBLIC_TENANT_RESOLUTION_STRATEGY=subdomain
NEXT_PUBLIC_DEFAULT_TENANT=demo
NEXT_PUBLIC_TENANT_SELECTION_URL=/tenant-selection

# API configuration
NEXT_PUBLIC_API_BASE_URL=https://api.petromanager.com
NEXT_PUBLIC_TENANT_API_PREFIX=/api/tenants
```

### Database Migration

Update your database schema to support multi-tenancy:

```sql
-- Add tenant_id to existing tables
ALTER TABLE tanks ADD COLUMN tenant_id VARCHAR(50) NOT NULL;
ALTER TABLE users ADD COLUMN tenant_id VARCHAR(50) NOT NULL;
ALTER TABLE deliveries ADD COLUMN tenant_id VARCHAR(50) NOT NULL;

-- Create indexes for performance
CREATE INDEX idx_tanks_tenant_id ON tanks(tenant_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_deliveries_tenant_id ON deliveries(tenant_id);

-- Create tenant table
CREATE TABLE tenants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  settings JSONB,
  branding JSONB,
  features JSONB,
  theme JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Routes

Update your API routes to be tenant-aware:

```tsx
// pages/api/tanks/index.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }

  // Your existing logic with tenant scoping
  const tanks = await getTanksForTenant(tenantId);

  res.json(tanks);
}
```

## Rollback Plan

If you need to rollback the migration:

1. **Remove TenantProvider** from your app layout
2. **Revert API calls** to direct fetch
3. **Remove permission checks** from components
4. **Revert routing** to standard Next.js router
5. **Remove tenant-specific** environment variables

## Post-Migration Checklist

- [ ] All components use tenant context
- [ ] API calls are tenant-scoped
- [ ] Permission checks are in place
- [ ] Error handling is tenant-aware
- [ ] Theming works per tenant
- [ ] Tests are updated and passing
- [ ] Performance is acceptable
- [ ] Security is maintained
- [ ] Documentation is updated

## Common Issues and Solutions

### Issue: "No tenant context available"

**Solution**: Ensure your component is wrapped with `TenantProvider`

### Issue: Cross-tenant data leaks

**Solution**: Verify all API responses include correct `tenantId` and use data validation

### Issue: Permission denied errors

**Solution**: Check user permissions in auth store and permission checker configuration

### Issue: Theme not applying

**Solution**: Ensure tenant has theme configuration and CSS variables are injected

### Issue: Performance degradation

**Solution**: Implement proper caching strategies and optimize queries

## Support

If you encounter issues during migration:

1. Check the troubleshooting section in the main documentation
2. Review the test examples for proper implementation
3. Contact the development team for assistance
4. Refer to the API reference for detailed method signatures
