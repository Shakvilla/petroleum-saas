// Documentation: /docs/error-handling/error-reporting.md

export interface ErrorReport {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: {
    userId?: string;
    tenantId?: string;
    url?: string;
    userAgent?: string;
    component?: string;
    action?: string;
  };
  metadata?: Record<string, any>;
}

export interface ErrorReportingConfig {
  enabled: boolean;
  endpoint: string;
  apiKey?: string;
  environment: 'development' | 'staging' | 'production';
  maxRetries: number;
  batchSize: number;
  flushInterval: number;
}

export class ErrorReportingService {
  private static instance: ErrorReportingService;
  private config: ErrorReportingConfig;
  private errorQueue: ErrorReport[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      enabled: process.env.NODE_ENV === 'production',
      endpoint:
        process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT || '/api/errors',
      apiKey: process.env.NEXT_PUBLIC_ERROR_REPORTING_API_KEY,
      environment: (process.env.NODE_ENV as any) || 'development',
      maxRetries: 3,
      batchSize: 10,
      flushInterval: 5000, // 5 seconds
    };

    if (this.config.enabled) {
      this.startFlushTimer();
    }
  }

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  /**
   * Report an error
   */
  static reportError(
    error: Error | string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorReportingService.getInstance();
    service.addError(error, context, metadata);
  }

  /**
   * Report a warning
   */
  static reportWarning(
    message: string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorReportingService.getInstance();
    service.addError(message, context, metadata, 'warning');
  }

  /**
   * Report info
   */
  static reportInfo(
    message: string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorReportingService.getInstance();
    service.addError(message, context, metadata, 'info');
  }

  private addError(
    error: Error | string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>,
    level: ErrorReport['level'] = 'error'
  ): void {
    if (!this.config.enabled) {
      return;
    }

    const errorReport: ErrorReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent:
          typeof window !== 'undefined'
            ? window.navigator.userAgent
            : undefined,
      },
      metadata,
    };

    this.errorQueue.push(errorReport);

    // Flush immediately if queue is full
    if (this.errorQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) {
      return;
    }

    const errorsToSend = this.errorQueue.splice(0, this.config.batchSize);

    try {
      // TODO: Replace with actual error reporting service
      // Issue: #ERROR-REPORTING-001
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: JSON.stringify({
          errors: errorsToSend,
          environment: this.config.environment,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error reporting failed: ${response.status}`);
      }
    } catch (error) {
      // Re-queue errors if reporting fails
      this.errorQueue.unshift(...errorsToSend);

      if (process.env.NODE_ENV === 'development') {
        console.error('Error reporting failed:', error);
      }
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private generateId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ErrorReportingConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.config.enabled && !this.flushTimer) {
      this.startFlushTimer();
    } else if (!this.config.enabled && this.flushTimer) {
      this.stopFlushTimer();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): ErrorReportingConfig {
    return { ...this.config };
  }

  /**
   * Clear error queue
   */
  clearQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Get queue size
   */
  getQueueSize(): number {
    return this.errorQueue.length;
  }

  /**
   * Force flush
   */
  async forceFlush(): Promise<void> {
    await this.flush();
  }
}

// Hook for error reporting
export function useErrorReporting() {
  const reportError = (
    error: Error | string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorReportingService.reportError(error, context, metadata);
  };

  const reportWarning = (
    message: string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorReportingService.reportWarning(message, context, metadata);
  };

  const reportInfo = (
    message: string,
    context?: ErrorReport['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorReportingService.reportInfo(message, context, metadata);
  };

  return {
    reportError,
    reportWarning,
    reportInfo,
  };
}

// Global error handler
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    ErrorReportingService.reportError(
      new Error(`Unhandled promise rejection: ${event.reason}`),
      {
        component: 'global',
        action: 'unhandledrejection',
      }
    );
  });

  // Handle uncaught errors
  window.addEventListener('error', event => {
    ErrorReportingService.reportError(event.error || new Error(event.message), {
      component: 'global',
      action: 'uncaughterror',
      url: event.filename,
    });
  });
}
