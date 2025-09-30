# Phase 2: Component Migration Guide

## Overview

This document provides a comprehensive guide for migrating existing components to use tenant-aware variants as part of Phase 2 of the design system enhancement.

## Migration Strategy

### 1. **Import Updates**

Replace existing component imports with tenant-aware variants:

```typescript
// Before
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// After
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
```

### 2. **Component Usage**

Replace component usage with tenant-aware variants:

```typescript
// Before
<Button variant="primary">Save</Button>
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
<Badge variant="outline">Status</Badge>

// After
<TenantAwareButton variant="primary">Save</TenantAwareButton>
<TenantAwareCard>
  <TenantAwareCardHeader>
    <TenantAwareCardTitle>Title</TenantAwareCardTitle>
  </TenantAwareCardHeader>
  <TenantAwareCardContent>Content</TenantAwareCardContent>
</TenantAwareCard>
<TenantAwareBadge variant="outline">Status</TenantAwareBadge>
```

### 3. **Automatic Tenant Theming**

Tenant-aware components automatically apply tenant theming when:

- `useTenantTheme` prop is `true` (default)
- Tenant context is available
- Component variant supports tenant theming

```typescript
// Automatically uses tenant colors
<TenantAwareButton variant="primary">Save</TenantAwareButton>

// Disable tenant theming if needed
<TenantAwareButton variant="primary" useTenantTheme={false}>Save</TenantAwareButton>

// Use custom tenant color
<TenantAwareButton
  variant="tenant-primary"
  customTenantColor="#ff6b35"
>
  Custom Branded Button
</TenantAwareButton>
```

## Completed Migrations

### 1. **Users Page Components**

**File:** `components/users/users-page-content.tsx`

**Changes:**

- Migrated `Card` → `TenantAwareCard`
- Migrated `Badge` → `TenantAwareBadge`
- Updated all card sub-components
- Applied tenant-aware badge variants for roles

**Benefits:**

- Automatic tenant branding for user management interface
- Consistent role-based badge colors
- Enhanced visual hierarchy with tenant colors

### 2. **Users Table Component**

**File:** `components/users/users-table.tsx`

**Changes:**

- Migrated `Button` → `TenantAwareButton`
- Updated all table action buttons
- Applied tenant theming to pagination controls

**Benefits:**

- Consistent button styling across table interface
- Tenant-branded action buttons
- Improved user experience with branded interactions

### 3. **Dashboard Overview**

**File:** `components/modern-dashboard-overview.tsx`

**Changes:**

- Migrated `Card` → `TenantAwareCard`
- Migrated `Badge` → `TenantAwareBadge`
- Migrated `Button` → `TenantAwareButton`
- Updated all dashboard components

**Benefits:**

- Tenant-branded dashboard interface
- Consistent theming across all dashboard elements
- Enhanced brand recognition for users

### 4. **Settings Components**

**Files:**

- `components/settings/settings-header.tsx`
- `components/settings/sections/branding-settings.tsx`

**Changes:**

- Migrated `Button` → `TenantAwareButton`
- Migrated `Badge` → `TenantAwareBadge`
- Migrated `Card` → `TenantAwareCard`
- Updated settings interface components

**Benefits:**

- Tenant-branded settings interface
- Consistent theming for configuration pages
- Enhanced user experience for brand customization

## Migration Patterns

### 1. **Direct Component Replacement**

For simple component replacements:

```typescript
// Pattern: Direct replacement
<Button variant="primary" size="lg">
  Action
</Button>

// Becomes
<TenantAwareButton variant="primary" size="lg">
  Action
</TenantAwareButton>
```

### 2. **Card Component Migration**

For card components with sub-components:

```typescript
// Pattern: Card with sub-components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Actions
  </CardFooter>
</Card>

// Becomes
<TenantAwareCard>
  <TenantAwareCardHeader>
    <TenantAwareCardTitle>Title</TenantAwareCardTitle>
    <TenantAwareCardDescription>Description</TenantAwareCardDescription>
  </TenantAwareCardHeader>
  <TenantAwareCardContent>
    Content
  </TenantAwareCardContent>
  <TenantAwareCardFooter>
    Actions
  </TenantAwareCardFooter>
</TenantAwareCard>
```

### 3. **Badge Variant Migration**

For badges with semantic variants:

```typescript
// Pattern: Semantic badge variants
<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
  Admin
</Badge>

// Becomes
<TenantAwareBadge variant="admin">
  Admin
</TenantAwareBadge>
```

### 4. **Conditional Theming**

For components that need conditional tenant theming:

```typescript
// Pattern: Conditional tenant theming
<TenantAwareButton
  variant="primary"
  useTenantTheme={shouldUseTenantTheme}
>
  Action
</TenantAwareButton>
```

## Best Practices

### 1. **Import Organization**

Group imports by category:

```typescript
// React and external libraries
import React from 'react';
import { useForm } from 'react-hook-form';

// Internal components
import { useTenant } from '@/components/tenant-provider';

// UI components
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { TenantAwareCard } from '@/components/ui/tenant-aware-card';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';

// Icons
import { Save, Edit, Delete } from 'lucide-react';
```

### 2. **Variant Selection**

Use appropriate variants for tenant theming:

```typescript
// Primary actions - use tenant primary color
<TenantAwareButton variant="primary">Save</TenantAwareButton>

// Secondary actions - use tenant secondary color
<TenantAwareButton variant="outline">Cancel</TenantAwareButton>

// Status indicators - use semantic variants
<TenantAwareBadge variant="success">Active</TenantAwareBadge>
<TenantAwareBadge variant="error">Inactive</TenantAwareBadge>

// Role indicators - use role variants
<TenantAwareBadge variant="admin">Administrator</TenantAwareBadge>
<TenantAwareBadge variant="manager">Manager</TenantAwareBadge>
```

### 3. **Custom Styling**

Override tenant colors when needed:

```typescript
// Custom tenant color for specific use cases
<TenantAwareButton
  variant="tenant-primary"
  customTenantColor="#ff6b35"
>
  Custom Branded Action
</TenantAwareButton>
```

### 4. **Accessibility**

Maintain accessibility features:

```typescript
// Ensure proper ARIA attributes
<TenantAwareButton
  variant="primary"
  aria-label="Save changes"
  disabled={isLoading}
>
  {isLoading ? 'Saving...' : 'Save'}
</TenantAwareButton>
```

## Testing Guidelines

### 1. **Visual Testing**

Test components with different tenant themes:

```typescript
// Test with different tenant colors
const testTenants = [
  { primaryColor: '#3b82f6', name: 'Blue Theme' },
  { primaryColor: '#ef4444', name: 'Red Theme' },
  { primaryColor: '#10b981', name: 'Green Theme' },
  { primaryColor: '#f59e0b', name: 'Orange Theme' },
];
```

### 2. **Functionality Testing**

Verify component functionality:

- Button clicks and form submissions
- Card interactions and hover states
- Badge display and color variations
- Responsive behavior across screen sizes

### 3. **Accessibility Testing**

Test accessibility compliance:

- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management

## Common Issues and Solutions

### 1. **Import Errors**

**Issue:** Duplicate component names after migration

**Solution:** Use specific imports and avoid wildcard imports

```typescript
// Avoid
import * as UI from '@/components/ui';

// Prefer
import { TenantAwareButton, TenantAwareCard } from '@/components/ui';
```

### 2. **Styling Conflicts**

**Issue:** Custom styles overriding tenant theming

**Solution:** Use CSS custom properties and tenant-aware utilities

```typescript
// Avoid hardcoded colors
<Button className="bg-blue-500 text-white">Action</Button>

// Prefer tenant-aware styling
<TenantAwareButton variant="primary">Action</TenantAwareButton>
```

### 3. **Performance Issues**

**Issue:** Excessive re-renders with tenant theming

**Solution:** Use React.memo and optimize tenant context usage

```typescript
const OptimizedComponent = React.memo(({ data }) => {
  const { tenant } = useTenant();

  return (
    <TenantAwareCard>
      <TenantAwareCardContent>
        {data.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </TenantAwareCardContent>
    </TenantAwareCard>
  );
});
```

## Migration Checklist

### Before Migration

- [ ] Identify components to migrate
- [ ] Review current component usage
- [ ] Plan import updates
- [ ] Test current functionality

### During Migration

- [ ] Update component imports
- [ ] Replace component usage
- [ ] Apply appropriate variants
- [ ] Test functionality
- [ ] Verify styling

### After Migration

- [ ] Test with different tenant themes
- [ ] Verify accessibility compliance
- [ ] Check responsive behavior
- [ ] Validate performance
- [ ] Update documentation

## Next Steps

### Phase 2 Completion

- [x] Migrate core components (Button, Card, Badge)
- [x] Update component imports
- [x] Test tenant theming consistency
- [x] Update component index exports
- [x] Create migration documentation

### Phase 3 Preparation

- [ ] Enhance settings UI with theme preview
- [ ] Add real-time theme preview
- [ ] Implement theme validation
- [ ] Create theme presets and templates

## Conclusion

Phase 2 migration successfully implements tenant-aware components across the application, providing:

- **Automatic tenant theming** for all migrated components
- **Consistent branding** across the user interface
- **Enhanced user experience** with tenant-specific styling
- **Maintainable codebase** with centralized theming logic

The migration maintains backward compatibility while adding powerful tenant customization capabilities. All components now automatically adapt to tenant branding while preserving existing functionality and accessibility features.
