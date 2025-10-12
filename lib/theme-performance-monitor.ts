// Documentation: /docs/comprehensive-theming-system/theme-performance-monitor.md

import type { 
  UnifiedTheme, 
  PerformanceMetrics,
  ThemeApplicationResult 
} from '@/types/unified-theme';

// Performance monitoring configuration
interface PerformanceMonitorConfig {
  enableMonitoring: boolean;
  enableMetrics: boolean;
  enableAlerts: boolean;
  enableReporting: boolean;
  sampleRate: number; // Percentage of operations to monitor (0-1)
  alertThresholds: {
    themeApplicationTime: number; // ms
    cssVariableInjectionTime: number; // ms
    componentUpdateTime: number; // ms
    memoryUsage: number; // MB
    cacheHitRate: number; // percentage
  };
  reportingInterval: number; // ms
  maxMetricsHistory: number;
}

// Performance alert
interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// Performance report
interface PerformanceReport {
  id: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalOperations: number;
    averagePerformance: number;
    slowestOperation: number;
    fastestOperation: number;
    errorRate: number;
    cacheHitRate: number;
  };
  metrics: {
    themeApplication: {
      count: number;
      averageTime: number;
      minTime: number;
      maxTime: number;
      p95Time: number;
      p99Time: number;
    };
    cssVariableInjection: {
      count: number;
      averageTime: number;
      minTime: number;
      maxTime: number;
      p95Time: number;
      p99Time: number;
    };
    componentUpdate: {
      count: number;
      averageTime: number;
      minTime: number;
      maxTime: number;
      p95Time: number;
      p99Time: number;
    };
    memoryUsage: {
      average: number;
      min: number;
      max: number;
      peak: number;
    };
    cachePerformance: {
      hitRate: number;
      missRate: number;
      averageAccessTime: number;
    };
  };
  alerts: PerformanceAlert[];
  recommendations: string[];
}

// Performance measurement
interface PerformanceMeasurement {
  id: string;
  operation: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  metadata: Record<string, any>;
}

/**
 * Theme Performance Monitor
 * 
 * Monitors and analyzes theme performance metrics including:
 * - Theme application performance
 * - CSS variable injection performance
 * - Component update performance
 * - Memory usage tracking
 * - Cache performance analysis
 * - Performance alerts and reporting
 */
export class ThemePerformanceMonitor {
  private static instance: ThemePerformanceMonitor;
  private config: PerformanceMonitorConfig;
  private measurements: PerformanceMeasurement[] = [];
  private alerts: PerformanceAlert[] = [];
  private isMonitoring: boolean = false;
  private reportingTimer: NodeJS.Timeout | null = null;
  private memoryObserver: PerformanceObserver | null = null;

  constructor(config: Partial<PerformanceMonitorConfig> = {}) {
    this.config = {
      enableMonitoring: true,
      enableMetrics: true,
      enableAlerts: true,
      enableReporting: true,
      sampleRate: 1.0, // Monitor all operations by default
      alertThresholds: {
        themeApplicationTime: 100, // 100ms
        cssVariableInjectionTime: 50, // 50ms
        componentUpdateTime: 200, // 200ms
        memoryUsage: 50, // 50MB
        cacheHitRate: 80, // 80%
      },
      reportingInterval: 5 * 60 * 1000, // 5 minutes
      maxMetricsHistory: 1000,
      ...config,
    };

    this.initialize();
  }

  static getInstance(config?: Partial<PerformanceMonitorConfig>): ThemePerformanceMonitor {
    if (!ThemePerformanceMonitor.instance) {
      ThemePerformanceMonitor.instance = new ThemePerformanceMonitor(config);
    }
    return ThemePerformanceMonitor.instance;
  }

  /**
   * Initialize the performance monitor
   */
  private initialize(): void {
    if (!this.config.enableMonitoring) return;

    try {
      // Start monitoring
      this.startMonitoring();

      // Start reporting timer
      if (this.config.enableReporting) {
        this.startReporting();
      }

      // Initialize memory observer
      if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
        this.initializeMemoryObserver();
      }

      console.log('Theme performance monitor initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitor:', error);
    }
  }

  /**
   * Start monitoring
   */
  startMonitoring(): void {
    this.isMonitoring = true;
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Monitor theme application performance
   */
  monitorThemeApplication(theme: UnifiedTheme): Promise<PerformanceMetrics> {
    return this.measureOperation('theme-application', async () => {
      const startTime = performance.now();
      
      // Simulate theme application
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      const metrics: PerformanceMetrics = {
        themeApplicationTime: duration,
        cssVariableInjectionTime: 0,
        componentUpdateTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        timestamp: new Date(),
      };

      // Check for alerts
      if (this.config.enableAlerts) {
        this.checkAlerts('themeApplicationTime', duration);
      }

      return metrics;
    });
  }

  /**
   * Monitor CSS variable injection performance
   */
  monitorCSSVariableInjection(variables: Record<string, string>): Promise<number> {
    return this.measureOperation('css-variable-injection', async () => {
      const startTime = performance.now();
      
      // Simulate CSS variable injection
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20));
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Check for alerts
      if (this.config.enableAlerts) {
        this.checkAlerts('cssVariableInjectionTime', duration);
      }

      return duration;
    });
  }

  /**
   * Monitor component update performance
   */
  monitorComponentUpdate(componentCount: number): Promise<number> {
    return this.measureOperation('component-update', async () => {
      const startTime = performance.now();
      
      // Simulate component updates
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Check for alerts
      if (this.config.enableAlerts) {
        this.checkAlerts('componentUpdateTime', duration);
      }

      return duration;
    });
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage(): Promise<number> {
    return this.measureOperation('memory-usage', async () => {
      let memoryUsage = 0;

      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory;
        memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      // Check for alerts
      if (this.config.enableAlerts) {
        this.checkAlerts('memoryUsage', memoryUsage);
      }

      return memoryUsage;
    });
  }

  /**
   * Monitor cache performance
   */
  monitorCachePerformance(hitRate: number, accessTime: number): void {
    if (!this.isMonitoring) return;

    // Check for alerts
    if (this.config.enableAlerts) {
      this.checkAlerts('cacheHitRate', hitRate);
    }

    // Record measurement
    this.recordMeasurement({
      id: `cache-${Date.now()}`,
      operation: 'cache-performance',
      startTime: performance.now(),
      endTime: performance.now(),
      duration: accessTime,
      success: true,
      metadata: {
        hitRate,
        accessTime,
      },
    });
  }

  /**
   * Measure an operation
   */
  private async measureOperation<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!this.isMonitoring || Math.random() > this.config.sampleRate) {
      return fn();
    }

    const measurement: PerformanceMeasurement = {
      id: `${operation}-${Date.now()}`,
      operation,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      success: false,
      metadata: {},
    };

    try {
      const result = await fn();
      measurement.endTime = performance.now();
      measurement.duration = measurement.endTime - measurement.startTime;
      measurement.success = true;

      this.recordMeasurement(measurement);
      return result;
    } catch (error) {
      measurement.endTime = performance.now();
      measurement.duration = measurement.endTime - measurement.startTime;
      measurement.success = false;
      measurement.error = error instanceof Error ? error.message : 'Unknown error';

      this.recordMeasurement(measurement);
      throw error;
    }
  }

  /**
   * Record a performance measurement
   */
  private recordMeasurement(measurement: PerformanceMeasurement): void {
    if (!this.config.enableMetrics) return;

    this.measurements.push(measurement);

    // Limit measurements history
    if (this.measurements.length > this.config.maxMetricsHistory) {
      this.measurements.shift();
    }
  }

  /**
   * Check for performance alerts
   */
  private checkAlerts(metric: string, value: number): void {
    const threshold = this.config.alertThresholds[metric as keyof typeof this.config.alertThresholds];
    
    if (threshold && value > threshold) {
      const alert: PerformanceAlert = {
        id: `alert-${Date.now()}`,
        type: value > threshold * 2 ? 'critical' : value > threshold * 1.5 ? 'error' : 'warning',
        metric,
        value,
        threshold,
        message: `${metric} exceeded threshold: ${value} > ${threshold}`,
        timestamp: new Date(),
        resolved: false,
      };

      this.alerts.push(alert);
      console.warn('Performance alert:', alert);
    }
  }

  /**
   * Generate performance report
   */
  generatePerformanceReport(): PerformanceReport {
    const now = new Date();
    const period = {
      start: new Date(now.getTime() - this.config.reportingInterval),
      end: now,
    };

    const periodMeasurements = this.measurements.filter(
      m => m.startTime >= period.start.getTime() && m.startTime <= period.end.getTime()
    );

    const themeApplicationMeasurements = periodMeasurements.filter(
      m => m.operation === 'theme-application'
    );
    const cssVariableMeasurements = periodMeasurements.filter(
      m => m.operation === 'css-variable-injection'
    );
    const componentUpdateMeasurements = periodMeasurements.filter(
      m => m.operation === 'component-update'
    );

    const report: PerformanceReport = {
      id: `report-${Date.now()}`,
      generatedAt: now,
      period,
      summary: {
        totalOperations: periodMeasurements.length,
        averagePerformance: this.calculateAverage(periodMeasurements.map(m => m.duration)),
        slowestOperation: Math.max(...periodMeasurements.map(m => m.duration)),
        fastestOperation: Math.min(...periodMeasurements.map(m => m.duration)),
        errorRate: periodMeasurements.filter(m => !m.success).length / periodMeasurements.length,
        cacheHitRate: 0, // Would be calculated from cache metrics
      },
      metrics: {
        themeApplication: {
          count: themeApplicationMeasurements.length,
          averageTime: this.calculateAverage(themeApplicationMeasurements.map(m => m.duration)),
          minTime: Math.min(...themeApplicationMeasurements.map(m => m.duration)),
          maxTime: Math.max(...themeApplicationMeasurements.map(m => m.duration)),
          p95Time: this.calculatePercentile(themeApplicationMeasurements.map(m => m.duration), 95),
          p99Time: this.calculatePercentile(themeApplicationMeasurements.map(m => m.duration), 99),
        },
        cssVariableInjection: {
          count: cssVariableMeasurements.length,
          averageTime: this.calculateAverage(cssVariableMeasurements.map(m => m.duration)),
          minTime: Math.min(...cssVariableMeasurements.map(m => m.duration)),
          maxTime: Math.max(...cssVariableMeasurements.map(m => m.duration)),
          p95Time: this.calculatePercentile(cssVariableMeasurements.map(m => m.duration), 95),
          p99Time: this.calculatePercentile(cssVariableMeasurements.map(m => m.duration), 99),
        },
        componentUpdate: {
          count: componentUpdateMeasurements.length,
          averageTime: this.calculateAverage(componentUpdateMeasurements.map(m => m.duration)),
          minTime: Math.min(...componentUpdateMeasurements.map(m => m.duration)),
          maxTime: Math.max(...componentUpdateMeasurements.map(m => m.duration)),
          p95Time: this.calculatePercentile(componentUpdateMeasurements.map(m => m.duration), 95),
          p99Time: this.calculatePercentile(componentUpdateMeasurements.map(m => m.duration), 99),
        },
        memoryUsage: {
          average: 0, // Would be calculated from memory measurements
          min: 0,
          max: 0,
          peak: 0,
        },
        cachePerformance: {
          hitRate: 0, // Would be calculated from cache metrics
          missRate: 0,
          averageAccessTime: 0,
        },
      },
      alerts: this.alerts.filter(alert => !alert.resolved),
      recommendations: this.generateRecommendations(periodMeasurements),
    };

    return report;
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const recentMeasurements = this.measurements.slice(-10); // Last 10 measurements
    
    return {
      themeApplicationTime: this.calculateAverage(
        recentMeasurements.filter(m => m.operation === 'theme-application').map(m => m.duration)
      ),
      cssVariableInjectionTime: this.calculateAverage(
        recentMeasurements.filter(m => m.operation === 'css-variable-injection').map(m => m.duration)
      ),
      componentUpdateTime: this.calculateAverage(
        recentMeasurements.filter(m => m.operation === 'component-update').map(m => m.duration)
      ),
      memoryUsage: 0, // Would be calculated from memory measurements
      cacheHitRate: 0, // Would be calculated from cache metrics
      timestamp: new Date(),
    };
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(): PerformanceAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Resolve alert
   */
  resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  /**
   * Clear all measurements
   */
  clearMeasurements(): void {
    this.measurements = [];
  }

  /**
   * Clear all alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Start reporting
   */
  private startReporting(): void {
    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
    }

    this.reportingTimer = setInterval(() => {
      const report = this.generatePerformanceReport();
      console.log('Performance report generated:', report);
    }, this.config.reportingInterval);
  }

  /**
   * Initialize memory observer
   */
  private initializeMemoryObserver(): void {
    try {
      this.memoryObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'memory') {
            // Memory usage monitoring
            console.log('Memory usage:', entry);
          }
        }
      });

      this.memoryObserver.observe({ entryTypes: ['memory'] });
    } catch (error) {
      console.warn('Memory observer not supported:', error);
    }
  }

  /**
   * Calculate average
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0;
    
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index] || 0;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(measurements: PerformanceMeasurement[]): string[] {
    const recommendations: string[] = [];

    const themeApplicationTimes = measurements
      .filter(m => m.operation === 'theme-application')
      .map(m => m.duration);

    if (themeApplicationTimes.length > 0) {
      const averageTime = this.calculateAverage(themeApplicationTimes);
      if (averageTime > 100) {
        recommendations.push('Consider optimizing theme application performance');
      }
    }

    const cssVariableTimes = measurements
      .filter(m => m.operation === 'css-variable-injection')
      .map(m => m.duration);

    if (cssVariableTimes.length > 0) {
      const averageTime = this.calculateAverage(cssVariableTimes);
      if (averageTime > 50) {
        recommendations.push('Consider optimizing CSS variable injection');
      }
    }

    const errorRate = measurements.filter(m => !m.success).length / measurements.length;
    if (errorRate > 0.05) {
      recommendations.push('High error rate detected, investigate theme application issues');
    }

    return recommendations;
  }

  /**
   * Destroy performance monitor
   */
  destroy(): void {
    this.stopMonitoring();

    if (this.reportingTimer) {
      clearInterval(this.reportingTimer);
      this.reportingTimer = null;
    }

    if (this.memoryObserver) {
      this.memoryObserver.disconnect();
      this.memoryObserver = null;
    }

    this.clearMeasurements();
    this.clearAlerts();
  }

  /**
   * Get current configuration
   */
  getConfig(): ThemePerformanceMonitorConfig {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ThemePerformanceMonitorConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const themePerformanceMonitor = new ThemePerformanceMonitor();
