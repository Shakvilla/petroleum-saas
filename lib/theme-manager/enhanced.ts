// Documentation: /docs/comprehensive-theming-system/enhanced-theme-manager.md

import { CoreThemeManager } from './core';
import type {
  UnifiedTheme,
  ThemePreset,
  ThemeCustomization,
  ThemeApplicationResult,
  ThemeExportData,
  ThemeImportResult,
  ThemeManagerConfig,
} from '@/types/unified-theme';

// Lazy-loaded imports for performance
let enhancedThemeCacheManager: any;
let themePerformanceMonitor: any;
let optimizedCSSVariableManager: any;
let dynamicTailwindManager: any;
let advancedThemingFeaturesManager: any;
let enhancedThemeValidationManager: any;
let themeAccessibilityFeaturesManager: any;
let themeExportImportManager: any;

/**
 * Enhanced Theme Manager
 * 
 * Extends CoreThemeManager with advanced features loaded on demand
 */
export class EnhancedThemeManager extends CoreThemeManager {
  // Enhanced dependencies (lazy-loaded)
  private enhancedCache: any = null;
  private enhancedPerformanceMonitor: any = null;
  private optimizedCSSManager: any = null;
  private dynamicTailwindManager: any = null;
  private advancedThemingFeatures: any = null;
  private enhancedValidation: any = null;
  private accessibilityFeatures: any = null;
  private exportImportManager: any = null;

  constructor(config: Partial<ThemeManagerConfig> = {}) {
    super(config);
  }

  /**
   * Lazy load enhanced theme modules
   */
  private async loadEnhancedModules() {
    if (!enhancedThemeCacheManager) {
      const modules = await Promise.all([
        import('../enhanced-theme-cache'),
        import('../theme-performance-monitor'),
        import('../optimized-css-variables'),
        import('../dynamic-tailwind-manager'),
        import('../advanced-theming-features'),
        import('../enhanced-theme-validation'),
        import('../theme-accessibility-features'),
        import('../theme-export-import'),
      ]);

      enhancedThemeCacheManager = modules[0].enhancedThemeCacheManager;
      themePerformanceMonitor = modules[1].themePerformanceMonitor;
      optimizedCSSVariableManager = modules[2].optimizedCSSVariableManager;
      dynamicTailwindManager = modules[3].dynamicTailwindManager;
      advancedThemingFeaturesManager = modules[4].advancedThemingFeaturesManager;
      enhancedThemeValidationManager = modules[5].enhancedThemeValidationManager;
      themeAccessibilityFeaturesManager = modules[6].themeAccessibilityFeaturesManager;
      themeExportImportManager = modules[7].themeExportImportManager;

      // Initialize enhanced dependencies
      this.enhancedCache = enhancedThemeCacheManager;
      this.enhancedPerformanceMonitor = themePerformanceMonitor;
      this.optimizedCSSManager = optimizedCSSVariableManager;
      this.dynamicTailwindManager = dynamicTailwindManager;
      this.advancedThemingFeatures = advancedThemingFeaturesManager;
      this.enhancedValidation = enhancedThemeValidationManager;
      this.accessibilityFeatures = themeAccessibilityFeaturesManager;
      this.exportImportManager = themeExportImportManager;
    }
  }

  /**
   * Enhanced theme application with advanced features
   */
  async applyTheme(theme: UnifiedTheme): Promise<ThemeApplicationResult> {
    // Load enhanced modules if needed
    await this.loadEnhancedModules();

    // Call parent applyTheme
    const result = await super.applyTheme(theme);

    if (result.success && this.enhancedCache) {
      // Enhanced caching
      await this.enhancedCache.cacheTheme(theme);
    }

    if (result.success && this.optimizedCSSManager) {
      // Optimized CSS variable injection
      await this.optimizedCSSManager.injectVariables(theme);
    }

    if (result.success && this.dynamicTailwindManager) {
      // Dynamic Tailwind class injection
      await this.dynamicTailwindManager.injectTailwindClasses(theme);
    }

    if (result.success && this.enhancedPerformanceMonitor) {
      // Enhanced performance monitoring
      this.enhancedPerformanceMonitor.monitorThemeApplication(theme, result.performance);
    }

    return result;
  }

  /**
   * Export theme with enhanced features
   */
  async exportTheme(themeId: string, format: 'json' | 'yaml' | 'css' = 'json'): Promise<ThemeExportData> {
    await this.loadEnhancedModules();

    if (this.exportImportManager) {
      return await this.exportImportManager.exportTheme(themeId, format);
    }

    // Fallback to basic export
    const theme = this.getCurrentTheme();
    if (!theme) {
      throw new Error('No theme to export');
    }

    return {
      theme,
      format,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Import theme with enhanced features
   */
  async importTheme(data: ThemeExportData): Promise<ThemeImportResult> {
    await this.loadEnhancedModules();

    if (this.exportImportManager) {
      return await this.exportImportManager.importTheme(data);
    }

    // Fallback to basic import
    try {
      const validation = this.validateTheme(data.theme);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors,
          warnings: validation.warnings.map(w => w.message),
        };
      }

      await this.applyTheme(data.theme);
      return {
        success: true,
        theme: data.theme,
        errors: [],
        warnings: validation.warnings.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
      };
    }
  }

  /**
   * Enhanced theme validation
   */
  validateTheme(theme: UnifiedTheme) {
    // Call parent validation first
    const basicValidation = super.validateTheme(theme);

    // Enhanced validation if available
    if (this.enhancedValidation) {
      return this.enhancedValidation.validateTheme(theme);
    }

    return basicValidation;
  }

  /**
   * Apply accessibility features
   */
  async applyAccessibilityFeatures(theme: UnifiedTheme): Promise<UnifiedTheme> {
    await this.loadEnhancedModules();

    if (this.accessibilityFeatures) {
      return await this.accessibilityFeatures.applyAccessibilityFeatures(theme);
    }

    return theme;
  }

  /**
   * Apply advanced theming features
   */
  async applyAdvancedFeatures(theme: UnifiedTheme): Promise<UnifiedTheme> {
    await this.loadEnhancedModules();

    if (this.advancedThemingFeatures) {
      return await this.advancedThemingFeatures.applyAdvancedFeatures(theme);
    }

    return theme;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    if (this.enhancedPerformanceMonitor) {
      return this.enhancedPerformanceMonitor.getMetrics();
    }

    return this.performanceMetrics;
  }

  /**
   * Clear enhanced cache
   */
  async clearEnhancedCache(): Promise<void> {
    await this.loadEnhancedModules();

    if (this.enhancedCache) {
      await this.enhancedCache.clear();
    }
  }

  /**
   * Destroy enhanced manager
   */
  destroy(): void {
    super.destroy();
    
    // Clean up enhanced dependencies
    this.enhancedCache = null;
    this.enhancedPerformanceMonitor = null;
    this.optimizedCSSManager = null;
    this.dynamicTailwindManager = null;
    this.advancedThemingFeatures = null;
    this.enhancedValidation = null;
    this.accessibilityFeatures = null;
    this.exportImportManager = null;
  }
}
