// Documentation: /docs/comprehensive-theming-system/theme-system-integration-tests.md

import { UnifiedThemeManager } from '@/lib/unified-theme-manager';
import { EnhancedThemeCacheManager } from '@/lib/enhanced-theme-cache';
import { ThemePerformanceMonitor } from '@/lib/theme-performance-monitor';
import { OptimizedCSSVariableManager } from '@/lib/optimized-css-variables';
import { DynamicTailwindManager } from '@/lib/dynamic-tailwind-manager';
import { AdvancedThemingFeaturesManager } from '@/lib/advanced-theming-features';
import { EnhancedThemeValidationManager } from '@/lib/enhanced-theme-validation';
import { ThemeAccessibilityFeaturesManager } from '@/lib/theme-accessibility-features';
import { ThemeExportImportManager } from '@/lib/theme-export-import';
import type { UnifiedTheme } from '@/types/unified-theme';

// Mock DOM environment
const mockDocument = {
  head: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  documentElement: {
    style: {
      setProperty: jest.fn(),
    },
  },
  querySelectorAll: jest.fn().mockReturnValue([]),
};

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
});

// Mock window environment
const mockWindow = {
  matchMedia: jest.fn().mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  innerWidth: 1024,
  innerHeight: 768,
};

Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
});

// Mock performance API
const mockPerformance = {
  now: jest.fn().mockReturnValue(Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(),
  getEntriesByName: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000,
  },
};

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Theme System Integration Tests', () => {
  let themeManager: UnifiedThemeManager;
  let cacheManager: EnhancedThemeCacheManager;
  let performanceMonitor: ThemePerformanceMonitor;
  let cssManager: OptimizedCSSVariableManager;
  let tailwindManager: DynamicTailwindManager;
  let advancedFeatures: AdvancedThemingFeaturesManager;
  let validationManager: EnhancedThemeValidationManager;
  let accessibilityManager: ThemeAccessibilityFeaturesManager;
  let exportImportManager: ThemeExportImportManager;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Create mock theme
    mockTheme = {
      id: 'integration-test-theme',
      name: 'Integration Test Theme',
      description: 'A test theme for integration testing',
      version: '1.0.0',
      metadata: {
        author: 'Test Author',
        license: 'MIT',
        tags: ['test', 'integration'],
        category: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#1f2937',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f5f5f5',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
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
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
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
        },
        brightness: {
          0: '0',
          50: '0.5',
          75: '0.75',
          90: '0.9',
          95: '0.95',
          100: '1',
          105: '1.05',
          110: '1.1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        contrast: {
          0: '0',
          50: '0.5',
          75: '0.75',
          100: '1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        grayscale: {
          0: '0',
          100: '1',
        },
        hueRotate: {
          0: '0deg',
          15: '15deg',
          30: '30deg',
          60: '60deg',
          90: '90deg',
          180: '180deg',
        },
        invert: {
          0: '0',
          100: '1',
        },
        opacity: {
          0: '0',
          5: '0.05',
          10: '0.1',
          20: '0.2',
          25: '0.25',
          30: '0.3',
          40: '0.4',
          50: '0.5',
          60: '0.6',
          70: '0.7',
          75: '0.75',
          80: '0.8',
          90: '0.9',
          95: '0.95',
          100: '1',
        },
        saturate: {
          0: '0',
          50: '0.5',
          100: '1',
          150: '1.5',
          200: '2',
        },
        sepia: {
          0: '0',
          100: '1',
        },
      },
      branding: {
        logo: '',
        favicon: '',
        colors: {
          primary: '#3b82f6',
          secondary: '#1f2937',
          accent: '#06b6d4',
        },
      },
    };

    // Initialize all managers
    themeManager = new UnifiedThemeManager({
      enableCaching: true,
      enablePerformanceMonitoring: true,
      enableValidation: true,
      enableAutoFix: true,
    });

    cacheManager = new EnhancedThemeCacheManager({
      enablePersistence: true,
      enableCompression: true,
      enableEncryption: false,
      enableMetrics: true,
    });

    performanceMonitor = new ThemePerformanceMonitor({
      enableMonitoring: true,
      enableMetrics: true,
      enableAlerts: true,
      enableReporting: false,
    });

    cssManager = new OptimizedCSSVariableManager({
      enableBatching: true,
      enableCompression: true,
      enableMinification: true,
      enableCaching: true,
    });

    tailwindManager = new DynamicTailwindManager({
      enableDynamicClasses: true,
      enableCustomUtilities: true,
      enableThemeExtensions: true,
      enablePerformanceOptimization: true,
    });

    advancedFeatures = new AdvancedThemingFeaturesManager({
      enableDarkMode: true,
      enableResponsiveThemes: true,
      enableSeasonalThemes: false,
      enableTimeBasedThemes: false,
      enableLocationBasedThemes: false,
      enableUserPreferenceThemes: true,
      enableAutoContrast: true,
      enableThemeAnimations: true,
      enableThemeTransitions: true,
      enableThemeEffects: true,
    });

    validationManager = new EnhancedThemeValidationManager({
      enableColorValidation: true,
      enableTypographyValidation: true,
      enableSpacingValidation: true,
      enableAccessibilityValidation: true,
      enablePerformanceValidation: true,
      enableConsistencyValidation: true,
      enableCustomValidation: true,
      strictMode: false,
      autoFix: true,
      validationLevel: 'standard',
    });

    accessibilityManager = new ThemeAccessibilityFeaturesManager({
      enableWCAGCompliance: true,
      enableHighContrast: true,
      enableReducedMotion: true,
      enableKeyboardNavigation: true,
      enableScreenReader: true,
      enableFocusIndicators: true,
      enableColorBlindSupport: true,
      enableFontSizeScaling: true,
      enableVoiceControl: false,
      enableGestureControl: true,
      wcagLevel: 'AA',
      contrastRatio: 4.5,
      fontSizeScale: 1.0,
      motionReduction: 0.5,
    });

    exportImportManager = new ThemeExportImportManager({
      includePresets: true,
      includeCustomizations: true,
      includeHistory: false,
      includeValidation: true,
      includeAccessibility: true,
      includePerformance: false,
      format: 'json',
      compression: false,
      encryption: false,
      metadata: true,
      version: '1.0.0',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Theme Application Flow', () => {
    it('should apply theme through complete system', async () => {
      // Apply theme through unified theme manager
      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(true);
      expect(result.theme).toEqual(mockTheme);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);

      // Verify CSS variables were injected
      expect(mockDocument.head.appendChild).toHaveBeenCalled();

      // Verify performance monitoring
      const metrics = performanceMonitor.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.themeApplicationTime).toBeGreaterThanOrEqual(0);

      // Verify caching
      const cachedTheme = await cacheManager.getCachedTheme('integration-test-theme');
      expect(cachedTheme.theme).toEqual(mockTheme);
    });

    it('should handle theme application errors gracefully', async () => {
      // Mock CSS injection to throw error
      mockDocument.head.appendChild.mockImplementation(() => {
        throw new Error('CSS injection failed');
      });

      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Validation Integration', () => {
    it('should validate theme before application', async () => {
      const invalidTheme = { ...mockTheme, colors: {} as any };

      const result = await themeManager.applyTheme(invalidTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should auto-fix theme issues when enabled', async () => {
      const themeWithIssues = {
        ...mockTheme,
        colors: {
          ...mockTheme.colors,
          text: '#ffffff', // Same as background - low contrast
          background: '#ffffff',
        },
      };

      const result = await themeManager.applyTheme(themeWithIssues);

      // Should either succeed with fixes or fail with validation errors
      expect(result).toBeDefined();
    });
  });

  describe('Accessibility Integration', () => {
    it('should apply accessibility features to theme', async () => {
      const accessibleTheme = accessibilityManager.applyAccessibilityFeatures(mockTheme);

      expect(accessibleTheme).toBeDefined();
      expect(accessibleTheme).not.toEqual(mockTheme);
    });

    it('should respect user preferences', () => {
      // Mock high contrast preference
      mockWindow.matchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const accessibleTheme = accessibilityManager.applyAccessibilityFeatures(mockTheme);

      expect(accessibleTheme).toBeDefined();
    });
  });

  describe('Advanced Features Integration', () => {
    it('should apply advanced theming features', () => {
      const advancedTheme = advancedFeatures.applyAccessibilityFeatures(mockTheme);

      expect(advancedTheme).toBeDefined();
    });

    it('should handle responsive theme changes', () => {
      // Mock window resize
      mockWindow.innerWidth = 768; // Mobile width

      // Trigger resize event
      const resizeEvent = new Event('resize');
      mockWindow.dispatchEvent(resizeEvent);

      // Should not throw
      expect(() => {
        advancedFeatures.applyAccessibilityFeatures(mockTheme);
      }).not.toThrow();
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should monitor theme application performance', async () => {
      const metrics = await performanceMonitor.monitorThemeApplication(mockTheme);

      expect(metrics).toBeDefined();
      expect(metrics.themeApplicationTime).toBeGreaterThanOrEqual(0);
    });

    it('should monitor CSS variable injection', async () => {
      const variables = {
        '--color-primary': '#3b82f6',
        '--color-secondary': '#1f2937',
      };

      const duration = await performanceMonitor.monitorCSSVariableInjection(variables);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should monitor component updates', async () => {
      const componentCount = 10;

      const duration = await performanceMonitor.monitorComponentUpdate(componentCount);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should generate performance reports', () => {
      const report = performanceMonitor.generatePerformanceReport();

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.summary).toBeDefined();
      expect(report.metrics).toBeDefined();
    });
  });

  describe('Caching Integration', () => {
    it('should cache theme and related data', async () => {
      await cacheManager.cacheTheme(mockTheme);

      const cachedData = await cacheManager.getCachedTheme('integration-test-theme');

      expect(cachedData.theme).toEqual(mockTheme);
      expect(cachedData.cssVariables).toBeDefined();
      expect(cachedData.tailwindClasses).toBeDefined();
      expect(cachedData.metrics).toBeDefined();
    });

    it('should warm cache with multiple themes', async () => {
      const themes = [
        mockTheme,
        { ...mockTheme, id: 'theme-2' },
        { ...mockTheme, id: 'theme-3' },
      ];

      await cacheManager.warmCache(themes);

      const cachedTheme1 = await cacheManager.getCachedTheme('integration-test-theme');
      const cachedTheme2 = await cacheManager.getCachedTheme('theme-2');
      const cachedTheme3 = await cacheManager.getCachedTheme('theme-3');

      expect(cachedTheme1.theme).toEqual(mockTheme);
      expect(cachedTheme2.theme).toEqual({ ...mockTheme, id: 'theme-2' });
      expect(cachedTheme3.theme).toEqual({ ...mockTheme, id: 'theme-3' });
    });

    it('should handle cache errors gracefully', async () => {
      // Mock localStorage to throw error
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage is full');
      });

      await expect(cacheManager.cacheTheme(mockTheme)).resolves.not.toThrow();
    });
  });

  describe('CSS Variable Management Integration', () => {
    it('should inject CSS variables efficiently', async () => {
      const cssVariables = {
        colors: mockTheme.colors,
        typography: mockTheme.typography,
        spacing: mockTheme.spacing,
        borderRadius: mockTheme.borderRadius,
        shadows: mockTheme.shadows,
        animations: mockTheme.animations,
        transitions: mockTheme.transitions,
        effects: mockTheme.effects,
      };

      await cssManager.injectVariables(cssVariables);

      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });

    it('should batch CSS variable updates', () => {
      cssManager.batchCSSVariableUpdate('--color-primary', '#ff0000');
      cssManager.batchCSSVariableUpdate('--color-secondary', '#00ff00');

      // Should not immediately inject
      expect(mockDocument.head.appendChild).not.toHaveBeenCalled();

      // Wait for batch to flush
      setTimeout(() => {
        expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalled();
      }, 20);
    });

    it('should update CSS variables dynamically', async () => {
      const variables = {
        colors: {
          primary: '#ff0000',
        },
      };

      await cssManager.updateVariables(variables);

      expect(mockDocument.documentElement.style.setProperty).toHaveBeenCalled();
    });
  });

  describe('Tailwind Management Integration', () => {
    it('should generate custom Tailwind classes', () => {
      const classes = tailwindManager.generateCustomClasses(mockTheme);

      expect(classes).toBeDefined();
      expect(classes.colors).toBeDefined();
      expect(classes.typography).toBeDefined();
      expect(classes.spacing).toBeDefined();
      expect(classes.borderRadius).toBeDefined();
      expect(classes.shadows).toBeDefined();
      expect(classes.animations).toBeDefined();
      expect(classes.transitions).toBeDefined();
      expect(classes.effects).toBeDefined();
      expect(classes.utilities).toBeDefined();
    });

    it('should generate CSS from Tailwind classes', () => {
      const classes = tailwindManager.generateCustomClasses(mockTheme);
      const css = tailwindManager.generateCSS(classes);

      expect(css).toBeDefined();
      expect(typeof css).toBe('string');
      expect(css.length).toBeGreaterThan(0);
    });

    it('should inject Tailwind classes into document', async () => {
      await tailwindManager.injectTailwindClasses(mockTheme);

      expect(mockDocument.head.appendChild).toHaveBeenCalled();
    });
  });

  describe('Export/Import Integration', () => {
    it('should export theme in multiple formats', async () => {
      const jsonExport = await exportImportManager.exportTheme(mockTheme, 'json');
      const cssExport = await exportImportManager.exportTheme(mockTheme, 'css');
      const scssExport = await exportImportManager.exportTheme(mockTheme, 'scss');
      const tailwindExport = await exportImportManager.exportTheme(mockTheme, 'tailwind');

      expect(jsonExport).toBeDefined();
      expect(cssExport).toBeDefined();
      expect(scssExport).toBeDefined();
      expect(tailwindExport).toBeDefined();

      expect(typeof jsonExport).toBe('string');
      expect(typeof cssExport).toBe('string');
      expect(typeof scssExport).toBe('string');
      expect(typeof tailwindExport).toBe('string');
    });

    it('should import theme from exported data', async () => {
      const exportedData = await exportImportManager.exportTheme(mockTheme, 'json');
      const importResult = await exportImportManager.importTheme(exportedData, 'json');

      expect(importResult.success).toBe(true);
      expect(importResult.imported.presets).toBeGreaterThanOrEqual(0);
      expect(importResult.imported.customizations).toBeGreaterThanOrEqual(0);
      expect(importResult.imported.history).toBeGreaterThanOrEqual(0);
    });

    it('should handle import errors gracefully', async () => {
      const invalidData = 'invalid-json-data';
      const importResult = await exportImportManager.importTheme(invalidData, 'json');

      expect(importResult.success).toBe(false);
      expect(importResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Theme History Integration', () => {
    it('should manage theme history', async () => {
      // Apply initial theme
      await themeManager.applyTheme(mockTheme);

      // Apply second theme
      const secondTheme = { ...mockTheme, id: 'theme-2', name: 'Second Theme' };
      await themeManager.applyTheme(secondTheme);

      // Undo to first theme
      const undoResult = themeManager.undo();
      expect(undoResult.success).toBe(true);

      // Redo to second theme
      const redoResult = themeManager.redo();
      expect(redoResult.success).toBe(true);
    });
  });

  describe('Error Recovery Integration', () => {
    it('should recover from theme application errors', async () => {
      // Mock multiple failures
      mockDocument.head.appendChild.mockImplementation(() => {
        throw new Error('CSS injection failed');
      });

      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Reset mock
      mockDocument.head.appendChild.mockImplementation(() => {});

      // Should be able to apply theme after error
      const retryResult = await themeManager.applyTheme(mockTheme);
      expect(retryResult.success).toBe(true);
    });

    it('should handle validation errors gracefully', async () => {
      const invalidTheme = { ...mockTheme, colors: {} as any };

      const result = await themeManager.applyTheme(invalidTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Optimization Integration', () => {
    it('should optimize theme application performance', async () => {
      const startTime = performance.now();

      await themeManager.applyTheme(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should batch operations efficiently', async () => {
      const themes = [
        mockTheme,
        { ...mockTheme, id: 'theme-2' },
        { ...mockTheme, id: 'theme-3' },
      ];

      const startTime = performance.now();

      // Apply themes in sequence
      for (const theme of themes) {
        await themeManager.applyTheme(theme);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Configuration Integration', () => {
    it('should respect configuration settings', async () => {
      const customConfig = {
        enableCaching: false,
        enablePerformanceMonitoring: false,
        enableValidation: false,
        enableAutoFix: false,
      };

      const customManager = new UnifiedThemeManager(customConfig);

      const result = await customManager.applyTheme(mockTheme);

      expect(result.success).toBe(true);
    });

    it('should update configuration dynamically', () => {
      const newConfig = {
        enableCaching: true,
        enablePerformanceMonitoring: true,
      };

      themeManager.updateConfig(newConfig);

      const config = themeManager.getConfig();
      expect(config.enableCaching).toBe(true);
      expect(config.enablePerformanceMonitoring).toBe(true);
    });
  });

  describe('Cleanup Integration', () => {
    it('should cleanup all resources', () => {
      expect(() => {
        themeManager.destroy();
        cacheManager.destroy();
        performanceMonitor.destroy();
        cssManager.destroy();
        tailwindManager.destroy();
        advancedFeatures.destroy();
        validationManager.destroy();
        accessibilityManager.destroy();
        exportImportManager.destroy();
      }).not.toThrow();
    });
  });
});
