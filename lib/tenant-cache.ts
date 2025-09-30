import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tenantId: string;
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  tenantScoped?: boolean;
}

export class TenantCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private defaultTTL: number;
  private currentTenantId: string | null = null;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTTL = options.ttl || 5 * 60 * 1000; // 5 minutes
  }

  // Set tenant context
  setTenant(tenantId: string) {
    this.currentTenantId = tenantId;
  }

  // Generate tenant-scoped cache key
  private getTenantKey(key: string): string {
    if (!this.currentTenantId) {
      throw new Error('No tenant context available for cache operations');
    }
    return `tenant:${this.currentTenantId}:${key}`;
  }

  // Set cache entry
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const tenantKey = this.getTenantKey(key);
    const ttl = options.ttl || this.defaultTTL;
    const timestamp = Date.now();

    // Check cache size and evict if necessary
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(tenantKey, {
      data,
      timestamp,
      ttl,
      tenantId: this.currentTenantId!,
    });
  }

  // Get cache entry
  get<T>(key: string): T | null {
    const tenantKey = this.getTenantKey(key);
    const entry = this.cache.get(tenantKey);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(tenantKey);
      return null;
    }

    // Validate tenant ownership
    if (entry.tenantId !== this.currentTenantId) {
      console.warn('Cache entry tenant mismatch, removing entry');
      this.cache.delete(tenantKey);
      return null;
    }

    return entry.data as T;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    const tenantKey = this.getTenantKey(key);
    const entry = this.cache.get(tenantKey);

    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(tenantKey);
      return false;
    }

    // Validate tenant ownership
    if (entry.tenantId !== this.currentTenantId) {
      this.cache.delete(tenantKey);
      return false;
    }

    return true;
  }

  // Delete cache entry
  delete(key: string): boolean {
    const tenantKey = this.getTenantKey(key);
    return this.cache.delete(tenantKey);
  }

  // Clear all cache entries for current tenant
  clear(): void {
    if (!this.currentTenantId) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tenantId === this.currentTenantId) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache entries
  clearAll(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): {
    size: number;
    tenantSize: number;
    hitRate: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    let tenantSize = 0;
    let oldestTimestamp = Infinity;
    let newestTimestamp = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tenantId === this.currentTenantId) {
        tenantSize++;
        oldestTimestamp = Math.min(oldestTimestamp, entry.timestamp);
        newestTimestamp = Math.max(newestTimestamp, entry.timestamp);
      }
    }

    return {
      size: this.cache.size,
      tenantSize,
      hitRate: 0, // Would need to track hits/misses
      oldestEntry: oldestTimestamp === Infinity ? null : oldestTimestamp,
      newestEntry: newestTimestamp === 0 ? null : newestTimestamp,
    };
  }

  // Evict oldest entry
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Clean expired entries
  cleanExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get all keys for current tenant
  getTenantKeys(): string[] {
    if (!this.currentTenantId) {
      return [];
    }

    const keys: string[] = [];
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tenantId === this.currentTenantId) {
        // Remove tenant prefix from key
        const cleanKey = key.replace(`tenant:${this.currentTenantId}:`, '');
        keys.push(cleanKey);
      }
    }

    return keys;
  }

  // Invalidate cache entries matching pattern
  invalidatePattern(pattern: string): void {
    if (!this.currentTenantId) {
      return;
    }

    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tenantId === this.currentTenantId) {
        const cleanKey = key.replace(`tenant:${this.currentTenantId}:`, '');
        if (regex.test(cleanKey)) {
          keysToDelete.push(key);
        }
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Warm cache with data
  warmCache<T>(entries: Array<{ key: string; data: T; ttl?: number }>): void {
    entries.forEach(({ key, data, ttl }) => {
      this.set(key, data, { ttl });
    });
  }

  // Export cache data for current tenant
  exportCache(): Record<string, any> {
    if (!this.currentTenantId) {
      return {};
    }

    const exported: Record<string, any> = {};
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tenantId === this.currentTenantId) {
        const cleanKey = key.replace(`tenant:${this.currentTenantId}:`, '');
        exported[cleanKey] = entry.data;
      }
    }

    return exported;
  }

  // Import cache data
  importCache(data: Record<string, any>, ttl?: number): void {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value, { ttl });
    });
  }
}

// Global cache instance
export const tenantCache = new TenantCache();

// React hook for using the cache
export function useTenantCache() {
  const { tenant } = useTenant();

  // Update cache tenant context
  useEffect(() => {
    if (tenant?.id) {
      tenantCache.setTenant(tenant.id);
    }
  }, [tenant?.id]);

  return {
    set: <T>(key: string, data: T, options?: CacheOptions) =>
      tenantCache.set(key, data, options),
    get: <T>(key: string) => tenantCache.get<T>(key),
    has: (key: string) => tenantCache.has(key),
    delete: (key: string) => tenantCache.delete(key),
    clear: () => tenantCache.clear(),
    clearAll: () => tenantCache.clearAll(),
    getStats: () => tenantCache.getStats(),
    cleanExpired: () => tenantCache.cleanExpired(),
    getTenantKeys: () => tenantCache.getTenantKeys(),
    invalidatePattern: (pattern: string) =>
      tenantCache.invalidatePattern(pattern),
    warmCache: <T>(entries: Array<{ key: string; data: T; ttl?: number }>) =>
      tenantCache.warmCache(entries),
    exportCache: () => tenantCache.exportCache(),
    importCache: (data: Record<string, any>, ttl?: number) =>
      tenantCache.importCache(data, ttl),
  };
}
