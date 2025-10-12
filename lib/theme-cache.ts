// Documentation: /docs/branding-preset-themes/theme-cache.md

import { useMemo, useCallback, useRef, useEffect } from 'react';
import type { ThemePreset, ThemeCustomization, ValidationResults } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

// Cache configuration
interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  enablePersistence: boolean;
  persistenceKey: string;
}

// Cache entry
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

// Theme cache implementation
export class ThemeCacheManager {
  private static instance: ThemeCacheManager;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private config: CacheConfig;
  private hitCount = 0;
  private missCount = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      ttl: 5 * 60 * 1000, // 5 minutes
      enablePersistence: true,
      persistenceKey: 'theme-cache',
      ...config,
    };

    // Load from localStorage if persistence is enabled
    if (this.config.enablePersistence) {
      this.loadFromStorage();
    }

    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  static getInstance(config?: Partial<CacheConfig>): ThemeCacheManager {
    if (!ThemeCacheManager.instance) {
      ThemeCacheManager.instance = new ThemeCacheManager(config);
    }
    return ThemeCacheManager.instance;
  }

  // Set cache entry
  set<T>(key: string, value: T): void {
    const now = Date.now();
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 0,
      lastAccessed: now,
    });

    // Persist to localStorage if enabled
    if (this.config.enablePersistence) {
      this.saveToStorage();
    }
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;
    this.hitCount++;

    return entry.value;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    const now = Date.now();
    
    // Check if entry has expired
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Delete cache entry
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    
    if (deleted && this.config.enablePersistence) {
      this.saveToStorage();
    }
    
    return deleted;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.hitCount = 0;
    this.missCount = 0;
    
    if (this.config.enablePersistence) {
      localStorage.removeItem(this.config.persistenceKey);
    }
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    ttl: number;
    hitRate: number;
    hitCount: number;
    missCount: number;
    totalRequests: number;
  } {
    const totalRequests = this.hitCount + this.missCount;
    const hitRate = totalRequests > 0 ? this.hitCount / totalRequests : 0;

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl,
      hitRate,
      hitCount: this.hitCount,
      missCount: this.missCount,
      totalRequests,
    };
  }

  // Get cache keys
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Get cache entries by pattern
  getByPattern(pattern: RegExp): Array<{ key: string; value: any; timestamp: number }> {
    const entries: Array<{ key: string; value: any; timestamp: number }> = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (pattern.test(key)) {
        entries.push({
          key,
          value: entry.value,
          timestamp: entry.timestamp,
        });
      }
    }
    
    return entries;
  }

  // Evict oldest entry
  private evictOldest(): void {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Cleanup expired entries
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0 && this.config.enablePersistence) {
      this.saveToStorage();
    }
  }

  // Save to localStorage
  private saveToStorage(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      const data = {
        cache: Array.from(this.cache.entries()),
        stats: {
          hitCount: this.hitCount,
          missCount: this.missCount,
        },
        timestamp: Date.now(),
      };
      
      localStorage.setItem(this.config.persistenceKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save theme cache to localStorage:', error);
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return;
      }
      
      const data = localStorage.getItem(this.config.persistenceKey);
      
      if (data) {
        const parsed = JSON.parse(data);
        
        // Restore cache entries
        if (parsed.cache && Array.isArray(parsed.cache)) {
          for (const [key, entry] of parsed.cache) {
            this.cache.set(key, entry);
          }
        }
        
        // Restore statistics
        if (parsed.stats) {
          this.hitCount = parsed.stats.hitCount || 0;
          this.missCount = parsed.stats.missCount || 0;
        }
      }
    } catch (error) {
      console.warn('Failed to load theme cache from localStorage:', error);
    }
  }
}

// Theme-specific cache operations
export class ThemeCacheOperations {
  private static instance: ThemeCacheOperations;
  private cache: ThemeCacheManager;

  constructor(cache?: ThemeCacheManager) {
    this.cache = cache || ThemeCacheManager.getInstance();
  }

  static getInstance(cache?: ThemeCacheManager): ThemeCacheOperations {
    if (!ThemeCacheOperations.instance) {
      ThemeCacheOperations.instance = new ThemeCacheOperations(cache);
    }
    return ThemeCacheOperations.instance;
  }

  // Cache theme preset
  cacheThemePreset(preset: ThemePreset): void {
    const key = `preset-${preset.id}`;
    this.cache.set(key, preset);
  }

  // Get cached theme preset
  getCachedThemePreset(presetId: string): ThemePreset | null {
    const key = `preset-${presetId}`;
    return this.cache.get(key);
  }

  // Cache theme validation results
  cacheValidationResults(presetId: string, results: ValidationResults): void {
    const key = `validation-${presetId}`;
    this.cache.set(key, results);
  }

  // Get cached validation results
  getCachedValidationResults(presetId: string): ValidationResults | null {
    const key = `validation-${presetId}`;
    return this.cache.get(key);
  }

  // Cache theme customizations
  cacheThemeCustomizations(presetId: string, customizations: ThemeCustomization): void {
    const key = `customizations-${presetId}`;
    this.cache.set(key, customizations);
  }

  // Get cached theme customizations
  getCachedThemeCustomizations(presetId: string): ThemeCustomization | null {
    const key = `customizations-${presetId}`;
    return this.cache.get(key);
  }

  // Cache contrast calculations
  cacheContrastCalculation(color1: string, color2: string, ratio: number): void {
    const key = `contrast-${color1}-${color2}`;
    this.cache.set(key, ratio);
  }

  // Get cached contrast calculation
  getCachedContrastCalculation(color1: string, color2: string): number | null {
    const key = `contrast-${color1}-${color2}`;
    return this.cache.get(key);
  }

  // Cache theme preview data
  cacheThemePreview(presetId: string, previewData: any): void {
    const key = `preview-${presetId}`;
    this.cache.set(key, previewData);
  }

  // Get cached theme preview
  getCachedThemePreview(presetId: string): any | null {
    const key = `preview-${presetId}`;
    return this.cache.get(key);
  }

  // Clear theme-related cache entries
  clearThemeCache(presetId?: string): void {
    if (presetId) {
      // Clear specific theme cache
      const patterns = [
        `preset-${presetId}`,
        `validation-${presetId}`,
        `customizations-${presetId}`,
        `preview-${presetId}`,
      ];
      
      patterns.forEach(pattern => {
        this.cache.delete(pattern);
      });
    } else {
      // Clear all theme cache
      const themeKeys = this.cache.getByPattern(/^(preset|validation|customizations|preview|contrast)-/);
      themeKeys.forEach(({ key }) => {
        this.cache.delete(key);
      });
    }
  }
}

// React hooks for theme caching
export function useThemeCache<T>(
  key: string,
  factory: () => T,
  dependencies: any[] = []
): T {
  const cache = ThemeCacheManager.getInstance();
  const cached = cache.get<T>(key);
  
  return useMemo(() => {
    if (cached !== null) {
      return cached;
    }
    
    const value = factory();
    cache.set(key, value);
    return value;
  }, dependencies);
}

export function useThemePresetCache(presetId: string): ThemePreset | null {
  const cache = ThemeCacheOperations.getInstance();
  
  return useMemo(() => {
    return cache.getCachedThemePreset(presetId);
  }, [presetId]);
}

export function useValidationCache(presetId: string): ValidationResults | null {
  const cache = ThemeCacheOperations.getInstance();
  
  return useMemo(() => {
    return cache.getCachedValidationResults(presetId);
  }, [presetId]);
}

export function useCustomizationsCache(presetId: string): ThemeCustomization | null {
  const cache = ThemeCacheOperations.getInstance();
  
  return useMemo(() => {
    return cache.getCachedThemeCustomizations(presetId);
  }, [presetId]);
}

export function useContrastCache(color1: string, color2: string): number | null {
  const cache = ThemeCacheOperations.getInstance();
  
  return useMemo(() => {
    return cache.getCachedContrastCalculation(color1, color2);
  }, [color1, color2]);
}

// Memoization utilities
export function memoizeThemeFunction<T extends any[], R>(
  fn: (...args: T) => R,
  keyGenerator?: (...args: T) => string
): (...args: T) => R {
  const cache = new Map<string, R>();

  return (...args: T): R => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    
    // Limit cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return result;
  };
}

// Optimized theme operations with caching
export const cachedValidateThemePreset = memoizeThemeFunction(
  (preset: ThemePreset) => {
    // Basic validation logic
    return {
      isValid: !!(preset.id && preset.colors && preset.typography),
      errors: [],
    };
  },
  (preset) => `validate-${preset.id}`
);

export const cachedCalculateContrast = memoizeThemeFunction(
  (color1: string, color2: string) => {
    // Simplified contrast calculation
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const l1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
    const l2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },
  (color1, color2) => `contrast-${color1}-${color2}`
);

// Cache invalidation strategies
export class CacheInvalidationStrategy {
  private static instance: CacheInvalidationStrategy;
  private cache: ThemeCacheManager;

  constructor(cache?: ThemeCacheManager) {
    this.cache = cache || ThemeCacheManager.getInstance();
  }

  static getInstance(cache?: ThemeCacheManager): CacheInvalidationStrategy {
    if (!CacheInvalidationStrategy.instance) {
      CacheInvalidationStrategy.instance = new CacheInvalidationStrategy(cache);
    }
    return CacheInvalidationStrategy.instance;
  }

  // Invalidate by pattern
  invalidateByPattern(pattern: RegExp): void {
    const keys = this.cache.getByPattern(pattern);
    keys.forEach(({ key }) => {
      this.cache.delete(key);
    });
  }

  // Invalidate by time
  invalidateByTime(olderThan: number): void {
    const now = Date.now();
    const keys = this.cache.getByPattern(/.*/);
    
    keys.forEach(({ key, timestamp }) => {
      if (now - timestamp > olderThan) {
        this.cache.delete(key);
      }
    });
  }

  // Invalidate by access count
  invalidateByAccessCount(lessThan: number): void {
    // This would require tracking access counts in the cache entries
    // Implementation depends on the specific cache structure
  }
}

// Export singleton instances
export const themeCacheManager = ThemeCacheManager.getInstance();
export const themeCacheOperations = ThemeCacheOperations.getInstance();
export const cacheInvalidationStrategy = CacheInvalidationStrategy.getInstance();
