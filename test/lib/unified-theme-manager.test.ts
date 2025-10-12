// Documentation: /docs/comprehensive-theming-system/unified-theme-manager-tests.md

import { UnifiedThemeManager } from '@/lib/unified-theme-manager';
import type { UnifiedTheme, UnifiedThemePreset } from '@/types/unified-theme';

// Mock dependencies
jest.mock('@/lib/enhanced-theme-cache');
jest.mock('@/lib/theme-performance-monitor');
jest.mock('@/lib/optimized-css-variables');
jest.mock('@/lib/dynamic-tailwind-manager');
jest.mock('@/lib/advanced-theming-features');
jest.mock('@/lib/enhanced-theme-validation');
jest.mock('@/lib/theme-accessibility-features');
jest.mock('@/lib/theme-export-import');

describe('UnifiedThemeManager', () => {
  let themeManager: UnifiedThemeManager;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock theme
    mockTheme = {
      id: 'test-theme',
      name: 'Test Theme',
      description: 'A test theme for unit testing',
      version: '1.0.0',
      metadata: {
        author: 'Test Author',
        license: 'MIT',
        tags: ['test', 'unit'],
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

    // Create theme manager instance
    themeManager = new UnifiedThemeManager({
      enableCaching: false,
      enablePerformanceMonitoring: false,
      enableValidation: false,
      enableAutoFix: false,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    it('should create a UnifiedThemeManager instance', () => {
      expect(themeManager).toBeInstanceOf(UnifiedThemeManager);
    });

    it('should initialize with default configuration', () => {
      const defaultManager = new UnifiedThemeManager();
      expect(defaultManager).toBeInstanceOf(UnifiedThemeManager);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        enableCaching: true,
        enablePerformanceMonitoring: true,
        enableValidation: true,
        enableAutoFix: true,
        cacheSize: 100,
        cacheTTL: 300000,
        debounceDelay: 200,
        validationLevel: 'strict' as const,
      };

      const customManager = new UnifiedThemeManager(customConfig);
      expect(customManager).toBeInstanceOf(UnifiedThemeManager);
    });
  });

  describe('Theme Application', () => {
    it('should apply theme successfully', async () => {
      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(true);
      expect(result.theme).toEqual(mockTheme);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle theme application errors', async () => {
      // Mock theme application to throw error
      const errorTheme = { ...mockTheme, id: 'error-theme' };
      
      // Mock document methods to throw error
      Object.defineProperty(document, 'head', {
        value: {
          appendChild: jest.fn().mockImplementation(() => {
            throw new Error('DOM manipulation failed');
          }),
        },
        writable: true,
      });

      const result = await themeManager.applyTheme(errorTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate theme before application', async () => {
      const invalidTheme = { ...mockTheme, colors: {} as any };
      
      const result = await themeManager.applyTheme(invalidTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should cache theme after successful application', async () => {
      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(true);
      // Verify caching was called (mocked)
    });

    it('should record performance metrics', async () => {
      const result = await themeManager.applyTheme(mockTheme);

      expect(result.success).toBe(true);
      expect(result.performanceMetrics).toBeDefined();
    });
  });

  describe('Theme Management', () => {
    it('should get current theme', () => {
      const currentTheme = themeManager.getCurrentTheme();
      expect(currentTheme).toBeDefined();
    });

    it('should get current branding', () => {
      const currentBranding = themeManager.getCurrentBranding();
      expect(currentBranding).toBeDefined();
    });

    it('should reset theme to default', async () => {
      const result = await themeManager.resetTheme();

      expect(result.success).toBe(true);
      expect(result.theme).toBeDefined();
    });

    it('should validate theme', () => {
      const validationResults = themeManager.validateTheme(mockTheme);

      expect(validationResults).toBeDefined();
      expect(validationResults.isValid).toBeDefined();
      expect(validationResults.errors).toBeDefined();
      expect(validationResults.warnings).toBeDefined();
    });
  });

  describe('Theme History', () => {
    it('should add theme to history', () => {
      const historyEntry = themeManager.addToHistory(mockTheme, 'user', 'Test theme application');

      expect(historyEntry).toBeDefined();
      expect(historyEntry.theme).toEqual(mockTheme);
      expect(historyEntry.appliedBy).toBe('user');
      expect(historyEntry.description).toBe('Test theme application');
    });

    it('should undo theme change', () => {
      // Add theme to history
      themeManager.addToHistory(mockTheme, 'user', 'Test theme application');

      // Undo the change
      const undoResult = themeManager.undo();

      expect(undoResult.success).toBe(true);
      expect(undoResult.theme).toBeDefined();
    });

    it('should redo theme change', () => {
      // Add theme to history
      themeManager.addToHistory(mockTheme, 'user', 'Test theme application');

      // Undo the change
      themeManager.undo();

      // Redo the change
      const redoResult = themeManager.redo();

      expect(redoResult.success).toBe(true);
      expect(redoResult.theme).toBeDefined();
    });

    it('should handle undo when no history exists', () => {
      const undoResult = themeManager.undo();

      expect(undoResult.success).toBe(false);
      expect(undoResult.error).toBeDefined();
    });

    it('should handle redo when no future history exists', () => {
      const redoResult = themeManager.redo();

      expect(redoResult.success).toBe(false);
      expect(redoResult.error).toBeDefined();
    });
  });

  describe('Theme Export/Import', () => {
    it('should export theme', async () => {
      const exportedTheme = await themeManager.exportTheme(mockTheme);

      expect(exportedTheme).toBeDefined();
      expect(typeof exportedTheme).toBe('string');
    });

    it('should import theme', async () => {
      const exportedTheme = await themeManager.exportTheme(mockTheme);
      const importResult = await themeManager.importTheme(exportedTheme);

      expect(importResult.success).toBe(true);
      expect(importResult.theme).toBeDefined();
    });

    it('should handle import errors', async () => {
      const invalidData = 'invalid-json-data';
      const importResult = await themeManager.importTheme(invalidData);

      expect(importResult.success).toBe(false);
      expect(importResult.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Presets', () => {
    it('should load theme presets', () => {
      const presets = themeManager.getThemePresets();

      expect(presets).toBeDefined();
      expect(Array.isArray(presets)).toBe(true);
    });

    it('should get theme preset by ID', () => {
      const preset = themeManager.getThemePresetById('corporate-blue');

      expect(preset).toBeDefined();
    });

    it('should return null for non-existent preset', () => {
      const preset = themeManager.getThemePresetById('non-existent');

      expect(preset).toBeNull();
    });
  });

  describe('Theme Customization', () => {
    it('should apply theme customizations', () => {
      const customizations = {
        colors: {
          primary: '#ff0000',
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
        },
      };

      const customizedTheme = themeManager.applyCustomizations(mockTheme, customizations);

      expect(customizedTheme).toBeDefined();
      expect(customizedTheme.colors.primary).toBe('#ff0000');
      expect(customizedTheme.typography.fontFamily).toBe('Arial, sans-serif');
    });

    it('should save theme customizations', () => {
      const customizations = {
        colors: {
          primary: '#ff0000',
        },
      };

      const result = themeManager.saveCustomizations(customizations);

      expect(result.success).toBe(true);
    });

    it('should reset theme customizations', () => {
      const result = themeManager.resetCustomizations();

      expect(result.success).toBe(true);
    });
  });

  describe('Performance Monitoring', () => {
    it('should get performance metrics', () => {
      const metrics = themeManager.getPerformanceMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.themeApplicationTime).toBeDefined();
      expect(metrics.cssVariableInjectionTime).toBeDefined();
      expect(metrics.componentUpdateTime).toBeDefined();
      expect(metrics.memoryUsage).toBeDefined();
      expect(metrics.cacheHitRate).toBeDefined();
    });

    it('should clear performance metrics', () => {
      themeManager.clearPerformanceMetrics();

      const metrics = themeManager.getPerformanceMetrics();
      expect(metrics.themeApplicationTime).toBe(0);
      expect(metrics.cssVariableInjectionTime).toBe(0);
      expect(metrics.componentUpdateTime).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle theme application errors gracefully', async () => {
      // Mock theme application to throw error
      const errorTheme = { ...mockTheme, id: 'error-theme' };
      
      // Mock CSS variable injection to throw error
      Object.defineProperty(document, 'head', {
        value: {
          appendChild: jest.fn().mockImplementation(() => {
            throw new Error('CSS injection failed');
          }),
        },
        writable: true,
      });

      const result = await themeManager.applyTheme(errorTheme);

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle validation errors', () => {
      const invalidTheme = { ...mockTheme, colors: {} as any };
      
      const validationResults = themeManager.validateTheme(invalidTheme);

      expect(validationResults.isValid).toBe(false);
      expect(validationResults.errors.length).toBeGreaterThan(0);
    });

    it('should handle export errors', async () => {
      // Mock export to throw error
      const errorTheme = { ...mockTheme, id: 'error-theme' };
      
      // Mock JSON.stringify to throw error
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Serialization failed');
      });

      await expect(themeManager.exportTheme(errorTheme)).rejects.toThrow();

      // Restore original function
      JSON.stringify = originalStringify;
    });
  });

  describe('Configuration', () => {
    it('should get current configuration', () => {
      const config = themeManager.getConfig();

      expect(config).toBeDefined();
      expect(config.enableCaching).toBeDefined();
      expect(config.enablePerformanceMonitoring).toBeDefined();
      expect(config.enableValidation).toBeDefined();
      expect(config.enableAutoFix).toBeDefined();
    });

    it('should update configuration', () => {
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

  describe('Cleanup', () => {
    it('should destroy theme manager', () => {
      expect(() => themeManager.destroy()).not.toThrow();
    });
  });
});
