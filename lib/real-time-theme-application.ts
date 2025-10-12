// Documentation: /docs/comprehensive-theming-system/real-time-theme-application.md

import type { UnifiedTheme, ThemeApplicationResult } from '@/types/unified-theme';
import { EnhancedCSSVariableManager } from './enhanced-css-variables';

/**
 * Real-time Theme Application System
 * 
 * Handles real-time theme updates with performance optimization,
 * debouncing, and visual feedback.
 */
export class RealTimeThemeApplication {
  private cssVariableManager: EnhancedCSSVariableManager;
  private debounceTimer: NodeJS.Timeout | null = null;
  private isApplying: boolean = false;
  private pendingTheme: UnifiedTheme | null = null;
  private applicationHistory: ThemeApplicationResult[] = [];
  private maxHistorySize: number = 20;

  constructor() {
    this.cssVariableManager = new EnhancedCSSVariableManager();
  }

  /**
   * Apply theme with real-time updates
   */
  async applyThemeRealTime(theme: UnifiedTheme): Promise<ThemeApplicationResult> {
    const startTime = performance.now();

    try {
      // Store pending theme
      this.pendingTheme = theme;

      // Debounce theme application for performance
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      return new Promise((resolve) => {
        this.debounceTimer = setTimeout(async () => {
          try {
            this.isApplying = true;

            // Apply theme immediately
            const result = await this.applyThemeImmediately(theme);

            // Add to history
            this.addToHistory(result);

            // Clear pending theme
            this.pendingTheme = null;

            resolve(result);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const result: ThemeApplicationResult = {
              success: false,
              theme,
              appliedAt: new Date(),
              duration: performance.now() - startTime,
              errors: [errorMessage],
              warnings: [],
            };

            resolve(result);
          } finally {
            this.isApplying = false;
          }
        }, 100); // 100ms debounce delay
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        theme,
        appliedAt: new Date(),
        duration: performance.now() - startTime,
        errors: [errorMessage],
        warnings: [],
      };
    }
  }

  /**
   * Apply theme immediately without debouncing
   */
  private async applyThemeImmediately(theme: UnifiedTheme): Promise<ThemeApplicationResult> {
    const startTime = performance.now();

    try {
      // Apply theme to document
      await this.applyToDocument(theme);

      // Apply theme to components
      await this.applyToComponents(theme);

      // Apply theme to layout
      await this.applyToLayout(theme);

      // Apply theme to CSS variables
      await this.applyToCSSVariables(theme);

      return {
        success: true,
        theme,
        appliedAt: new Date(),
        duration: performance.now() - startTime,
        errors: [],
        warnings: [],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        theme,
        appliedAt: new Date(),
        duration: performance.now() - startTime,
        errors: [errorMessage],
        warnings: [],
      };
    }
  }

  /**
   * Apply theme to document
   */
  private async applyToDocument(theme: UnifiedTheme): Promise<void> {
    if (typeof window === 'undefined') return;

    // Update document root classes
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-custom');
    
    // Add new theme class
    root.classList.add(`theme-${theme.metadata.category}`);

    // Update document meta tags
    this.updateDocumentMeta(theme);

    // Update document title
    if (theme.branding.appName) {
      document.title = `${theme.branding.appName} - Petroleum Management System`;
    }
  }

  /**
   * Apply theme to components
   */
  private async applyToComponents(theme: UnifiedTheme): Promise<void> {
    if (typeof window === 'undefined') return;

    // Dispatch custom event for components to listen to
    const themeChangeEvent = new CustomEvent('theme-change', {
      detail: {
        theme,
        timestamp: Date.now(),
      },
    });

    window.dispatchEvent(themeChangeEvent);

    // Update CSS custom properties for components
    const root = document.documentElement;
    
    // Color properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--component-color-${key}`, value);
    });

    // Typography properties
    root.style.setProperty('--component-font-family', theme.typography.fontFamily);
    root.style.setProperty('--component-font-heading', theme.typography.headingFont);

    // Spacing properties
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--component-spacing-${key}`, value);
    });

    // Border radius properties
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--component-radius-${key}`, value);
    });

    // Shadow properties
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--component-shadow-${key}`, value);
    });
  }

  /**
   * Apply theme to layout
   */
  private async applyToLayout(theme: UnifiedTheme): Promise<void> {
    if (typeof window === 'undefined') return;

    // Update layout-specific CSS variables
    const root = document.documentElement;
    
    // Layout spacing
    root.style.setProperty('--layout-spacing', theme.spacing.md);
    root.style.setProperty('--layout-padding', theme.spacing.lg);
    root.style.setProperty('--layout-margin', theme.spacing.sm);

    // Layout colors
    root.style.setProperty('--layout-background', theme.colors.background);
    root.style.setProperty('--layout-surface', theme.colors.surface);
    root.style.setProperty('--layout-border', theme.colors.border);

    // Layout typography
    root.style.setProperty('--layout-font-family', theme.typography.fontFamily);
    root.style.setProperty('--layout-font-size', theme.typography.fontSizes.base);

    // Layout shadows
    root.style.setProperty('--layout-shadow', theme.shadows.md);
  }

  /**
   * Apply theme to CSS variables
   */
  private async applyToCSSVariables(theme: UnifiedTheme): Promise<void> {
    // Generate CSS variables from theme
    const cssVariables = this.cssVariableManager.generateVariables(theme);
    
    // Inject variables
    this.cssVariableManager.injectVariables(cssVariables);
  }

  /**
   * Update document meta tags
   */
  private updateDocumentMeta(theme: UnifiedTheme): void {
    if (typeof window === 'undefined') return;

    // Update theme-color meta tag
    let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = theme.colors.primary;

    // Update description meta tag
    let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = theme.description || `${theme.name} theme for Petroleum Management System`;

    // Update keywords meta tag
    let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.content = theme.metadata.tags.join(', ');
  }

  /**
   * Add application result to history
   */
  private addToHistory(result: ThemeApplicationResult): void {
    this.applicationHistory.push(result);
    
    // Limit history size
    if (this.applicationHistory.length > this.maxHistorySize) {
      this.applicationHistory.shift();
    }
  }

  /**
   * Get application history
   */
  getApplicationHistory(): ThemeApplicationResult[] {
    return [...this.applicationHistory];
  }

  /**
   * Clear application history
   */
  clearApplicationHistory(): void {
    this.applicationHistory = [];
  }

  /**
   * Get current application status
   */
  getApplicationStatus(): {
    isApplying: boolean;
    pendingTheme: UnifiedTheme | null;
    lastApplied: Date | null;
  } {
    return {
      isApplying: this.isApplying,
      pendingTheme: this.pendingTheme,
      lastApplied: this.applicationHistory.length > 0 
        ? this.applicationHistory[this.applicationHistory.length - 1].appliedAt 
        : null,
    };
  }

  /**
   * Cancel pending theme application
   */
  cancelPendingApplication(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    this.pendingTheme = null;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): {
    averageApplicationTime: number;
    totalApplications: number;
    successRate: number;
    lastApplicationTime: number;
  } {
    if (this.applicationHistory.length === 0) {
      return {
        averageApplicationTime: 0,
        totalApplications: 0,
        successRate: 0,
        lastApplicationTime: 0,
      };
    }

    const totalTime = this.applicationHistory.reduce((sum, result) => sum + result.duration, 0);
    const successfulApplications = this.applicationHistory.filter(result => result.success).length;
    const lastApplication = this.applicationHistory[this.applicationHistory.length - 1];

    return {
      averageApplicationTime: totalTime / this.applicationHistory.length,
      totalApplications: this.applicationHistory.length,
      successRate: (successfulApplications / this.applicationHistory.length) * 100,
      lastApplicationTime: lastApplication.duration,
    };
  }

  /**
   * Optimize theme application for performance
   */
  optimizeApplication(): void {
    // Clear CSS variable manager cache
    this.cssVariableManager.clearInjectedVariables();
    
    // Clear application history
    this.clearApplicationHistory();
    
    // Cancel any pending applications
    this.cancelPendingApplication();
  }

  /**
   * Enable real-time preview mode
   */
  enableRealTimePreview(): void {
    // Add preview class to document
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('theme-preview-mode');
    }
  }

  /**
   * Disable real-time preview mode
   */
  disableRealTimePreview(): void {
    // Remove preview class from document
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('theme-preview-mode');
    }
  }
}

// Export singleton instance
export const realTimeThemeApplication = new RealTimeThemeApplication();
