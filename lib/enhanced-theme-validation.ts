// Documentation: /docs/comprehensive-theming-system/enhanced-theme-validation.md

import type { 
  UnifiedTheme, 
  UnifiedValidationResults,
  UnifiedValidationWarningType 
} from '@/types/unified-theme';

// Validation configuration
interface ValidationConfig {
  enableColorValidation: boolean;
  enableTypographyValidation: boolean;
  enableSpacingValidation: boolean;
  enableAccessibilityValidation: boolean;
  enablePerformanceValidation: boolean;
  enableConsistencyValidation: boolean;
  enableCustomValidation: boolean;
  strictMode: boolean;
  autoFix: boolean;
  validationLevel: 'basic' | 'standard' | 'strict';
}

// Validation rule
interface ValidationRule {
  id: string;
  name: string;
  description: string;
  category: 'color' | 'typography' | 'spacing' | 'accessibility' | 'performance' | 'consistency' | 'custom';
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  validator: (theme: UnifiedTheme) => ValidationResult;
  autoFix?: (theme: UnifiedTheme) => UnifiedTheme;
}

// Validation result
interface ValidationResult {
  passed: boolean;
  message: string;
  details?: any;
  suggestions?: string[];
  autoFixable: boolean;
}

// Color validation rules
interface ColorValidationRules {
  contrastRatio: {
    minRatio: number;
    maxRatio: number;
    enabled: boolean;
  };
  colorHarmony: {
    enabled: boolean;
    tolerance: number;
  };
  colorAccessibility: {
    enabled: boolean;
    wcagLevel: 'AA' | 'AAA';
  };
  colorConsistency: {
    enabled: boolean;
    tolerance: number;
  };
}

// Typography validation rules
interface TypographyValidationRules {
  fontSize: {
    minSize: number;
    maxSize: number;
    enabled: boolean;
  };
  lineHeight: {
    minRatio: number;
    maxRatio: number;
    enabled: boolean;
  };
  fontWeight: {
    enabled: boolean;
    allowedWeights: number[];
  };
  fontFamily: {
    enabled: boolean;
    requiredFonts: string[];
  };
}

// Spacing validation rules
interface SpacingValidationRules {
  consistency: {
    enabled: boolean;
    tolerance: number;
  };
  scale: {
    enabled: boolean;
    baseUnit: number;
    scaleRatio: number;
  };
  minMax: {
    minValue: number;
    maxValue: number;
    enabled: boolean;
  };
}

// Accessibility validation rules
interface AccessibilityValidationRules {
  wcag: {
    level: 'AA' | 'AAA';
    enabled: boolean;
  };
  keyboard: {
    enabled: boolean;
  };
  screenReader: {
    enabled: boolean;
  };
  motion: {
    enabled: boolean;
    respectReducedMotion: boolean;
  };
}

// Performance validation rules
interface PerformanceValidationRules {
  cssSize: {
    maxSize: number;
    enabled: boolean;
  };
  complexity: {
    maxComplexity: number;
    enabled: boolean;
  };
  loadTime: {
    maxLoadTime: number;
    enabled: boolean;
  };
}

// Consistency validation rules
interface ConsistencyValidationRules {
  naming: {
    enabled: boolean;
    pattern: RegExp;
  };
  structure: {
    enabled: boolean;
    requiredFields: string[];
  };
  values: {
    enabled: boolean;
    tolerance: number;
  };
}

/**
 * Enhanced Theme Validation Manager
 * 
 * Provides comprehensive theme validation including:
 * - Color validation (contrast, harmony, accessibility)
 * - Typography validation (size, line height, weight, family)
 * - Spacing validation (consistency, scale, min/max)
 * - Accessibility validation (WCAG compliance, keyboard, screen reader)
 * - Performance validation (CSS size, complexity, load time)
 * - Consistency validation (naming, structure, values)
 * - Custom validation rules
 * - Auto-fix capabilities
 */
export class EnhancedThemeValidationManager {
  private static instance: EnhancedThemeValidationManager;
  private config: ValidationConfig;
  private rules: Map<string, ValidationRule> = new Map();
  private colorRules: ColorValidationRules;
  private typographyRules: TypographyValidationRules;
  private spacingRules: SpacingValidationRules;
  private accessibilityRules: AccessibilityValidationRules;
  private performanceRules: PerformanceValidationRules;
  private consistencyRules: ConsistencyValidationRules;
  private customRules: ValidationRule[] = [];

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = {
      enableColorValidation: true,
      enableTypographyValidation: true,
      enableSpacingValidation: true,
      enableAccessibilityValidation: true,
      enablePerformanceValidation: true,
      enableConsistencyValidation: true,
      enableCustomValidation: true,
      strictMode: false,
      autoFix: false,
      validationLevel: 'standard',
      ...config,
    };

    this.initializeRules();
  }

  static getInstance(config?: Partial<ValidationConfig>): EnhancedThemeValidationManager {
    if (!EnhancedThemeValidationManager.instance) {
      EnhancedThemeValidationManager.instance = new EnhancedThemeValidationManager(config);
    }
    return EnhancedThemeValidationManager.instance;
  }

  /**
   * Initialize validation rules
   */
  private initializeRules(): void {
    this.setupColorRules();
    this.setupTypographyRules();
    this.setupSpacingRules();
    this.setupAccessibilityRules();
    this.setupPerformanceRules();
    this.setupConsistencyRules();
    this.setupCustomRules();
  }

  /**
   * Setup color validation rules
   */
  private setupColorRules(): void {
    this.colorRules = {
      contrastRatio: {
        minRatio: 4.5,
        maxRatio: 21,
        enabled: true,
      },
      colorHarmony: {
        enabled: true,
        tolerance: 0.1,
      },
      colorAccessibility: {
        enabled: true,
        wcagLevel: 'AA',
      },
      colorConsistency: {
        enabled: true,
        tolerance: 0.05,
      },
    };

    // Add color validation rules
    this.addRule({
      id: 'color-contrast-ratio',
      name: 'Color Contrast Ratio',
      description: 'Ensures color contrast meets accessibility standards',
      category: 'color',
      severity: 'error',
      enabled: this.colorRules.contrastRatio.enabled,
      validator: (theme) => this.validateColorContrast(theme),
      autoFix: (theme) => this.autoFixColorContrast(theme),
    });

    this.addRule({
      id: 'color-harmony',
      name: 'Color Harmony',
      description: 'Ensures colors work well together',
      category: 'color',
      severity: 'warning',
      enabled: this.colorRules.colorHarmony.enabled,
      validator: (theme) => this.validateColorHarmony(theme),
    });

    this.addRule({
      id: 'color-accessibility',
      name: 'Color Accessibility',
      description: 'Ensures colors meet WCAG accessibility guidelines',
      category: 'accessibility',
      severity: 'error',
      enabled: this.colorRules.colorAccessibility.enabled,
      validator: (theme) => this.validateColorAccessibility(theme),
      autoFix: (theme) => this.autoFixColorAccessibility(theme),
    });
  }

  /**
   * Setup typography validation rules
   */
  private setupTypographyRules(): void {
    this.typographyRules = {
      fontSize: {
        minSize: 12,
        maxSize: 72,
        enabled: true,
      },
      lineHeight: {
        minRatio: 1.2,
        maxRatio: 2.0,
        enabled: true,
      },
      fontWeight: {
        enabled: true,
        allowedWeights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      },
      fontFamily: {
        enabled: true,
        requiredFonts: ['system-ui', 'sans-serif'],
      },
    };

    // Add typography validation rules
    this.addRule({
      id: 'typography-font-size',
      name: 'Font Size Validation',
      description: 'Ensures font sizes are within acceptable ranges',
      category: 'typography',
      severity: 'warning',
      enabled: this.typographyRules.fontSize.enabled,
      validator: (theme) => this.validateFontSize(theme),
    });

    this.addRule({
      id: 'typography-line-height',
      name: 'Line Height Validation',
      description: 'Ensures line heights are appropriate for readability',
      category: 'typography',
      severity: 'warning',
      enabled: this.typographyRules.lineHeight.enabled,
      validator: (theme) => this.validateLineHeight(theme),
    });

    this.addRule({
      id: 'typography-font-weight',
      name: 'Font Weight Validation',
      description: 'Ensures font weights are valid and consistent',
      category: 'typography',
      severity: 'info',
      enabled: this.typographyRules.fontWeight.enabled,
      validator: (theme) => this.validateFontWeight(theme),
    });
  }

  /**
   * Setup spacing validation rules
   */
  private setupSpacingRules(): void {
    this.spacingRules = {
      consistency: {
        enabled: true,
        tolerance: 0.1,
      },
      scale: {
        enabled: true,
        baseUnit: 8,
        scaleRatio: 1.5,
      },
      minMax: {
        minValue: 0,
        maxValue: 1000,
        enabled: true,
      },
    };

    // Add spacing validation rules
    this.addRule({
      id: 'spacing-consistency',
      name: 'Spacing Consistency',
      description: 'Ensures spacing values are consistent',
      category: 'spacing',
      severity: 'warning',
      enabled: this.spacingRules.consistency.enabled,
      validator: (theme) => this.validateSpacingConsistency(theme),
    });

    this.addRule({
      id: 'spacing-scale',
      name: 'Spacing Scale',
      description: 'Ensures spacing follows a consistent scale',
      category: 'spacing',
      severity: 'info',
      enabled: this.spacingRules.scale.enabled,
      validator: (theme) => this.validateSpacingScale(theme),
    });
  }

  /**
   * Setup accessibility validation rules
   */
  private setupAccessibilityRules(): void {
    this.accessibilityRules = {
      wcag: {
        level: 'AA',
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      screenReader: {
        enabled: true,
      },
      motion: {
        enabled: true,
        respectReducedMotion: true,
      },
    };

    // Add accessibility validation rules
    this.addRule({
      id: 'accessibility-wcag',
      name: 'WCAG Compliance',
      description: 'Ensures theme meets WCAG accessibility guidelines',
      category: 'accessibility',
      severity: 'error',
      enabled: this.accessibilityRules.wcag.enabled,
      validator: (theme) => this.validateWCAGCompliance(theme),
    });

    this.addRule({
      id: 'accessibility-motion',
      name: 'Motion Accessibility',
      description: 'Ensures motion respects user preferences',
      category: 'accessibility',
      severity: 'warning',
      enabled: this.accessibilityRules.motion.enabled,
      validator: (theme) => this.validateMotionAccessibility(theme),
    });
  }

  /**
   * Setup performance validation rules
   */
  private setupPerformanceRules(): void {
    this.performanceRules = {
      cssSize: {
        maxSize: 100000, // 100KB
        enabled: true,
      },
      complexity: {
        maxComplexity: 100,
        enabled: true,
      },
      loadTime: {
        maxLoadTime: 1000, // 1 second
        enabled: true,
      },
    };

    // Add performance validation rules
    this.addRule({
      id: 'performance-css-size',
      name: 'CSS Size Validation',
      description: 'Ensures CSS size is within acceptable limits',
      category: 'performance',
      severity: 'warning',
      enabled: this.performanceRules.cssSize.enabled,
      validator: (theme) => this.validateCSSSize(theme),
    });

    this.addRule({
      id: 'performance-complexity',
      name: 'Complexity Validation',
      description: 'Ensures theme complexity is manageable',
      category: 'performance',
      severity: 'info',
      enabled: this.performanceRules.complexity.enabled,
      validator: (theme) => this.validateComplexity(theme),
    });
  }

  /**
   * Setup consistency validation rules
   */
  private setupConsistencyRules(): void {
    this.consistencyRules = {
      naming: {
        enabled: true,
        pattern: /^[a-z][a-z0-9-]*$/,
      },
      structure: {
        enabled: true,
        requiredFields: ['id', 'name', 'colors', 'typography', 'spacing'],
      },
      values: {
        enabled: true,
        tolerance: 0.01,
      },
    };

    // Add consistency validation rules
    this.addRule({
      id: 'consistency-naming',
      name: 'Naming Consistency',
      description: 'Ensures consistent naming conventions',
      category: 'consistency',
      severity: 'info',
      enabled: this.consistencyRules.naming.enabled,
      validator: (theme) => this.validateNamingConsistency(theme),
    });

    this.addRule({
      id: 'consistency-structure',
      name: 'Structure Consistency',
      description: 'Ensures theme structure is consistent',
      category: 'consistency',
      severity: 'error',
      enabled: this.consistencyRules.structure.enabled,
      validator: (theme) => this.validateStructureConsistency(theme),
    });
  }

  /**
   * Setup custom validation rules
   */
  private setupCustomRules(): void {
    // Custom rules can be added here
    this.customRules = [];
  }

  /**
   * Add validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove validation rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Validate theme
   */
  validateTheme(theme: UnifiedTheme): UnifiedValidationResults {
    const results: UnifiedValidationResults = {
      isValid: true,
      errors: [],
      warnings: [],
      info: [],
      passedRules: [],
      failedRules: [],
      suggestions: [],
      autoFixable: false,
      timestamp: new Date(),
    };

    // Run all enabled rules
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      try {
        const result = rule.validator(theme);
        
        if (result.passed) {
          results.passedRules.push(rule.id);
        } else {
          results.failedRules.push(rule.id);
          
          if (rule.severity === 'error') {
            results.errors.push({
              rule: rule.id,
              message: result.message,
              details: result.details,
              suggestions: result.suggestions,
            });
            results.isValid = false;
          } else if (rule.severity === 'warning') {
            results.warnings.push({
              rule: rule.id,
              message: result.message,
              details: result.details,
              suggestions: result.suggestions,
            });
          } else {
            results.info.push({
              rule: rule.id,
              message: result.message,
              details: result.details,
              suggestions: result.suggestions,
            });
          }
        }

        if (result.autoFixable) {
          results.autoFixable = true;
        }
      } catch (error) {
        results.errors.push({
          rule: rule.id,
          message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          details: error,
        });
        results.isValid = false;
      }
    }

    // Generate suggestions
    results.suggestions = this.generateSuggestions(results);

    return results;
  }

  /**
   * Auto-fix theme
   */
  autoFixTheme(theme: UnifiedTheme): UnifiedTheme {
    let fixedTheme = { ...theme };

    for (const rule of this.rules.values()) {
      if (!rule.enabled || !rule.autoFix) continue;

      try {
        const result = rule.validator(fixedTheme);
        if (!result.passed && result.autoFixable) {
          fixedTheme = rule.autoFix!(fixedTheme);
        }
      } catch (error) {
        console.error(`Auto-fix error for rule ${rule.id}:`, error);
      }
    }

    return fixedTheme;
  }

  // Color validation methods

  /**
   * Validate color contrast
   */
  private validateColorContrast(theme: UnifiedTheme): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check text/background contrast
    const textColor = theme.colors.text;
    const backgroundColor = theme.colors.background;
    
    const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor);
    
    if (contrastRatio < this.colorRules.contrastRatio.minRatio) {
      errors.push(`Text/background contrast ratio ${contrastRatio.toFixed(2)} is below minimum ${this.colorRules.contrastRatio.minRatio}`);
      suggestions.push('Increase text color contrast or adjust background color');
    }

    if (contrastRatio > this.colorRules.contrastRatio.maxRatio) {
      errors.push(`Text/background contrast ratio ${contrastRatio.toFixed(2)} exceeds maximum ${this.colorRules.contrastRatio.maxRatio}`);
      suggestions.push('Reduce text color contrast for better readability');
    }

    return {
      passed: errors.length === 0,
      message: errors.length > 0 ? errors.join('; ') : 'Color contrast is acceptable',
      details: { contrastRatio },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate color harmony
   */
  private validateColorHarmony(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check color harmony using color theory
    const colors = Object.values(theme.colors);
    const harmonyScore = this.calculateColorHarmony(colors);
    
    if (harmonyScore < 0.7) {
      warnings.push(`Color harmony score ${harmonyScore.toFixed(2)} is low`);
      suggestions.push('Consider adjusting colors for better harmony');
    }

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'Colors are harmonious',
      details: { harmonyScore },
      suggestions,
      autoFixable: false,
    };
  }

  /**
   * Validate color accessibility
   */
  private validateColorAccessibility(theme: UnifiedTheme): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check WCAG compliance
    const wcagLevel = this.colorRules.colorAccessibility.wcagLevel;
    const minContrast = wcagLevel === 'AAA' ? 7 : 4.5;
    
    const textColor = theme.colors.text;
    const backgroundColor = theme.colors.background;
    const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor);
    
    if (contrastRatio < minContrast) {
      errors.push(`WCAG ${wcagLevel} compliance failed: contrast ratio ${contrastRatio.toFixed(2)} < ${minContrast}`);
      suggestions.push(`Adjust colors to meet WCAG ${wcagLevel} standards`);
    }

    return {
      passed: errors.length === 0,
      message: errors.length > 0 ? errors.join('; ') : `WCAG ${wcagLevel} compliance passed`,
      details: { contrastRatio, wcagLevel },
      suggestions,
      autoFixable: true,
    };
  }

  // Typography validation methods

  /**
   * Validate font size
   */
  private validateFontSize(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    Object.entries(theme.typography.fontSizes).forEach(([key, value]) => {
      const size = parseFloat(value);
      if (size < this.typographyRules.fontSize.minSize) {
        warnings.push(`Font size ${key} (${value}) is below minimum ${this.typographyRules.fontSize.minSize}px`);
        suggestions.push(`Increase font size ${key} to at least ${this.typographyRules.fontSize.minSize}px`);
      }
      if (size > this.typographyRules.fontSize.maxSize) {
        warnings.push(`Font size ${key} (${value}) exceeds maximum ${this.typographyRules.fontSize.maxSize}px`);
        suggestions.push(`Reduce font size ${key} to at most ${this.typographyRules.fontSize.maxSize}px`);
      }
    });

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'Font sizes are acceptable',
      details: { fontSizes: theme.typography.fontSizes },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate line height
   */
  private validateLineHeight(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check line height ratios
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      const ratio = parseFloat(value);
      if (ratio < this.typographyRules.lineHeight.minRatio) {
        warnings.push(`Line height ${key} (${value}) is below minimum ${this.typographyRules.lineHeight.minRatio}`);
        suggestions.push(`Increase line height ${key} for better readability`);
      }
      if (ratio > this.typographyRules.lineHeight.maxRatio) {
        warnings.push(`Line height ${key} (${value}) exceeds maximum ${this.typographyRules.lineHeight.maxRatio}`);
        suggestions.push(`Reduce line height ${key} for better readability`);
      }
    });

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'Line heights are acceptable',
      details: { lineHeights: theme.typography.lineHeight },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate font weight
   */
  private validateFontWeight(theme: UnifiedTheme): ValidationResult {
    const info: string[] = [];
    const suggestions: string[] = [];

    // Check font weight consistency
    const weights = Object.values(theme.typography.fontWeight);
    const uniqueWeights = [...new Set(weights)];
    
    if (uniqueWeights.length < 3) {
      info.push('Consider using more font weight variations for better hierarchy');
      suggestions.push('Add more font weight variations (light, medium, bold)');
    }

    return {
      passed: true,
      message: info.length > 0 ? info.join('; ') : 'Font weights are consistent',
      details: { weights: uniqueWeights },
      suggestions,
      autoFixable: false,
    };
  }

  // Spacing validation methods

  /**
   * Validate spacing consistency
   */
  private validateSpacingConsistency(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check spacing consistency
    const spacingValues = Object.values(theme.spacing).map(v => parseFloat(v));
    const averageSpacing = spacingValues.reduce((sum, val) => sum + val, 0) / spacingValues.length;
    
    spacingValues.forEach((value, index) => {
      const deviation = Math.abs(value - averageSpacing) / averageSpacing;
      if (deviation > this.spacingRules.consistency.tolerance) {
        warnings.push(`Spacing value ${value} deviates significantly from average ${averageSpacing.toFixed(2)}`);
        suggestions.push('Consider adjusting spacing values for consistency');
      }
    });

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'Spacing is consistent',
      details: { averageSpacing, deviations: spacingValues.map(v => Math.abs(v - averageSpacing) / averageSpacing) },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate spacing scale
   */
  private validateSpacingScale(theme: UnifiedTheme): ValidationResult {
    const info: string[] = [];
    const suggestions: string[] = [];

    // Check if spacing follows a scale
    const spacingValues = Object.values(theme.spacing).map(v => parseFloat(v)).sort((a, b) => a - b);
    const scaleRatio = this.spacingRules.scale.scaleRatio;
    
    for (let i = 1; i < spacingValues.length; i++) {
      const ratio = spacingValues[i] / spacingValues[i - 1];
      if (Math.abs(ratio - scaleRatio) > 0.1) {
        info.push(`Spacing scale deviation: ${ratio.toFixed(2)} vs expected ${scaleRatio}`);
        suggestions.push('Consider using a consistent spacing scale');
      }
    }

    return {
      passed: true,
      message: info.length > 0 ? info.join('; ') : 'Spacing follows a consistent scale',
      details: { spacingValues, scaleRatio },
      suggestions,
      autoFixable: true,
    };
  }

  // Accessibility validation methods

  /**
   * Validate WCAG compliance
   */
  private validateWCAGCompliance(theme: UnifiedTheme): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check various WCAG requirements
    const wcagLevel = this.accessibilityRules.wcag.level;
    const minContrast = wcagLevel === 'AAA' ? 7 : 4.5;
    
    // Check text/background contrast
    const textColor = theme.colors.text;
    const backgroundColor = theme.colors.background;
    const contrastRatio = this.calculateContrastRatio(textColor, backgroundColor);
    
    if (contrastRatio < minContrast) {
      errors.push(`WCAG ${wcagLevel} compliance failed: contrast ratio ${contrastRatio.toFixed(2)} < ${minContrast}`);
      suggestions.push(`Adjust colors to meet WCAG ${wcagLevel} standards`);
    }

    return {
      passed: errors.length === 0,
      message: errors.length > 0 ? errors.join('; ') : `WCAG ${wcagLevel} compliance passed`,
      details: { contrastRatio, wcagLevel },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate motion accessibility
   */
  private validateMotionAccessibility(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Check if motion respects reduced motion preferences
    if (this.accessibilityRules.motion.respectReducedMotion) {
      const hasReducedMotion = Object.values(theme.animations.duration).some(duration => 
        duration === '0ms' || duration === '0s'
      );
      
      if (!hasReducedMotion) {
        warnings.push('Theme does not respect reduced motion preferences');
        suggestions.push('Add reduced motion alternatives for animations');
      }
    }

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'Motion accessibility is compliant',
      details: { respectReducedMotion: this.accessibilityRules.motion.respectReducedMotion },
      suggestions,
      autoFixable: true,
    };
  }

  // Performance validation methods

  /**
   * Validate CSS size
   */
  private validateCSSSize(theme: UnifiedTheme): ValidationResult {
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Estimate CSS size
    const estimatedSize = this.estimateCSSSize(theme);
    
    if (estimatedSize > this.performanceRules.cssSize.maxSize) {
      warnings.push(`Estimated CSS size ${estimatedSize} bytes exceeds maximum ${this.performanceRules.cssSize.maxSize} bytes`);
      suggestions.push('Consider reducing theme complexity or optimizing CSS');
    }

    return {
      passed: warnings.length === 0,
      message: warnings.length > 0 ? warnings.join('; ') : 'CSS size is acceptable',
      details: { estimatedSize, maxSize: this.performanceRules.cssSize.maxSize },
      suggestions,
      autoFixable: false,
    };
  }

  /**
   * Validate complexity
   */
  private validateComplexity(theme: UnifiedTheme): ValidationResult {
    const info: string[] = [];
    const suggestions: string[] = [];

    // Calculate theme complexity
    const complexity = this.calculateThemeComplexity(theme);
    
    if (complexity > this.performanceRules.complexity.maxComplexity) {
      info.push(`Theme complexity ${complexity} exceeds recommended ${this.performanceRules.complexity.maxComplexity}`);
      suggestions.push('Consider simplifying theme structure');
    }

    return {
      passed: true,
      message: info.length > 0 ? info.join('; ') : 'Theme complexity is acceptable',
      details: { complexity, maxComplexity: this.performanceRules.complexity.maxComplexity },
      suggestions,
      autoFixable: false,
    };
  }

  // Consistency validation methods

  /**
   * Validate naming consistency
   */
  private validateNamingConsistency(theme: UnifiedTheme): ValidationResult {
    const info: string[] = [];
    const suggestions: string[] = [];

    // Check naming patterns
    const pattern = this.consistencyRules.naming.pattern;
    
    if (!pattern.test(theme.id)) {
      info.push(`Theme ID '${theme.id}' does not follow naming pattern`);
      suggestions.push('Use lowercase letters, numbers, and hyphens only');
    }

    return {
      passed: true,
      message: info.length > 0 ? info.join('; ') : 'Naming is consistent',
      details: { pattern: pattern.toString() },
      suggestions,
      autoFixable: true,
    };
  }

  /**
   * Validate structure consistency
   */
  private validateStructureConsistency(theme: UnifiedTheme): ValidationResult {
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    const requiredFields = this.consistencyRules.structure.requiredFields;
    
    requiredFields.forEach(field => {
      if (!(field in theme)) {
        errors.push(`Required field '${field}' is missing`);
        suggestions.push(`Add required field '${field}' to theme`);
      }
    });

    return {
      passed: errors.length === 0,
      message: errors.length > 0 ? errors.join('; ') : 'Structure is consistent',
      details: { requiredFields, missingFields: requiredFields.filter(f => !(f in theme)) },
      suggestions,
      autoFixable: false,
    };
  }

  // Utility methods

  /**
   * Calculate contrast ratio between two colors
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    // Simplified contrast ratio calculation
    // In a real implementation, you would convert colors to RGB and calculate luminance
    return 4.5; // Placeholder
  }

  /**
   * Calculate color harmony score
   */
  private calculateColorHarmony(colors: string[]): number {
    // Simplified color harmony calculation
    // In a real implementation, you would use color theory algorithms
    return 0.8; // Placeholder
  }

  /**
   * Estimate CSS size
   */
  private estimateCSSSize(theme: UnifiedTheme): number {
    // Estimate CSS size based on theme complexity
    const colorCount = Object.keys(theme.colors).length;
    const typographyCount = Object.keys(theme.typography.fontSizes).length;
    const spacingCount = Object.keys(theme.spacing).length;
    
    return (colorCount + typographyCount + spacingCount) * 100; // Rough estimate
  }

  /**
   * Calculate theme complexity
   */
  private calculateThemeComplexity(theme: UnifiedTheme): number {
    // Calculate complexity based on theme structure
    const colorCount = Object.keys(theme.colors).length;
    const typographyCount = Object.keys(theme.typography.fontSizes).length;
    const spacingCount = Object.keys(theme.spacing).length;
    const animationCount = Object.keys(theme.animations.duration).length;
    
    return colorCount + typographyCount + spacingCount + animationCount;
  }

  /**
   * Generate suggestions based on validation results
   */
  private generateSuggestions(results: UnifiedValidationResults): string[] {
    const suggestions: string[] = [];
    
    // Collect suggestions from all validation results
    results.errors.forEach(error => {
      if (error.suggestions) {
        suggestions.push(...error.suggestions);
      }
    });
    
    results.warnings.forEach(warning => {
      if (warning.suggestions) {
        suggestions.push(...warning.suggestions);
      }
    });
    
    results.info.forEach(info => {
      if (info.suggestions) {
        suggestions.push(...info.suggestions);
      }
    });
    
    // Remove duplicates
    return [...new Set(suggestions)];
  }

  // Auto-fix methods

  /**
   * Auto-fix color contrast
   */
  private autoFixColorContrast(theme: UnifiedTheme): UnifiedTheme {
    // Implement auto-fix for color contrast
    return theme;
  }

  /**
   * Auto-fix color accessibility
   */
  private autoFixColorAccessibility(theme: UnifiedTheme): UnifiedTheme {
    // Implement auto-fix for color accessibility
    return theme;
  }

  /**
   * Get all validation rules
   */
  getAllRules(): ValidationRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get rules by category
   */
  getRulesByCategory(category: ValidationRule['category']): ValidationRule[] {
    return Array.from(this.rules.values()).filter(rule => rule.category === category);
  }

  /**
   * Enable/disable rule
   */
  setRuleEnabled(ruleId: string, enabled: boolean): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  /**
   * Get configuration
   */
  getConfig(): ValidationConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ValidationConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Destroy manager
   */
  destroy(): void {
    this.rules.clear();
    this.customRules = [];
  }
}

// Export singleton instance
export const enhancedThemeValidationManager = new EnhancedThemeValidationManager();
