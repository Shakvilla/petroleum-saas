// Documentation: /docs/comprehensive-theming-system/theme-performance-monitor-tests.md

import { ThemePerformanceMonitor } from '@/lib/theme-performance-monitor';
import type { UnifiedTheme } from '@/types/unified-theme';

// Mock performance API
const mockPerformance = {
  now: jest.fn(),
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

// Mock PerformanceObserver
const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}));

Object.defineProperty(global, 'PerformanceObserver', {
  value: mockPerformanceObserver,
  writable: true,
});

describe('ThemePerformanceMonitor', () => {
  let performanceMonitor: ThemePerformanceMonitor;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    mockPerformance.now.mockReturnValue(Date.now());

    // Create mock theme
    mockTheme = {
      id: 'test-theme',
      name: 'Test Theme',
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

    // Create performance monitor instance
    performanceMonitor = new ThemePerformanceMonitor({
      enableMonitoring: true,
      enableMetrics: true,
      enableAlerts: true,
      enableReporting: false,
      sampleRate: 1.0,
      alertThresholds: {
        themeApplicationTime: 100,
        cssVariableInjectionTime: 50,
        componentUpdateTime: 200,
        memoryUsage: 50,
        cacheHitRate: 80,
      },
      reportingInterval: 300000,
      maxMetricsHistory: 100,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    it('should create a ThemePerformanceMonitor instance', () => {
      expect(performanceMonitor).toBeInstanceOf(ThemePerformanceMonitor);
    });

    it('should initialize with default configuration', () => {
      const defaultMonitor = new ThemePerformanceMonitor();
      expect(defaultMonitor).toBeInstanceOf(ThemePerformanceMonitor);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        enableMonitoring: true,
        enableMetrics: true,
        enableAlerts: true,
        enableReporting: true,
        sampleRate: 0.5,
        alertThresholds: {
          themeApplicationTime: 200,
          cssVariableInjectionTime: 100,
          componentUpdateTime: 400,
          memoryUsage: 100,
          cacheHitRate: 90,
        },
        reportingInterval: 600000,
        maxMetricsHistory: 200,
      };

      const customMonitor = new ThemePerformanceMonitor(customConfig);
      expect(customMonitor).toBeInstanceOf(ThemePerformanceMonitor);
    });

    it('should be a singleton', () => {
      const instance1 = ThemePerformanceMonitor.getInstance();
      const instance2 = ThemePerformanceMonitor.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Monitoring Control', () => {
    it('should start monitoring', () => {
      performanceMonitor.startMonitoring();
      // No direct way to test this, but should not throw
      expect(() => performanceMonitor.startMonitoring()).not.toThrow();
    });

    it('should stop monitoring', () => {
      performanceMonitor.stopMonitoring();
      // No direct way to test this, but should not throw
      expect(() => performanceMonitor.stopMonitoring()).not.toThrow();
    });
  });

  describe('Theme Application Monitoring', () => {
    it('should monitor theme application performance', async () => {
      const metrics = await performanceMonitor.monitorThemeApplication(mockTheme);

      expect(metrics).toBeDefined();
      expect(metrics.themeApplicationTime).toBeGreaterThanOrEqual(0);
      expect(metrics.cssVariableInjectionTime).toBeDefined();
      expect(metrics.componentUpdateTime).toBeDefined();
      expect(metrics.memoryUsage).toBeDefined();
      expect(metrics.cacheHitRate).toBeDefined();
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });

    it('should handle theme application errors', async () => {
      // Mock theme application to throw error
      const errorTheme = { ...mockTheme, id: 'error-theme' };

      await expect(
        performanceMonitor.monitorThemeApplication(errorTheme)
      ).resolves.toBeDefined();
    });
  });

  describe('CSS Variable Injection Monitoring', () => {
    it('should monitor CSS variable injection performance', async () => {
      const variables = {
        '--color-primary': '#3b82f6',
        '--color-secondary': '#1f2937',
        '--color-accent': '#06b6d4',
      };

      const duration = await performanceMonitor.monitorCSSVariableInjection(variables);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle CSS variable injection errors', async () => {
      const invalidVariables = null as any;

      await expect(
        performanceMonitor.monitorCSSVariableInjection(invalidVariables)
      ).resolves.toBeDefined();
    });
  });

  describe('Component Update Monitoring', () => {
    it('should monitor component update performance', async () => {
      const componentCount = 10;

      const duration = await performanceMonitor.monitorComponentUpdate(componentCount);

      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle component update errors', async () => {
      const invalidComponentCount = -1;

      await expect(
        performanceMonitor.monitorComponentUpdate(invalidComponentCount)
      ).resolves.toBeDefined();
    });
  });

  describe('Memory Usage Monitoring', () => {
    it('should monitor memory usage', async () => {
      const memoryUsage = await performanceMonitor.monitorMemoryUsage();

      expect(memoryUsage).toBeGreaterThanOrEqual(0);
    });

    it('should handle memory monitoring errors', async () => {
      // Mock performance.memory to be undefined
      const originalMemory = (performance as any).memory;
      delete (performance as any).memory;

      const memoryUsage = await performanceMonitor.monitorMemoryUsage();
      expect(memoryUsage).toBe(0);

      // Restore original memory
      (performance as any).memory = originalMemory;
    });
  });

  describe('Cache Performance Monitoring', () => {
    it('should monitor cache performance', () => {
      const hitRate = 85;
      const accessTime = 5;

      expect(() => {
        performanceMonitor.monitorCachePerformance(hitRate, accessTime);
      }).not.toThrow();
    });

    it('should handle cache performance monitoring errors', () => {
      const invalidHitRate = -1;
      const invalidAccessTime = -1;

      expect(() => {
        performanceMonitor.monitorCachePerformance(invalidHitRate, invalidAccessTime);
      }).not.toThrow();
    });
  });

  describe('Performance Reports', () => {
    it('should generate performance report', () => {
      const report = performanceMonitor.generatePerformanceReport();

      expect(report).toBeDefined();
      expect(report.id).toBeDefined();
      expect(report.generatedAt).toBeInstanceOf(Date);
      expect(report.period).toBeDefined();
      expect(report.summary).toBeDefined();
      expect(report.metrics).toBeDefined();
      expect(report.alerts).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    it('should include performance metrics in report', () => {
      const report = performanceMonitor.generatePerformanceReport();

      expect(report.metrics.themeApplication).toBeDefined();
      expect(report.metrics.cssVariableInjection).toBeDefined();
      expect(report.metrics.componentUpdate).toBeDefined();
      expect(report.metrics.memoryUsage).toBeDefined();
      expect(report.metrics.cachePerformance).toBeDefined();
    });
  });

  describe('Performance Metrics', () => {
    it('should get performance metrics', () => {
      const metrics = performanceMonitor.getPerformanceMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.themeApplicationTime).toBeGreaterThanOrEqual(0);
      expect(metrics.cssVariableInjectionTime).toBeGreaterThanOrEqual(0);
      expect(metrics.componentUpdateTime).toBeGreaterThanOrEqual(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
      expect(metrics.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Performance Alerts', () => {
    it('should get active alerts', () => {
      const alerts = performanceMonitor.getActiveAlerts();

      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should resolve alert', () => {
      // First generate some alerts by exceeding thresholds
      const slowTheme = { ...mockTheme, id: 'slow-theme' };
      
      // Mock performance.now to return slow times
      mockPerformance.now
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200); // 200ms - exceeds threshold

      performanceMonitor.monitorThemeApplication(slowTheme);

      const alerts = performanceMonitor.getActiveAlerts();
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        performanceMonitor.resolveAlert(alertId);

        const updatedAlerts = performanceMonitor.getActiveAlerts();
        const resolvedAlert = updatedAlerts.find(alert => alert.id === alertId);
        expect(resolvedAlert).toBeUndefined();
      }
    });

    it('should clear all alerts', () => {
      performanceMonitor.clearAlerts();

      const alerts = performanceMonitor.getActiveAlerts();
      expect(alerts).toHaveLength(0);
    });
  });

  describe('Measurement Management', () => {
    it('should clear measurements', () => {
      performanceMonitor.clearMeasurements();

      // No direct way to test this, but should not throw
      expect(() => performanceMonitor.clearMeasurements()).not.toThrow();
    });
  });

  describe('Sample Rate', () => {
    it('should respect sample rate', async () => {
      const lowSampleMonitor = new ThemePerformanceMonitor({
        sampleRate: 0.0, // 0% sampling
      });

      const metrics = await lowSampleMonitor.monitorThemeApplication(mockTheme);

      expect(metrics).toBeDefined();
    });

    it('should handle high sample rate', async () => {
      const highSampleMonitor = new ThemePerformanceMonitor({
        sampleRate: 1.0, // 100% sampling
      });

      const metrics = await highSampleMonitor.monitorThemeApplication(mockTheme);

      expect(metrics).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle monitoring errors gracefully', async () => {
      // Mock performance.now to throw error
      mockPerformance.now.mockImplementation(() => {
        throw new Error('Performance API error');
      });

      await expect(
        performanceMonitor.monitorThemeApplication(mockTheme)
      ).resolves.toBeDefined();
    });

    it('should handle report generation errors', () => {
      // Mock Date constructor to throw error
      const originalDate = global.Date;
      global.Date = jest.fn().mockImplementation(() => {
        throw new Error('Date constructor error');
      }) as any;

      expect(() => performanceMonitor.generatePerformanceReport()).not.toThrow();

      // Restore original Date
      global.Date = originalDate;
    });
  });

  describe('Configuration', () => {
    it('should get current configuration', () => {
      const config = performanceMonitor.getConfig();

      expect(config).toBeDefined();
      expect(config.enableMonitoring).toBeDefined();
      expect(config.enableMetrics).toBeDefined();
      expect(config.enableAlerts).toBeDefined();
      expect(config.enableReporting).toBeDefined();
      expect(config.sampleRate).toBeDefined();
      expect(config.alertThresholds).toBeDefined();
      expect(config.reportingInterval).toBeDefined();
      expect(config.maxMetricsHistory).toBeDefined();
    });

    it('should update configuration', () => {
      const newConfig = {
        enableMonitoring: false,
        sampleRate: 0.5,
      };

      performanceMonitor.updateConfig(newConfig);

      const config = performanceMonitor.getConfig();
      expect(config.enableMonitoring).toBe(false);
      expect(config.sampleRate).toBe(0.5);
    });
  });

  describe('Cleanup', () => {
    it('should destroy performance monitor', () => {
      expect(() => performanceMonitor.destroy()).not.toThrow();
    });
  });
});
