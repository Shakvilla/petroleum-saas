// Documentation: /docs/comprehensive-theming-system/unified-theme-manager.md

import type {
  UnifiedTheme,
  ThemeApplicationResult,
  ThemeValidationResult,
  ThemeHistoryEntry,
  PerformanceMetrics,
  ThemeExportData,
  ThemeImportResult,
  ThemeManagerConfig,
  ThemeManager,
  EnhancedCSSVariables,
} from '@/types/unified-theme';
import {
  DEFAULT_SPACING,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_SHADOWS,
  DEFAULT_ANIMATIONS,
  DEFAULT_TRANSITIONS,
  DEFAULT_EFFECTS,
  DEFAULT_ACCESSIBILITY,
} from '@/types/unified-theme';
import type { ColorScheme, TypographyConfig } from '@/types/settings';
import { ThemeCacheManager } from './theme-cache';
import { ThemePerformanceMonitor } from './theme-performance';
import { validateThemePreset } from './theme-validation';
import { getThemePresetById } from './theme-presets-data';
// Heavy imports moved to dynamic loading to improve performance

/**
 * Unified Theme Manager
 * 
 * Central theme management system that handles:
 * - Theme application from multiple sources
 * - Real-time theme updates
 * - Theme validation and optimization
 * - Performance monitoring
 * - Caching and persistence
 */
export class UnifiedThemeManager implements ThemeManager {
  // State
  private _currentTheme: UnifiedTheme | null = null;
  private _themePresets: Map<string, ThemePreset> = new Map();
  private _customThemes: Map<string, UnifiedTheme> = new Map();
  private _themeHistory: ThemeHistoryEntry[] = [];
  private _validationResults: ThemeValidationResult | null = null;
  private _performanceMetrics: PerformanceMetrics | null = null;
  private _isApplying: boolean = false;
  private _lastApplied: Date | null = null;
  private _errors: string[] = [];

  // Dependencies
  private cache: ThemeCacheManager;
  private performanceMonitor: ThemePerformanceMonitor;
  private config: ThemeManagerConfig;
  
  // Enhanced dependencies (loaded dynamically)
  private enhancedCache: any;
  private enhancedPerformanceMonitor: any;
  private optimizedCSSManager: any;
  private dynamicTailwindManager: any;
  private advancedThemingFeatures: any;
  private enhancedValidation: any;
  private accessibilityFeatures: any;
  private exportImportManager: any;

  // Default theme
  private defaultTheme: UnifiedTheme;
  
  // Additional properties
  private historyIndex: number = -1;
  private currentCustomizations: any = null;

  constructor(config: Partial<ThemeManagerConfig> = {}) {
    this.config = {
      enableCaching: true,
      enablePerformanceMonitoring: true,
      enableRealTimeUpdates: true,
      enableAccessibilityValidation: true,
      cacheSize: 100,
      cacheTTL: 5 * 60 * 1000, // 5 minutes
      debounceDelay: 100,
      validationLevel: 'standard',
      ...config,
    };

    this.cache = new ThemeCacheManager({
      maxSize: this.config.cacheSize,
      ttl: this.config.cacheTTL,
    });

    this.performanceMonitor = new ThemePerformanceMonitor();
    
    // Initialize enhanced dependencies with dynamic loading
    this.initializeEnhancedDependencies();

    this.defaultTheme = this.getDefaultTheme();
    this.loadThemePresets();
  }

  // Core Theme Management

  /**
   * Initialize enhanced dependencies with dynamic loading
   */
  private async initializeEnhancedDependencies(): Promise<void> {
    try {
      // Load heavy dependencies dynamically to improve initial load time
      const [
        { enhancedThemeCacheManager },
        { themePerformanceMonitor },
        { optimizedCSSVariableManager },
        { dynamicTailwindManager },
        { advancedThemingFeaturesManager },
        { enhancedThemeValidationManager },
        { themeAccessibilityFeaturesManager },
        { themeExportImportManager }
      ] = await Promise.all([
        import('./enhanced-theme-cache'),
        import('./theme-performance-monitor'),
        import('./optimized-css-variables'),
        import('./dynamic-tailwind-manager'),
        import('./advanced-theming-features'),
        import('./enhanced-theme-validation'),
        import('./theme-accessibility-features'),
        import('./theme-export-import')
      ]);

      this.enhancedCache = enhancedThemeCacheManager;
      this.enhancedPerformanceMonitor = themePerformanceMonitor;
      this.optimizedCSSManager = optimizedCSSVariableManager;
      this.dynamicTailwindManager = dynamicTailwindManager;
      this.advancedThemingFeatures = advancedThemingFeaturesManager;
      this.enhancedValidation = enhancedThemeValidationManager;
      this.accessibilityFeatures = themeAccessibilityFeaturesManager;
      this.exportImportManager = themeExportImportManager;
    } catch (error) {
      console.warn('Failed to load enhanced theme dependencies:', error);
      // Set fallback values to prevent runtime errors
      this.enhancedCache = null as any;
      this.enhancedPerformanceMonitor = null as any;
      this.optimizedCSSManager = null as any;
      this.dynamicTailwindManager = null as any;
      this.advancedThemingFeatures = null as any;
      this.enhancedValidation = null as any;
      this.accessibilityFeatures = null as any;
      this.exportImportManager = null as any;
    }
  }

  /**
   * Apply a theme to the application
   */
  async applyTheme(theme: UnifiedTheme): Promise<ThemeApplicationResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this._isApplying = true;

      // Ensure enhanced dependencies are loaded
      if (!this.enhancedCache) {
        await this.initializeEnhancedDependencies();
      }

      // Validate theme if enabled
      if (this.config.enableAccessibilityValidation) {
        const validation = this.validateTheme(theme);
        if (!validation.isValid) {
          errors.push(...validation.errors.map(e => e.message));
        }
        warnings.push(...validation.warnings.map(w => w.message));
      }

      // Apply theme if validation passes or is disabled
      if (errors.length === 0) {
        await this.applyThemeToDocument(theme);
        await this.applyThemeToComponents(theme);
        await this.applyThemeToLayout(theme);

        this._currentTheme = theme;
        this._lastApplied = new Date();

        // Add to history
        this.addToHistory({
          id: `theme-${theme.id}-${Date.now()}`,
          theme,
          appliedAt: new Date(),
          appliedBy: 'user',
          description: `Applied theme: ${theme.name}`,
          duration: performance.now() - startTime,
        });

        // Cache theme if enabled
        if (this.config.enableCaching) {
          this.cacheTheme(theme);
          // Use enhanced cache
          await this.enhancedCache.cacheTheme(theme);
        }

        // Record performance metrics if enabled
        if (this.config.enablePerformanceMonitoring) {
          this.recordPerformanceMetrics(performance.now() - startTime);
          // Use enhanced performance monitoring
          await this.enhancedPerformanceMonitor.monitorThemeApplication(theme);
        }

        // Apply advanced theming features
        const advancedTheme = this.advancedThemingFeatures.applyAccessibilityFeatures(theme);
        
        // Apply accessibility features
        const accessibleTheme = this.accessibilityFeatures.applyAccessibilityFeatures(advancedTheme);
        
        // Validate theme
        const validationResults = this.enhancedValidation.validateTheme(accessibleTheme);
        
        // Auto-fix if enabled and validation failed
        if (!validationResults.isValid && this.config.autoFix) {
          const fixedTheme = this.enhancedValidation.autoFixTheme(accessibleTheme);
          await this.applyThemeToDocument(fixedTheme);
        }
      }

      return {
        success: errors.length === 0,
        theme,
        appliedAt: new Date(),
        duration: performance.now() - startTime,
        errors,
        warnings,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      this.errors.push(errorMessage);

      return {
        success: false,
        theme,
        appliedAt: new Date(),
        duration: performance.now() - startTime,
        errors,
        warnings,
      };
    } finally {
      this._isApplying = false;
    }
  }

  /**
   * Apply a theme preset with optional customizations
   */
  async applyPreset(presetId: string, customizations?: ThemeCustomization): Promise<ThemeApplicationResult> {
    const preset = this.themePresets.get(presetId);
    if (!preset) {
      throw new Error(`Theme preset not found: ${presetId}`);
    }

    const unifiedTheme = this.convertPresetToUnifiedTheme(preset);
    
    if (customizations) {
      const customizedTheme = this.applyCustomizations(unifiedTheme, customizations);
      return this.applyTheme(customizedTheme);
    }

    return this.applyTheme(unifiedTheme);
  }

  /**
   * Apply customizations to the current theme
   */
  async applyCustomization(customization: ThemeCustomization): Promise<ThemeApplicationResult> {
    if (!this.currentTheme) {
      throw new Error('No current theme to customize');
    }

    const customizedTheme = this.applyCustomizations(this.currentTheme, customization);
    return this.applyTheme(customizedTheme);
  }

  // Theme Management

  /**
   * Save a theme
   */
  saveTheme(theme: UnifiedTheme): void {
    this.customThemes.set(theme.id, theme);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(`theme-${theme.id}`, JSON.stringify(theme));
    }
  }

  /**
   * Load a theme by ID
   */
  loadTheme(themeId: string): UnifiedTheme | null {
    // Check custom themes first
    if (this.customThemes.has(themeId)) {
      return this.customThemes.get(themeId)!;
    }

    // Check presets
    const preset = this.themePresets.get(themeId);
    if (preset) {
      return this.convertPresetToUnifiedTheme(preset);
    }

    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(`theme-${themeId}`);
      if (stored) {
        try {
          const theme = JSON.parse(stored) as UnifiedTheme;
          this.customThemes.set(themeId, theme);
          return theme;
        } catch (error) {
          console.error('Failed to parse stored theme:', error);
        }
      }
    }

    return null;
  }

  /**
   * Delete a theme
   */
  deleteTheme(themeId: string): void {
    this.customThemes.delete(themeId);
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`theme-${themeId}`);
    }
  }

  // Validation

  /**
   * Validate a theme
   */
  validateTheme(theme: UnifiedTheme): ThemeValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const recommendations: string[] = [];

    // Validate colors
    const colorValidation = this.validateColors(theme.colors);
    errors.push(...colorValidation.errors);
    warnings.push(...colorValidation.warnings);

    // Validate typography
    const typographyValidation = this.validateTypography(theme.typography);
    errors.push(...typographyValidation.errors);
    warnings.push(...typographyValidation.warnings);

    // Validate accessibility
    const accessibilityValidation = this.validateAccessibility(theme.accessibility);
    errors.push(...accessibilityValidation.errors);
    warnings.push(...accessibilityValidation.warnings);

    // Calculate score
    const score = this.calculateValidationScore(errors, warnings);

    // Generate recommendations
    if (score < 80) {
      recommendations.push('Consider improving color contrast ratios');
    }
    if (score < 90) {
      recommendations.push('Review typography for better readability');
    }
    if (score < 95) {
      recommendations.push('Optimize for accessibility compliance');
    }

    this._validationResults = {
      isValid: errors.length === 0,
      errors,
      warnings,
      recommendations,
      score,
      lastValidated: new Date(),
    };

    return this._validationResults;
  }

  // History Management

  /**
   * Undo the last theme change
   */
  undoThemeChange(): void {
    if (this.themeHistory.length > 1) {
      const previousEntry = this.themeHistory[this.themeHistory.length - 2];
      this.applyTheme(previousEntry.theme);
    }
  }

  /**
   * Redo the last undone theme change
   */
  redoThemeChange(): void {
    // Implementation would require tracking undone changes
    // For now, this is a placeholder
    console.warn('Redo functionality not yet implemented');
  }

  /**
   * Clear theme history
   */
  clearHistory(): void {
    this._themeHistory = [];
  }

  // Export/Import

  /**
   * Export a theme
   */
  exportTheme(theme: UnifiedTheme): string {
    const exportData: ThemeExportData = {
      theme,
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        application: 'petroleum-saas',
        exportedBy: 'user',
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import a theme
   */
  importTheme(themeData: string): ThemeImportResult {
    try {
      const parsed = JSON.parse(themeData) as ThemeExportData;
      
      if (!parsed.theme) {
        return {
          success: false,
          errors: ['Invalid theme data format'],
          warnings: [],
        };
      }

      // Validate imported theme
      const validation = this.validateTheme(parsed.theme);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors.map(e => e.message),
          warnings: validation.warnings.map(w => w.message),
        };
      }

      // Save imported theme
      this.saveTheme(parsed.theme);

      return {
        success: true,
        theme: parsed.theme,
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

  // Performance

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics | null {
    return this._performanceMetrics;
  }

  /**
   * Clear performance metrics
   */
  clearPerformanceMetrics(): void {
    this._performanceMetrics = null;
  }

  // Cache

  /**
   * Clear theme cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return this.cache.getStats();
  }

  // Reset

  /**
   * Reset to default theme
   */
  resetToDefault(): void {
    this.applyTheme(this.defaultTheme);
  }

  /**
   * Reset to a specific preset
   */
  resetToPreset(presetId: string): void {
    this.applyPreset(presetId);
  }

  // Getters

  get currentTheme(): UnifiedTheme | null {
    return this._currentTheme;
  }

  get themePresets(): Map<string, ThemePreset> {
    return this._themePresets;
  }

  get customThemes(): Map<string, UnifiedTheme> {
    return this._customThemes;
  }

  get themeHistory(): ThemeHistoryEntry[] {
    return this._themeHistory;
  }

  get validationResults(): ThemeValidationResult | null {
    return this._validationResults;
  }

  get performanceMetrics(): PerformanceMetrics | null {
    return this._performanceMetrics;
  }

  get isApplying(): boolean {
    return this._isApplying;
  }

  get lastApplied(): Date | null {
    return this._lastApplied;
  }

  get errors(): string[] {
    return this._errors;
  }

  // Private Methods

  /**
   * Create default theme
   */
  private createDefaultTheme(): UnifiedTheme {
    return {
      id: 'default',
      name: 'Default Theme',
      description: 'Default theme for the application',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingFont: 'Inter, system-ui, sans-serif',
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
        fontWeight: {
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75',
        },
      },
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      shadows: DEFAULT_SHADOWS,
      branding: {
        logo: {
          primary: '',
          favicon: '',
          sizes: {
            small: '',
            medium: '',
            large: '',
          },
        },
        favicon: '',
        appName: 'Petroleum SaaS',
      },
      animations: DEFAULT_ANIMATIONS,
      transitions: DEFAULT_TRANSITIONS,
      effects: DEFAULT_EFFECTS,
      accessibility: DEFAULT_ACCESSIBILITY,
      optimized: true,
      cached: false,
      metadata: {
        createdBy: 'System',
        version: '1.0.0',
        lastUpdated: new Date(),
        category: 'corporate',
        tags: ['default', 'system'],
        industry: ['petroleum', 'energy'],
        license: 'MIT',
        compatibility: {
          minVersion: '1.0.0',
        },
      },
    };
  }

  /**
   * Load theme presets
   */
  private loadThemePresets(): void {
    // Load presets from theme-presets-data
    // This would be implemented to load from the existing preset system
    console.log('Loading theme presets...');
  }

  /**
   * Convert preset to unified theme
   */
  private convertPresetToUnifiedTheme(preset: ThemePreset): UnifiedTheme {
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      colors: preset.colors,
      typography: preset.typography,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      shadows: DEFAULT_SHADOWS,
      branding: {
        logo: {
          primary: '',
          favicon: '',
          sizes: {
            small: '',
            medium: '',
            large: '',
          },
        },
        favicon: '',
        appName: 'Petroleum SaaS',
      },
      animations: DEFAULT_ANIMATIONS,
      transitions: DEFAULT_TRANSITIONS,
      effects: DEFAULT_EFFECTS,
      accessibility: preset.accessibility,
      optimized: true,
      cached: false,
      metadata: {
        createdBy: preset.metadata?.createdBy || 'System',
        version: preset.metadata?.version || '1.0.0',
        lastUpdated: preset.metadata?.lastUpdated || new Date(),
        category: preset.category,
        tags: preset.tags,
        industry: preset.metadata?.industry || ['petroleum', 'energy'],
        license: 'MIT',
        compatibility: {
          minVersion: '1.0.0',
        },
      },
    };
  }

  /**
   * Apply customizations to a theme
   */
  private applyCustomizations(theme: UnifiedTheme, customization: ThemeCustomization): UnifiedTheme {
    return {
      ...theme,
      colors: {
        ...theme.colors,
        ...customization.customizations.colors,
      },
      typography: {
        ...theme.typography,
        ...customization.customizations.typography,
      },
      branding: {
        ...theme.branding,
        ...customization.customizations.logo,
        favicon: customization.customizations.favicon || theme.branding.favicon,
      },
    };
  }

  /**
   * Apply theme to document
   */
  private async applyThemeToDocument(theme: UnifiedTheme): Promise<void> {
    if (typeof window === 'undefined') return;

    const cssVariables = this.generateCSSVariables(theme);
    
    // Use optimized CSS variable injection
    await this.optimizedCSSManager.injectVariables(cssVariables);
    
    // Generate and inject dynamic Tailwind classes
    await this.dynamicTailwindManager.injectTailwindClasses(theme);
  }

  /**
   * Apply theme to components
   */
  private async applyThemeToComponents(theme: UnifiedTheme): Promise<void> {
    // Monitor component update performance
    const componentCount = document.querySelectorAll('[class*="theme-"]').length;
    await this.enhancedPerformanceMonitor.monitorComponentUpdate(componentCount);
    
    // Dispatch custom event for components to listen to
    if (typeof window !== 'undefined') {
      const themeChangeEvent = new CustomEvent('theme-change', {
        detail: {
          theme,
          timestamp: Date.now(),
        },
      });
      window.dispatchEvent(themeChangeEvent);
    }
    
    console.log('Applying theme to components:', theme.name);
  }

  /**
   * Apply theme to layout
   */
  private async applyThemeToLayout(theme: UnifiedTheme): Promise<void> {
    // This would update layout-specific styling
    // Implementation depends on the layout system
    console.log('Applying theme to layout:', theme.name);
  }

  /**
   * Generate CSS variables from theme
   */
  private generateCSSVariables(theme: UnifiedTheme): EnhancedCSSVariables {
    return {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        surface: theme.colors.surface,
        text: theme.colors.text,
        textSecondary: theme.colors.textSecondary || theme.colors.text,
        border: theme.colors.border || '#e2e8f0',
        error: theme.colors.error,
        warning: theme.colors.warning,
        success: theme.colors.success,
        info: theme.colors.info || theme.colors.primary,
      },
      typography: {
        fontFamily: theme.typography.fontFamily,
        headingFont: theme.typography.headingFont || theme.typography.fontFamily,
        fontSize: theme.typography.fontSizes,
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75',
        },
      },
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
      animations: theme.animations.duration,
      transitions: theme.transitions.duration,
      effects: theme.effects.blur,
    };
  }

  /**
   * Inject CSS variables into document
   */
  private injectCSSVariables(variables: EnhancedCSSVariables): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Inject color variables
    Object.entries(variables.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Inject typography variables
    Object.entries(variables.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--font-${key}`, value);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--font-${key}-${subKey}`, subValue);
        });
      }
    });

    // Inject spacing variables
    Object.entries(variables.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Inject border radius variables
    Object.entries(variables.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Inject shadow variables
    Object.entries(variables.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }

  /**
   * Cache a theme
   */
  private cacheTheme(theme: UnifiedTheme): void {
    const cssVariables = this.generateCSSVariables(theme);
    this.cache.set(`theme-${theme.id}`, {
      theme,
      cssVariables,
      tailwindClasses: [], // Would be generated
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
    });
  }

  /**
   * Add entry to theme history
   */
  private addToHistory(entry: ThemeHistoryEntry): void {
    this.themeHistory.push(entry);
    
    // Limit history size
    if (this.themeHistory.length > 50) {
      this.themeHistory.shift();
    }
  }

  /**
   * Record performance metrics
   */
  private recordPerformanceMetrics(duration: number): void {
    this._performanceMetrics = {
      themeApplicationTime: duration,
      cssVariableInjectionTime: 0, // Would be measured
      componentUpdateTime: 0, // Would be measured
      memoryUsage: 0, // Would be measured
      cacheHitRate: 0, // Would be calculated
      timestamp: new Date(),
    };
  }

  /**
   * Validate colors
   */
  private validateColors(colors: ColorScheme): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Basic color validation
    Object.entries(colors).forEach(([key, value]) => {
      if (!value) {
        errors.push({
          type: 'color',
          message: `Missing color value for ${key}`,
          element: key,
        });
      }
    });

    return { errors, warnings };
  }

  /**
   * Validate typography
   */
  private validateTypography(typography: TypographyConfig): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!typography.fontFamily) {
      errors.push({
        type: 'typography',
        message: 'Missing font family',
        element: 'fontFamily',
      });
    }

    return { errors, warnings };
  }

  /**
   * Validate accessibility
   */
  private validateAccessibility(accessibility: any): { errors: ValidationError[]; warnings: ValidationWarning[] } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (accessibility.contrastRatio < 4.5) {
      warnings.push({
        type: 'accessibility',
        message: 'Contrast ratio below WCAG AA standard',
        element: 'contrastRatio',
        value: accessibility.contrastRatio,
        recommendation: 'Increase contrast ratio to at least 4.5',
      });
    }

    return { errors, warnings };
  }

  /**
   * Calculate validation score
   */
  private calculateValidationScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    let score = 100;
    score -= errors.length * 20; // Each error reduces score by 20
    score -= warnings.length * 5; // Each warning reduces score by 5
    return Math.max(0, score);
  }

  /**
   * Get current theme
   */
  getCurrentTheme(): UnifiedTheme | null {
    return this._currentTheme;
  }

  /**
   * Get current branding
   */
  getCurrentBranding(): BrandingConfig | null {
    return this._currentTheme?.branding || null;
  }

  /**
   * Reset theme to default
   */
  async resetTheme(): Promise<ThemeApplicationResult> {
    const defaultTheme = this.getDefaultTheme();
    return this.applyTheme(defaultTheme);
  }

  /**
   * Undo theme change
   */
  undo(): ThemeApplicationResult {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const theme = this._themeHistory[this.historyIndex];
      this._currentTheme = theme;
      this.applyThemeToDocument(theme);
      return { success: true, theme, errors: [], warnings: [] };
    }
    return { success: false, theme: null, errors: [{ type: 'history', message: 'No previous theme to undo' }], warnings: [] };
  }

  /**
   * Redo theme change
   */
  redo(): ThemeApplicationResult {
    if (this.historyIndex < this._themeHistory.length - 1) {
      this.historyIndex++;
      const theme = this._themeHistory[this.historyIndex];
      this._currentTheme = theme;
      this.applyThemeToDocument(theme);
      return { success: true, theme, errors: [], warnings: [] };
    }
    return { success: false, theme: null, errors: [{ type: 'history', message: 'No future theme to redo' }], warnings: [] };
  }

  /**
   * Get theme presets
   */
  getThemePresets(): ThemePreset[] {
    // This would typically load from a data source
    return [];
  }

  /**
   * Get theme preset by ID
   */
  getThemePresetById(id: string): ThemePreset | null {
    return getThemePresetById(id) || null;
  }

  /**
   * Save theme customizations
   */
  saveCustomizations(customizations: ThemeCustomization): ThemeApplicationResult {
    this.currentCustomizations = customizations;
    if (this._currentTheme) {
      const customizedTheme = this.applyCustomizations(this._currentTheme, customizations);
      return this.applyTheme(customizedTheme);
    }
    return { success: false, theme: null, errors: [{ type: 'customization', message: 'No current theme to customize' }], warnings: [] };
  }

  /**
   * Reset theme customizations
   */
  resetCustomizations(): ThemeApplicationResult {
    this.currentCustomizations = null;
    if (this._currentTheme) {
      return this.applyTheme(this._currentTheme);
    }
    return { success: false, theme: null, errors: [{ type: 'customization', message: 'No current theme to reset' }], warnings: [] };
  }

  /**
   * Get current configuration
   */
  getConfig(): ThemeManagerConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ThemeManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Destroy theme manager
   */
  destroy(): void {
    // Cleanup resources
    this._currentTheme = null;
    this.currentCustomizations = null;
    this._themeHistory = [];
    this.historyIndex = -1;
  }

  /**
   * Get default theme
   */
  private getDefaultTheme(): UnifiedTheme {
    return {
      id: 'default',
      name: 'Default Theme',
      description: 'Default theme',
      colors: {
        primary: '#3b82f6',
        secondary: '#1f2937',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
        headingFont: 'Inter, sans-serif',
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
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75',
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '5rem',
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
      shadows: {
        none: 'none',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      branding: {
        logo: {
          primary: '',
          favicon: '',
          sizes: {
            small: '',
            medium: '',
            large: '',
          },
        },
        favicon: '',
        appName: 'PetroManager',
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
        keyframes: {},
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
        properties: ['color', 'background-color', 'border-color'],
      },
      effects: {
        blur: {
          none: '0',
          sm: '4px',
          md: '8px',
          lg: '12px',
          xl: '16px',
          '2xl': '24px',
          '3xl': '40px',
        },
        brightness: {
          '0': '0',
          '50': '0.5',
          '75': '0.75',
          '90': '0.9',
          '95': '0.95',
          '100': '1',
          '105': '1.05',
          '110': '1.1',
          '125': '1.25',
          '150': '1.5',
          '200': '2',
        },
        contrast: {
          '0': '0',
          '50': '0.5',
          '75': '0.75',
          '100': '1',
          '125': '1.25',
          '150': '1.5',
          '200': '2',
        },
        grayscale: {
          '0': '0',
          '100': '1',
        },
        hueRotate: {
          '0': '0deg',
          '15': '15deg',
          '30': '30deg',
          '60': '60deg',
          '90': '90deg',
          '180': '180deg',
        },
        invert: {
          '0': '0',
          '100': '1',
        },
        opacity: {
          '0': '0',
          '5': '0.05',
          '10': '0.1',
          '20': '0.2',
          '25': '0.25',
          '30': '0.3',
          '40': '0.4',
          '50': '0.5',
          '60': '0.6',
          '70': '0.7',
          '75': '0.75',
          '80': '0.8',
          '90': '0.9',
          '95': '0.95',
          '100': '1',
        },
        saturate: {
          '0': '0',
          '50': '0.5',
          '100': '1',
          '150': '1.5',
          '200': '2',
        },
        sepia: {
          '0': '0',
          '100': '1',
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
      optimized: false,
      cached: false,
      metadata: {
        author: 'System',
        license: 'MIT',
        tags: ['default'],
        category: 'corporate',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
  }
}

// Export singleton instance
export const unifiedThemeManager = new UnifiedThemeManager();
