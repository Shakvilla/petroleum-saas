// Documentation: /docs/comprehensive-theming-system/optimized-css-variables.md

import type { UnifiedTheme, EnhancedCSSVariables } from '@/types/unified-theme';

// CSS variable optimization configuration
interface CSSVariableOptimizationConfig {
  enableBatching: boolean;
  enableCompression: boolean;
  enableMinification: boolean;
  enableCaching: boolean;
  batchDelay: number; // ms
  compressionThreshold: number; // bytes
  cacheSize: number;
  enablePerformanceMonitoring: boolean;
}

// Batched CSS variable update
interface BatchedCSSVariableUpdate {
  variables: Map<string, string>;
  timestamp: number;
  priority: 'low' | 'normal' | 'high';
}

// CSS variable cache entry
interface CSSVariableCacheEntry {
  variables: EnhancedCSSVariables;
  css: string;
  timestamp: number;
  size: number;
  compressed: boolean;
}

/**
 * Optimized CSS Variable Manager
 * 
 * Provides optimized CSS variable injection with:
 * - Batching for performance
 * - Compression and minification
 * - Caching for reuse
 * - Performance monitoring
 * - Smart update strategies
 */
export class OptimizedCSSVariableManager {
  private static instance: OptimizedCSSVariableManager;
  private config: CSSVariableOptimizationConfig;
  private batchedUpdates: Map<string, string> = new Map();
  private updateTimer: NodeJS.Timeout | null = null;
  private cache: Map<string, CSSVariableCacheEntry> = new Map();
  private performanceMetrics: {
    totalInjectionTime: number;
    injectionCount: number;
    averageInjectionTime: number;
    cacheHitRate: number;
    compressionRatio: number;
  };

  constructor(config: Partial<CSSVariableOptimizationConfig> = {}) {
    this.config = {
      enableBatching: true,
      enableCompression: true,
      enableMinification: true,
      enableCaching: true,
      batchDelay: 16, // 60fps
      compressionThreshold: 1024, // 1KB
      cacheSize: 50,
      enablePerformanceMonitoring: true,
      ...config,
    };

    this.performanceMetrics = {
      totalInjectionTime: 0,
      injectionCount: 0,
      averageInjectionTime: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
    };
  }

  static getInstance(config?: Partial<CSSVariableOptimizationConfig>): OptimizedCSSVariableManager {
    if (!OptimizedCSSVariableManager.instance) {
      OptimizedCSSVariableManager.instance = new OptimizedCSSVariableManager(config);
    }
    return OptimizedCSSVariableManager.instance;
  }

  /**
   * Inject CSS variables with optimization
   */
  async injectVariables(variables: EnhancedCSSVariables): Promise<void> {
    const startTime = performance.now();

    try {
      // Check cache first
      if (this.config.enableCaching) {
        const cached = this.getCachedVariables(variables);
        if (cached) {
          this.injectCachedVariables(cached);
          this.updatePerformanceMetrics(performance.now() - startTime, true);
          return;
        }
      }

      // Generate CSS content
      const cssContent = await this.generateOptimizedCSS(variables);

      // Inject CSS
      await this.injectCSS(cssContent);

      // Cache the result
      if (this.config.enableCaching) {
        this.cacheVariables(variables, cssContent);
      }

      this.updatePerformanceMetrics(performance.now() - startTime, false);
    } catch (error) {
      console.error('Failed to inject CSS variables:', error);
    }
  }

  /**
   * Batch CSS variable update
   */
  batchCSSVariableUpdate(variable: string, value: string): void {
    if (!this.config.enableBatching) {
      this.injectSingleVariable(variable, value);
      return;
    }

    this.batchedUpdates.set(variable, value);

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(() => {
      this.flushBatchedUpdates();
    }, this.config.batchDelay);
  }

  /**
   * Update CSS variables dynamically
   */
  async updateVariables(variables: Partial<EnhancedCSSVariables>): Promise<void> {
    const startTime = performance.now();

    try {
      if (this.config.enableBatching) {
        // Use batching for updates
        Object.entries(variables).forEach(([key, value]) => {
          if (typeof value === 'string') {
            this.batchCSSVariableUpdate(`--${key}`, value);
          } else if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              this.batchCSSVariableUpdate(`--${key}-${subKey}`, subValue);
            });
          }
        });
      } else {
        // Direct update
        await this.updateVariablesDirectly(variables);
      }

      this.updatePerformanceMetrics(performance.now() - startTime, false);
    } catch (error) {
      console.error('Failed to update CSS variables:', error);
    }
  }

  /**
   * Generate optimized CSS content
   */
  private async generateOptimizedCSS(variables: EnhancedCSSVariables): Promise<string> {
    let cssContent = this.generateCSSContent(variables);

    // Minify CSS if enabled
    if (this.config.enableMinification) {
      cssContent = this.minifyCSS(cssContent);
    }

    // Compress CSS if enabled and size exceeds threshold
    if (this.config.enableCompression && cssContent.length > this.config.compressionThreshold) {
      cssContent = await this.compressCSS(cssContent);
    }

    return cssContent;
  }

  /**
   * Generate CSS content from variables
   */
  private generateCSSContent(variables: EnhancedCSSVariables): string {
    const cssRules: string[] = [];

    // Generate :root rules
    cssRules.push(':root{');

    // Color variables
    Object.entries(variables.colors).forEach(([key, value]) => {
      cssRules.push(`--color-${key}:${value};`);
    });

    // Typography variables
    Object.entries(variables.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssRules.push(`--font-${key}:${value};`);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          cssRules.push(`--font-${key}-${subKey}:${subValue};`);
        });
      }
    });

    // Spacing variables
    Object.entries(variables.spacing).forEach(([key, value]) => {
      cssRules.push(`--spacing-${key}:${value};`);
    });

    // Border radius variables
    Object.entries(variables.borderRadius).forEach(([key, value]) => {
      cssRules.push(`--radius-${key}:${value};`);
    });

    // Shadow variables
    Object.entries(variables.shadows).forEach(([key, value]) => {
      cssRules.push(`--shadow-${key}:${value};`);
    });

    // Animation variables
    Object.entries(variables.animations).forEach(([key, value]) => {
      cssRules.push(`--animation-${key}:${value};`);
    });

    // Transition variables
    Object.entries(variables.transitions).forEach(([key, value]) => {
      cssRules.push(`--transition-${key}:${value};`);
    });

    // Effect variables
    Object.entries(variables.effects).forEach(([key, value]) => {
      cssRules.push(`--effect-${key}:${value};`);
    });

    cssRules.push('}');

    // Generate utility classes
    cssRules.push(this.generateUtilityClasses(variables));

    return cssRules.join('');
  }

  /**
   * Generate utility classes
   */
  private generateUtilityClasses(variables: EnhancedCSSVariables): string {
    const utilityClasses: string[] = [];

    // Color utility classes
    Object.keys(variables.colors).forEach(key => {
      utilityClasses.push(`.text-${key}{color:var(--color-${key})}`);
      utilityClasses.push(`.bg-${key}{background-color:var(--color-${key})}`);
      utilityClasses.push(`.border-${key}{border-color:var(--color-${key})}`);
    });

    // Typography utility classes
    Object.keys(variables.typography.fontSize).forEach(key => {
      utilityClasses.push(`.text-${key}{font-size:var(--font-fontSize-${key})}`);
    });

    // Spacing utility classes
    Object.keys(variables.spacing).forEach(key => {
      utilityClasses.push(`.p-${key}{padding:var(--spacing-${key})}`);
      utilityClasses.push(`.m-${key}{margin:var(--spacing-${key})}`);
      utilityClasses.push(`.px-${key}{padding-left:var(--spacing-${key});padding-right:var(--spacing-${key})}`);
      utilityClasses.push(`.py-${key}{padding-top:var(--spacing-${key});padding-bottom:var(--spacing-${key})}`);
      utilityClasses.push(`.mx-${key}{margin-left:var(--spacing-${key});margin-right:var(--spacing-${key})}`);
      utilityClasses.push(`.my-${key}{margin-top:var(--spacing-${key});margin-bottom:var(--spacing-${key})}`);
    });

    // Border radius utility classes
    Object.keys(variables.borderRadius).forEach(key => {
      utilityClasses.push(`.rounded-${key}{border-radius:var(--radius-${key})}`);
    });

    // Shadow utility classes
    Object.keys(variables.shadows).forEach(key => {
      utilityClasses.push(`.shadow-${key}{box-shadow:var(--shadow-${key})}`);
    });

    return utilityClasses.join('');
  }

  /**
   * Minify CSS content
   */
  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove semicolon before closing brace
      .replace(/{\s*/g, '{') // Remove spaces after opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolon
      .replace(/:\s*/g, ':') // Remove spaces after colon
      .replace(/,\s*/g, ',') // Remove spaces after comma
      .trim();
  }

  /**
   * Compress CSS content
   */
  private async compressCSS(css: string): Promise<string> {
    // In a real implementation, you would use a compression library
    // For now, we'll just return the minified CSS
    return this.minifyCSS(css);
  }

  /**
   * Inject CSS into document
   */
  private async injectCSS(cssContent: string): Promise<void> {
    if (typeof window === 'undefined') return;

    // Remove existing style element
    const existingElement = document.getElementById('optimized-theme-variables');
    if (existingElement) {
      document.head.removeChild(existingElement);
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'optimized-theme-variables';
    styleElement.textContent = cssContent;

    // Inject into document head
    document.head.appendChild(styleElement);
  }

  /**
   * Inject single CSS variable
   */
  private injectSingleVariable(variable: string, value: string): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    root.style.setProperty(variable, value);
  }

  /**
   * Flush batched updates
   */
  private flushBatchedUpdates(): void {
    if (this.batchedUpdates.size === 0) return;

    const root = document.documentElement;
    
    this.batchedUpdates.forEach((value, variable) => {
      root.style.setProperty(variable, value);
    });

    this.batchedUpdates.clear();
    this.updateTimer = null;
  }

  /**
   * Update variables directly
   */
  private async updateVariablesDirectly(variables: Partial<EnhancedCSSVariables>): Promise<void> {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Color variables
    if (variables.colors) {
      Object.entries(variables.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }

    // Typography variables
    if (variables.typography) {
      Object.entries(variables.typography).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--font-${key}`, value);
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--font-${key}-${subKey}`, subValue);
          });
        }
      });
    }

    // Spacing variables
    if (variables.spacing) {
      Object.entries(variables.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
      });
    }

    // Border radius variables
    if (variables.borderRadius) {
      Object.entries(variables.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
      });
    }

    // Shadow variables
    if (variables.shadows) {
      Object.entries(variables.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }

    // Animation variables
    if (variables.animations) {
      Object.entries(variables.animations).forEach(([key, value]) => {
        root.style.setProperty(`--animation-${key}`, value);
      });
    }

    // Transition variables
    if (variables.transitions) {
      Object.entries(variables.transitions).forEach(([key, value]) => {
        root.style.setProperty(`--transition-${key}`, value);
      });
    }

    // Effect variables
    if (variables.effects) {
      Object.entries(variables.effects).forEach(([key, value]) => {
        root.style.setProperty(`--effect-${key}`, value);
      });
    }
  }

  /**
   * Get cached variables
   */
  private getCachedVariables(variables: EnhancedCSSVariables): string | null {
    const key = this.generateCacheKey(variables);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes TTL
      return cached.css;
    }
    
    return null;
  }

  /**
   * Cache variables
   */
  private cacheVariables(variables: EnhancedCSSVariables, css: string): void {
    const key = this.generateCacheKey(variables);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.cacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      variables,
      css,
      timestamp: Date.now(),
      size: css.length,
      compressed: this.config.enableCompression,
    });
  }

  /**
   * Inject cached variables
   */
  private injectCachedVariables(css: string): void {
    if (typeof window === 'undefined') return;

    // Remove existing style element
    const existingElement = document.getElementById('optimized-theme-variables');
    if (existingElement) {
      document.head.removeChild(existingElement);
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'optimized-theme-variables';
    styleElement.textContent = css;

    // Inject into document head
    document.head.appendChild(styleElement);
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(variables: EnhancedCSSVariables): string {
    // Generate a hash of the variables for caching
    const str = JSON.stringify(variables);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `css-${hash}`;
  }

  /**
   * Update performance metrics
   */
  private updatePerformanceMetrics(duration: number, cacheHit: boolean): void {
    if (!this.config.enablePerformanceMonitoring) return;

    this.performanceMetrics.totalInjectionTime += duration;
    this.performanceMetrics.injectionCount++;
    this.performanceMetrics.averageInjectionTime = 
      this.performanceMetrics.totalInjectionTime / this.performanceMetrics.injectionCount;

    if (cacheHit) {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.injectionCount - 1) + 100) / 
        this.performanceMetrics.injectionCount;
    } else {
      this.performanceMetrics.cacheHitRate = 
        (this.performanceMetrics.cacheHitRate * (this.performanceMetrics.injectionCount - 1)) / 
        this.performanceMetrics.injectionCount;
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear batched updates
   */
  clearBatchedUpdates(): void {
    this.batchedUpdates.clear();
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: this.performanceMetrics.cacheHitRate,
    };
  }

  /**
   * Destroy CSS variable manager
   */
  destroy(): void {
    // Cleanup resources
    this.batchedUpdates.clear();
    this.cache.clear();
    this.compressionCache.clear();
    this.minificationCache.clear();
  }
}

// Export singleton instance
export const optimizedCSSVariableManager = new OptimizedCSSVariableManager();
