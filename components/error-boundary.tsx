'use client';

import React, { Component, ErrorInfo, ReactNode, memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { ErrorReportingService } from '@/lib/error-reporting';
import { ErrorLoggingService } from '@/lib/error-logging';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
  showDetails?: boolean;
  retryable?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Report error to error reporting service
    ErrorReportingService.reportError(
      error,
      {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
      },
      {
        errorInfo: errorInfo.componentStack,
        level: this.props.level || 'page',
      }
    );

    // Log error to error logging service
    ErrorLoggingService.error(
      error,
      {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
      },
      {
        errorInfo: errorInfo.componentStack,
        level: this.props.level || 'page',
      }
    );

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
    // errorReporting.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const {
        level = 'page',
        showDetails = false,
        retryable = true,
      } = this.props;
      const isDevelopment = process.env.NODE_ENV === 'development';
      const shouldShowDetails = showDetails || isDevelopment;

      // Different layouts based on error level
      if (level === 'component') {
        return (
          <Card className="w-full">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Component Error
                  </p>
                  <p className="text-xs text-gray-500">
                    This component encountered an error
                  </p>
                </div>
                {retryable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={this.handleRetry}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {shouldShowDetails && this.state.error && (
                <div className="mt-3 rounded-md bg-gray-50 p-2 text-xs">
                  <p className="font-medium text-gray-700">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      }

      if (level === 'critical') {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
            <Card className="w-full max-w-lg border-red-200">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <Bug className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-900">
                  Critical System Error
                </CardTitle>
                <CardDescription className="text-red-700">
                  A critical error has occurred. Please contact support
                  immediately.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {shouldShowDetails && this.state.error && (
                  <div className="rounded-md bg-red-100 p-4 text-sm">
                    <p className="font-medium text-red-900">Error Details:</p>
                    <p className="mt-1 text-red-800">
                      {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-red-700">
                          Stack Trace
                        </summary>
                        <pre className="mt-2 overflow-auto text-xs text-red-600">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  {retryable && (
                    <Button onClick={this.handleRetry} className="w-full">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={this.handleGoHome}
                    className="w-full"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Default page-level error
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. Please try again or contact
                support if the problem persists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {shouldShowDetails && this.state.error && (
                <div className="rounded-md bg-gray-100 p-3 text-sm">
                  <p className="font-medium text-gray-900">Error Details:</p>
                  <p className="mt-1 text-gray-700">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-gray-600">
                        Stack Trace
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-gray-600">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-2">
                {retryable && (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    level?: 'page' | 'component' | 'critical';
    showDetails?: boolean;
    retryable?: boolean;
  }
) => {
  return memo(function WrappedComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={options?.fallback}
        level={options?.level}
        showDetails={options?.showDetails}
        retryable={options?.retryable}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  });
};

// Hook for error boundary context
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: ErrorInfo) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by useErrorHandler:', error, errorInfo);
    }

    // TODO: Send to error reporting service
    // Issue: #ERROR-REPORTING-002
    // errorReporting.captureException(error, { extra: errorInfo });
  };

  return { handleError };
}

// Component-level error boundary for specific components
export const ComponentErrorBoundary = memo(function ComponentErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary level="component" fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
});

// Critical error boundary for important sections
export const CriticalErrorBoundary = memo(function CriticalErrorBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary level="critical" fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
});
