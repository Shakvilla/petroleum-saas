import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

export interface TenantTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface TenantBranding {
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

export class TenantThemeManager {
  private currentTheme: TenantTheme | null = null;
  private currentBranding: TenantBranding | null = null;
  private styleElement: HTMLStyleElement | null = null;

  // Default theme
  private defaultTheme: TenantTheme = {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6',
    },
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
  };

  // Apply tenant theme
  applyTheme(tenant: Tenant) {
    const theme = this.buildThemeFromTenant(tenant);
    const branding = this.buildBrandingFromTenant(tenant);

    this.currentTheme = theme;
    this.currentBranding = branding;

    this.injectCSSVariables(theme);
    this.updateFavicon(branding.favicon);
    this.updatePageTitle(branding.name);
  }

  // Build theme from tenant data
  private buildThemeFromTenant(tenant: Tenant): TenantTheme {
    const customTheme = tenant.theme || {};

    return {
      colors: {
        primary: customTheme.primaryColor || this.defaultTheme.colors.primary,
        secondary:
          customTheme.secondaryColor || this.defaultTheme.colors.secondary,
        accent: customTheme.accentColor || this.defaultTheme.colors.accent,
        background:
          customTheme.backgroundColor || this.defaultTheme.colors.background,
        surface: customTheme.surfaceColor || this.defaultTheme.colors.surface,
        text: customTheme.textColor || this.defaultTheme.colors.text,
        textSecondary:
          customTheme.textSecondaryColor ||
          this.defaultTheme.colors.textSecondary,
        border: customTheme.borderColor || this.defaultTheme.colors.border,
        error: this.defaultTheme.colors.error,
        warning: this.defaultTheme.colors.warning,
        success: this.defaultTheme.colors.success,
        info: this.defaultTheme.colors.info,
      },
      fonts: {
        primary: customTheme.primaryFont || this.defaultTheme.fonts.primary,
        secondary:
          customTheme.secondaryFont || this.defaultTheme.fonts.secondary,
        mono: this.defaultTheme.fonts.mono,
      },
      spacing: this.defaultTheme.spacing,
      borderRadius: this.defaultTheme.borderRadius,
      shadows: this.defaultTheme.shadows,
    };
  }

  // Build branding from tenant data
  private buildBrandingFromTenant(tenant: Tenant): TenantBranding {
    return {
      logo: tenant.branding?.logo || '/placeholder-logo.svg',
      favicon: tenant.branding?.favicon || '/placeholder-logo.svg',
      name: tenant.name,
      tagline: tenant.branding?.tagline,
      colors: {
        primary: tenant.theme?.primaryColor || this.defaultTheme.colors.primary,
        secondary:
          tenant.theme?.secondaryColor || this.defaultTheme.colors.secondary,
        accent: tenant.theme?.accentColor || this.defaultTheme.colors.accent,
      },
      fonts: {
        primary: tenant.theme?.primaryFont || this.defaultTheme.fonts.primary,
        secondary:
          tenant.theme?.secondaryFont || this.defaultTheme.fonts.secondary,
      },
    };
  }

  // Inject CSS variables
  private injectCSSVariables(theme: TenantTheme) {
    if (typeof window === 'undefined') return;

    // Remove existing style element
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
    }

    // Create new style element
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'tenant-theme-variables';

    const cssVariables = `
      :root {
        --tenant-primary: ${theme.colors.primary};
        --tenant-secondary: ${theme.colors.secondary};
        --tenant-accent: ${theme.colors.accent};
        --tenant-background: ${theme.colors.background};
        --tenant-surface: ${theme.colors.surface};
        --tenant-text: ${theme.colors.text};
        --tenant-text-secondary: ${theme.colors.textSecondary};
        --tenant-border: ${theme.colors.border};
        --tenant-error: ${theme.colors.error};
        --tenant-warning: ${theme.colors.warning};
        --tenant-success: ${theme.colors.success};
        --tenant-info: ${theme.colors.info};
        
        --tenant-font-primary: ${theme.fonts.primary};
        --tenant-font-secondary: ${theme.fonts.secondary};
        --tenant-font-mono: ${theme.fonts.mono};
        
        --tenant-spacing-xs: ${theme.spacing.xs};
        --tenant-spacing-sm: ${theme.spacing.sm};
        --tenant-spacing-md: ${theme.spacing.md};
        --tenant-spacing-lg: ${theme.spacing.lg};
        --tenant-spacing-xl: ${theme.spacing.xl};
        
        --tenant-radius-sm: ${theme.borderRadius.sm};
        --tenant-radius-md: ${theme.borderRadius.md};
        --tenant-radius-lg: ${theme.borderRadius.lg};
        --tenant-radius-xl: ${theme.borderRadius.xl};
        
        --tenant-shadow-sm: ${theme.shadows.sm};
        --tenant-shadow-md: ${theme.shadows.md};
        --tenant-shadow-lg: ${theme.shadows.lg};
        --tenant-shadow-xl: ${theme.shadows.xl};
      }
    `;

    this.styleElement.textContent = cssVariables;
    document.head.appendChild(this.styleElement);
  }

  // Update favicon
  private updateFavicon(faviconUrl: string) {
    if (typeof window === 'undefined') return;

    const existingFavicon = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = faviconUrl;
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = faviconUrl;
      document.head.appendChild(link);
    }
  }

  // Update page title
  private updatePageTitle(tenantName: string) {
    if (typeof window === 'undefined') return;

    const originalTitle = document.title;
    if (!originalTitle.includes(tenantName)) {
      document.title = `${tenantName} - ${originalTitle}`;
    }
  }

  // Get current theme
  getCurrentTheme(): TenantTheme | null {
    return this.currentTheme;
  }

  // Get current branding
  getCurrentBranding(): TenantBranding | null {
    return this.currentBranding;
  }

  // Reset to default theme
  resetToDefault() {
    this.currentTheme = null;
    this.currentBranding = null;

    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  // Generate theme CSS for export
  generateThemeCSS(theme: TenantTheme): string {
    return `
      .tenant-themed {
        --primary: ${theme.colors.primary};
        --secondary: ${theme.colors.secondary};
        --accent: ${theme.colors.accent};
        --background: ${theme.colors.background};
        --surface: ${theme.colors.surface};
        --text: ${theme.colors.text};
        --text-secondary: ${theme.colors.textSecondary};
        --border: ${theme.colors.border};
        --error: ${theme.colors.error};
        --warning: ${theme.colors.warning};
        --success: ${theme.colors.success};
        --info: ${theme.colors.info};
      }
    `;
  }
}

// Global theme manager instance
export const themeManager = new TenantThemeManager();

// React hook for using the theme manager
export function useTenantTheme() {
  const { tenant } = useTenant();

  // Apply theme when tenant changes
  useEffect(() => {
    if (tenant) {
      themeManager.applyTheme(tenant);
    } else {
      themeManager.resetToDefault();
    }
  }, [tenant]);

  return {
    theme: themeManager.getCurrentTheme(),
    branding: themeManager.getCurrentBranding(),
    applyTheme: (tenant: Tenant) => themeManager.applyTheme(tenant),
    resetTheme: () => themeManager.resetToDefault(),
  };
}

// Utility function to get CSS variable value
export function getCSSVariable(variableName: string): string {
  if (typeof window === 'undefined') return '';

  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
}

// Utility function to set CSS variable value
export function setCSSVariable(variableName: string, value: string): void {
  if (typeof window === 'undefined') return;

  document.documentElement.style.setProperty(variableName, value);
}
