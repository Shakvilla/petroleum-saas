// Documentation: /docs/error-handling/error-logging.md

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: {
    userId?: string;
    tenantId?: string;
    component?: string;
    action?: string;
    requestId?: string;
  };
  metadata?: Record<string, any>;
  stack?: string;
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
  maxEntries: number;
  persistToStorage: boolean;
  storageKey: string;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
}

export class ErrorLoggingService {
  private static instance: ErrorLoggingService;
  private config: LoggingConfig;
  private logs: LogEntry[] = [];
  private logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private constructor() {
    this.config = {
      enabled: true,
      level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info') as any,
      maxEntries: 1000,
      persistToStorage: true,
      storageKey: 'petroleum-saas-logs',
      enableConsole: process.env.NODE_ENV === 'development',
      enableRemote: process.env.NODE_ENV === 'production',
      remoteEndpoint: process.env.NEXT_PUBLIC_LOGGING_ENDPOINT,
    };

    this.loadFromStorage();
  }

  static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  /**
   * Log debug message
   */
  static debug(
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorLoggingService.getInstance();
    service.log('debug', message, context, metadata);
  }

  /**
   * Log info message
   */
  static info(
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorLoggingService.getInstance();
    service.log('info', message, context, metadata);
  }

  /**
   * Log warning message
   */
  static warn(
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorLoggingService.getInstance();
    service.log('warn', message, context, metadata);
  }

  /**
   * Log error message
   */
  static error(
    message: string | Error,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ): void {
    const service = ErrorLoggingService.getInstance();
    const errorMessage = message instanceof Error ? message.message : message;
    const stack = message instanceof Error ? message.stack : undefined;
    service.log('error', errorMessage, context, metadata, stack);
  }

  private log(
    level: LogEntry['level'],
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>,
    stack?: string
  ): void {
    if (!this.config.enabled) {
      return;
    }

    // Check if log level is enabled
    if (this.logLevels[level] < this.logLevels[this.config.level]) {
      return;
    }

    const logEntry: LogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      metadata,
      stack,
    };

    this.logs.push(logEntry);

    // Limit log entries
    if (this.logs.length > this.config.maxEntries) {
      this.logs = this.logs.slice(-this.config.maxEntries);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Persist to storage
    if (this.config.persistToStorage) {
      this.saveToStorage();
    }

    // Remote logging
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.logToRemote(logEntry);
    }
  }

  private logToConsole(logEntry: LogEntry): void {
    const { level, message, context, metadata, stack } = logEntry;
    const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, context, metadata);
        break;
      case 'info':
        console.info(prefix, message, context, metadata);
        break;
      case 'warn':
        console.warn(prefix, message, context, metadata);
        break;
      case 'error':
        console.error(prefix, message, context, metadata, stack);
        break;
    }
  }

  private async logToRemote(logEntry: LogEntry): Promise<void> {
    try {
      // TODO: Replace with actual logging service
      // Issue: #ERROR-LOGGING-001
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      // Don't log remote logging failures to avoid infinite loops
      if (this.config.enableConsole) {
        console.warn('Failed to send log to remote service:', error);
      }
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.logs.slice(-100)) // Keep only last 100 entries in storage
      );
    } catch (error) {
      // Storage might be full or unavailable
      if (this.config.enableConsole) {
        console.warn('Failed to save logs to storage:', error);
      }
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        this.logs = Array.isArray(parsedLogs) ? parsedLogs : [];
      }
    } catch (error) {
      // Invalid stored data
      if (this.config.enableConsole) {
        console.warn('Failed to load logs from storage:', error);
      }
    }
  }

  private generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get logs
   */
  getLogs(level?: LogEntry['level'], limit?: number): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return [...filteredLogs];
  }

  /**
   * Clear logs
   */
  clearLogs(): void {
    this.logs = [];
    if (this.config.persistToStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Export logs
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'level', 'message', 'component', 'action'];
      const rows = this.logs.map(log => [
        log.timestamp,
        log.level,
        log.message,
        log.context?.component || '',
        log.context?.action || '',
      ]);

      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggingConfig {
    return { ...this.config };
  }
}

// Hook for error logging
export function useErrorLogging() {
  const debug = (
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorLoggingService.debug(message, context, metadata);
  };

  const info = (
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorLoggingService.info(message, context, metadata);
  };

  const warn = (
    message: string,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorLoggingService.warn(message, context, metadata);
  };

  const error = (
    message: string | Error,
    context?: LogEntry['context'],
    metadata?: Record<string, any>
  ) => {
    ErrorLoggingService.error(message, context, metadata);
  };

  const getLogs = (level?: LogEntry['level'], limit?: number) => {
    return ErrorLoggingService.getInstance().getLogs(level, limit);
  };

  const clearLogs = () => {
    ErrorLoggingService.getInstance().clearLogs();
  };

  const exportLogs = (format: 'json' | 'csv' = 'json') => {
    return ErrorLoggingService.getInstance().exportLogs(format);
  };

  return {
    debug,
    info,
    warn,
    error,
    getLogs,
    clearLogs,
    exportLogs,
  };
}
