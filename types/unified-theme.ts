// Documentation: /docs/comprehensive-theming-system/unified-theme-types.md

import type { ColorScheme, TypographyConfig } from '@/types/settings';
import type { ThemePreset, ThemeCustomization, ValidationResults } from '@/types/theme-presets';

// Core theme data structure
export interface UnifiedTheme {
  id: string;
  name: string;
  description?: string;
  
  // Core theme data
  colors: ColorScheme;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: BorderRadiusConfig;
  shadows: ShadowConfig;
  
  // Branding
  branding: BrandingConfig;
  
  // Advanced theming
  animations: AnimationConfig;
  transitions: TransitionConfig;
  effects: EffectConfig;
  
  // Accessibility
  accessibility: AccessibilityConfig;
  
  // Performance
  optimized: boolean;
  cached: boolean;
  
  // Metadata
  metadata: ThemeMetadata;
}

// Spacing configuration
export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

// Border radius configuration
export interface BorderRadiusConfig {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

// Shadow configuration
export interface ShadowConfig {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

// Branding configuration
export interface BrandingConfig {
  logo: LogoConfig;
  favicon: string;
  appName: string;
  loginBackground?: string;
  customCSS?: string;
}

// Logo configuration
export interface LogoConfig {
  primary: string;
  favicon: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
  };
}

// Animation configuration
export interface AnimationConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  keyframes: Record<string, string>;
}

// Transition configuration
export interface TransitionConfig {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  properties: string[];
}

// Effect configuration
export interface EffectConfig {
  blur: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  brightness: {
    '0': string;
    '50': string;
    '75': string;
    '90': string;
    '95': string;
    '100': string;
    '105': string;
    '110': string;
    '125': string;
    '150': string;
    '200': string;
  };
  contrast: {
    '0': string;
    '50': string;
    '75': string;
    '100': string;
    '125': string;
    '150': string;
    '200': string;
  };
  grayscale: {
    '0': string;
    '100': string;
  };
  hueRotate: {
    '0': string;
    '15': string;
    '30': string;
    '60': string;
    '90': string;
    '180': string;
  };
  invert: {
    '0': string;
    '100': string;
  };
  opacity: {
    '0': string;
    '5': string;
    '10': string;
    '20': string;
    '25': string;
    '30': string;
    '40': string;
    '50': string;
    '60': string;
    '70': string;
    '75': string;
    '80': string;
    '90': string;
    '95': string;
    '100': string;
  };
  saturate: {
    '0': string;
    '50': string;
    '100': string;
    '150': string;
    '200': string;
  };
  sepia: {
    '0': string;
    '100': string;
  };
}

// Accessibility configuration
export interface AccessibilityConfig {
  contrastRatio: number;
  wcagCompliant: boolean;
  colorBlindnessFriendly: boolean;
  largeTextCompliant: boolean;
  reducedMotionCompliant: boolean;
  highContrastMode: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigationOptimized: boolean;
  focusIndicators: boolean;
  ariaLabels: boolean;
  recommendations: string[];
  score: number;
}

// Theme metadata
export interface ThemeMetadata {
  createdBy: string;
  version: string;
  lastUpdated: Date;
  category: ThemeCategory;
  tags: string[];
  industry: string[];
  license: string;
  compatibility: {
    minVersion: string;
    maxVersion?: string;
  };
}

// Theme category
export type ThemeCategory = 
  | 'corporate'
  | 'modern'
  | 'vibrant'
  | 'minimal'
  | 'dark'
  | 'accessible'
  | 'test'
  | 'custom';

// Enhanced CSS variables
export interface EnhancedCSSVariables {
  // Core colors
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
  
  // Typography
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  
  // Spacing
  spacing: Record<string, string>;
  
  // Border radius
  borderRadius: Record<string, string>;
  
  // Shadows
  shadows: Record<string, string>;
  
  // Animations
  animations: Record<string, string>;
  
  // Transitions
  transitions: Record<string, string>;
  
  // Effects
  effects: Record<string, string>;
}

// Theme application result
export interface ThemeApplicationResult {
  success: boolean;
  theme: UnifiedTheme;
  appliedAt: Date;
  duration: number;
  errors: string[];
  warnings: string[];
}

// Theme validation result
export interface ThemeValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  recommendations: string[];
  score: number;
  lastValidated: Date;
}

// Validation error
export interface ValidationError {
  type: 'color' | 'typography' | 'spacing' | 'accessibility' | 'performance';
  message: string;
  element?: string;
  value?: any;
  expected?: any;
}

// Validation warning
export interface ValidationWarning {
  type: 'color' | 'typography' | 'spacing' | 'accessibility' | 'performance';
  message: string;
  element?: string;
  value?: any;
  recommendation?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  themeApplicationTime: number;
  cssVariableInjectionTime: number;
  componentUpdateTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  timestamp: Date;
}

// Theme cache entry
export interface ThemeCacheEntry {
  theme: UnifiedTheme;
  cssVariables: EnhancedCSSVariables;
  tailwindClasses: string[];
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// Theme history entry
export interface ThemeHistoryEntry {
  id: string;
  theme: UnifiedTheme;
  customizations?: ThemeCustomization;
  appliedAt: Date;
  appliedBy: string;
  description: string;
  duration: number;
}

// Theme export data
export interface ThemeExportData {
  theme: UnifiedTheme;
  metadata: {
    exportedAt: string;
    version: string;
    application: string;
    exportedBy: string;
  };
}

// Theme import result
export interface ThemeImportResult {
  success: boolean;
  theme?: UnifiedTheme;
  errors: string[];
  warnings: string[];
}

// Theme manager configuration
export interface ThemeManagerConfig {
  enableCaching: boolean;
  enablePerformanceMonitoring: boolean;
  enableRealTimeUpdates: boolean;
  enableAccessibilityValidation: boolean;
  cacheSize: number;
  cacheTTL: number;
  debounceDelay: number;
  validationLevel: 'basic' | 'standard' | 'strict';
}

// Theme manager state
export interface ThemeManagerState {
  currentTheme: UnifiedTheme | null;
  themePresets: Map<string, ThemePreset>;
  customThemes: Map<string, UnifiedTheme>;
  themeHistory: ThemeHistoryEntry[];
  validationResults: ThemeValidationResult | null;
  performanceMetrics: PerformanceMetrics | null;
  isApplying: boolean;
  lastApplied: Date | null;
  errors: string[];
}

// Theme manager actions
export interface ThemeManagerActions {
  // Core actions
  applyTheme: (theme: UnifiedTheme) => Promise<ThemeApplicationResult>;
  applyPreset: (presetId: string, customizations?: ThemeCustomization) => Promise<ThemeApplicationResult>;
  applyCustomization: (customization: ThemeCustomization) => Promise<ThemeApplicationResult>;
  
  // Theme management
  saveTheme: (theme: UnifiedTheme) => void;
  loadTheme: (themeId: string) => UnifiedTheme | null;
  deleteTheme: (themeId: string) => void;
  
  // Validation
  validateTheme: (theme: UnifiedTheme) => ThemeValidationResult;
  
  // History
  undoThemeChange: () => void;
  redoThemeChange: () => void;
  clearHistory: () => void;
  
  // Export/Import
  exportTheme: (theme: UnifiedTheme) => string;
  importTheme: (themeData: string) => ThemeImportResult;
  
  // Performance
  getPerformanceMetrics: () => PerformanceMetrics | null;
  clearPerformanceMetrics: () => void;
  
  // Cache
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
  
  // Reset
  resetToDefault: () => void;
  resetToPreset: (presetId: string) => void;
}

// Theme manager interface
export interface ThemeManager extends ThemeManagerState, ThemeManagerActions {}

// Default theme configuration
export const DEFAULT_SPACING: SpacingConfig = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
  '4xl': '6rem',
};

export const DEFAULT_BORDER_RADIUS: BorderRadiusConfig = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export const DEFAULT_SHADOWS: ShadowConfig = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const DEFAULT_ANIMATIONS: AnimationConfig = {
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
};

export const DEFAULT_TRANSITIONS: TransitionConfig = {
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
};

export const DEFAULT_EFFECTS: EffectConfig = {
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
};

export const DEFAULT_ACCESSIBILITY: AccessibilityConfig = {
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
};
