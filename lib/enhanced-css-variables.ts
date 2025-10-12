// Documentation: /docs/comprehensive-theming-system/enhanced-css-variables.md

import type { UnifiedTheme, EnhancedCSSVariables } from '@/types/unified-theme';

/**
 * Enhanced CSS Variable Manager
 * 
 * Manages CSS variable generation, injection, and optimization
 * for the unified theming system.
 */
export class EnhancedCSSVariableManager {
  private injectedVariables: Map<string, string> = new Map();
  private styleElement: HTMLStyleElement | null = null;
  private isOptimized: boolean = false;

  /**
   * Generate CSS variables from theme
   */
  generateVariables(theme: UnifiedTheme): EnhancedCSSVariables {
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
  injectVariables(variables: EnhancedCSSVariables): void {
    if (typeof window === 'undefined') return;

    // Remove existing style element
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
    }

    // Create new style element
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'enhanced-theme-variables';

    const cssContent = this.generateCSSContent(variables);
    this.styleElement.textContent = cssContent;

    // Inject into document
    document.head.appendChild(this.styleElement);

    // Store injected variables
    this.storeInjectedVariables(variables);
  }

  /**
   * Update CSS variables dynamically
   */
  updateVariables(variables: Partial<EnhancedCSSVariables>): void {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;

    // Update color variables
    if (variables.colors) {
      Object.entries(variables.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
        this.injectedVariables.set(`--color-${key}`, value);
      });
    }

    // Update typography variables
    if (variables.typography) {
      Object.entries(variables.typography).forEach(([key, value]) => {
        if (typeof value === 'string') {
          root.style.setProperty(`--font-${key}`, value);
          this.injectedVariables.set(`--font-${key}`, value);
        } else {
          Object.entries(value).forEach(([subKey, subValue]) => {
            root.style.setProperty(`--font-${key}-${subKey}`, subValue);
            this.injectedVariables.set(`--font-${key}-${subKey}`, subValue);
          });
        }
      });
    }

    // Update spacing variables
    if (variables.spacing) {
      Object.entries(variables.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value);
        this.injectedVariables.set(`--spacing-${key}`, value);
      });
    }

    // Update border radius variables
    if (variables.borderRadius) {
      Object.entries(variables.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value);
        this.injectedVariables.set(`--radius-${key}`, value);
      });
    }

    // Update shadow variables
    if (variables.shadows) {
      Object.entries(variables.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
        this.injectedVariables.set(`--shadow-${key}`, value);
      });
    }

    // Update animation variables
    if (variables.animations) {
      Object.entries(variables.animations).forEach(([key, value]) => {
        root.style.setProperty(`--animation-${key}`, value);
        this.injectedVariables.set(`--animation-${key}`, value);
      });
    }

    // Update transition variables
    if (variables.transitions) {
      Object.entries(variables.transitions).forEach(([key, value]) => {
        root.style.setProperty(`--transition-${key}`, value);
        this.injectedVariables.set(`--transition-${key}`, value);
      });
    }

    // Update effect variables
    if (variables.effects) {
      Object.entries(variables.effects).forEach(([key, value]) => {
        root.style.setProperty(`--effect-${key}`, value);
        this.injectedVariables.set(`--effect-${key}`, value);
      });
    }
  }

  /**
   * Optimize CSS variables for performance
   */
  optimizeVariables(variables: EnhancedCSSVariables): EnhancedCSSVariables {
    if (this.isOptimized) {
      return variables;
    }

    // Optimize color values
    const optimizedColors = this.optimizeColors(variables.colors);
    
    // Optimize typography values
    const optimizedTypography = this.optimizeTypography(variables.typography);
    
    // Optimize spacing values
    const optimizedSpacing = this.optimizeSpacing(variables.spacing);
    
    // Optimize border radius values
    const optimizedBorderRadius = this.optimizeBorderRadius(variables.borderRadius);
    
    // Optimize shadow values
    const optimizedShadows = this.optimizeShadows(variables.shadows);

    this.isOptimized = true;

    return {
      colors: optimizedColors,
      typography: optimizedTypography,
      spacing: optimizedSpacing,
      borderRadius: optimizedBorderRadius,
      shadows: optimizedShadows,
      animations: variables.animations,
      transitions: variables.transitions,
      effects: variables.effects,
    };
  }

  /**
   * Get injected variables
   */
  getInjectedVariables(): Map<string, string> {
    return new Map(this.injectedVariables);
  }

  /**
   * Clear injected variables
   */
  clearInjectedVariables(): void {
    this.injectedVariables.clear();
    
    if (this.styleElement) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }
  }

  /**
   * Check if variables are injected
   */
  hasInjectedVariables(): boolean {
    return this.injectedVariables.size > 0;
  }

  /**
   * Get variable value
   */
  getVariableValue(variableName: string): string | null {
    return this.injectedVariables.get(variableName) || null;
  }

  /**
   * Generate CSS content from variables
   */
  private generateCSSContent(variables: EnhancedCSSVariables): string {
    const cssRules: string[] = [];

    // Generate :root rules
    cssRules.push(':root {');

    // Color variables
    Object.entries(variables.colors).forEach(([key, value]) => {
      cssRules.push(`  --color-${key}: ${value};`);
    });

    // Typography variables
    Object.entries(variables.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        cssRules.push(`  --font-${key}: ${value};`);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          cssRules.push(`  --font-${key}-${subKey}: ${subValue};`);
        });
      }
    });

    // Spacing variables
    Object.entries(variables.spacing).forEach(([key, value]) => {
      cssRules.push(`  --spacing-${key}: ${value};`);
    });

    // Border radius variables
    Object.entries(variables.borderRadius).forEach(([key, value]) => {
      cssRules.push(`  --radius-${key}: ${value};`);
    });

    // Shadow variables
    Object.entries(variables.shadows).forEach(([key, value]) => {
      cssRules.push(`  --shadow-${key}: ${value};`);
    });

    // Animation variables
    Object.entries(variables.animations).forEach(([key, value]) => {
      cssRules.push(`  --animation-${key}: ${value};`);
    });

    // Transition variables
    Object.entries(variables.transitions).forEach(([key, value]) => {
      cssRules.push(`  --transition-${key}: ${value};`);
    });

    // Effect variables
    Object.entries(variables.effects).forEach(([key, value]) => {
      cssRules.push(`  --effect-${key}: ${value};`);
    });

    cssRules.push('}');

    // Generate utility classes
    cssRules.push(this.generateUtilityClasses(variables));

    return cssRules.join('\n');
  }

  /**
   * Generate utility classes
   */
  private generateUtilityClasses(variables: EnhancedCSSVariables): string {
    const utilityClasses: string[] = [];

    // Color utility classes
    Object.keys(variables.colors).forEach(key => {
      utilityClasses.push(`.text-${key} { color: var(--color-${key}); }`);
      utilityClasses.push(`.bg-${key} { background-color: var(--color-${key}); }`);
      utilityClasses.push(`.border-${key} { border-color: var(--color-${key}); }`);
    });

    // Typography utility classes
    Object.keys(variables.typography.fontSize).forEach(key => {
      utilityClasses.push(`.text-${key} { font-size: var(--font-fontSize-${key}); }`);
    });

    // Spacing utility classes
    Object.keys(variables.spacing).forEach(key => {
      utilityClasses.push(`.p-${key} { padding: var(--spacing-${key}); }`);
      utilityClasses.push(`.m-${key} { margin: var(--spacing-${key}); }`);
      utilityClasses.push(`.px-${key} { padding-left: var(--spacing-${key}); padding-right: var(--spacing-${key}); }`);
      utilityClasses.push(`.py-${key} { padding-top: var(--spacing-${key}); padding-bottom: var(--spacing-${key}); }`);
      utilityClasses.push(`.mx-${key} { margin-left: var(--spacing-${key}); margin-right: var(--spacing-${key}); }`);
      utilityClasses.push(`.my-${key} { margin-top: var(--spacing-${key}); margin-bottom: var(--spacing-${key}); }`);
    });

    // Border radius utility classes
    Object.keys(variables.borderRadius).forEach(key => {
      utilityClasses.push(`.rounded-${key} { border-radius: var(--radius-${key}); }`);
    });

    // Shadow utility classes
    Object.keys(variables.shadows).forEach(key => {
      utilityClasses.push(`.shadow-${key} { box-shadow: var(--shadow-${key}); }`);
    });

    return utilityClasses.join('\n');
  }

  /**
   * Store injected variables
   */
  private storeInjectedVariables(variables: EnhancedCSSVariables): void {
    // Color variables
    Object.entries(variables.colors).forEach(([key, value]) => {
      this.injectedVariables.set(`--color-${key}`, value);
    });

    // Typography variables
    Object.entries(variables.typography).forEach(([key, value]) => {
      if (typeof value === 'string') {
        this.injectedVariables.set(`--font-${key}`, value);
      } else {
        Object.entries(value).forEach(([subKey, subValue]) => {
          this.injectedVariables.set(`--font-${key}-${subKey}`, subValue);
        });
      }
    });

    // Spacing variables
    Object.entries(variables.spacing).forEach(([key, value]) => {
      this.injectedVariables.set(`--spacing-${key}`, value);
    });

    // Border radius variables
    Object.entries(variables.borderRadius).forEach(([key, value]) => {
      this.injectedVariables.set(`--radius-${key}`, value);
    });

    // Shadow variables
    Object.entries(variables.shadows).forEach(([key, value]) => {
      this.injectedVariables.set(`--shadow-${key}`, value);
    });

    // Animation variables
    Object.entries(variables.animations).forEach(([key, value]) => {
      this.injectedVariables.set(`--animation-${key}`, value);
    });

    // Transition variables
    Object.entries(variables.transitions).forEach(([key, value]) => {
      this.injectedVariables.set(`--transition-${key}`, value);
    });

    // Effect variables
    Object.entries(variables.effects).forEach(([key, value]) => {
      this.injectedVariables.set(`--effect-${key}`, value);
    });
  }

  /**
   * Optimize colors
   */
  private optimizeColors(colors: EnhancedCSSVariables['colors']): EnhancedCSSVariables['colors'] {
    const optimized: EnhancedCSSVariables['colors'] = { ...colors };

    // Convert hex colors to RGB for better performance
    Object.entries(optimized).forEach(([key, value]) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        const rgb = this.hexToRgb(value);
        if (rgb) {
          optimized[key as keyof EnhancedCSSVariables['colors']] = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        }
      }
    });

    return optimized;
  }

  /**
   * Optimize typography
   */
  private optimizeTypography(typography: EnhancedCSSVariables['typography']): EnhancedCSSVariables['typography'] {
    return {
      ...typography,
      fontFamily: typography.fontFamily.replace(/\s+/g, ' ').trim(),
      headingFont: typography.headingFont.replace(/\s+/g, ' ').trim(),
    };
  }

  /**
   * Optimize spacing
   */
  private optimizeSpacing(spacing: EnhancedCSSVariables['spacing']): EnhancedCSSVariables['spacing'] {
    const optimized: EnhancedCSSVariables['spacing'] = { ...spacing };

    // Convert rem to px for better performance
    Object.entries(optimized).forEach(([key, value]) => {
      if (typeof value === 'string' && value.endsWith('rem')) {
        const numValue = parseFloat(value);
        optimized[key as keyof EnhancedCSSVariables['spacing']] = `${numValue * 16}px`;
      }
    });

    return optimized;
  }

  /**
   * Optimize border radius
   */
  private optimizeBorderRadius(borderRadius: EnhancedCSSVariables['borderRadius']): EnhancedCSSVariables['borderRadius'] {
    const optimized: EnhancedCSSVariables['borderRadius'] = { ...borderRadius };

    // Convert rem to px for better performance
    Object.entries(optimized).forEach(([key, value]) => {
      if (typeof value === 'string' && value.endsWith('rem')) {
        const numValue = parseFloat(value);
        optimized[key as keyof EnhancedCSSVariables['borderRadius']] = `${numValue * 16}px`;
      }
    });

    return optimized;
  }

  /**
   * Optimize shadows
   */
  private optimizeShadows(shadows: EnhancedCSSVariables['shadows']): EnhancedCSSVariables['shadows'] {
    return { ...shadows };
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
}

// Export singleton instance
export const enhancedCSSVariableManager = new EnhancedCSSVariableManager();
