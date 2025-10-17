// Documentation: /docs/responsive-design/responsive-provider-tests.md

import { render, screen, act } from '@testing-library/react';
import { ResponsiveProvider, useResponsive, useDeviceType, useViewport } from '@/components/responsive-provider';

// Mock window methods
const mockResize = jest.fn();
const mockOrientationChange = jest.fn();

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: jest.fn((event, handler) => {
    if (event === 'resize') mockResize.mockImplementation(handler);
    if (event === 'orientationchange') mockOrientationChange.mockImplementation(handler);
  }),
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: jest.fn(),
});

// Test component to access context
function TestComponent() {
  const responsive = useResponsive();
  const deviceType = useDeviceType();
  const viewport = useViewport();

  return (
    <div>
      <div data-testid="breakpoint">{responsive.state.breakpoint}</div>
      <div data-testid="is-mobile">{responsive.isMobile.toString()}</div>
      <div data-testid="is-tablet">{responsive.isTablet.toString()}</div>
      <div data-testid="is-desktop">{responsive.isDesktop.toString()}</div>
      <div data-testid="viewport-width">{viewport.width}</div>
      <div data-testid="viewport-height">{viewport.height}</div>
      <div data-testid="orientation">{viewport.orientation}</div>
      <div data-testid="device-type-mobile">{deviceType.isMobile.toString()}</div>
      <div data-testid="device-type-tablet">{deviceType.isTablet.toString()}</div>
      <div data-testid="device-type-desktop">{deviceType.isDesktop.toString()}</div>
    </div>
  );
}

describe('ResponsiveProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide responsive context with default values', () => {
    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('desktop');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('true');
  });

  it('should detect mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('mobile');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
  });

  it('should detect tablet breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 768 });
    Object.defineProperty(window, 'innerHeight', { value: 1024 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('tablet');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('true');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
  });

  it('should detect large desktop breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1440 });
    Object.defineProperty(window, 'innerHeight', { value: 900 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('largeDesktop');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('is-desktop')).toHaveTextContent('false');
  });

  it('should handle orientation changes', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    Object.defineProperty(window, 'innerHeight', { value: 667 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('orientation')).toHaveTextContent('portrait');

    // Simulate orientation change
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 667 });
      Object.defineProperty(window, 'innerHeight', { value: 375 });
      mockOrientationChange();
    });

    expect(screen.getByTestId('orientation')).toHaveTextContent('landscape');
  });

  it('should handle window resize', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024 });
    Object.defineProperty(window, 'innerHeight', { value: 768 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('desktop');

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      mockResize();
    });

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('mobile');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
  });

  it('should provide viewport dimensions', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    Object.defineProperty(window, 'innerHeight', { value: 800 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('viewport-width')).toHaveTextContent('1200');
    expect(screen.getByTestId('viewport-height')).toHaveTextContent('800');
  });

  it('should provide device type helpers', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 });

    render(
      <ResponsiveProvider>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('device-type-mobile')).toHaveTextContent('true');
    expect(screen.getByTestId('device-type-tablet')).toHaveTextContent('false');
    expect(screen.getByTestId('device-type-desktop')).toHaveTextContent('false');
  });

  it('should throw error when used outside provider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useResponsive must be used within a ResponsiveProvider');
    
    consoleError.mockRestore();
  });

  it('should accept initial state', () => {
    const initialState = {
      breakpoint: 'mobile' as const,
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      isLargeDesktop: false,
      orientation: 'portrait' as const,
      viewportWidth: 375,
      viewportHeight: 667,
      safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
    };

    render(
      <ResponsiveProvider initialState={initialState}>
        <TestComponent />
      </ResponsiveProvider>
    );

    expect(screen.getByTestId('breakpoint')).toHaveTextContent('mobile');
    expect(screen.getByTestId('is-mobile')).toHaveTextContent('true');
  });
});
