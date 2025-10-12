// Documentation: /docs/comprehensive-theming-system/theme-performance-tests.md

import { UnifiedThemeManager } from '@/lib/unified-theme-manager';
import { EnhancedThemeCacheManager } from '@/lib/enhanced-theme-cache';
import { ThemePerformanceMonitor } from '@/lib/theme-performance-monitor';
import { OptimizedCSSVariableManager } from '@/lib/optimized-css-variables';
import { DynamicTailwindManager } from '@/lib/dynamic-tailwind-manager';
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

describe('Theme System Performance Tests', () => {
  let themeManager: UnifiedThemeManager;
  let cacheManager: EnhancedThemeCacheManager;
  let performanceMonitor: ThemePerformanceMonitor;
  let cssManager: OptimizedCSSVariableManager;
  let tailwindManager: DynamicTailwindManager;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Create mock theme
    mockTheme = {
      id: 'performance-test-theme',
      name: 'Performance Test Theme',
      description: 'A test theme for performance testing',
      version: '1.0.0',
      metadata: {
        author: 'Test Author',
        license: 'MIT',
        tags: ['test', 'performance'],
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

    // Initialize managers
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
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Theme Application Performance', () => {
    test('should apply theme within performance threshold', async () => {
      const startTime = performance.now();

      const result = await themeManager.applyTheme(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle multiple theme applications efficiently', async () => {
      const themes = Array.from({ length: 10 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      for (const theme of themes) {
        await themeManager.applyTheme(theme);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });

    test('should batch theme applications efficiently', async () => {
      const themes = Array.from({ length: 100 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      // Apply themes in parallel
      const promises = themes.map(theme => themeManager.applyTheme(theme));
      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });

  describe('Cache Performance', () => {
    test('should cache theme efficiently', async () => {
      const startTime = performance.now();

      await cacheManager.cacheTheme(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should retrieve cached theme efficiently', async () => {
      // Cache theme first
      await cacheManager.cacheTheme(mockTheme);

      const startTime = performance.now();

      const cachedTheme = await cacheManager.getCachedTheme('performance-test-theme');

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(cachedTheme.theme).toEqual(mockTheme);
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should handle cache warming efficiently', async () => {
      const themes = Array.from({ length: 50 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      await cacheManager.warmCache(themes);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should handle cache eviction efficiently', async () => {
      const smallCacheManager = new EnhancedThemeCacheManager({
        maxSize: 10,
        ttl: 60000,
      });

      const themes = Array.from({ length: 20 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      for (const theme of themes) {
        await smallCacheManager.cacheTheme(theme);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      expect(smallCacheManager.getSize()).toBeLessThanOrEqual(10);
    });
  });

  describe('CSS Variable Performance', () => {
    test('should inject CSS variables efficiently', async () => {
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

      const startTime = performance.now();

      await cssManager.injectVariables(cssVariables);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should batch CSS variable updates efficiently', () => {
      const startTime = performance.now();

      // Batch multiple updates
      for (let i = 0; i < 100; i++) {
        cssManager.batchCSSVariableUpdate(`--color-${i}`, `#${i.toString(16).padStart(6, '0')}`);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should update CSS variables efficiently', async () => {
      const variables = {
        colors: {
          primary: '#ff0000',
          secondary: '#00ff00',
          accent: '#0000ff',
        },
      };

      const startTime = performance.now();

      await cssManager.updateVariables(variables);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });
  });

  describe('Tailwind Performance', () => {
    test('should generate Tailwind classes efficiently', () => {
      const startTime = performance.now();

      const classes = tailwindManager.generateCustomClasses(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(classes).toBeDefined();
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should generate CSS from Tailwind classes efficiently', () => {
      const classes = tailwindManager.generateCustomClasses(mockTheme);

      const startTime = performance.now();

      const css = tailwindManager.generateCSS(classes);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(css).toBeDefined();
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should inject Tailwind classes efficiently', async () => {
      const startTime = performance.now();

      await tailwindManager.injectTailwindClasses(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should handle multiple Tailwind class generations efficiently', () => {
      const themes = Array.from({ length: 100 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      for (const theme of themes) {
        tailwindManager.generateCustomClasses(theme);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe('Performance Monitoring', () => {
    test('should monitor theme application performance efficiently', async () => {
      const startTime = performance.now();

      const metrics = await performanceMonitor.monitorThemeApplication(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(metrics).toBeDefined();
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should generate performance reports efficiently', () => {
      const startTime = performance.now();

      const report = performanceMonitor.generatePerformanceReport();

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(report).toBeDefined();
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should handle performance monitoring under load', async () => {
      const startTime = performance.now();

      // Monitor multiple operations
      const promises = Array.from({ length: 100 }, () =>
        performanceMonitor.monitorThemeApplication(mockTheme)
      );
      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });
  });

  describe('Memory Usage', () => {
    test('should not leak memory during theme applications', async () => {
      const initialMemory = (performance as any).memory.usedJSHeapSize;

      // Apply themes multiple times
      for (let i = 0; i < 100; i++) {
        await themeManager.applyTheme({
          ...mockTheme,
          id: `theme-${i}`,
          name: `Theme ${i}`,
        });
      }

      const finalMemory = (performance as any).memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    test('should not leak memory during cache operations', async () => {
      const initialMemory = (performance as any).memory.usedJSHeapSize;

      // Perform cache operations
      for (let i = 0; i < 100; i++) {
        await cacheManager.cacheTheme({
          ...mockTheme,
          id: `theme-${i}`,
          name: `Theme ${i}`,
        });
      }

      const finalMemory = (performance as any).memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 5MB)
      expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle concurrent theme applications', async () => {
      const themes = Array.from({ length: 10 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      // Apply themes concurrently
      const promises = themes.map(theme => themeManager.applyTheme(theme));
      const results = await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success)).toBe(true);
      expect(duration).toBeLessThan(2000); // Should complete within 2 seconds
    });

    test('should handle concurrent cache operations', async () => {
      const themes = Array.from({ length: 10 }, (_, i) => ({
        ...mockTheme,
        id: `theme-${i}`,
        name: `Theme ${i}`,
      }));

      const startTime = performance.now();

      // Cache themes concurrently
      const promises = themes.map(theme => cacheManager.cacheTheme(theme));
      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    test('should handle concurrent CSS variable operations', async () => {
      const cssVariables = Array.from({ length: 10 }, (_, i) => ({
        colors: {
          primary: `#${i.toString(16).padStart(6, '0')}`,
          secondary: `#${(i + 1).toString(16).padStart(6, '0')}`,
          accent: `#${(i + 2).toString(16).padStart(6, '0')}`,
        },
      }));

      const startTime = performance.now();

      // Inject CSS variables concurrently
      const promises = cssVariables.map(variables => cssManager.injectVariables(variables));
      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500); // Should complete within 500ms
    });
  });

  describe('Performance Thresholds', () => {
    test('should meet performance thresholds for theme application', async () => {
      const startTime = performance.now();

      const result = await themeManager.applyTheme(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(500); // Should complete within 500ms
    });

    test('should meet performance thresholds for cache operations', async () => {
      const startTime = performance.now();

      await cacheManager.cacheTheme(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    test('should meet performance thresholds for CSS variable injection', async () => {
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

      const startTime = performance.now();

      await cssManager.injectVariables(cssVariables);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should meet performance thresholds for Tailwind class generation', () => {
      const startTime = performance.now();

      const classes = tailwindManager.generateCustomClasses(mockTheme);

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(classes).toBeDefined();
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });
  });

  describe('Performance Regression', () => {
    test('should not regress in performance over time', async () => {
      const measurements: number[] = [];

      // Measure performance multiple times
      for (let i = 0; i < 10; i++) {
        const startTime = performance.now();

        await themeManager.applyTheme({
          ...mockTheme,
          id: `theme-${i}`,
          name: `Theme ${i}`,
        });

        const endTime = performance.now();
        const duration = endTime - startTime;
        measurements.push(duration);
      }

      // Calculate average and standard deviation
      const average = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
      const variance = measurements.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / measurements.length;
      const standardDeviation = Math.sqrt(variance);

      // Performance should be consistent (low standard deviation)
      expect(standardDeviation).toBeLessThan(average * 0.5); // Standard deviation should be less than 50% of average
    });
  });
});
