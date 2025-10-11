// Documentation: /docs/branding-preset-themes/theme-error-boundary.md

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Settings,
  Bug,
  Info,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { themeErrorHandler, ThemeErrorType } from '@/lib/theme-error-handling';

interface ThemeErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  retryCount: number;
}

interface ThemeErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  className?: string;
}

export class ThemeErrorBoundary extends Component<
  ThemeErrorBoundaryProps,
  ThemeErrorBoundaryState
> {
  private resetTimeoutId: number | null = null;

  constructor(props: ThemeErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ThemeErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    
    // Log error to theme error handler
    const themeError = themeErrorHandler.createError(
      ThemeErrorType.UNKNOWN_ERROR,
      `Theme Error Boundary caught error: ${error.message}`,
      {
        error: error.toString(),
        errorInfo: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      },
      {
        operation: 'themeErrorBoundary',
      }
    );

    this.setState({
      error,
      errorInfo,
      errorId: themeError.timestamp.toISOString(),
    });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Theme Error Boundary:', error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ThemeErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError, retryCount } = this.state;

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetOnPropsChange) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  handleRetry = () => {
    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state;
    const { children, fallback, className } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className={className}>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-red-800">
                    Theme Error
                  </CardTitle>
                </div>
                <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                  Error Boundary
                </Badge>
              </div>
              <CardDescription className="text-red-700">
                Something went wrong while rendering the theme components.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-800">Error Details</h4>
                <div className="p-3 bg-red-100 border border-red-200 rounded text-sm">
                  <div className="font-mono text-red-800">
                    {error?.message || 'Unknown error occurred'}
                  </div>
                  {errorId && (
                    <div className="text-xs text-red-600 mt-1">
                      Error ID: {errorId}
                    </div>
                  )}
                  {retryCount > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      Retry attempts: {retryCount}
                    </div>
                  )}
                </div>
              </div>

              {/* Component Stack (Development Only) */}
              {process.env.NODE_ENV === 'development' && errorInfo && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-800">Component Stack</h4>
                  <div className="p-3 bg-red-100 border border-red-200 rounded text-xs font-mono text-red-800 max-h-32 overflow-y-auto">
                    {errorInfo.componentStack}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Go Home
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-red-600">
                If this error persists, please contact support with the Error ID above.
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Fallback components for different theme operations
export function ThemePresetFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle>Theme Presets Unavailable</CardTitle>
          </div>
          <CardDescription>
            Unable to load theme presets. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ThemeCustomizerFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-yellow-600" />
            <CardTitle>Theme Customizer Unavailable</CardTitle>
          </div>
          <CardDescription>
            Unable to load theme customizer. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ThemePreviewFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-yellow-600" />
            <CardTitle>Theme Preview Unavailable</CardTitle>
          </div>
          <CardDescription>
            Unable to load theme preview. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ThemeValidationFallback({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-yellow-600" />
            <CardTitle>Theme Validation Unavailable</CardTitle>
          </div>
          <CardDescription>
            Unable to load theme validation. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Error display component
export function ThemeErrorDisplay({ 
  error, 
  onRetry, 
  className 
}: { 
  error: Error; 
  onRetry?: () => void; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <CardTitle className="text-red-800">Theme Error</CardTitle>
          </div>
          <CardDescription className="text-red-700">
            {error.message || 'An unexpected error occurred'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Success display component
export function ThemeSuccessDisplay({ 
  message, 
  className 
}: { 
  message: string; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-800">Success</CardTitle>
          </div>
          <CardDescription className="text-green-700">
            {message}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

// Loading fallback component
export function ThemeLoadingFallback({ 
  message = 'Loading theme...', 
  className 
}: { 
  message?: string; 
  className?: string; 
}) {
  return (
    <div className={className}>
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Export error boundary with fallbacks
export function withThemeErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ThemeErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ThemeErrorBoundary>
    );
  };
}

export default ThemeErrorBoundary;
