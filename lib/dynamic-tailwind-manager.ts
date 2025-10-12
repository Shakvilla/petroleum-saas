// Documentation: /docs/comprehensive-theming-system/dynamic-tailwind-manager.md

import type { UnifiedTheme } from '@/types/unified-theme';

// Dynamic Tailwind configuration
interface DynamicTailwindConfig {
  enableDynamicClasses: boolean;
  enableCustomUtilities: boolean;
  enableThemeExtensions: boolean;
  enablePerformanceOptimization: boolean;
  cacheSize: number;
  enableCompression: boolean;
  enableMinification: boolean;
  updateDelay: number; // ms
}

// Generated Tailwind classes
interface GeneratedTailwindClasses {
  colors: string[];
  typography: string[];
  spacing: string[];
  borderRadius: string[];
  shadows: string[];
  animations: string[];
  transitions: string[];
  effects: string[];
  utilities: string[];
}

// Tailwind class cache entry
interface TailwindClassCacheEntry {
  classes: GeneratedTailwindClasses;
  css: string;
  timestamp: number;
  size: number;
  compressed: boolean;
}

/**
 * Dynamic Tailwind Manager
 * 
 * Manages dynamic Tailwind CSS class generation and injection with:
 * - Dynamic class generation from themes
 * - Custom utility classes
 * - Theme extensions
 * - Performance optimization
 * - Caching and compression
 * - Real-time updates
 */
export class DynamicTailwindManager {
  private static instance: DynamicTailwindManager;
  private config: DynamicTailwindConfig;
  private generatedClasses: Map<string, GeneratedTailwindClasses> = new Map();
  private classCache: Map<string, TailwindClassCacheEntry> = new Map();
  private updateTimer: NodeJS.Timeout | null = null;
  private pendingUpdates: Set<string> = new Set();

  constructor(config: Partial<DynamicTailwindConfig> = {}) {
    this.config = {
      enableDynamicClasses: true,
      enableCustomUtilities: true,
      enableThemeExtensions: true,
      enablePerformanceOptimization: true,
      cacheSize: 100,
      enableCompression: true,
      enableMinification: true,
      updateDelay: 16, // 60fps
      ...config,
    };
  }

  static getInstance(config?: Partial<DynamicTailwindConfig>): DynamicTailwindManager {
    if (!DynamicTailwindManager.instance) {
      DynamicTailwindManager.instance = new DynamicTailwindManager(config);
    }
    return DynamicTailwindManager.instance;
  }

  /**
   * Generate custom Tailwind classes from theme
   */
  generateCustomClasses(theme: UnifiedTheme): GeneratedTailwindClasses {
    const themeId = theme.id;
    
    // Check cache first
    if (this.generatedClasses.has(themeId)) {
      return this.generatedClasses.get(themeId)!;
    }

    const classes: GeneratedTailwindClasses = {
      colors: this.generateColorClasses(theme),
      typography: this.generateTypographyClasses(theme),
      spacing: this.generateSpacingClasses(theme),
      borderRadius: this.generateBorderRadiusClasses(theme),
      shadows: this.generateShadowClasses(theme),
      animations: this.generateAnimationClasses(theme),
      transitions: this.generateTransitionClasses(theme),
      effects: this.generateEffectClasses(theme),
      utilities: this.generateUtilityClasses(theme),
    };

    // Cache the generated classes
    this.generatedClasses.set(themeId, classes);

    // Limit cache size
    if (this.generatedClasses.size > this.config.cacheSize) {
      const oldestKey = this.generatedClasses.keys().next().value;
      this.generatedClasses.delete(oldestKey);
    }

    return classes;
  }

  /**
   * Generate CSS from Tailwind classes
   */
  generateCSS(classes: GeneratedTailwindClasses): string {
    const cssRules: string[] = [];

    // Color classes
    classes.colors.forEach(rule => {
      cssRules.push(rule);
    });

    // Typography classes
    classes.typography.forEach(rule => {
      cssRules.push(rule);
    });

    // Spacing classes
    classes.spacing.forEach(rule => {
      cssRules.push(rule);
    });

    // Border radius classes
    classes.borderRadius.forEach(rule => {
      cssRules.push(rule);
    });

    // Shadow classes
    classes.shadows.forEach(rule => {
      cssRules.push(rule);
    });

    // Animation classes
    classes.animations.forEach(rule => {
      cssRules.push(rule);
    });

    // Transition classes
    classes.transitions.forEach(rule => {
      cssRules.push(rule);
    });

    // Effect classes
    classes.effects.forEach(rule => {
      cssRules.push(rule);
    });

    // Utility classes
    classes.utilities.forEach(rule => {
      cssRules.push(rule);
    });

    let css = cssRules.join('\n');

    // Minify CSS if enabled
    if (this.config.enableMinification) {
      css = this.minifyCSS(css);
    }

    // Compress CSS if enabled
    if (this.config.enableCompression) {
      css = this.compressCSS(css);
    }

    return css;
  }

  /**
   * Inject Tailwind classes into document
   */
  async injectTailwindClasses(theme: UnifiedTheme): Promise<void> {
    try {
      // Generate classes
      const classes = this.generateCustomClasses(theme);
      
      // Generate CSS
      const css = this.generateCSS(classes);
      
      // Inject CSS
      await this.injectCSS(css);
      
      console.log('Tailwind classes injected for theme:', theme.name);
    } catch (error) {
      console.error('Failed to inject Tailwind classes:', error);
    }
  }

  /**
   * Update Tailwind classes dynamically
   */
  updateTailwindClasses(themeId: string): void {
    if (!this.config.enableDynamicClasses) return;

    this.pendingUpdates.add(themeId);

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(() => {
      this.flushPendingUpdates();
    }, this.config.updateDelay);
  }

  /**
   * Generate color classes
   */
  private generateColorClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.colors).forEach(([key, value]) => {
      classes.push(`.text-${key}{color:${value}}`);
      classes.push(`.bg-${key}{background-color:${value}}`);
      classes.push(`.border-${key}{border-color:${value}}`);
      classes.push(`.ring-${key}{--tw-ring-color:${value}}`);
      classes.push(`.divide-${key}>:not([hidden])~:not([hidden]){border-color:${value}}`);
      classes.push(`.placeholder-${key}::placeholder{color:${value}}`);
      classes.push(`.caret-${key}{caret-color:${value}}`);
      classes.push(`.accent-${key}{accent-color:${value}}`);
      classes.push(`.outline-${key}{outline-color:${value}}`);
      classes.push(`.decoration-${key}{text-decoration-color:${value}}`);
    });

    return classes;
  }

  /**
   * Generate typography classes
   */
  private generateTypographyClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    // Font family classes
    classes.push(`.font-primary{font-family:${theme.typography.fontFamily}}`);
    classes.push(`.font-heading{font-family:${theme.typography.headingFont || theme.typography.fontFamily}}`);

    // Font size classes
    Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
      classes.push(`.text-${key}{font-size:${value}}`);
    });

    // Font weight classes
    const fontWeights = {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    };

    Object.entries(fontWeights).forEach(([key, value]) => {
      classes.push(`.font-${key}{font-weight:${value}}`);
    });

    // Line height classes
    const lineHeights = {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    };

    Object.entries(lineHeights).forEach(([key, value]) => {
      classes.push(`.leading-${key}{line-height:${value}}`);
    });

    return classes;
  }

  /**
   * Generate spacing classes
   */
  private generateSpacingClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.spacing).forEach(([key, value]) => {
      // Padding classes
      classes.push(`.p-${key}{padding:${value}}`);
      classes.push(`.px-${key}{padding-left:${value};padding-right:${value}}`);
      classes.push(`.py-${key}{padding-top:${value};padding-bottom:${value}}`);
      classes.push(`.pt-${key}{padding-top:${value}}`);
      classes.push(`.pr-${key}{padding-right:${value}}`);
      classes.push(`.pb-${key}{padding-bottom:${value}}`);
      classes.push(`.pl-${key}{padding-left:${value}}`);

      // Margin classes
      classes.push(`.m-${key}{margin:${value}}`);
      classes.push(`.mx-${key}{margin-left:${value};margin-right:${value}}`);
      classes.push(`.my-${key}{margin-top:${value};margin-bottom:${value}}`);
      classes.push(`.mt-${key}{margin-top:${value}}`);
      classes.push(`.mr-${key}{margin-right:${value}}`);
      classes.push(`.mb-${key}{margin-bottom:${value}}`);
      classes.push(`.ml-${key}{margin-left:${value}}`);

      // Gap classes
      classes.push(`.gap-${key}{gap:${value}}`);
      classes.push(`.gap-x-${key}{column-gap:${value}}`);
      classes.push(`.gap-y-${key}{row-gap:${value}}`);
    });

    return classes;
  }

  /**
   * Generate border radius classes
   */
  private generateBorderRadiusClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      classes.push(`.rounded-${key}{border-radius:${value}}`);
      classes.push(`.rounded-t-${key}{border-top-left-radius:${value};border-top-right-radius:${value}}`);
      classes.push(`.rounded-r-${key}{border-top-right-radius:${value};border-bottom-right-radius:${value}}`);
      classes.push(`.rounded-b-${key}{border-bottom-right-radius:${value};border-bottom-left-radius:${value}}`);
      classes.push(`.rounded-l-${key}{border-top-left-radius:${value};border-bottom-left-radius:${value}}`);
      classes.push(`.rounded-tl-${key}{border-top-left-radius:${value}}`);
      classes.push(`.rounded-tr-${key}{border-top-right-radius:${value}}`);
      classes.push(`.rounded-br-${key}{border-bottom-right-radius:${value}}`);
      classes.push(`.rounded-bl-${key}{border-bottom-left-radius:${value}}`);
    });

    return classes;
  }

  /**
   * Generate shadow classes
   */
  private generateShadowClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.shadows).forEach(([key, value]) => {
      classes.push(`.shadow-${key}{box-shadow:${value}}`);
    });

    return classes;
  }

  /**
   * Generate animation classes
   */
  private generateAnimationClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      classes.push(`.duration-${key}{transition-duration:${value}}`);
    });

    Object.entries(theme.animations.easing).forEach(([key, value]) => {
      classes.push(`.ease-${key}{transition-timing-function:${value}}`);
    });

    Object.entries(theme.animations.keyframes).forEach(([key, value]) => {
      classes.push(`.animate-${key}{animation:${value}}`);
    });

    return classes;
  }

  /**
   * Generate transition classes
   */
  private generateTransitionClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.transitions.duration).forEach(([key, value]) => {
      classes.push(`.transition-${key}{transition-duration:${value}}`);
    });

    Object.entries(theme.transitions.easing).forEach(([key, value]) => {
      classes.push(`.ease-${key}{transition-timing-function:${value}}`);
    });

    theme.transitions.properties.forEach(property => {
      classes.push(`.transition-${property}{transition-property:${property}}`);
    });

    return classes;
  }

  /**
   * Generate effect classes
   */
  private generateEffectClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    Object.entries(theme.effects.blur).forEach(([key, value]) => {
      classes.push(`.blur-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.brightness).forEach(([key, value]) => {
      classes.push(`.brightness-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.contrast).forEach(([key, value]) => {
      classes.push(`.contrast-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.grayscale).forEach(([key, value]) => {
      classes.push(`.grayscale-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.hueRotate).forEach(([key, value]) => {
      classes.push(`.hue-rotate-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.invert).forEach(([key, value]) => {
      classes.push(`.invert-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.opacity).forEach(([key, value]) => {
      classes.push(`.opacity-${key}{opacity:${value}}`);
    });

    Object.entries(theme.effects.saturate).forEach(([key, value]) => {
      classes.push(`.saturate-${key}{filter:${value}}`);
    });

    Object.entries(theme.effects.sepia).forEach(([key, value]) => {
      classes.push(`.sepia-${key}{filter:${value}}`);
    });

    return classes;
  }

  /**
   * Generate utility classes
   */
  private generateUtilityClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    // Custom utility classes based on theme
    classes.push('.theme-primary{color:var(--color-primary)}');
    classes.push('.theme-secondary{color:var(--color-secondary)}');
    classes.push('.theme-accent{color:var(--color-accent)}');
    classes.push('.theme-background{background-color:var(--color-background)}');
    classes.push('.theme-surface{background-color:var(--color-surface)}');
    classes.push('.theme-text{color:var(--color-text)}');
    classes.push('.theme-border{border-color:var(--color-border)}');

    // Typography utilities
    classes.push('.theme-font{font-family:var(--font-family)}');
    classes.push('.theme-heading{font-family:var(--font-heading)}');

    // Spacing utilities
    classes.push('.theme-spacing{padding:var(--spacing-md)}');
    classes.push('.theme-spacing-sm{padding:var(--spacing-sm)}');
    classes.push('.theme-spacing-lg{padding:var(--spacing-lg)}');

    // Border radius utilities
    classes.push('.theme-radius{border-radius:var(--radius-md)}');
    classes.push('.theme-radius-sm{border-radius:var(--radius-sm)}');
    classes.push('.theme-radius-lg{border-radius:var(--radius-lg)}');

    // Shadow utilities
    classes.push('.theme-shadow{box-shadow:var(--shadow-md)}');
    classes.push('.theme-shadow-sm{box-shadow:var(--shadow-sm)}');
    classes.push('.theme-shadow-lg{box-shadow:var(--shadow-lg)}');

    return classes;
  }

  /**
   * Inject CSS into document
   */
  private async injectCSS(css: string): Promise<void> {
    if (typeof window === 'undefined') return;

    // Remove existing dynamic Tailwind style element
    const existingElement = document.getElementById('dynamic-tailwind-classes');
    if (existingElement) {
      document.head.removeChild(existingElement);
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-tailwind-classes';
    styleElement.textContent = css;

    // Inject into document head
    document.head.appendChild(styleElement);
  }

  /**
   * Flush pending updates
   */
  private flushPendingUpdates(): void {
    this.pendingUpdates.forEach(themeId => {
      // This would trigger theme updates
      console.log('Updating Tailwind classes for theme:', themeId);
    });

    this.pendingUpdates.clear();
    this.updateTimer = null;
  }

  /**
   * Minify CSS
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
   * Compress CSS
   */
  private compressCSS(css: string): string {
    // In a real implementation, you would use a compression library
    // For now, we'll just return the minified CSS
    return this.minifyCSS(css);
  }

  /**
   * Get generated classes for theme
   */
  getGeneratedClasses(themeId: string): GeneratedTailwindClasses | null {
    return this.generatedClasses.get(themeId) || null;
  }

  /**
   * Clear generated classes
   */
  clearGeneratedClasses(): void {
    this.generatedClasses.clear();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.classCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; classCount: number } {
    return {
      size: this.classCache.size,
      classCount: this.generatedClasses.size,
    };
  }

  /**
   * Destroy manager
   */
  destroy(): void {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }

    this.clearGeneratedClasses();
    this.clearCache();
  }
}

// Export singleton instance
export const dynamicTailwindManager = new DynamicTailwindManager();
