// Documentation: /docs/branding-preset-themes/theme-performance.md

import { useMemo, useCallback, useRef, useEffect } from 'react';
import type { ThemePreset, ThemeCustomization, ValidationResults } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

// Performance monitoring
export class ThemePerformanceMonitor {
  private static instance: ThemePerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private maxMetrics = 100;

  static getInstance(): ThemePerformanceMonitor {
    if (!ThemePerformanceMonitor.instance) {
      ThemePerformanceMonitor.instance = new ThemePerformanceMonitor();
    }
    return ThemePerformanceMonitor.instance;
  }

  // Start timing an operation
  startTiming(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(operation, duration);
    };
  }

  // Record a performance metric
  recordMetric(operation: string, value: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const operationMetrics = this.metrics.get(operation)!;
    operationMetrics.push(value);
    
    // Keep only recent metrics
    if (operationMetrics.length > this.maxMetrics) {
      operationMetrics.shift();
    }
  }

  // Get performance statistics
  getStats(operation: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const metrics = this.metrics.get(operation);
    if (!metrics || metrics.length === 0) {
      return null;
    }

    const sorted = [...metrics].sort((a, b) => a - b);
    const count = sorted.length;
    const average = sorted.reduce((sum, val) => sum + val, 0) / count;
    const min = sorted[0];
    const max = sorted[count - 1];
    const p95Index = Math.floor(count * 0.95);
    const p95 = sorted[p95Index];

    return { count, average, min, max, p95 };
  }

  // Get all performance statistics
  getAllStats(): Record<string, ReturnType<typeof this.getStats>> {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {};
    
    for (const operation of this.metrics.keys()) {
      stats[operation] = this.getStats(operation);
    }
    
    return stats;
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Theme caching utilities
export class ThemeCache {
  private static instance: ThemeCache;
  private cache: Map<string, any> = new Map();
  private maxSize = 50;
  private ttl = 5 * 60 * 1000; // 5 minutes
  private timestamps: Map<string, number> = new Map();

  static getInstance(): ThemeCache {
    if (!ThemeCache.instance) {
      ThemeCache.instance = new ThemeCache();
    }
    return ThemeCache.instance;
  }

  // Set cache entry
  set(key: string, value: any): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.delete(oldestKey);
    }

    this.cache.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  // Get cache entry
  get(key: string): any | null {
    const timestamp = this.timestamps.get(key);
    if (!timestamp) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - timestamp > this.ttl) {
      this.delete(key);
      return null;
    }

    return this.cache.get(key) || null;
  }

  // Delete cache entry
  delete(key: string): void {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.timestamps.clear();
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    ttl: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
      hitRate: 0, // TODO: Implement hit rate tracking
    };
  }
}

// Memoization utilities
export function memoizeThemeOperation<T extends any[], R>(
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

// Optimized theme validation
export const optimizedValidateThemePreset = memoizeThemeOperation(
  (preset: ThemePreset) => {
    const monitor = ThemePerformanceMonitor.getInstance();
    const stopTiming = monitor.startTiming('validateThemePreset');
    
    try {
      // Basic validation logic
      const isValid = !!(
        preset.id &&
        preset.colors &&
        preset.typography &&
        preset.accessibility
      );
      
      return { isValid, errors: [] };
    } finally {
      stopTiming();
    }
  },
  (preset) => `validate-${preset.id}`
);

// Optimized contrast calculation
export const optimizedCalculateContrast = memoizeThemeOperation(
  (color1: string, color2: string) => {
    const monitor = ThemePerformanceMonitor.getInstance();
    const stopTiming = monitor.startTiming('calculateContrast');
    
    try {
      // Simplified contrast calculation
      // In a real implementation, this would use proper color space conversion
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
    } finally {
      stopTiming();
    }
  },
  (color1, color2) => `contrast-${color1}-${color2}`
);

// React hooks for performance optimization
export function useOptimizedThemeValidation(theme: ThemePreset) {
  return useMemo(() => {
    return optimizedValidateThemePreset(theme);
  }, [theme.id, theme.colors, theme.typography]);
}

export function useOptimizedContrastCalculation(color1: string, color2: string) {
  return useMemo(() => {
    return optimizedCalculateContrast(color1, color2);
  }, [color1, color2]);
}

export function useThemeCache<T>(key: string, factory: () => T): T {
  const cache = ThemeCache.getInstance();
  const cached = cache.get(key);
  
  if (cached !== null) {
    return cached;
  }
  
  const value = factory();
  cache.set(key, value);
  return value;
}

// Debounced theme operations
export function useDebouncedThemeOperation<T>(
  operation: (value: T) => void,
  delay: number = 300
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((value: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      operation(value);
    }, delay);
  }, [operation, delay]);
}

// Throttled theme operations
export function useThrottledThemeOperation<T>(
  operation: (value: T) => void,
  delay: number = 100
) {
  const lastExecutedRef = useRef<number>(0);
  
  return useCallback((value: T) => {
    const now = Date.now();
    
    if (now - lastExecutedRef.current >= delay) {
      operation(value);
      lastExecutedRef.current = now;
    }
  }, [operation, delay]);
}

// Virtual scrolling for large theme lists
export function useVirtualizedThemeList(
  themes: ThemePreset[],
  itemHeight: number = 200,
  containerHeight: number = 600
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    themes.length
  );
  
  const visibleThemes = themes.slice(visibleStart, visibleEnd);
  const totalHeight = themes.length * itemHeight;
  const offsetY = visibleStart * itemHeight;
  
  return {
    visibleThemes,
    totalHeight,
    offsetY,
    setScrollTop,
  };
}

// Lazy loading for theme components
export function useLazyThemeComponent<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType<T>
) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    importFn()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [importFn]);
  
  if (loading) {
    return { Component: fallback || null, loading: true, error: null };
  }
  
  if (error) {
    return { Component: fallback || null, loading: false, error };
  }
  
  return { Component, loading: false, error: null };
}

// Performance optimization for theme rendering
export function useOptimizedThemeRendering(
  theme: ThemePreset,
  customizations?: ThemeCustomization
) {
  const monitor = ThemePerformanceMonitor.getInstance();
  
  const optimizedTheme = useMemo(() => {
    const stopTiming = monitor.startTiming('optimizeThemeRendering');
    
    try {
      if (!customizations) {
        return theme;
      }
      
      // Apply customizations efficiently
      const updatedTheme = {
        ...theme,
        colors: {
          ...theme.colors,
          ...customizations.colors,
        },
        typography: {
          ...theme.typography,
          ...customizations.typography,
        },
      };
      
      return updatedTheme;
    } finally {
      stopTiming();
    }
  }, [theme, customizations]);
  
  const validationResults = useOptimizedThemeValidation(optimizedTheme);
  
  return {
    theme: optimizedTheme,
    validationResults,
  };
}

// Batch theme operations
export function useBatchedThemeOperations() {
  const [operations, setOperations] = useState<Array<() => void>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const addOperation = useCallback((operation: () => void) => {
    setOperations(prev => [...prev, operation]);
  }, []);
  
  const processBatch = useCallback(async () => {
    if (isProcessing || operations.length === 0) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process operations in batches
      const batchSize = 10;
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);
        await Promise.all(batch.map(op => op()));
        
        // Small delay between batches to prevent blocking
        if (i + batchSize < operations.length) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    } finally {
      setOperations([]);
      setIsProcessing(false);
    }
  }, [operations, isProcessing]);
  
  useEffect(() => {
    if (operations.length > 0) {
      const timeoutId = setTimeout(processBatch, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [operations, processBatch]);
  
  return {
    addOperation,
    isProcessing,
    pendingOperations: operations.length,
  };
}

// Export singleton instances
export const themePerformanceMonitor = ThemePerformanceMonitor.getInstance();
export const themeCache = ThemeCache.getInstance();
