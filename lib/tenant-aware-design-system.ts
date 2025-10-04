/**
 * Tenant-Aware Design System
 *
 * Extends the base design system to support tenant-specific theming
 * and branding customization while maintaining consistency.
 */

import * as React from 'react';
import { designSystem } from './design-system';
import { cn } from './utils';
import { useTenant } from '@/components/tenant-provider';
import { useTenantTheme } from './tenant-theme';
import type { Tenant } from '@/types';

type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: boolean | undefined | null };

// Tenant-aware color system that extends base design system
export const tenantAwareColors = {
  // Base colors from design system
  ...designSystem.colors,

  // Tenant-specific color utilities
  getTenantPrimary: (tenant?: Tenant | null) => {
    return tenant?.branding?.primaryColor || designSystem.colors.primary[500];
  },

  getTenantSecondary: (tenant?: Tenant | null) => {
    return tenant?.branding?.secondaryColor || designSystem.colors.primary[600];
  },

  getTenantAccent: (tenant?: Tenant | null) => {
    return designSystem.colors.primary[400];
  },

  // Generate color palette from tenant primary color
  generateTenantPalette: (primaryColor: string) => {
    // This would use a color manipulation library like chroma-js
    // For now, return a simple palette
    return {
      50: `${primaryColor}10`, // 10% opacity
      100: `${primaryColor}20`, // 20% opacity
      200: `${primaryColor}40`, // 40% opacity
      300: `${primaryColor}60`, // 60% opacity
      400: `${primaryColor}80`, // 80% opacity
      500: primaryColor,
      600: primaryColor, // Could be darkened
      700: primaryColor, // Could be darkened
      800: primaryColor, // Could be darkened
      900: primaryColor, // Could be darkened
    };
  },
};

// Tenant-aware typography system
export const tenantAwareTypography = {
  ...designSystem.typography,

  getTenantFontFamily: (tenant?: Tenant | null) => {
    return designSystem.typography.fontFamily.sans;
  },

  getTenantHeadingFont: (tenant?: Tenant | null) => {
    return designSystem.typography.fontFamily.sans;
  },
};

// Tenant-aware component variants
export const tenantAwareComponentVariants = {
  ...designSystem.componentVariants,

  // Generate tenant-specific button variants
  generateTenantButtonVariants: (tenant?: Tenant | null) => {
    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);
    const secondaryColor = tenantAwareColors.getTenantSecondary(tenant);

    return {
      primary: `bg-[${primaryColor}] text-white hover:bg-[${primaryColor}]/90 focus:ring-2 focus:ring-[${primaryColor}] focus:ring-offset-2`,
      secondary: `bg-[${secondaryColor}] text-white hover:bg-[${secondaryColor}]/90 focus:ring-2 focus:ring-[${secondaryColor}] focus:ring-offset-2`,
      outline: `border border-[${primaryColor}] bg-transparent text-[${primaryColor}] hover:bg-[${primaryColor}] hover:text-white focus:ring-2 focus:ring-[${primaryColor}] focus:ring-offset-2`,
    };
  },

  // Generate tenant-specific card variants
  generateTenantCardVariants: (tenant?: Tenant | null) => {
    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);

    return {
      default: `bg-white border border-gray-200 rounded-lg shadow-sm`,
      elevated: `bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow`,
      branded: `bg-white border border-[${primaryColor}]/20 rounded-lg shadow-sm hover:shadow-md hover:border-[${primaryColor}]/40 transition-all`,
      primary: `bg-[${primaryColor}] text-white rounded-lg shadow-sm`,
    };
  },

  // Generate tenant-specific badge variants
  generateTenantBadgeVariants: (tenant?: Tenant | null) => {
    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);

    return {
      default: `bg-[${primaryColor}]/10 text-[${primaryColor}] border border-[${primaryColor}]/20`,
      solid: `bg-[${primaryColor}] text-white border border-[${primaryColor}]`,
      outline: `bg-transparent text-[${primaryColor}] border border-[${primaryColor}]`,
    };
  },
};

// Utility functions for tenant-aware styling
export const tenantAwareUtils = {
  // Get tenant-aware class names
  getTenantClasses: (
    baseClasses: string,
    tenant?: Tenant | null,
    variant?: string
  ) => {
    if (!tenant || !variant) return baseClasses;

    const tenantVariants =
      tenantAwareComponentVariants.generateTenantButtonVariants(tenant);
    return cn(
      baseClasses,
      tenantVariants[variant as keyof typeof tenantVariants]
    );
  },

  // Apply tenant colors to CSS custom properties
  applyTenantColors: (tenant?: Tenant | null) => {
    if (!tenant) return {};

    return {
      '--tenant-primary': tenantAwareColors.getTenantPrimary(tenant),
      '--tenant-secondary': tenantAwareColors.getTenantSecondary(tenant),
      '--tenant-accent': tenantAwareColors.getTenantAccent(tenant),
      '--tenant-font-family': tenantAwareTypography.getTenantFontFamily(tenant),
      '--tenant-heading-font':
        tenantAwareTypography.getTenantHeadingFont(tenant),
    } as React.CSSProperties;
  },

  // Generate tenant-specific CSS variables
  generateTenantCSSVariables: (tenant?: Tenant | null) => {
    if (!tenant) return '';

    const primaryColor = tenantAwareColors.getTenantPrimary(tenant);
    const secondaryColor = tenantAwareColors.getTenantSecondary(tenant);
    const accentColor = tenantAwareColors.getTenantAccent(tenant);
    const fontFamily = tenantAwareTypography.getTenantFontFamily(tenant);
    const headingFont = tenantAwareTypography.getTenantHeadingFont(tenant);

    return `
      :root {
        --tenant-primary: ${primaryColor};
        --tenant-secondary: ${secondaryColor};
        --tenant-accent: ${accentColor};
        --tenant-font-family: ${fontFamily};
        --tenant-heading-font: ${headingFont};
      }
      
      .tenant-themed {
        --primary: var(--tenant-primary);
        --secondary: var(--tenant-secondary);
        --accent: var(--tenant-accent);
        font-family: var(--tenant-font-family);
      }
      
      .tenant-themed h1, .tenant-themed h2, .tenant-themed h3, 
      .tenant-themed h4, .tenant-themed h5, .tenant-themed h6 {
        font-family: var(--tenant-heading-font);
      }
    `;
  },
};

// React hook for tenant-aware design system
export const useTenantAwareDesignSystem = () => {
  const { tenant } = useTenant();
  const { theme, branding } = useTenantTheme();

  return {
    // Colors
    colors: {
      ...designSystem.colors,
      tenant: {
        primary: tenantAwareColors.getTenantPrimary(tenant),
        secondary: tenantAwareColors.getTenantSecondary(tenant),
        accent: tenantAwareColors.getTenantAccent(tenant),
      },
    },

    // Typography
    typography: {
      ...designSystem.typography,
      tenant: {
        fontFamily: tenantAwareTypography.getTenantFontFamily(tenant),
        headingFont: tenantAwareTypography.getTenantHeadingFont(tenant),
      },
    },

    // Component variants
    componentVariants: {
      ...designSystem.componentVariants,
      tenant: {
        button:
          tenantAwareComponentVariants.generateTenantButtonVariants(tenant),
        card: tenantAwareComponentVariants.generateTenantCardVariants(tenant),
        badge: tenantAwareComponentVariants.generateTenantBadgeVariants(tenant),
      },
    },

    // Utilities
    utils: {
      ...designSystem.utils,
      tenant: tenantAwareUtils,
    },

    // Tenant data
    tenant,
    theme,
    branding,

    // Helper functions
    getTenantClasses: (baseClasses: string, variant?: string) =>
      tenantAwareUtils.getTenantClasses(baseClasses, tenant, variant),

    getTenantStyles: () => tenantAwareUtils.applyTenantColors(tenant),

    generateTenantCSS: () =>
      tenantAwareUtils.generateTenantCSSVariables(tenant),
  };
};

// Higher-order component for tenant-aware styling
export function withTenantAwareStyling<P extends object>(
  Component: React.ComponentType<P>
) {
  return React.forwardRef<HTMLDivElement, P>((props, ref) => {
    const { getTenantStyles, generateTenantCSS } = useTenantAwareDesignSystem();

    return React.createElement(
      'div',
      {
        className: 'tenant-themed',
        style: getTenantStyles(),
        ref: ref,
      },
      React.createElement('style', null, generateTenantCSS()),
      React.createElement(Component, props as P)
    );
  });
}

// Utility for creating tenant-aware class names
export const tenantAwareCn = (...inputs: ClassValue[]) => {
  return cn(inputs);
};

// Export the enhanced design system
export const tenantAwareDesignSystem = {
  colors: tenantAwareColors,
  typography: tenantAwareTypography,
  componentVariants: tenantAwareComponentVariants,
  utils: tenantAwareUtils,
  useTenantAwareDesignSystem,
  withTenantAwareStyling,
  tenantAwareCn,
};

export default tenantAwareDesignSystem;
