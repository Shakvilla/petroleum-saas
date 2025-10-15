// Documentation: /docs/comprehensive-theming-system/theme-manager-core.md

import type {
  UnifiedTheme,
  ThemePreset,
  ThemeCustomization,
  ThemeApplicationResult,
  ThemeValidationResult,
  ThemeHistoryEntry,
  PerformanceMetrics,
  ThemeExportData,
  ThemeImportResult,
  ThemeManagerConfig,
  ThemeManager,
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
import { ThemeCacheManager } from '../theme-cache';
import { ThemePerformanceMonitor } from '../theme-performance';
import { validateThemePreset } from '../theme-validation';
import { getThemePresetById } from '../theme-presets-data';

/**
 * Core Theme Manager
 * 
 * Handles basic theme management operations without heavy dependencies
 */
export class CoreThemeManager implements ThemeManager {
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

  // Configuration
  private config: ThemeManagerConfig;
  
  // Core dependencies
  private cache: ThemeCacheManager;
  private performanceMonitor: ThemePerformanceMonitor;

  // Default theme
  private defaultTheme: UnifiedTheme;

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

    this.defaultTheme = this.getDefaultTheme();
    this.loadThemePresets();
  }

  // Core Theme Management

  /**
   * Apply a theme to the application
   */
  async applyTheme(theme: UnifiedTheme): Promise<ThemeApplicationResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      this._isApplying = true;

      // Validate theme if enabled
      if (this.config.enableAccessibilityValidation) {
        const validation = this.validateTheme(theme);
        if (!validation.isValid) {
          errors.push(...validation.errors);
          warnings.push(...validation.warnings.map(w => w.message));
        }
      }

      // Cache theme
      if (this.config.enableCaching) {
        this.cache.set(theme.id, theme);
      }

      // Apply theme to document
      await this.applyThemeToDocument(theme);

      // Update state
      this._currentTheme = theme;
      this._lastApplied = new Date();

      // Add to history
      this.addToThemeHistory(theme);

      // Performance monitoring
      if (this.config.enablePerformanceMonitoring) {
        const endTime = performance.now();
        this._performanceMetrics = {
          applyTime: endTime - startTime,
          themeSize: JSON.stringify(theme).length,
          cacheHitRate: this.cache.getHitRate(),
          memoryUsage: process.memoryUsage?.()?.heapUsed || 0,
        };
      }

      return {
        success: true,
        theme,
        errors,
        warnings,
        performance: this._performanceMetrics,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      this._errors.push(errorMessage);

      return {
        success: false,
        theme: null,
        errors,
        warnings,
        performance: this._performanceMetrics,
      };
    } finally {
      this._isApplying = false;
    }
  }

  /**
   * Apply theme to document
   */
  private async applyThemeToDocument(theme: UnifiedTheme): Promise<void> {
    if (typeof window === 'undefined') return;

    // Apply CSS variables
    const root = document.documentElement;
    
    // Colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Typography
    Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    root.style.setProperty('--font-family', theme.typography.fontFamily);
    root.style.setProperty('--heading-font', theme.typography.headingFont || theme.typography.fontFamily);

    // Spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }

  /**
   * Validate theme
   */
  validateTheme(theme: UnifiedTheme): ThemeValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!theme.id) errors.push('Theme ID is required');
    if (!theme.name) errors.push('Theme name is required');
    if (!theme.colors) errors.push('Theme colors are required');
    if (!theme.typography) errors.push('Theme typography is required');

    // Color validation
    if (theme.colors) {
      const requiredColors = ['primary', 'secondary', 'background', 'text'];
      requiredColors.forEach(color => {
        if (!theme.colors[color as keyof typeof theme.colors]) {
          errors.push(`Required color '${color}' is missing`);
        }
      });
    }

    // Typography validation
    if (theme.typography) {
      if (!theme.typography.fontFamily) {
        errors.push('Font family is required');
      }
      if (!theme.typography.fontSizes || Object.keys(theme.typography.fontSizes).length === 0) {
        errors.push('Font sizes are required');
      }
    }

    // Accessibility validation
    if (theme.accessibility) {
      if (theme.accessibility.contrastRatio < 4.5) {
        warnings.push('Contrast ratio below WCAG AA standard');
      }
    }

    const isValid = errors.length === 0;

    this._validationResults = {
      isValid,
      errors,
      warnings: warnings.map(message => ({ type: 'warning' as const, message })),
      score: isValid ? 100 : Math.max(0, 100 - (errors.length * 10) - (warnings.length * 5)),
    };

    return this._validationResults;
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
          '5xl': '3rem',
          '6xl': '3.75rem',
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
      animations: DEFAULT_ANIMATIONS,
      transitions: DEFAULT_TRANSITIONS,
      effects: DEFAULT_EFFECTS,
      accessibility: DEFAULT_ACCESSIBILITY,
      branding: {
        logo: '',
        favicon: '',
        companyName: '',
        tagline: '',
      },
      metadata: {
        version: '1.0.0',
        author: 'System',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['default'],
        category: 'corporate',
      },
    };
  }

  /**
   * Load theme presets
   */
  private loadThemePresets(): void {
    // Load default presets
    const defaultPresets = [
      'corporate-blue',
      'modern-green',
      'vibrant-purple',
      'minimal-gray',
      'dark-theme',
      'accessible-theme',
    ];

    defaultPresets.forEach(presetId => {
      try {
        const preset = getThemePresetById(presetId);
        if (preset) {
          this._themePresets.set(presetId, preset);
        }
      } catch (error) {
        console.warn(`Failed to load preset ${presetId}:`, error);
      }
    });
  }

  /**
   * Add theme to history
   */
  private addToThemeHistory(theme: UnifiedTheme): void {
    const historyEntry: ThemeHistoryEntry = {
      id: `history-${Date.now()}`,
      theme: { ...theme },
      timestamp: new Date(),
      action: 'apply',
    };

    this._themeHistory.push(historyEntry);

    // Limit history size
    if (this._themeHistory.length > 50) {
      this._themeHistory = this._themeHistory.slice(-50);
    }
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

  // Additional core methods
  getCurrentTheme(): UnifiedTheme | null {
    return this._currentTheme;
  }

  getCurrentBranding(): any {
    return this._currentTheme?.branding || null;
  }

  resetTheme(): void {
    this._currentTheme = null;
    this._errors = [];
  }

  undo(): boolean {
    if (this._themeHistory.length > 1) {
      this._themeHistory.pop();
      const previousTheme = this._themeHistory[this._themeHistory.length - 1];
      if (previousTheme) {
        this._currentTheme = previousTheme.theme;
        return true;
      }
    }
    return false;
  }

  redo(): boolean {
    // Implementation for redo functionality
    return false;
  }

  getThemePresets(): ThemePreset[] {
    return Array.from(this._themePresets.values());
  }

  getThemePresetById(id: string): ThemePreset | null {
    return this._themePresets.get(id) || null;
  }

  saveCustomizations(customizations: ThemeCustomization): void {
    // Implementation for saving customizations
  }

  resetCustomizations(): void {
    // Implementation for resetting customizations
  }

  getConfig(): ThemeManagerConfig {
    return this.config;
  }

  updateConfig(newConfig: Partial<ThemeManagerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Theme management methods
  saveTheme(theme: UnifiedTheme): void {
    const themeId = theme.id || `theme_${Date.now()}`;
    this._customThemes.set(themeId, { ...theme, id: themeId });
  }

  loadTheme(themeId: string): UnifiedTheme | null {
    // Try custom themes first
    const customTheme = this._customThemes.get(themeId);
    if (customTheme) {
      return customTheme;
    }

    // Try theme presets
    const preset = this._themePresets.get(themeId);
    if (preset) {
      return this.convertPresetToTheme(preset);
    }

    // Return default theme for 'default' ID
    if (themeId === 'default') {
      return this.defaultTheme;
    }

    return null;
  }

  deleteTheme(themeId: string): void {
    this._customThemes.delete(themeId);
  }

  // History management methods
  undoThemeChange(): void {
    this.undo();
  }

  redoThemeChange(): void {
    this.redo();
  }

  clearHistory(): void {
    this._themeHistory = [];
  }

  // Export/Import methods
  exportTheme(theme: UnifiedTheme): string {
    return JSON.stringify(theme, null, 2);
  }

  importTheme(themeData: string): any {
    try {
      return JSON.parse(themeData);
    } catch (error) {
      throw new Error('Invalid theme data format');
    }
  }

  // Performance methods
  getPerformanceMetrics(): PerformanceMetrics | null {
    return this._performanceMetrics;
  }

  clearPerformanceMetrics(): void {
    this._performanceMetrics = null;
  }

  // Cache methods
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.getSize(),
      hitRate: this.cache.getHitRate(),
    };
  }

  // Reset methods
  resetToDefault(): void {
    this._currentTheme = this.defaultTheme;
    this._errors = [];
  }

  resetToPreset(presetId: string): void {
    const preset = this._themePresets.get(presetId);
    if (preset) {
      this._currentTheme = this.convertPresetToTheme(preset);
      this._errors = [];
    }
  }

  // Helper method to convert preset to theme
  private convertPresetToTheme(preset: ThemePreset): UnifiedTheme {
    return {
      id: preset.id,
      name: preset.name,
      description: preset.description,
      category: preset.category,
      colors: preset.colors,
      typography: preset.typography,
      spacing: DEFAULT_SPACING,
      borderRadius: DEFAULT_BORDER_RADIUS,
      shadows: DEFAULT_SHADOWS,
      animations: DEFAULT_ANIMATIONS,
      transitions: DEFAULT_TRANSITIONS,
      effects: DEFAULT_EFFECTS,
      accessibility: DEFAULT_ACCESSIBILITY,
      branding: {
        logo: '',
        favicon: '',
        companyName: '',
        tagline: '',
        socialMedia: {},
        contactInfo: {},
      },
      customizations: {},
      metadata: {
        version: '1.0.0',
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'System',
        tags: [],
      },
    };
  }

  destroy(): void {
    this.cache.clear();
    this._currentTheme = null;
    this._themePresets.clear();
    this._customThemes.clear();
    this._themeHistory = [];
    this._validationResults = null;
    this._performanceMetrics = null;
    this._errors = [];
  }
}
