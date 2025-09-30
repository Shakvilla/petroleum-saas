# Tenant Theming Integration with Design System

## Overview

This document confirms that the new design system approach fully supports company-wide theme customization and tenant branding. The implementation extends the existing tenant theming system while providing enhanced components that automatically adapt to tenant-specific brand guidelines.

## Current Tenant Theming System

### Existing Infrastructure

The platform already has a robust tenant theming system in place:

1. **TenantThemeManager** (`lib/tenant-theme.ts`)
   - Manages tenant-specific themes and branding
   - Injects CSS variables for tenant colors and fonts
   - Handles favicon and page title updates
   - Provides React hooks for theme access

2. **Settings System** (`types/settings.ts`)
   - `BrandingSettingsData` interface for comprehensive branding configuration
   - `ColorScheme` interface for color customization
   - `TypographyConfig` interface for font customization
   - `LogoConfig` interface for logo management

3. **Tenant Provider** (`components/tenant-provider.tsx`)
   - Provides tenant context throughout the application
   - Handles tenant resolution from subdomains, paths, and custom domains
   - Integrates with the theme manager

## Enhanced Design System Integration

### Tenant-Aware Design System (`lib/tenant-aware-design-system.ts`)

The new design system extends the existing tenant theming with:

#### 1. **Tenant-Aware Color System**

```typescript
export const tenantAwareColors = {
  // Base colors from design system
  ...designSystem.colors,

  // Tenant-specific color utilities
  getTenantPrimary: (tenant?: any) => {
    return (
      tenant?.branding?.primaryColor ||
      tenant?.theme?.primaryColor ||
      designSystem.colors.primary[500]
    );
  },

  getTenantSecondary: (tenant?: any) => {
    return (
      tenant?.branding?.secondaryColor ||
      tenant?.theme?.secondaryColor ||
      designSystem.colors.primary[600]
    );
  },

  // Generate color palette from tenant primary color
  generateTenantPalette: (primaryColor: string) => {
    // Returns a full color palette based on tenant's primary color
  },
};
```

#### 2. **Tenant-Aware Typography System**

```typescript
export const tenantAwareTypography = {
  ...designSystem.typography,

  getTenantFontFamily: (tenant?: any) => {
    return (
      tenant?.branding?.fontFamily ||
      tenant?.theme?.primaryFont ||
      designSystem.typography.fontFamily.sans
    );
  },

  getTenantHeadingFont: (tenant?: any) => {
    return (
      tenant?.branding?.headingFont ||
      tenant?.theme?.headingFont ||
      designSystem.typography.fontFamily.sans
    );
  },
};
```

#### 3. **Tenant-Aware Component Variants**

```typescript
export const tenantAwareComponentVariants = {
  // Generate tenant-specific button variants
  generateTenantButtonVariants: (tenant?: any) => {
    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);
    const secondaryColor = tenantAwareColors.getTenantSecondary(tenant);

    return {
      primary: `bg-[${primaryColor}] text-white hover:bg-[${primaryColor}]/90`,
      secondary: `bg-[${secondaryColor}] text-white hover:bg-[${secondaryColor}]/90`,
      outline: `border border-[${primaryColor}] bg-transparent text-[${primaryColor}]`,
    };
  },

  // Generate tenant-specific card variants
  generateTenantCardVariants: (tenant?: any) => {
    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);

    return {
      branded: `bg-white border border-[${primaryColor}]/20 hover:border-[${primaryColor}]/40`,
      primary: `bg-[${primaryColor}] text-white`,
    };
  },
};
```

#### 4. **React Hook for Tenant-Aware Design System**

```typescript
export const useTenantAwareDesignSystem = () => {
  const { tenant } = useTenant();
  const { theme, branding } = useTenantTheme();

  return {
    // Colors with tenant overrides
    colors: {
      ...designSystem.colors,
      tenant: {
        primary: tenantAwareColors.getTenantPrimary(tenant),
        secondary: tenantAwareColors.getTenantSecondary(tenant),
        accent: tenantAwareColors.getTenantAccent(tenant),
      },
    },

    // Typography with tenant overrides
    typography: {
      ...designSystem.typography,
      tenant: {
        fontFamily: tenantAwareTypography.getTenantFontFamily(tenant),
        headingFont: tenantAwareTypography.getTenantHeadingFont(tenant),
      },
    },

    // Component variants with tenant overrides
    componentVariants: {
      ...designSystem.componentVariants,
      tenant: {
        button:
          tenantAwareComponentVariants.generateTenantButtonVariants(tenant),
        card: tenantAwareComponentVariants.generateTenantCardVariants(tenant),
        badge: tenantAwareComponentVariants.generateTenantBadgeVariants(tenant),
      },
    },

    // Helper functions
    getTenantClasses: (baseClasses: string, variant?: string) =>
      tenantAwareUtils.getTenantClasses(baseClasses, tenant, variant),

    getTenantStyles: () => tenantAwareUtils.applyTenantColors(tenant),

    generateTenantCSS: () =>
      tenantAwareUtils.generateTenantCSSVariables(tenant),
  };
};
```

## Tenant-Aware Components

### 1. **TenantAwareButton** (`components/ui/tenant-aware-button.tsx`)

Extends the EnhancedButton with automatic tenant theming:

```typescript
// Automatically uses tenant colors when useTenantTheme is true
<TenantAwareButton variant="primary" useTenantTheme>
  Save Changes
</TenantAwareButton>

// Pre-built tenant variants
<TenantPrimaryButton>Primary Action</TenantPrimaryButton>
<TenantSecondaryButton>Secondary Action</TenantSecondaryButton>
<TenantOutlineButton>Outline Action</TenantOutlineButton>
<TenantGhostButton>Ghost Action</TenantGhostButton>

// Custom tenant color override
<TenantAwareButton
  variant="tenant-primary"
  customTenantColor="#ff6b35"
>
  Custom Color
</TenantAwareButton>
```

### 2. **TenantAwareCard** (`components/ui/tenant-aware-card.tsx`)

Extends the EnhancedCard with tenant branding:

```typescript
// Automatically uses tenant branding
<TenantAwareCard variant="default" useTenantTheme>
  <TenantAwareCardHeader>
    <TenantAwareCardTitle>Card Title</TenantAwareCardTitle>
    <TenantAwareCardDescription>Description</TenantAwareCardDescription>
  </TenantAwareCardHeader>
  <TenantAwareCardContent>
    Content
  </TenantAwareCardContent>
</TenantAwareCard>

// Pre-built tenant variants
<TenantBrandedCard>Branded Content</TenantBrandedCard>
<TenantPrimaryCard>Primary Content</TenantPrimaryCard>
<TenantOutlinedCard>Outlined Content</TenantOutlinedCard>
<TenantElevatedCard>Elevated Content</TenantElevatedCard>
```

### 3. **TenantAwareBadge** (`components/ui/tenant-aware-badge.tsx`)

Extends the EnhancedBadge with tenant colors:

```typescript
// Automatically uses tenant colors
<TenantAwareBadge variant="default" useTenantTheme>
  Status
</TenantAwareBadge>

// Pre-built tenant variants
<TenantPrimaryBadge>Primary</TenantPrimaryBadge>
<TenantSecondaryBadge>Secondary</TenantSecondaryBadge>
<TenantOutlineBadge>Outline</TenantOutlineBadge>
<TenantSolidBadge>Solid</TenantSolidBadge>

// Enhanced utility functions
<TenantAwareBadge variant={getTenantAwareBadgeVariantFromStatus('active')}>
  Active
</TenantAwareBadge>
```

## Integration with Existing Settings

### Branding Settings Integration

The tenant-aware design system seamlessly integrates with the existing branding settings:

```typescript
// Settings data structure (from types/settings.ts)
interface BrandingSettingsData {
  visualBranding: {
    logo: LogoConfig;
    colorScheme: ColorScheme; // Maps to tenant colors
    typography: TypographyConfig; // Maps to tenant fonts
    favicon: string;
  };
  displayPreferences: {
    dashboardLayout: DashboardLayout;
    defaultViews: DefaultView[];
    featureVisibility: FeatureVisibility;
  };
  localization: {
    language: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
    numberFormat: NumberFormat;
  };
}

// Color scheme interface
interface ColorScheme {
  primary: string; // Maps to --tenant-primary
  secondary: string; // Maps to --tenant-secondary
  accent: string; // Maps to --tenant-accent
  background: string; // Maps to --tenant-background
  surface: string; // Maps to --tenant-surface
  text: string; // Maps to --tenant-text
  success: string; // Maps to --tenant-success
  warning: string; // Maps to --tenant-warning
  error: string; // Maps to --tenant-error
}
```

### Settings to Theme Mapping

The system automatically maps settings to theme variables:

```typescript
// Automatic mapping from settings to CSS variables
const mapSettingsToTheme = (brandingSettings: BrandingSettingsData) => {
  return {
    '--tenant-primary': brandingSettings.visualBranding.colorScheme.primary,
    '--tenant-secondary': brandingSettings.visualBranding.colorScheme.secondary,
    '--tenant-accent': brandingSettings.visualBranding.colorScheme.accent,
    '--tenant-background':
      brandingSettings.visualBranding.colorScheme.background,
    '--tenant-surface': brandingSettings.visualBranding.colorScheme.surface,
    '--tenant-text': brandingSettings.visualBranding.colorScheme.text,
    '--tenant-font-family':
      brandingSettings.visualBranding.typography.fontFamily,
    '--tenant-heading-font':
      brandingSettings.visualBranding.typography.headingFont,
  };
};
```

## Usage Examples

### 1. **Basic Tenant Theming**

```typescript
import { useTenantAwareDesignSystem } from '@/lib/tenant-aware-design-system';
import { TenantAwareButton, TenantAwareCard } from '@/components/ui';

const MyComponent = () => {
  const { tenant, getTenantStyles } = useTenantAwareDesignSystem();

  return (
    <div style={getTenantStyles()}>
      <TenantAwareCard variant="tenant-branded">
        <TenantAwareCardHeader>
          <TenantAwareCardTitle>Welcome to {tenant?.name}</TenantAwareCardTitle>
        </TenantAwareCardHeader>
        <TenantAwareCardContent>
          <TenantAwareButton variant="tenant-primary">
            Get Started
          </TenantAwareButton>
        </TenantAwareCardContent>
      </TenantAwareCard>
    </div>
  );
};
```

### 2. **Custom Tenant Colors**

```typescript
const CustomThemedComponent = () => {
  return (
    <TenantAwareButton
      variant="tenant-primary"
      customTenantColor="#ff6b35"
    >
      Custom Branded Button
    </TenantAwareButton>
  );
};
```

### 3. **Conditional Tenant Theming**

```typescript
const ConditionalThemedComponent = ({ useCustomTheme }: { useCustomTheme: boolean }) => {
  return (
    <TenantAwareCard
      variant="default"
      useTenantTheme={useCustomTheme}
    >
      Content
    </TenantAwareCard>
  );
};
```

### 4. **Integration with Existing Components**

```typescript
// Existing components can be wrapped with tenant-aware styling
import { withTenantAwareStyling } from '@/lib/tenant-aware-design-system';
import { EnhancedButton } from '@/components/ui';

const TenantAwareEnhancedButton = withTenantAwareStyling(EnhancedButton);

// Usage
<TenantAwareEnhancedButton variant="primary">
  Enhanced with Tenant Theming
</TenantAwareEnhancedButton>
```

## Benefits

### 1. **Seamless Integration**

- Works with existing tenant theming system
- No breaking changes to current implementation
- Backward compatible with existing components

### 2. **Automatic Theming**

- Components automatically adapt to tenant branding
- No manual color management required
- Consistent theming across all components

### 3. **Flexible Customization**

- Override tenant colors when needed
- Conditional theming support
- Custom color injection capabilities

### 4. **Performance Optimized**

- CSS variables for efficient theming
- Minimal re-renders
- Optimized for production use

### 5. **Developer Experience**

- Simple API for tenant-aware components
- TypeScript support throughout
- Comprehensive documentation

## Migration Strategy

### Phase 1: Foundation (Completed)

- ✅ Tenant-aware design system
- ✅ Enhanced tenant-aware components
- ✅ Integration with existing theme manager
- ✅ Documentation and examples

### Phase 2: Component Migration (Ready)

- 🔄 Migrate existing components to use tenant-aware variants
- 🔄 Update component imports
- 🔄 Test tenant theming consistency

### Phase 3: Settings Integration (Ready)

- ⏳ Enhance settings UI to preview tenant theming
- ⏳ Add real-time theme preview
- ⏳ Implement theme validation

### Phase 4: Advanced Features (Planned)

- ⏳ Theme presets and templates
- ⏳ Advanced color palette generation
- ⏳ Theme export/import functionality

## Conclusion

The new design system approach **fully supports company-wide theme customization** and tenant branding. It extends the existing tenant theming infrastructure while providing enhanced components that automatically adapt to tenant-specific brand guidelines.

Key features:

- ✅ **Automatic tenant theming** for all enhanced components
- ✅ **Seamless integration** with existing settings system
- ✅ **Flexible customization** with override capabilities
- ✅ **Performance optimized** with CSS variables
- ✅ **Developer friendly** with TypeScript support
- ✅ **Backward compatible** with existing implementation

The system is ready for Phase 2 implementation and will provide a consistent, branded experience across all tenant instances while maintaining the flexibility for custom branding requirements.
