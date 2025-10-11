// Documentation: /docs/branding-preset-themes/theme-performance-tests.md

import {
  ThemePerformanceMonitor,
  ThemeCache,
  memoizeThemeFunction,
  optimizedValidateThemePreset,
  optimizedCalculateContrast,
} from '../theme-performance';
import type { ThemePreset } from '@/types/theme-presets';

describe('Theme Performance', () => {
  let performanceMonitor: ThemePerformanceMonitor;
  let cache: ThemeCache;

  beforeEach(() => {
    performanceMonitor = ThemePerformanceMonitor.getInstance();
    cache = ThemeCache.getInstance();
    performanceMonitor.clearMetrics();
    cache.clear();
  });

  describe('ThemePerformanceMonitor', () => {
    it('should track performance metrics', () => {
      const stopTiming = performanceMonitor.startTiming('test-operation');
      
      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 10) {
        // Wait 10ms
      }
      
      stopTiming();

      const stats = performanceMonitor.getStats('test-operation');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
      expect(stats?.average).toBeGreaterThan(0);
    });

    it('should record multiple metrics', () => {
      performanceMonitor.recordMetric('test-operation', 100);
      performanceMonitor.recordMetric('test-operation', 200);
      performanceMonitor.recordMetric('test-operation', 300);

      const stats = performanceMonitor.getStats('test-operation');
      expect(stats?.count).toBe(3);
      expect(stats?.average).toBe(200);
      expect(stats?.min).toBe(100);
      expect(stats?.max).toBe(300);
    });

    it('should calculate percentiles', () => {
      // Record 10 metrics
      for (let i = 1; i <= 10; i++) {
        performanceMonitor.recordMetric('test-operation', i * 10);
      }

      const stats = performanceMonitor.getStats('test-operation');
      expect(stats?.p95).toBe(100); // 95th percentile of 10, 20, ..., 100
    });

    it('should get all statistics', () => {
      performanceMonitor.recordMetric('operation-1', 100);
      performanceMonitor.recordMetric('operation-2', 200);

      const allStats = performanceMonitor.getAllStats();
      expect(allStats).toHaveProperty('operation-1');
      expect(allStats).toHaveProperty('operation-2');
    });

    it('should clear metrics', () => {
      performanceMonitor.recordMetric('test-operation', 100);
      expect(performanceMonitor.getStats('test-operation')).toBeDefined();

      performanceMonitor.clearMetrics();
      expect(performanceMonitor.getStats('test-operation')).toBeNull();
    });
  });

  describe('ThemeCache', () => {
    it('should store and retrieve values', () => {
      cache.set('test-key', 'test-value');
      expect(cache.get('test-key')).toBe('test-value');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('non-existent')).toBeNull();
    });

    it('should handle cache size limits', () => {
      // Set max size to 2 for testing
      const testCache = new ThemeCache({ maxSize: 2 });
      
      testCache.set('key-1', 'value-1');
      testCache.set('key-2', 'value-2');
      testCache.set('key-3', 'value-3'); // This should evict key-1

      expect(testCache.get('key-1')).toBeNull();
      expect(testCache.get('key-2')).toBe('value-2');
      expect(testCache.get('key-3')).toBe('value-3');
    });

    it('should handle TTL expiration', (done) => {
      const testCache = new ThemeCache({ ttl: 100 }); // 100ms TTL
      
      testCache.set('test-key', 'test-value');
      expect(testCache.get('test-key')).toBe('test-value');

      // Wait for TTL to expire
      setTimeout(() => {
        expect(testCache.get('test-key')).toBeNull();
        done();
      }, 150);
    });

    it('should delete entries', () => {
      cache.set('test-key', 'test-value');
      expect(cache.get('test-key')).toBe('test-value');

      cache.delete('test-key');
      expect(cache.get('test-key')).toBeNull();
    });

    it('should clear all entries', () => {
      cache.set('key-1', 'value-1');
      cache.set('key-2', 'value-2');

      cache.clear();
      expect(cache.get('key-1')).toBeNull();
      expect(cache.get('key-2')).toBeNull();
    });

    it('should provide cache statistics', () => {
      cache.set('test-key', 'test-value');
      const stats = cache.getStats();

      expect(stats.size).toBe(1);
      expect(stats.maxSize).toBe(50); // Default max size
      expect(stats.ttl).toBe(5 * 60 * 1000); // Default TTL
    });
  });

  describe('memoizeThemeFunction', () => {
    it('should memoize function results', () => {
      let callCount = 0;
      const memoizedFn = memoizeThemeFunction((x: number) => {
        callCount++;
        return x * 2;
      });

      expect(memoizedFn(5)).toBe(10);
      expect(memoizedFn(5)).toBe(10); // Should use cache
      expect(callCount).toBe(1);
    });

    it('should handle different arguments', () => {
      let callCount = 0;
      const memoizedFn = memoizeThemeFunction((x: number) => {
        callCount++;
        return x * 2;
      });

      expect(memoizedFn(5)).toBe(10);
      expect(memoizedFn(10)).toBe(20); // Different argument
      expect(callCount).toBe(2);
    });

    it('should use custom key generator', () => {
      let callCount = 0;
      const memoizedFn = memoizeThemeFunction(
        (x: number) => {
          callCount++;
          return x * 2;
        },
        (x) => `key-${x}`
      );

      expect(memoizedFn(5)).toBe(10);
      expect(memoizedFn(5)).toBe(10); // Should use cache
      expect(callCount).toBe(1);
    });
  });

  describe('optimizedValidateThemePreset', () => {
    const validPreset: ThemePreset = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'Test description',
      category: 'corporate',
      icon: 'test-icon',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#000000',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
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
      },
      tags: ['test'],
      accessibility: {
        contrastRatio: 4.5,
        colorBlindnessFriendly: true,
        largeTextCompliant: true,
      },
    };

    it('should validate theme preset', () => {
      const result = optimizedValidateThemePreset(validPreset);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should memoize validation results', () => {
      const result1 = optimizedValidateThemePreset(validPreset);
      const result2 = optimizedValidateThemePreset(validPreset);
      
      expect(result1).toBe(result2); // Same object reference due to memoization
    });

    it('should handle invalid preset', () => {
      const invalidPreset = { ...validPreset, id: '' };
      const result = optimizedValidateThemePreset(invalidPreset);
      
      expect(result.isValid).toBe(false);
    });
  });

  describe('optimizedCalculateContrast', () => {
    it('should calculate contrast ratio', () => {
      const ratio = optimizedCalculateContrast('#000000', '#ffffff');
      
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(25); // Reasonable upper bound
    });

    it('should memoize contrast calculations', () => {
      const ratio1 = optimizedCalculateContrast('#000000', '#ffffff');
      const ratio2 = optimizedCalculateContrast('#000000', '#ffffff');
      
      expect(ratio1).toBe(ratio2);
    });

    it('should handle different color pairs', () => {
      const ratio1 = optimizedCalculateContrast('#000000', '#ffffff');
      const ratio2 = optimizedCalculateContrast('#ff0000', '#00ff00');
      
      expect(ratio1).not.toBe(ratio2);
    });

    it('should handle edge cases', () => {
      // Same color should have ratio of 1
      const ratio = optimizedCalculateContrast('#000000', '#000000');
      expect(ratio).toBe(1);
    });
  });

  describe('Performance Integration', () => {
    it('should track performance across operations', () => {
      const stopTiming1 = performanceMonitor.startTiming('operation-1');
      const stopTiming2 = performanceMonitor.startTiming('operation-2');
      
      // Simulate work
      const start = Date.now();
      while (Date.now() - start < 5) {
        // Wait 5ms
      }
      
      stopTiming1();
      stopTiming2();

      const stats1 = performanceMonitor.getStats('operation-1');
      const stats2 = performanceMonitor.getStats('operation-2');
      
      expect(stats1).toBeDefined();
      expect(stats2).toBeDefined();
      expect(stats1?.count).toBe(1);
      expect(stats2?.count).toBe(1);
    });

    it('should work with cache operations', () => {
      const stopTiming = performanceMonitor.startTiming('cache-operation');
      
      cache.set('test-key', 'test-value');
      const value = cache.get('test-key');
      
      stopTiming();

      expect(value).toBe('test-value');
      
      const stats = performanceMonitor.getStats('cache-operation');
      expect(stats).toBeDefined();
      expect(stats?.count).toBe(1);
    });
  });
});
