// Documentation: /docs/comprehensive-theming-system/enhanced-theme-cache.md

import type { 
  UnifiedTheme, 
  ThemeCacheEntry, 
  EnhancedCSSVariables,
  PerformanceMetrics 
} from '@/types/unified-theme';

// Enhanced cache configuration
interface EnhancedCacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  enablePersistence: boolean;
  persistenceKey: string;
  enableCompression: boolean;
  enableEncryption: boolean;
  compressionThreshold: number; // Minimum size to compress (bytes)
  enableMetrics: boolean;
  cleanupInterval: number; // Cleanup interval in milliseconds
}

// Cache statistics
interface CacheStatistics {
  hitCount: number;
  missCount: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  averageAccessTime: number;
  lastCleanup: Date;
  compressionRatio: number;
}

// Cache entry with enhanced metadata
interface EnhancedCacheEntry<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed: boolean;
  encrypted: boolean;
  metadata: {
    themeId: string;
    themeName: string;
    category: string;
    version: string;
    tags: string[];
  };
}

/**
 * Enhanced Theme Cache Manager
 * 
 * Provides advanced caching capabilities for themes including:
 * - Compression and encryption
 * - Performance metrics
 * - Smart eviction policies
 * - Persistence with error handling
 * - Cache warming and preloading
 */
export class EnhancedThemeCacheManager {
  private static instance: EnhancedThemeCacheManager;
  private cache: Map<string, EnhancedCacheEntry<any>> = new Map();
  private config: EnhancedCacheConfig;
  private statistics: CacheStatistics;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor(config: Partial<EnhancedCacheConfig> = {}) {
    this.config = {
      maxSize: 200,
      ttl: 10 * 60 * 1000, // 10 minutes
      enablePersistence: true,
      persistenceKey: 'enhanced-theme-cache',
      enableCompression: true,
      enableEncryption: false, // Disabled by default for performance
      compressionThreshold: 1024, // 1KB
      enableMetrics: true,
      cleanupInterval: 2 * 60 * 1000, // 2 minutes
      ...config,
    };

    this.statistics = {
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
      averageAccessTime: 0,
      lastCleanup: new Date(),
      compressionRatio: 0,
    };

    this.initialize();
  }

  static getInstance(config?: Partial<EnhancedCacheConfig>): EnhancedThemeCacheManager {
    if (!EnhancedThemeCacheManager.instance) {
      EnhancedThemeCacheManager.instance = new EnhancedThemeCacheManager(config);
    }
    return EnhancedThemeCacheManager.instance;
  }

  /**
   * Initialize the cache manager
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load from localStorage if persistence is enabled
      if (this.config.enablePersistence) {
        await this.loadFromStorage();
      }

      // Start cleanup timer
      this.startCleanupTimer();

      this.isInitialized = true;
      console.log('Enhanced theme cache manager initialized');
    } catch (error) {
      console.error('Failed to initialize theme cache manager:', error);
    }
  }

  /**
   * Set cache entry with enhanced features
   */
  async set<T>(key: string, value: T, metadata?: Partial<EnhancedCacheEntry<T>['metadata']>): Promise<void> {
    const startTime = performance.now();

    try {
      // Calculate size
      const size = this.calculateSize(value);

      // Compress if enabled and size exceeds threshold
      let processedValue = value;
      let compressed = false;
      if (this.config.enableCompression && size > this.config.compressionThreshold) {
        processedValue = await this.compress(value);
        compressed = true;
      }

      // Encrypt if enabled
      let encrypted = false;
      if (this.config.enableEncryption) {
        processedValue = await this.encrypt(processedValue);
        encrypted = true;
      }

      // Remove oldest entries if cache is full
      if (this.cache.size >= this.config.maxSize) {
        this.evictOldest();
      }

      const now = Date.now();
      const entry: EnhancedCacheEntry<T> = {
        value: processedValue,
        timestamp: now,
        accessCount: 0,
        lastAccessed: now,
        size,
        compressed,
        encrypted,
        metadata: {
          themeId: key,
          themeName: metadata?.themeName || 'Unknown',
          category: metadata?.category || 'unknown',
          version: metadata?.version || '1.0.0',
          tags: metadata?.tags || [],
        },
      };

      this.cache.set(key, entry);
      this.updateStatistics();

      // Persist to localStorage if enabled
      if (this.config.enablePersistence) {
        await this.saveToStorage();
      }

      // Update metrics
      if (this.config.enableMetrics) {
        this.updateAccessTime(performance.now() - startTime);
      }
    } catch (error) {
      console.error('Failed to set cache entry:', error);
    }
  }

  /**
   * Get cache entry with enhanced features
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();

    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.statistics.missCount++;
        this.updateHitRate();
        return null;
      }

      const now = Date.now();
      
      // Check if entry has expired
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
        this.statistics.missCount++;
        this.updateHitRate();
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = now;
      this.statistics.hitCount++;
      this.updateHitRate();

      // Decrypt if encrypted
      let value = entry.value;
      if (entry.encrypted) {
        value = await this.decrypt(value);
      }

      // Decompress if compressed
      if (entry.compressed) {
        value = await this.decompress(value);
      }

      // Update metrics
      if (this.config.enableMetrics) {
        this.updateAccessTime(performance.now() - startTime);
      }

      return value as T;
    } catch (error) {
      console.error('Failed to get cache entry:', error);
      this.statistics.missCount++;
      this.updateHitRate();
      return null;
    }
  }

  /**
   * Cache theme with CSS variables and Tailwind classes
   */
  async cacheTheme(theme: UnifiedTheme): Promise<void> {
    const themeId = `theme-${theme.id}`;
    
    // Cache the theme
    await this.set(themeId, theme, {
      themeName: theme.name,
      category: theme.metadata.category,
      version: theme.metadata.version,
      tags: theme.metadata.tags,
    });

    // Cache CSS variables
    const cssVariables = this.generateCSSVariables(theme);
    await this.set(`${themeId}-css`, cssVariables, {
      themeName: `${theme.name} CSS Variables`,
      category: 'css',
      version: '1.0.0',
      tags: ['css', 'variables'],
    });

    // Cache Tailwind classes
    const tailwindClasses = this.generateTailwindClasses(theme);
    await this.set(`${themeId}-tailwind`, tailwindClasses, {
      themeName: `${theme.name} Tailwind Classes`,
      category: 'tailwind',
      version: '1.0.0',
      tags: ['tailwind', 'classes'],
    });

    // Cache performance metrics
    if (this.config.enableMetrics) {
      const metrics = this.generatePerformanceMetrics(theme);
      await this.set(`${themeId}-metrics`, metrics, {
        themeName: `${theme.name} Metrics`,
        category: 'metrics',
        version: '1.0.0',
        tags: ['metrics', 'performance'],
      });
    }
  }

  /**
   * Get cached theme with all related data
   */
  async getCachedTheme(themeId: string): Promise<{
    theme: UnifiedTheme | null;
    cssVariables: EnhancedCSSVariables | null;
    tailwindClasses: string[] | null;
    metrics: PerformanceMetrics | null;
  }> {
    const baseKey = `theme-${themeId}`;
    
    const [theme, cssVariables, tailwindClasses, metrics] = await Promise.all([
      this.get<UnifiedTheme>(baseKey),
      this.get<EnhancedCSSVariables>(`${baseKey}-css`),
      this.get<string[]>(`${baseKey}-tailwind`),
      this.config.enableMetrics ? this.get<PerformanceMetrics>(`${baseKey}-metrics`) : null,
    ]);

    return {
      theme,
      cssVariables,
      tailwindClasses,
      metrics,
    };
  }

  /**
   * Warm cache with popular themes
   */
  async warmCache(themes: UnifiedTheme[]): Promise<void> {
    console.log('Warming theme cache with', themes.length, 'themes');
    
    const warmPromises = themes.map(theme => this.cacheTheme(theme));
    await Promise.all(warmPromises);
    
    console.log('Cache warming completed');
  }

  /**
   * Preload themes based on usage patterns
   */
  async preloadThemes(themeIds: string[]): Promise<void> {
    console.log('Preloading themes:', themeIds);
    
    // This would typically fetch themes from a server
    // For now, we'll just log the preload request
    console.log('Preload request for themes:', themeIds);
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.statistics = {
      hitCount: 0,
      missCount: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
      averageAccessTime: 0,
      lastCleanup: new Date(),
      compressionRatio: 0,
    };

    if (this.config.enablePersistence) {
      this.clearStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStatistics {
    return { ...this.statistics };
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }

  /**
   * Check if cache has entry
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    return now - entry.timestamp <= this.config.ttl;
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.updateStatistics();
    }
    return deleted;
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache entries by category
   */
  getByCategory(category: string): EnhancedCacheEntry<any>[] {
    return Array.from(this.cache.values()).filter(
      entry => entry.metadata.category === category
    );
  }

  /**
   * Search cache entries
   */
  search(query: string): EnhancedCacheEntry<any>[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.cache.values()).filter(
      entry => 
        entry.metadata.themeName.toLowerCase().includes(lowercaseQuery) ||
        entry.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Private methods

  /**
   * Calculate size of an object
   */
  private calculateSize(value: any): number {
    try {
      return JSON.stringify(value).length * 2; // Rough estimate in bytes
    } catch {
      return 0;
    }
  }

  /**
   * Compress data
   */
  private async compress(data: any): Promise<any> {
    // In a real implementation, you would use a compression library
    // For now, we'll just return the data as-is
    return data;
  }

  /**
   * Decompress data
   */
  private async decompress(data: any): Promise<any> {
    // In a real implementation, you would use a decompression library
    // For now, we'll just return the data as-is
    return data;
  }

  /**
   * Encrypt data
   */
  private async encrypt(data: any): Promise<any> {
    // In a real implementation, you would use an encryption library
    // For now, we'll just return the data as-is
    return data;
  }

  /**
   * Decrypt data
   */
  private async decrypt(data: any): Promise<any> {
    // In a real implementation, you would use a decryption library
    // For now, we'll just return the data as-is
    return data;
  }

  /**
   * Generate CSS variables from theme
   */
  private generateCSSVariables(theme: UnifiedTheme): EnhancedCSSVariables {
    return {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        accent: theme.colors.accent,
        background: theme.colors.background,
        surface: theme.colors.surface,
        text: theme.colors.text,
        textSecondary: theme.colors.textSecondary || theme.colors.text,
        border: theme.colors.border || '#e2e8f0',
        error: theme.colors.error,
        warning: theme.colors.warning,
        success: theme.colors.success,
        info: theme.colors.info || theme.colors.primary,
      },
      typography: {
        fontFamily: theme.typography.fontFamily,
        headingFont: theme.typography.headingFont || theme.typography.fontFamily,
        fontSize: theme.typography.fontSizes,
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
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      shadows: theme.shadows,
      animations: theme.animations.duration,
      transitions: theme.transitions.duration,
      effects: theme.effects.blur,
    };
  }

  /**
   * Generate Tailwind classes from theme
   */
  private generateTailwindClasses(theme: UnifiedTheme): string[] {
    const classes: string[] = [];

    // Color classes
    Object.entries(theme.colors).forEach(([key, value]) => {
      classes.push(`text-${key}`);
      classes.push(`bg-${key}`);
      classes.push(`border-${key}`);
    });

    // Typography classes
    Object.keys(theme.typography.fontSizes).forEach(key => {
      classes.push(`text-${key}`);
    });

    // Spacing classes
    Object.keys(theme.spacing).forEach(key => {
      classes.push(`p-${key}`);
      classes.push(`m-${key}`);
    });

    return classes;
  }

  /**
   * Generate performance metrics for theme
   */
  private generatePerformanceMetrics(theme: UnifiedTheme): PerformanceMetrics {
    return {
      themeApplicationTime: 0,
      cssVariableInjectionTime: 0,
      componentUpdateTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      timestamp: new Date(),
    };
  }

  /**
   * Evict oldest cache entry
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
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

  /**
   * Update cache statistics
   */
  private updateStatistics(): void {
    this.statistics.entryCount = this.cache.size;
    this.statistics.totalSize = Array.from(this.cache.values()).reduce(
      (sum, entry) => sum + entry.size,
      0
    );
  }

  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    const total = this.statistics.hitCount + this.statistics.missCount;
    this.statistics.hitRate = total > 0 ? (this.statistics.hitCount / total) * 100 : 0;
  }

  /**
   * Update average access time
   */
  private updateAccessTime(accessTime: number): void {
    const totalAccesses = this.statistics.hitCount + this.statistics.missCount;
    this.statistics.averageAccessTime = 
      (this.statistics.averageAccessTime * (totalAccesses - 1) + accessTime) / totalAccesses;
  }

  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => this.cache.delete(key));
    this.statistics.lastCleanup = new Date();
    this.updateStatistics();

    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
    }
  }

  /**
   * Load from localStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      const stored = localStorage.getItem(this.config.persistenceKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data.cache || []);
        this.statistics = data.statistics || this.statistics;
        console.log('Loaded cache from localStorage');
      }
    } catch (error) {
      console.error('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Save to localStorage
   */
  private async saveToStorage(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;

      const data = {
        cache: Array.from(this.cache.entries()),
        statistics: this.statistics,
        timestamp: Date.now(),
      };

      localStorage.setItem(this.config.persistenceKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Clear localStorage
   */
  private clearStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.config.persistenceKey);
      }
    } catch (error) {
      console.error('Failed to clear cache from localStorage:', error);
    }
  }

  /**
   * Destroy cache manager
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }

    this.clear();
    this.isInitialized = false;
  }
}

// Export singleton instance
export const enhancedThemeCacheManager = new EnhancedThemeCacheManager();
