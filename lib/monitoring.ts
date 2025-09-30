// Application monitoring and health checks

interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface SystemMetrics {
  timestamp: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    cpu?: number;
    load?: number;
  };
  network: {
    online: boolean;
    connectionType?: string;
    downlink?: number;
    rtt?: number;
  };
  user: {
    active: boolean;
    sessionDuration: number;
    pageViews: number;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
  metadata?: Record<string, any>;
}

class Monitoring {
  private healthChecks: HealthCheck[] = [];
  private systemMetrics: SystemMetrics[] = [];
  private alerts: Alert[] = [];
  private isMonitoring = false;
  private monitoringInterval?: NodeJS.Timeout;
  private sessionStartTime: number;
  private pageViewCount = 0;

  constructor() {
    this.sessionStartTime = Date.now();
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.startMonitoring();
    this.setupEventListeners();
  }

  private startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;

    // Monitor every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.runHealthChecks();
    }, 30000);

    // Initial collection
    this.collectSystemMetrics();
    this.runHealthChecks();
  }

  private stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
  }

  private setupEventListeners() {
    // Track page views
    window.addEventListener('beforeunload', () => {
      this.trackPageView();
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackUserActivity();
      }
    });

    // Track network changes
    window.addEventListener('online', () => {
      this.createAlert(
        'info',
        'Network Connected',
        'Internet connection restored'
      );
    });

    window.addEventListener('offline', () => {
      this.createAlert(
        'warning',
        'Network Disconnected',
        'Internet connection lost'
      );
    });

    // Track errors
    window.addEventListener('error', event => {
      this.createAlert('error', 'JavaScript Error', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', event => {
      this.createAlert(
        'error',
        'Unhandled Promise Rejection',
        String(event.reason),
        {
          reason: event.reason,
        }
      );
    });
  }

  private collectSystemMetrics() {
    const metrics: SystemMetrics = {
      timestamp: Date.now(),
      memory: this.getMemoryMetrics(),
      performance: this.getPerformanceMetrics(),
      network: this.getNetworkMetrics(),
      user: this.getUserMetrics(),
    };

    this.systemMetrics.push(metrics);

    // Keep only last 100 metrics
    if (this.systemMetrics.length > 100) {
      this.systemMetrics = this.systemMetrics.slice(-100);
    }

    this.sendMetrics(metrics);
  }

  private getMemoryMetrics() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }

    return {
      used: 0,
      total: 0,
      percentage: 0,
    };
  }

  private getPerformanceMetrics() {
    // CPU and load metrics are not directly available in browsers
    // This would typically come from server-side monitoring
    return {};
  }

  private getNetworkMetrics() {
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
  }

  private getUserMetrics() {
    return {
      active: document.visibilityState === 'visible',
      sessionDuration: Date.now() - this.sessionStartTime,
      pageViews: this.pageViewCount,
    };
  }

  private runHealthChecks() {
    const checks: HealthCheck[] = [
      this.checkMemoryUsage(),
      this.checkNetworkConnectivity(),
      this.checkApplicationResponsiveness(),
      this.checkErrorRate(),
    ];

    this.healthChecks.push(...checks);

    // Keep only last 50 health checks
    if (this.healthChecks.length > 50) {
      this.healthChecks = this.healthChecks.slice(-50);
    }

    // Send health check results
    this.sendHealthChecks(checks);
  }

  private checkMemoryUsage(): HealthCheck {
    const memory = this.getMemoryMetrics();
    const isHealthy = memory.percentage < 80;
    const isDegraded = memory.percentage >= 80 && memory.percentage < 95;

    return {
      name: 'memory_usage',
      status: isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy',
      message: `Memory usage: ${memory.percentage.toFixed(1)}%`,
      timestamp: Date.now(),
      metadata: { memory },
    };
  }

  private checkNetworkConnectivity(): HealthCheck {
    const network = this.getNetworkMetrics();

    return {
      name: 'network_connectivity',
      status: network.online ? 'healthy' : 'unhealthy',
      message: network.online ? 'Network connected' : 'Network disconnected',
      timestamp: Date.now(),
      metadata: { network },
    };
  }

  private checkApplicationResponsiveness(): HealthCheck {
    // Simple responsiveness check
    const start = performance.now();

    // Perform a simple operation
    const result = Array.from({ length: 1000 }, (_, i) => i * i);

    const duration = performance.now() - start;
    const isHealthy = duration < 100; // Less than 100ms
    const isDegraded = duration >= 100 && duration < 500;

    return {
      name: 'application_responsiveness',
      status: isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy',
      message: `Response time: ${duration.toFixed(2)}ms`,
      timestamp: Date.now(),
      duration,
      metadata: { duration, resultLength: result.length },
    };
  }

  private checkErrorRate(): HealthCheck {
    // Check error rate from recent alerts
    const recentErrors = this.alerts.filter(
      alert => alert.type === 'error' && alert.timestamp > Date.now() - 300000 // Last 5 minutes
    );

    const errorRate = recentErrors.length;
    const isHealthy = errorRate === 0;
    const isDegraded = errorRate >= 1 && errorRate < 5;

    return {
      name: 'error_rate',
      status: isHealthy ? 'healthy' : isDegraded ? 'degraded' : 'unhealthy',
      message: `${errorRate} errors in the last 5 minutes`,
      timestamp: Date.now(),
      metadata: { errorRate, recentErrors: recentErrors.length },
    };
  }

  // Public methods
  createAlert(
    type: Alert['type'],
    title: string,
    message: string,
    metadata?: Record<string, any>
  ) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      resolved: false,
      metadata,
    };

    this.alerts.push(alert);
    this.sendAlert(alert);

    // Auto-resolve info alerts after 30 seconds
    if (type === 'info') {
      setTimeout(() => {
        this.resolveAlert(alert.id);
      }, 30000);
    }
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = Date.now();
      this.sendAlert(alert);
    }
  }

  trackPageView() {
    this.pageViewCount++;
  }

  trackUserActivity() {
    // Track user activity for monitoring
    this.createAlert('info', 'User Activity', 'User became active');
  }

  // Get methods
  getHealthChecks(): HealthCheck[] {
    return [...this.healthChecks];
  }

  getSystemMetrics(): SystemMetrics[] {
    return [...this.systemMetrics];
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  // Send methods
  private async sendMetrics(metrics: SystemMetrics) {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      console.warn('Failed to send metrics:', error);
    }
  }

  private async sendHealthChecks(checks: HealthCheck[]) {
    try {
      await fetch('/api/monitoring/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checks),
      });
    } catch (error) {
      console.warn('Failed to send health checks:', error);
    }
  }

  private async sendAlert(alert: Alert) {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });
    } catch (error) {
      console.warn('Failed to send alert:', error);
    }
  }

  // Cleanup
  destroy() {
    this.stopMonitoring();
  }
}

// Create singleton instance
export const monitoring = new Monitoring();

// Convenience functions
export const createAlert = (
  type: Alert['type'],
  title: string,
  message: string,
  metadata?: Record<string, any>
) => {
  monitoring.createAlert(type, title, message, metadata);
};

export const resolveAlert = (alertId: string) => {
  monitoring.resolveAlert(alertId);
};

export const trackPageView = () => {
  monitoring.trackPageView();
};

export const trackUserActivity = () => {
  monitoring.trackUserActivity();
};

// React hook for monitoring
export const useMonitoring = () => {
  return {
    createAlert,
    resolveAlert,
    trackPageView,
    trackUserActivity,
    getHealthChecks: () => monitoring.getHealthChecks(),
    getSystemMetrics: () => monitoring.getSystemMetrics(),
    getAlerts: () => monitoring.getAlerts(),
    getActiveAlerts: () => monitoring.getActiveAlerts(),
  };
};
