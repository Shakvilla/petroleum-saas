import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tenantId: string;
  context?: Record<string, any>;
}

export interface PerformanceThreshold {
  metric: string;
  warning: number;
  critical: number;
  unit: string;
}

export interface PerformanceReport {
  tenantId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: PerformanceMetric[];
  summary: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: number;
    cacheHitRate: number;
  };
  alerts: Array<{
    metric: string;
    level: 'warning' | 'critical';
    value: number;
    threshold: number;
    timestamp: Date;
  }>;
}

export class TenantPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private currentTenantId: string | null = null;
  private maxMetrics = 10000;
  private observers: Map<string, PerformanceObserver> = new Map();

  constructor() {
    this.setupDefaultThresholds();
    this.initializeObservers();
  }

  // Set tenant context
  setTenant(tenantId: string) {
    this.currentTenantId = tenantId;
  }

  // Setup default performance thresholds
  private setupDefaultThresholds() {
    this.thresholds.set('response_time', {
      metric: 'response_time',
      warning: 1000, // 1 second
      critical: 3000, // 3 seconds
      unit: 'ms',
    });

    this.thresholds.set('memory_usage', {
      metric: 'memory_usage',
      warning: 50 * 1024 * 1024, // 50MB
      critical: 100 * 1024 * 1024, // 100MB
      unit: 'bytes',
    });

    this.thresholds.set('error_rate', {
      metric: 'error_rate',
      warning: 5, // 5%
      critical: 10, // 10%
      unit: '%',
    });

    this.thresholds.set('cache_hit_rate', {
      metric: 'cache_hit_rate',
      warning: 80, // 80%
      critical: 60, // 60%
      unit: '%',
    });
  }

  // Initialize performance observers
  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.recordMetric('page_load_time', entry.duration, 'ms');
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', navObserver);
    }

    // Resource timing
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.recordMetric('resource_load_time', entry.duration, 'ms', {
              resource: entry.name,
              type: entry.initiatorType,
            });
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('memory_usage', memory.usedJSHeapSize, 'bytes');
        this.recordMetric('memory_limit', memory.jsHeapSizeLimit, 'bytes');
      }, 30000); // Every 30 seconds
    }
  }

  // Record a performance metric
  recordMetric(
    name: string,
    value: number,
    unit: string,
    context?: Record<string, any>
  ): void {
    if (!this.currentTenantId) {
      console.warn('No tenant context for performance metric');
      return;
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tenantId: this.currentTenantId,
      context,
    };

    this.metrics.push(metric);

    // Maintain metrics size
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Check thresholds and generate alerts
    this.checkThresholds(metric);
  }

  // Check performance thresholds
  private checkThresholds(metric: PerformanceMetric) {
    const threshold = this.thresholds.get(metric.name);
    if (!threshold) return;

    let level: 'warning' | 'critical' | null = null;
    let thresholdValue = 0;

    if (metric.value >= threshold.critical) {
      level = 'critical';
      thresholdValue = threshold.critical;
    } else if (metric.value >= threshold.warning) {
      level = 'warning';
      thresholdValue = threshold.warning;
    }

    if (level) {
      this.generateAlert(metric, level, thresholdValue);
    }
  }

  // Generate performance alert
  private generateAlert(
    metric: PerformanceMetric,
    level: 'warning' | 'critical',
    threshold: number
  ) {
    const alert = {
      metric: metric.name,
      level,
      value: metric.value,
      threshold,
      timestamp: metric.timestamp,
    };

    console.warn(`Performance Alert [${level.toUpperCase()}]:`, alert);

    // Send alert to monitoring service
    this.sendAlert(alert);
  }

  // Send alert to monitoring service
  private async sendAlert(alert: any) {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alert,
          tenantId: this.currentTenantId,
        }),
      });
    } catch (err) {
      console.error('Failed to send performance alert:', err);
    }
  }

  // Get metrics for current tenant
  getMetrics(
    metricName?: string,
    startDate?: Date,
    endDate?: Date
  ): PerformanceMetric[] {
    if (!this.currentTenantId) {
      return [];
    }

    let filtered = this.metrics.filter(
      m => m.tenantId === this.currentTenantId
    );

    if (metricName) {
      filtered = filtered.filter(m => m.name === metricName);
    }

    if (startDate) {
      filtered = filtered.filter(m => m.timestamp >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(m => m.timestamp <= endDate);
    }

    return filtered;
  }

  // Get performance summary
  getPerformanceSummary(period: { start: Date; end: Date }): PerformanceReport {
    if (!this.currentTenantId) {
      throw new Error('No tenant context for performance summary');
    }

    const metrics = this.getMetrics(undefined, period.start, period.end);
    const responseTimeMetrics = metrics.filter(m => m.name === 'response_time');
    const errorMetrics = metrics.filter(m => m.name === 'error_rate');
    const memoryMetrics = metrics.filter(m => m.name === 'memory_usage');
    const cacheMetrics = metrics.filter(m => m.name === 'cache_hit_rate');

    const summary = {
      totalRequests: responseTimeMetrics.length,
      averageResponseTime:
        responseTimeMetrics.length > 0
          ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) /
            responseTimeMetrics.length
          : 0,
      errorRate:
        errorMetrics.length > 0
          ? errorMetrics.reduce((sum, m) => sum + m.value, 0) /
            errorMetrics.length
          : 0,
      memoryUsage:
        memoryMetrics.length > 0
          ? memoryMetrics[memoryMetrics.length - 1].value
          : 0,
      cacheHitRate:
        cacheMetrics.length > 0
          ? cacheMetrics.reduce((sum, m) => sum + m.value, 0) /
            cacheMetrics.length
          : 0,
    };

    const alerts = this.getAlerts(period);

    return {
      tenantId: this.currentTenantId,
      period,
      metrics,
      summary,
      alerts,
    };
  }

  // Get alerts for period
  private getAlerts(period: { start: Date; end: Date }) {
    // This would typically come from a separate alerts store
    // For now, return empty array
    return [];
  }

  // Set custom threshold
  setThreshold(threshold: PerformanceThreshold) {
    this.thresholds.set(threshold.metric, threshold);
  }

  // Get all thresholds
  getThresholds(): PerformanceThreshold[] {
    return Array.from(this.thresholds.values());
  }

  // Clear metrics for current tenant
  clearMetrics() {
    if (!this.currentTenantId) {
      this.metrics = [];
      return;
    }

    this.metrics = this.metrics.filter(
      m => m.tenantId !== this.currentTenantId
    );
  }

  // Clear all metrics
  clearAllMetrics() {
    this.metrics = [];
  }

  // Get performance statistics
  getStats() {
    if (!this.currentTenantId) {
      return {
        totalMetrics: 0,
        tenantMetrics: 0,
        metricsByType: {},
        oldestMetric: null,
        newestMetric: null,
      };
    }

    const tenantMetrics = this.metrics.filter(
      m => m.tenantId === this.currentTenantId
    );
    const metricsByType = tenantMetrics.reduce(
      (acc, metric) => {
        acc[metric.name] = (acc[metric.name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const timestamps = tenantMetrics.map(m => m.timestamp.getTime());
    const oldestTimestamp =
      timestamps.length > 0 ? Math.min(...timestamps) : null;
    const newestTimestamp =
      timestamps.length > 0 ? Math.max(...timestamps) : null;

    return {
      totalMetrics: this.metrics.length,
      tenantMetrics: tenantMetrics.length,
      metricsByType,
      oldestMetric: oldestTimestamp ? new Date(oldestTimestamp) : null,
      newestMetric: newestTimestamp ? new Date(newestTimestamp) : null,
    };
  }

  // Cleanup observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new TenantPerformanceMonitor();

// React hook for using the performance monitor
export function useTenantPerformanceMonitor() {
  const { tenant } = useTenant();

  // Update performance monitor tenant context
  useEffect(() => {
    if (tenant?.id) {
      performanceMonitor.setTenant(tenant.id);
    }
  }, [tenant?.id]);

  return {
    recordMetric: (
      name: string,
      value: number,
      unit: string,
      context?: Record<string, any>
    ) => performanceMonitor.recordMetric(name, value, unit, context),
    getMetrics: (metricName?: string, startDate?: Date, endDate?: Date) =>
      performanceMonitor.getMetrics(metricName, startDate, endDate),
    getPerformanceSummary: (period: { start: Date; end: Date }) =>
      performanceMonitor.getPerformanceSummary(period),
    setThreshold: (threshold: PerformanceThreshold) =>
      performanceMonitor.setThreshold(threshold),
    getThresholds: () => performanceMonitor.getThresholds(),
    clearMetrics: () => performanceMonitor.clearMetrics(),
    getStats: () => performanceMonitor.getStats(),
  };
}
