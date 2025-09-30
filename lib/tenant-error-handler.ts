import { useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import type { Tenant } from '@/types';

export interface TenantErrorContext {
  tenantId?: string;
  userId?: string;
  resource?: string;
  action?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  stack?: string;
}

export class TenantError extends Error {
  public code: string;
  public tenantId?: string;
  public context: TenantErrorContext;
  public isSecurityIncident: boolean;
  public severity: 'low' | 'medium' | 'high' | 'critical';

  constructor(
    message: string,
    code: string,
    context: Partial<TenantErrorContext> = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    super(message);
    this.name = 'TenantError';
    this.code = code;
    this.tenantId = context.tenantId;
    this.context = {
      timestamp: new Date(),
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context,
    };
    this.severity = severity;
    this.isSecurityIncident = this.determineSecurityIncident(code);
  }

  private determineSecurityIncident(code: string): boolean {
    const securityCodes = [
      'CROSS_TENANT_ACCESS',
      'TENANT_MISMATCH',
      'UNAUTHORIZED_ACCESS',
      'PERMISSION_VIOLATION',
      'DATA_LEAK_DETECTED',
      'INVALID_TENANT_CONTEXT',
    ];
    return securityCodes.includes(code);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      tenantId: this.tenantId,
      context: this.context,
      severity: this.severity,
      isSecurityIncident: this.isSecurityIncident,
      stack: this.stack,
    };
  }
}

export class TenantErrorHandler {
  private tenant: Tenant | null = null;
  private errorLog: TenantError[] = [];
  private maxLogSize = 100;
  private securityIncidents: TenantError[] = [];

  setTenant(tenant: Tenant) {
    this.tenant = tenant;
  }

  // Handle different types of errors
  handleError(
    error: Error,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    let tenantError: TenantError;

    if (error instanceof TenantError) {
      tenantError = error;
    } else {
      // Convert regular error to tenant error
      tenantError = new TenantError(error.message, 'UNKNOWN_ERROR', {
        ...context,
        stack: error.stack,
      });
    }

    // Add tenant context if available
    if (this.tenant && !tenantError.tenantId) {
      tenantError.tenantId = this.tenant.id;
      tenantError.context.tenantId = this.tenant.id;
    }

    // Log the error
    this.logError(tenantError);

    // Handle security incidents
    if (tenantError.isSecurityIncident) {
      this.handleSecurityIncident(tenantError);
    }

    return tenantError;
  }

  // Handle API errors
  handleAPIError(
    response: Response,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    let code = 'API_ERROR';
    let message = `HTTP ${response.status}: ${response.statusText}`;

    switch (response.status) {
      case 401:
        code = 'UNAUTHORIZED';
        message = 'Authentication required';
        break;
      case 403:
        code = 'FORBIDDEN';
        message = 'Access denied';
        break;
      case 404:
        code = 'NOT_FOUND';
        message = 'Resource not found';
        break;
      case 409:
        code = 'CONFLICT';
        message = 'Resource conflict';
        break;
      case 422:
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        break;
      case 429:
        code = 'RATE_LIMITED';
        message = 'Rate limit exceeded';
        break;
      case 500:
        code = 'SERVER_ERROR';
        message = 'Internal server error';
        break;
      case 503:
        code = 'SERVICE_UNAVAILABLE';
        message = 'Service unavailable';
        break;
    }

    const tenantError = new TenantError(
      message,
      code,
      {
        ...context,
        url: response.url,
      },
      response.status >= 500 ? 'high' : 'medium'
    );

    this.logError(tenantError);
    return tenantError;
  }

  // Handle network errors
  handleNetworkError(
    error: Error,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    const tenantError = new TenantError(
      'Network connection failed',
      'NETWORK_ERROR',
      {
        ...context,
        stack: error.stack,
      },
      'medium'
    );

    this.logError(tenantError);
    return tenantError;
  }

  // Handle validation errors
  handleValidationError(
    field: string,
    value: any,
    rule: string,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    const tenantError = new TenantError(
      `Validation failed for field '${field}': ${rule}`,
      'VALIDATION_ERROR',
      {
        ...context,
        resource: field,
        action: 'validate',
      },
      'low'
    );

    this.logError(tenantError);
    return tenantError;
  }

  // Handle permission errors
  handlePermissionError(
    resource: string,
    action: string,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    const tenantError = new TenantError(
      `Permission denied: Cannot ${action} ${resource}`,
      'PERMISSION_DENIED',
      {
        ...context,
        resource,
        action,
      },
      'medium'
    );

    this.logError(tenantError);
    return tenantError;
  }

  // Handle cross-tenant access attempts
  handleCrossTenantAccess(
    attemptedTenantId: string,
    context: Partial<TenantErrorContext> = {}
  ): TenantError {
    const tenantError = new TenantError(
      `Cross-tenant access attempt detected: ${attemptedTenantId}`,
      'CROSS_TENANT_ACCESS',
      {
        ...context,
        resource: 'tenant',
        action: 'access',
      },
      'critical'
    );

    this.logError(tenantError);
    this.handleSecurityIncident(tenantError);
    return tenantError;
  }

  // Log error
  private logError(error: TenantError) {
    this.errorLog.push(error);

    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Tenant Error:', error);
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(error);
    }
  }

  // Handle security incidents
  private handleSecurityIncident(error: TenantError) {
    this.securityIncidents.push(error);

    // Maintain security incidents log size
    if (this.securityIncidents.length > 50) {
      this.securityIncidents.shift();
    }

    // Log security incident
    console.warn('Security Incident:', error);

    // Send to security monitoring
    this.sendToSecurityMonitoring(error);

    // Notify administrators for critical incidents
    if (error.severity === 'critical') {
      this.notifyAdministrators(error);
    }
  }

  // Send error to monitoring service
  private async sendToMonitoring(error: TenantError) {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toJSON(),
          tenantId: this.tenant?.id,
        }),
      });
    } catch (err) {
      console.error('Failed to send error to monitoring:', err);
    }
  }

  // Send security incident to security monitoring
  private async sendToSecurityMonitoring(error: TenantError) {
    try {
      await fetch('/api/security/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          incident: error.toJSON(),
          tenantId: this.tenant?.id,
          severity: error.severity,
        }),
      });
    } catch (err) {
      console.error('Failed to send security incident:', err);
    }
  }

  // Notify administrators
  private async notifyAdministrators(error: TenantError) {
    try {
      await fetch('/api/notifications/security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.toJSON(),
          tenantId: this.tenant?.id,
          urgency: 'high',
        }),
      });
    } catch (err) {
      console.error('Failed to notify administrators:', err);
    }
  }

  // Get error log
  getErrorLog(): TenantError[] {
    return [...this.errorLog];
  }

  // Get security incidents
  getSecurityIncidents(): TenantError[] {
    return [...this.securityIncidents];
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Clear security incidents
  clearSecurityIncidents() {
    this.securityIncidents = [];
  }

  // Get error statistics
  getErrorStatistics() {
    const errors = this.errorLog;
    const incidents = this.securityIncidents;

    return {
      totalErrors: errors.length,
      totalIncidents: incidents.length,
      errorsBySeverity: {
        low: errors.filter(e => e.severity === 'low').length,
        medium: errors.filter(e => e.severity === 'medium').length,
        high: errors.filter(e => e.severity === 'high').length,
        critical: errors.filter(e => e.severity === 'critical').length,
      },
      errorsByCode: errors.reduce(
        (acc, error) => {
          acc[error.code] = (acc[error.code] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      recentErrors: errors.slice(-10),
      recentIncidents: incidents.slice(-5),
    };
  }
}

// Global error handler instance
export const tenantErrorHandler = new TenantErrorHandler();

// React hook for using the error handler
export function useTenantErrorHandler() {
  const { tenant } = useTenant();

  // Update error handler tenant context
  useEffect(() => {
    if (tenant) {
      tenantErrorHandler.setTenant(tenant);
    }
  }, [tenant]);

  return {
    handleError: (error: Error, context?: Partial<TenantErrorContext>) =>
      tenantErrorHandler.handleError(error, context),
    handleAPIError: (
      response: Response,
      context?: Partial<TenantErrorContext>
    ) => tenantErrorHandler.handleAPIError(response, context),
    handleNetworkError: (error: Error, context?: Partial<TenantErrorContext>) =>
      tenantErrorHandler.handleNetworkError(error, context),
    handleValidationError: (
      field: string,
      value: any,
      rule: string,
      context?: Partial<TenantErrorContext>
    ) => tenantErrorHandler.handleValidationError(field, value, rule, context),
    handlePermissionError: (
      resource: string,
      action: string,
      context?: Partial<TenantErrorContext>
    ) => tenantErrorHandler.handlePermissionError(resource, action, context),
    handleCrossTenantAccess: (
      attemptedTenantId: string,
      context?: Partial<TenantErrorContext>
    ) => tenantErrorHandler.handleCrossTenantAccess(attemptedTenantId, context),
    getErrorLog: () => tenantErrorHandler.getErrorLog(),
    getSecurityIncidents: () => tenantErrorHandler.getSecurityIncidents(),
    getErrorStatistics: () => tenantErrorHandler.getErrorStatistics(),
    clearErrorLog: () => tenantErrorHandler.clearErrorLog(),
    clearSecurityIncidents: () => tenantErrorHandler.clearSecurityIncidents(),
  };
}
