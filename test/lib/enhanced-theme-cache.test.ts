// Documentation: /docs/comprehensive-theming-system/enhanced-theme-cache-tests.md

import { EnhancedThemeCacheManager } from '@/lib/enhanced-theme-cache';
import type { UnifiedTheme } from '@/types/unified-theme';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('EnhancedThemeCacheManager', () => {
  let cacheManager: EnhancedThemeCacheManager;
  let mockTheme: UnifiedTheme;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Create mock theme
    mockTheme = {
      id: 'test-theme',
      name: 'Test Theme',
      description: 'A test theme for cache testing',
      version: '1.0.0',
      metadata: {
        author: 'Test Author',
        license: 'MIT',
        tags: ['test', 'cache'],
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

    // Create cache manager instance
    cacheManager = new EnhancedThemeCacheManager({
      enablePersistence: false,
      enableCompression: false,
      enableEncryption: false,
      enableMetrics: false,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    it('should create an EnhancedThemeCacheManager instance', () => {
      expect(cacheManager).toBeInstanceOf(EnhancedThemeCacheManager);
    });

    it('should initialize with default configuration', () => {
      const defaultManager = new EnhancedThemeCacheManager();
      expect(defaultManager).toBeInstanceOf(EnhancedThemeCacheManager);
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        maxSize: 50,
        ttl: 300000,
        enablePersistence: true,
        enableCompression: true,
        enableEncryption: true,
        enableMetrics: true,
      };

      const customManager = new EnhancedThemeCacheManager(customConfig);
      expect(customManager).toBeInstanceOf(EnhancedThemeCacheManager);
    });

    it('should be a singleton', () => {
      const instance1 = EnhancedThemeCacheManager.getInstance();
      const instance2 = EnhancedThemeCacheManager.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('Cache Operations', () => {
    it('should set cache entry', async () => {
      await cacheManager.set('test-key', mockTheme);

      const cached = await cacheManager.get('test-key');
      expect(cached).toEqual(mockTheme);
    });

    it('should get cache entry', async () => {
      await cacheManager.set('test-key', mockTheme);

      const cached = await cacheManager.get('test-key');
      expect(cached).toEqual(mockTheme);
    });

    it('should return null for non-existent key', async () => {
      const cached = await cacheManager.get('non-existent-key');
      expect(cached).toBeNull();
    });

    it('should check if cache has entry', async () => {
      await cacheManager.set('test-key', mockTheme);

      expect(cacheManager.has('test-key')).toBe(true);
      expect(cacheManager.has('non-existent-key')).toBe(false);
    });

    it('should delete cache entry', async () => {
      await cacheManager.set('test-key', mockTheme);
      expect(cacheManager.has('test-key')).toBe(true);

      const deleted = cacheManager.delete('test-key');
      expect(deleted).toBe(true);
      expect(cacheManager.has('test-key')).toBe(false);
    });

    it('should clear all cache entries', async () => {
      await cacheManager.set('key1', mockTheme);
      await cacheManager.set('key2', mockTheme);

      expect(cacheManager.getSize()).toBe(2);

      cacheManager.clear();

      expect(cacheManager.getSize()).toBe(0);
    });
  });

  describe('Theme Caching', () => {
    it('should cache theme with CSS variables and Tailwind classes', async () => {
      await cacheManager.cacheTheme(mockTheme);

      const cachedTheme = await cacheManager.getCachedTheme('test-theme');
      expect(cachedTheme.theme).toEqual(mockTheme);
      expect(cachedTheme.cssVariables).toBeDefined();
      expect(cachedTheme.tailwindClasses).toBeDefined();
    });

    it('should get cached theme with all related data', async () => {
      await cacheManager.cacheTheme(mockTheme);

      const cachedTheme = await cacheManager.getCachedTheme('test-theme');
      expect(cachedTheme.theme).toEqual(mockTheme);
      expect(cachedTheme.cssVariables).toBeDefined();
      expect(cachedTheme.tailwindClasses).toBeDefined();
      expect(cachedTheme.metrics).toBeDefined();
    });

    it('should return null for non-existent theme', async () => {
      const cachedTheme = await cacheManager.getCachedTheme('non-existent-theme');
      expect(cachedTheme.theme).toBeNull();
      expect(cachedTheme.cssVariables).toBeNull();
      expect(cachedTheme.tailwindClasses).toBeNull();
      expect(cachedTheme.metrics).toBeNull();
    });
  });

  describe('Cache Warming', () => {
    it('should warm cache with multiple themes', async () => {
      const themes = [mockTheme, { ...mockTheme, id: 'theme-2' }];

      await cacheManager.warmCache(themes);

      const cachedTheme1 = await cacheManager.getCachedTheme('test-theme');
      const cachedTheme2 = await cacheManager.getCachedTheme('theme-2');

      expect(cachedTheme1.theme).toEqual(mockTheme);
      expect(cachedTheme2.theme).toEqual({ ...mockTheme, id: 'theme-2' });
    });

    it('should preload themes based on usage patterns', async () => {
      const themeIds = ['theme-1', 'theme-2', 'theme-3'];

      await expect(cacheManager.preloadThemes(themeIds)).resolves.not.toThrow();
    });
  });

  describe('Cache Statistics', () => {
    it('should get cache statistics', async () => {
      await cacheManager.set('key1', mockTheme);
      await cacheManager.set('key2', mockTheme);
      await cacheManager.get('key1'); // Hit
      await cacheManager.get('key3'); // Miss

      const stats = cacheManager.getStats();
      expect(stats).toBeDefined();
      expect(stats.hitCount).toBe(1);
      expect(stats.missCount).toBe(1);
      expect(stats.hitRate).toBe(50);
      expect(stats.entryCount).toBe(2);
    });

    it('should get cache size', async () => {
      expect(cacheManager.getSize()).toBe(0);

      await cacheManager.set('key1', mockTheme);
      expect(cacheManager.getSize()).toBe(1);

      await cacheManager.set('key2', mockTheme);
      expect(cacheManager.getSize()).toBe(2);
    });
  });

  describe('Cache Search', () => {
    it('should get cache entries by category', async () => {
      await cacheManager.set('theme-1', mockTheme, { category: 'corporate' });
      await cacheManager.set('theme-2', mockTheme, { category: 'creative' });

      const corporateEntries = cacheManager.getByCategory('corporate');
      const creativeEntries = cacheManager.getByCategory('creative');

      expect(corporateEntries).toHaveLength(1);
      expect(creativeEntries).toHaveLength(1);
    });

    it('should search cache entries', async () => {
      await cacheManager.set('theme-1', mockTheme, { 
        themeName: 'Corporate Blue Theme',
        tags: ['corporate', 'blue']
      });
      await cacheManager.set('theme-2', mockTheme, { 
        themeName: 'Creative Red Theme',
        tags: ['creative', 'red']
      });

      const corporateResults = cacheManager.search('corporate');
      const blueResults = cacheManager.search('blue');

      expect(corporateResults).toHaveLength(1);
      expect(blueResults).toHaveLength(1);
    });
  });

  describe('Cache Eviction', () => {
    it('should evict oldest entries when cache is full', async () => {
      const smallCacheManager = new EnhancedThemeCacheManager({
        maxSize: 2,
        ttl: 60000,
      });

      await smallCacheManager.set('key1', mockTheme);
      await smallCacheManager.set('key2', mockTheme);
      await smallCacheManager.set('key3', mockTheme); // Should evict key1

      expect(smallCacheManager.has('key1')).toBe(false);
      expect(smallCacheManager.has('key2')).toBe(true);
      expect(smallCacheManager.has('key3')).toBe(true);
    });
  });

  describe('Cache Expiration', () => {
    it('should expire entries after TTL', async () => {
      const shortTTLManager = new EnhancedThemeCacheManager({
        ttl: 100, // 100ms
      });

      await shortTTLManager.set('key1', mockTheme);

      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 150));

      const cached = await shortTTLManager.get('key1');
      expect(cached).toBeNull();
    });
  });

  describe('Persistence', () => {
    it('should save to localStorage when persistence is enabled', async () => {
      const persistentManager = new EnhancedThemeCacheManager({
        enablePersistence: true,
        persistenceKey: 'test-cache',
      });

      await persistentManager.set('key1', mockTheme);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-cache',
        expect.any(String)
      );
    });

    it('should load from localStorage when persistence is enabled', () => {
      const storedData = {
        cache: [['key1', { value: mockTheme, timestamp: Date.now() }]],
        statistics: { hitCount: 0, missCount: 0 },
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedData));

      const persistentManager = new EnhancedThemeCacheManager({
        enablePersistence: true,
        persistenceKey: 'test-cache',
      });

      expect(localStorageMock.getItem).toHaveBeenCalledWith('test-cache');
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage is full');
      });

      const persistentManager = new EnhancedThemeCacheManager({
        enablePersistence: true,
        persistenceKey: 'test-cache',
      });

      // Should not throw error
      await expect(persistentManager.set('key1', mockTheme)).resolves.not.toThrow();
    });
  });

  describe('Compression', () => {
    it('should compress large entries when compression is enabled', async () => {
      const compressionManager = new EnhancedThemeCacheManager({
        enableCompression: true,
        compressionThreshold: 100, // 100 bytes
      });

      const largeTheme = { ...mockTheme, largeData: 'x'.repeat(200) };

      await compressionManager.set('large-theme', largeTheme);

      const cached = await compressionManager.get('large-theme');
      expect(cached).toEqual(largeTheme);
    });
  });

  describe('Encryption', () => {
    it('should encrypt entries when encryption is enabled', async () => {
      const encryptionManager = new EnhancedThemeCacheManager({
        enableEncryption: true,
      });

      await encryptionManager.set('encrypted-theme', mockTheme);

      const cached = await encryptionManager.get('encrypted-theme');
      expect(cached).toEqual(mockTheme);
    });
  });

  describe('Performance Metrics', () => {
    it('should track performance metrics when enabled', async () => {
      const metricsManager = new EnhancedThemeCacheManager({
        enableMetrics: true,
      });

      await metricsManager.set('key1', mockTheme);
      await metricsManager.get('key1');

      const stats = metricsManager.getStats();
      expect(stats.hitCount).toBe(1);
      expect(stats.missCount).toBe(0);
      expect(stats.averageAccessTime).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle cache operation errors gracefully', async () => {
      // Mock JSON.stringify to throw error
      const originalStringify = JSON.stringify;
      JSON.stringify = jest.fn().mockImplementation(() => {
        throw new Error('Serialization failed');
      });

      await expect(cacheManager.set('key1', mockTheme)).resolves.not.toThrow();

      // Restore original function
      JSON.stringify = originalStringify;
    });

    it('should handle get operation errors gracefully', async () => {
      await cacheManager.set('key1', mockTheme);

      // Mock JSON.parse to throw error
      const originalParse = JSON.parse;
      JSON.parse = jest.fn().mockImplementation(() => {
        throw new Error('Parsing failed');
      });

      const result = await cacheManager.get('key1');
      expect(result).toBeNull();

      // Restore original function
      JSON.parse = originalParse;
    });
  });

  describe('Cleanup', () => {
    it('should destroy cache manager', () => {
      expect(() => cacheManager.destroy()).not.toThrow();
    });
  });
});
