// Documentation: /docs/branding-preset-themes/theme-error-boundary-tests.md

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeErrorBoundary } from '../theme-error-boundary';
import { themeErrorHandler } from '@/lib/theme-error-handling';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div className="card-description">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div className="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div className="card-title">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
    <button onClick={onClick} disabled={disabled} className={`button ${className}`}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  ),
}));

// Mock window.location
const mockReload = jest.fn();
const mockHref = jest.fn();

Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
    href: mockHref,
  },
  writable: true,
});

describe('Theme Error Boundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    themeErrorHandler.clearErrors();
  });

  // Component that throws an error
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error message');
    }
    return <div>No error</div>;
  };

  it('should render children when there is no error', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should render error UI when there is an error', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Theme Error')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong while rendering the theme components.')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should show error boundary badge', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Error Boundary')).toBeInTheDocument();
  });

  it('should show retry button', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeInTheDocument();
  });

  it('should show reload page button', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    expect(reloadButton).toBeInTheDocument();
  });

  it('should show go home button', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const goHomeButton = screen.getByText('Go Home');
    expect(goHomeButton).toBeInTheDocument();
  });

  it('should handle retry button click', () => {
    const { rerender } = render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Rerender with no error
    rerender(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should handle reload page button click', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const reloadButton = screen.getByText('Reload Page');
    fireEvent.click(reloadButton);

    expect(mockReload).toHaveBeenCalled();
  });

  it('should handle go home button click', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);

    expect(mockHref).toHaveBeenCalledWith('/');
  });

  it('should show custom fallback when provided', () => {
    const customFallback = <div>Custom fallback UI</div>;

    render(
      <ThemeErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
    expect(screen.queryByText('Theme Error')).not.toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();

    render(
      <ThemeErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Test error message',
      }),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should reset error boundary when resetKeys change', () => {
    const { rerender } = render(
      <ThemeErrorBoundary resetKeys={['key1']} resetOnPropsChange={true}>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Theme Error')).toBeInTheDocument();

    // Change resetKeys
    rerender(
      <ThemeErrorBoundary resetKeys={['key2']} resetOnPropsChange={true}>
        <ThrowError shouldThrow={false} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should show component stack in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText('Component Stack')).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not show component stack in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.queryByText('Component Stack')).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should show error ID', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
  });

  it('should show retry count', () => {
    const { rerender } = render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);

    // Rerender with error again
    rerender(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText(/Retry attempts: 1/)).toBeInTheDocument();
  });

  it('should show help text', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ThemeErrorBoundary>
    );

    expect(screen.getByText(/If this error persists, please contact support/)).toBeInTheDocument();
  });
});
