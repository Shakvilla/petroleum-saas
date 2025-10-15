// Documentation: /docs/comprehensive-theming-system/tenant-theme-integration.md

import type { Tenant } from '@/types';
import type { TenantTheme, TenantBranding } from './tenant-theme';
import type { UnifiedTheme } from '@/types/unified-theme';
// Remove direct import to break circular dependency
// import { TenantThemeManager } from './tenant-theme';
import { UnifiedThemeManager } from './unified-theme-manager';
import { EnhancedCSSVariableManager } from './enhanced-css-variables';

/**
 * Tenant Theme Integration
 * 
 * Bridges the existing TenantThemeManager with the new UnifiedThemeManager
 * to maintain backward compatibility while providing enhanced functionality.
 */
export class TenantThemeIntegration {
  private tenantThemeManager: any; // Changed to any to avoid circular dependency
  private unifiedThemeManager: UnifiedThemeManager;
  private cssVariableManager: EnhancedCSSVariableManager;
  private isIntegrated: boolean = false;

  constructor(
    unifiedThemeManager: UnifiedThemeManager,
    cssVariableManager: EnhancedCSSVariableManager
  ) {
    this.unifiedThemeManager = unifiedThemeManager;
    this.cssVariableManager = cssVariableManager;
  }

  /**
   * Initialize integration with lazy loading
   */
  async initialize(): Promise<void> {
    if (this.isIntegrated) return;

    try {
      // Dynamic import to avoid circular dependency
      const { TenantThemeManager } = await import('./tenant-theme');
      this.tenantThemeManager = new TenantThemeManager();

      // Override tenant theme manager methods to integrate with unified system
      this.overrideTenantThemeManager();
      
      this.isIntegrated = true;
      console.log('Tenant theme integration initialized');
    } catch (error) {
      console.error('Failed to initialize tenant theme integration:', error);
      // Create a mock tenant theme manager to prevent errors
      this.tenantThemeManager = {
        applyTheme: () => Promise.resolve(),
        resetToDefault: () => {},
        getCurrentTheme: () => null,
        getCurrentBranding: () => null,
      } as any;
      this.isIntegrated = true;
    }
  }

  /**
   * Apply tenant theme with unified system integration
   */
  async applyTenantTheme(tenant: Tenant): Promise<void> {
    try {
      // Ensure initialization
      if (!this.isIntegrated) {
        await this.initialize();
      }

      // Build tenant theme using existing logic
      const tenantTheme = this.buildTenantTheme(tenant);
      const tenantBranding = this.buildTenantBranding(tenant);

      // Convert to unified theme
      const unifiedTheme = this.convertTenantThemeToUnified(tenantTheme, tenantBranding, tenant);

      // Apply using unified theme manager
      const result = await this.unifiedThemeManager.applyTheme(unifiedTheme);

      if (result.success) {
        // Update tenant theme manager state for backward compatibility
        this.updateTenantThemeManagerState(tenantTheme, tenantBranding);
        
        // Apply tenant-specific CSS variables
        this.applyTenantCSSVariables(tenantTheme);
        
        // Update branding
        this.updateBranding(tenantBranding);
        
        console.log('Tenant theme applied successfully:', tenant.name);
      } else {
        console.error('Failed to apply tenant theme:', result.errors);
      }
    } catch (error) {
      console.error('Error applying tenant theme:', error);
      // Fallback to original tenant theme manager if available
      if (this.tenantThemeManager && typeof this.tenantThemeManager.applyTheme === 'function') {
        try {
          await this.tenantThemeManager.applyTheme(tenant);
        } catch (fallbackError) {
          console.error('Fallback tenant theme application also failed:', fallbackError);
        }
      }
    }
  }

  /**
   * Reset tenant theme
   */
  async resetTenantTheme(): Promise<void> {
    try {
      // Reset unified theme manager
      this.unifiedThemeManager.resetToDefault();
      
      // Reset tenant theme manager if available
      if (this.tenantThemeManager && typeof this.tenantThemeManager.resetToDefault === 'function') {
        this.tenantThemeManager.resetToDefault();
      }
      
      console.log('Tenant theme reset successfully');
    } catch (error) {
      console.error('Error resetting tenant theme:', error);
    }
  }

  /**
   * Get current tenant theme
   */
  getCurrentTenantTheme(): TenantTheme | null {
    if (this.tenantThemeManager && typeof this.tenantThemeManager.getCurrentTheme === 'function') {
      return this.tenantThemeManager.getCurrentTheme();
    }
    return null;
  }

  /**
   * Get current tenant branding
   */
  getCurrentTenantBranding(): TenantBranding | null {
    if (this.tenantThemeManager && typeof this.tenantThemeManager.getCurrentBranding === 'function') {
      return this.tenantThemeManager.getCurrentBranding();
    }
    return null;
  }

  /**
   * Get current unified theme
   */
  getCurrentUnifiedTheme(): UnifiedTheme | null {
    if (!this.unifiedThemeManager) {
      console.warn('UnifiedThemeManager not initialized');
      return null;
    }
    return this.unifiedThemeManager.currentTheme;
  }

  /**
   * Convert tenant theme to unified theme
   */
  private convertTenantThemeToUnified(
    tenantTheme: TenantTheme,
    tenantBranding: TenantBranding,
    tenant: Tenant
  ): UnifiedTheme {
    return {
      id: `tenant-${tenant.id}`,
      name: `${tenant.name} Theme`,
      description: `Custom theme for ${tenant.name}`,
      colors: {
        primary: tenantTheme.colors.primary,
        secondary: tenantTheme.colors.secondary,
        accent: tenantTheme.colors.accent,
        background: tenantTheme.colors.background,
        surface: tenantTheme.colors.surface,
        text: tenantTheme.colors.text,
        textSecondary: tenantTheme.colors.textSecondary,
        border: tenantTheme.colors.border,
        error: tenantTheme.colors.error,
        warning: tenantTheme.colors.warning,
        success: tenantTheme.colors.success,
        info: tenantTheme.colors.info,
      },
      typography: {
        fontFamily: tenantTheme.fonts.primary,
        headingFont: tenantTheme.fonts.secondary,
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
      },
      spacing: {
        xs: tenantTheme.spacing.xs,
        sm: tenantTheme.spacing.sm,
        md: tenantTheme.spacing.md,
        lg: tenantTheme.spacing.lg,
        xl: tenantTheme.spacing.xl,
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      borderRadius: {
        none: '0',
        sm: tenantTheme.borderRadius.sm,
        md: tenantTheme.borderRadius.md,
        lg: tenantTheme.borderRadius.lg,
        xl: tenantTheme.borderRadius.xl,
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      shadows: {
        none: 'none',
        sm: tenantTheme.shadows.sm,
        md: tenantTheme.shadows.md,
        lg: tenantTheme.shadows.lg,
        xl: tenantTheme.shadows.xl,
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      branding: {
        logo: {
          primary: tenantBranding.logo,
          favicon: tenantBranding.favicon,
          sizes: {
            small: tenantBranding.logo,
            medium: tenantBranding.logo,
            large: tenantBranding.logo,
          },
        },
        favicon: tenantBranding.favicon,
        appName: tenantBranding.name,
      },
      animations: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          linear: 'linear',
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
        },
        keyframes: {
          fadeIn: 'fadeIn 0.3s ease-in-out',
          fadeOut: 'fadeOut 0.3s ease-in-out',
          slideIn: 'slideIn 0.3s ease-out',
          slideOut: 'slideOut 0.3s ease-in',
          scaleIn: 'scaleIn 0.2s ease-out',
          scaleOut: 'scaleOut 0.2s ease-in',
        },
      },
      transitions: {
        duration: {
          fast: '150ms',
          normal: '300ms',
          slow: '500ms',
        },
        easing: {
          linear: 'linear',
          ease: 'ease',
          easeIn: 'ease-in',
          easeOut: 'ease-out',
          easeInOut: 'ease-in-out',
        },
        properties: ['color', 'background-color', 'border-color', 'opacity', 'transform'],
      },
      effects: {
        blur: {
          none: 'blur(0)',
          sm: 'blur(4px)',
          md: 'blur(8px)',
          lg: 'blur(12px)',
          xl: 'blur(16px)',
          '2xl': 'blur(24px)',
          '3xl': 'blur(40px)',
        },
        brightness: {
          '0': 'brightness(0)',
          '50': 'brightness(0.5)',
          '75': 'brightness(0.75)',
          '90': 'brightness(0.9)',
          '95': 'brightness(0.95)',
          '100': 'brightness(1)',
          '105': 'brightness(1.05)',
          '110': 'brightness(1.1)',
          '125': 'brightness(1.25)',
          '150': 'brightness(1.5)',
          '200': 'brightness(2)',
        },
        contrast: {
          '0': 'contrast(0)',
          '50': 'contrast(0.5)',
          '75': 'contrast(0.75)',
          '100': 'contrast(1)',
          '125': 'contrast(1.25)',
          '150': 'contrast(1.5)',
          '200': 'contrast(2)',
        },
        grayscale: {
          '0': 'grayscale(0)',
          '100': 'grayscale(1)',
        },
        hueRotate: {
          '0': 'hue-rotate(0deg)',
          '15': 'hue-rotate(15deg)',
          '30': 'hue-rotate(30deg)',
          '60': 'hue-rotate(60deg)',
          '90': 'hue-rotate(90deg)',
          '180': 'hue-rotate(180deg)',
        },
        invert: {
          '0': 'invert(0)',
          '100': 'invert(1)',
        },
        opacity: {
          '0': 'opacity(0)',
          '5': 'opacity(0.05)',
          '10': 'opacity(0.1)',
          '20': 'opacity(0.2)',
          '25': 'opacity(0.25)',
          '30': 'opacity(0.3)',
          '40': 'opacity(0.4)',
          '50': 'opacity(0.5)',
          '60': 'opacity(0.6)',
          '70': 'opacity(0.7)',
          '75': 'opacity(0.75)',
          '80': 'opacity(0.8)',
          '90': 'opacity(0.9)',
          '95': 'opacity(0.95)',
          '100': 'opacity(1)',
        },
        saturate: {
          '0': 'saturate(0)',
          '50': 'saturate(0.5)',
          '100': 'saturate(1)',
          '150': 'saturate(1.5)',
          '200': 'saturate(2)',
        },
        sepia: {
          '0': 'sepia(0)',
          '100': 'sepia(1)',
        },
      },
      accessibility: {
        contrastRatio: 4.5,
        wcagCompliant: true,
        colorBlindnessFriendly: true,
        largeTextCompliant: true,
        reducedMotionCompliant: true,
        highContrastMode: false,
        screenReaderOptimized: true,
        keyboardNavigationOptimized: true,
        focusIndicators: true,
        ariaLabels: true,
        recommendations: [],
        score: 100,
      },
      optimized: true,
      cached: false,
      metadata: {
        createdBy: 'tenant-system',
        version: '1.0.0',
        lastUpdated: new Date(),
        category: 'tenant',
        tags: ['tenant', 'custom'],
        industry: ['petroleum', 'energy'],
        license: 'MIT',
        compatibility: {
          minVersion: '1.0.0',
        },
      },
    };
  }

  /**
   * Build tenant theme using existing logic
   */
  private buildTenantTheme(tenant: Tenant): TenantTheme {
    // Use the existing buildThemeFromTenant method
    const defaultTheme = {
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

    const customTheme = tenant.theme || {};

    return {
      colors: {
        primary: customTheme.primaryColor || defaultTheme.colors.primary,
        secondary: customTheme.secondaryColor || defaultTheme.colors.secondary,
        accent: customTheme.accentColor || defaultTheme.colors.accent,
        background: customTheme.backgroundColor || defaultTheme.colors.background,
        surface: customTheme.surfaceColor || defaultTheme.colors.surface,
        text: customTheme.textColor || defaultTheme.colors.text,
        textSecondary: customTheme.textSecondaryColor || defaultTheme.colors.textSecondary,
        border: customTheme.borderColor || defaultTheme.colors.border,
        error: defaultTheme.colors.error,
        warning: defaultTheme.colors.warning,
        success: defaultTheme.colors.success,
        info: defaultTheme.colors.info,
      },
      fonts: {
        primary: customTheme.primaryFont || defaultTheme.fonts.primary,
        secondary: customTheme.secondaryFont || defaultTheme.fonts.secondary,
        mono: defaultTheme.fonts.mono,
      },
      spacing: defaultTheme.spacing,
      borderRadius: defaultTheme.borderRadius,
      shadows: defaultTheme.shadows,
    };
  }

  /**
   * Build tenant branding using existing logic
   */
  private buildTenantBranding(tenant: Tenant): TenantBranding {
    const defaultTheme = {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
      },
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
      },
    };

    return {
      logo: tenant.branding?.logo || '/placeholder-logo.svg',
      favicon: tenant.branding?.favicon || '/placeholder-logo.svg',
      name: tenant.name,
      tagline: tenant.branding?.tagline,
      colors: {
        primary: tenant.theme?.primaryColor || defaultTheme.colors.primary,
        secondary: tenant.theme?.secondaryColor || defaultTheme.colors.secondary,
        accent: tenant.theme?.accentColor || defaultTheme.colors.accent,
      },
      fonts: {
        primary: tenant.theme?.primaryFont || defaultTheme.fonts.primary,
        secondary: tenant.theme?.secondaryFont || defaultTheme.fonts.secondary,
      },
    };
  }

  /**
   * Override tenant theme manager methods
   */
  private overrideTenantThemeManager(): void {
    // Store original methods
    const originalApplyTheme = this.tenantThemeManager.applyTheme.bind(this.tenantThemeManager);
    const originalResetToDefault = this.tenantThemeManager.resetToDefault.bind(this.tenantThemeManager);

    // Override applyTheme method
    this.tenantThemeManager.applyTheme = async (tenant: Tenant) => {
      await this.applyTenantTheme(tenant);
    };

    // Override resetToDefault method
    this.tenantThemeManager.resetToDefault = async () => {
      await this.resetTenantTheme();
    };
  }

  /**
   * Update tenant theme manager state for backward compatibility
   */
  private updateTenantThemeManagerState(tenantTheme: TenantTheme, tenantBranding: TenantBranding): void {
    // Update internal state using reflection or direct property access
    // This ensures backward compatibility with existing code
    (this.tenantThemeManager as any).currentTheme = tenantTheme;
    (this.tenantThemeManager as any).currentBranding = tenantBranding;
  }

  /**
   * Apply tenant-specific CSS variables
   */
  private applyTenantCSSVariables(tenantTheme: TenantTheme): void {
    if (typeof window === 'undefined') return;

    // Remove existing tenant style element
    const existingElement = document.getElementById('tenant-theme-variables');
    if (existingElement) {
      document.head.removeChild(existingElement);
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'tenant-theme-variables';

    const cssVariables = `
      :root {
        --tenant-primary: ${tenantTheme.colors.primary};
        --tenant-secondary: ${tenantTheme.colors.secondary};
        --tenant-accent: ${tenantTheme.colors.accent};
        --tenant-background: ${tenantTheme.colors.background};
        --tenant-surface: ${tenantTheme.colors.surface};
        --tenant-text: ${tenantTheme.colors.text};
        --tenant-text-secondary: ${tenantTheme.colors.textSecondary};
        --tenant-border: ${tenantTheme.colors.border};
        --tenant-error: ${tenantTheme.colors.error};
        --tenant-warning: ${tenantTheme.colors.warning};
        --tenant-success: ${tenantTheme.colors.success};
        --tenant-info: ${tenantTheme.colors.info};
        
        --tenant-font-primary: ${tenantTheme.fonts.primary};
        --tenant-font-secondary: ${tenantTheme.fonts.secondary};
        --tenant-font-mono: ${tenantTheme.fonts.mono};
        
        --tenant-spacing-xs: ${tenantTheme.spacing.xs};
        --tenant-spacing-sm: ${tenantTheme.spacing.sm};
        --tenant-spacing-md: ${tenantTheme.spacing.md};
        --tenant-spacing-lg: ${tenantTheme.spacing.lg};
        --tenant-spacing-xl: ${tenantTheme.spacing.xl};
        
        --tenant-radius-sm: ${tenantTheme.borderRadius.sm};
        --tenant-radius-md: ${tenantTheme.borderRadius.md};
        --tenant-radius-lg: ${tenantTheme.borderRadius.lg};
        --tenant-radius-xl: ${tenantTheme.borderRadius.xl};
        
        --tenant-shadow-sm: ${tenantTheme.shadows.sm};
        --tenant-shadow-md: ${tenantTheme.shadows.md};
        --tenant-shadow-lg: ${tenantTheme.shadows.lg};
        --tenant-shadow-xl: ${tenantTheme.shadows.xl};
      }
    `;

    styleElement.textContent = cssVariables;
    document.head.appendChild(styleElement);
  }

  /**
   * Update branding (favicon and page title)
   */
  private updateBranding(tenantBranding: TenantBranding): void {
    if (typeof window === 'undefined') return;

    // Update favicon
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = tenantBranding.favicon;
    } else {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = tenantBranding.favicon;
      document.head.appendChild(link);
    }

    // Update page title
    const originalTitle = document.title;
    if (!originalTitle.includes(tenantBranding.name)) {
      document.title = `${tenantBranding.name} - ${originalTitle}`;
    }
  }
}

// Export singleton instance (lazy initialization)
let _tenantThemeIntegration: TenantThemeIntegration | null = null;

export const getTenantThemeIntegration = async (): Promise<TenantThemeIntegration> => {
  if (!_tenantThemeIntegration) {
    const { UnifiedThemeManager } = await import('./unified-theme-manager');
    const { EnhancedCSSVariableManager } = await import('./enhanced-css-variables');
    
    _tenantThemeIntegration = new TenantThemeIntegration(
      new UnifiedThemeManager(),
      new EnhancedCSSVariableManager()
    );
    
    // Initialize the integration
    await _tenantThemeIntegration.initialize();
  }
  return _tenantThemeIntegration;
};
