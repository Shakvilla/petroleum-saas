import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
  network?: {
    online: boolean;
    connectionType?: string;
    downlink?: number;
    rtt?: number;
  };
}

interface PerformanceThresholds {
  fcp: { good: number; poor: number };
  lcp: { good: number; poor: number };
  fid: { good: number; poor: number };
  cls: { good: number; poor: number };
  ttfb: { good: number; poor: number };
}

const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  fcp: { good: 1800, poor: 3000 },
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 800, poor: 1800 },
};

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);

  const getMemoryInfo = useCallback(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return { used: 0, total: 0, percentage: 0 };
    }

    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
    };
  }, []);

  const getNetworkInfo = useCallback(() => {
    if (typeof window === 'undefined') {
      return { online: false };
    }

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      connectionType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    };
  }, []);

  const getPerformanceScore = useCallback(
    (value: number, thresholds: { good: number; poor: number }) => {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.poor) return 'needs-improvement';
      return 'poor';
    },
    []
  );

  const measurePerformance = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
        'web-vitals'
      );

      const newMetrics: PerformanceMetrics = {
        memory: getMemoryInfo(),
        network: getNetworkInfo(),
      };

      // Measure Core Web Vitals
      getFCP(metric => {
        newMetrics.fcp = metric.value;
      });

      getLCP(metric => {
        newMetrics.lcp = metric.value;
      });

      getFID(metric => {
        newMetrics.fid = metric.value;
      });

      getCLS(metric => {
        newMetrics.cls = metric.value;
      });

      getTTFB(metric => {
        newMetrics.ttfb = metric.value;
      });

      setMetrics(newMetrics);
      setHistory(prev => [...prev.slice(-19), newMetrics]);
    } catch (error) {
      console.warn('Failed to measure performance:', error);
    }
  }, [getMemoryInfo, getNetworkInfo]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    measurePerformance();

    const interval = setInterval(() => {
      measurePerformance();
    }, 5000);

    return () => {
      clearInterval(interval);
      setIsMonitoring(false);
    };
  }, [isMonitoring, measurePerformance]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  const getScore = useCallback(
    (metric: keyof PerformanceThresholds, value?: number) => {
      if (value === undefined) return 'unknown';
      return getPerformanceScore(value, DEFAULT_THRESHOLDS[metric]);
    },
    [getPerformanceScore]
  );

  const getOverallScore = useCallback(() => {
    const scores = [
      getScore('fcp', metrics.fcp),
      getScore('lcp', metrics.lcp),
      getScore('fid', metrics.fid),
      getScore('cls', metrics.cls),
      getScore('ttfb', metrics.ttfb),
    ].filter(score => score !== 'unknown');

    if (scores.length === 0) return 'unknown';

    const goodCount = scores.filter(score => score === 'good').length;
    const poorCount = scores.filter(score => score === 'poor').length;

    if (goodCount >= scores.length * 0.8) return 'good';
    if (poorCount >= scores.length * 0.5) return 'poor';
    return 'needs-improvement';
  }, [metrics, getScore]);

  const formatBytes = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDuration = useCallback((ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }, []);

  const getRecommendations = useCallback(() => {
    const recommendations: string[] = [];

    if (metrics.fcp && metrics.fcp > DEFAULT_THRESHOLDS.fcp.poor) {
      recommendations.push(
        'Optimize First Contentful Paint by reducing render-blocking resources'
      );
    }

    if (metrics.lcp && metrics.lcp > DEFAULT_THRESHOLDS.lcp.poor) {
      recommendations.push(
        'Improve Largest Contentful Paint by optimizing images and critical resources'
      );
    }

    if (metrics.fid && metrics.fid > DEFAULT_THRESHOLDS.fid.poor) {
      recommendations.push(
        'Reduce First Input Delay by minimizing JavaScript execution time'
      );
    }

    if (metrics.cls && metrics.cls > DEFAULT_THRESHOLDS.cls.poor) {
      recommendations.push(
        'Fix Cumulative Layout Shift by setting size attributes on images and ads'
      );
    }

    if (metrics.memory && metrics.memory.percentage > 80) {
      recommendations.push(
        'High memory usage detected. Consider optimizing memory-intensive operations'
      );
    }

    return recommendations;
  }, [metrics]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cleanup = startMonitoring();
      return cleanup;
    }
  }, [startMonitoring]);

  return {
    metrics,
    history,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getScore,
    getOverallScore,
    getRecommendations,
    formatBytes,
    formatDuration,
    thresholds: DEFAULT_THRESHOLDS,
  };
}

// Hook for specific performance metrics
export function useWebVitals() {
  const [vitals, setVitals] = useState<{
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  }>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measureVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
          'web-vitals'
        );

        getFCP(metric => {
          setVitals(prev => ({ ...prev, fcp: metric.value }));
        });

        getLCP(metric => {
          setVitals(prev => ({ ...prev, lcp: metric.value }));
        });

        getFID(metric => {
          setVitals(prev => ({ ...prev, fid: metric.value }));
        });

        getCLS(metric => {
          setVitals(prev => ({ ...prev, cls: metric.value }));
        });

        getTTFB(metric => {
          setVitals(prev => ({ ...prev, ttfb: metric.value }));
        });
      } catch (error) {
        console.warn('Failed to measure web vitals:', error);
      }
    };

    measureVitals();
  }, []);

  return vitals;
}

// Hook for memory monitoring
export function useMemoryMonitor() {
  const [memory, setMemory] = useState<{
    used: number;
    total: number;
    percentage: number;
  }>({ used: 0, total: 0, percentage: 0 });

  useEffect(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const updateMemory = () => {
      const memoryInfo = (performance as any).memory;
      setMemory({
        used: memoryInfo.usedJSHeapSize,
        total: memoryInfo.totalJSHeapSize,
        percentage:
          (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100,
      });
    };

    updateMemory();
    const interval = setInterval(updateMemory, 5000);

    return () => clearInterval(interval);
  }, []);

  return memory;
}

// Hook for network monitoring
export function useNetworkMonitor() {
  const [network, setNetwork] = useState<{
    online: boolean;
    connectionType?: string;
    downlink?: number;
    rtt?: number;
  }>({ online: navigator.onLine });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateNetwork = () => {
      const connection =
        (navigator as any).connection ||
        (navigator as any).mozConnection ||
        (navigator as any).webkitConnection;

      setNetwork({
        online: navigator.onLine,
        connectionType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    updateNetwork();

    const handleOnline = () => updateNetwork();
    const handleOffline = () => updateNetwork();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateNetwork);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', updateNetwork);
      }
    };
  }, []);

  return network;
}
