// Documentation: /docs/responsive-design/responsive-provider.md

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  ResponsiveState, 
  getBreakpoint, 
  getOrientation, 
  getSafeAreaInsets,
  BREAKPOINTS 
} from '@/lib/responsive-config';

interface ResponsiveContextType {
  state: ResponsiveState;
  updateState: (newState: Partial<ResponsiveState>) => void;
  getBreakpointConfig: () => typeof BREAKPOINTS[keyof typeof BREAKPOINTS];
  isBreakpoint: (breakpoint: string) => boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

interface ResponsiveProviderProps {
  children: ReactNode;
  initialState?: Partial<ResponsiveState>;
}

export function ResponsiveProvider({ children, initialState }: ResponsiveProviderProps) {
  const [state, setState] = useState<ResponsiveState>(() => {
    const defaultState: ResponsiveState = {
      breakpoint: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: false,
      orientation: 'portrait',
      viewportWidth: 1024,
      viewportHeight: 768,
      safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
      ...initialState
    };

    // Initialize with current viewport if available
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = getBreakpoint(width);
      const orientation = getOrientation();
      const safeAreaInsets = getSafeAreaInsets();

      return {
        ...defaultState,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
        isLargeDesktop: breakpoint === 'largeDesktop',
        orientation,
        viewportWidth: width,
        viewportHeight: height,
        safeAreaInsets
      };
    }

    return defaultState;
  });

  const updateState = (newState: Partial<ResponsiveState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const getBreakpointConfig = () => {
    return BREAKPOINTS[state.breakpoint];
  };

  const isBreakpoint = (breakpoint: string) => {
    return state.breakpoint === breakpoint;
  };

  // Handle viewport changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = getBreakpoint(width);
      const orientation = getOrientation();
      const safeAreaInsets = getSafeAreaInsets();

      setState(prev => ({
        ...prev,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet',
        isDesktop: breakpoint === 'desktop',
        isLargeDesktop: breakpoint === 'largeDesktop',
        orientation,
        viewportWidth: width,
        viewportHeight: height,
        safeAreaInsets
      }));
    };

    const handleOrientationChange = () => {
      // Small delay to ensure viewport dimensions are updated
      setTimeout(handleResize, 100);
    };

    // Initial setup
    handleResize();

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const contextValue: ResponsiveContextType = {
    state,
    updateState,
    getBreakpointConfig,
    isBreakpoint,
    isMobile: state.isMobile,
    isTablet: state.isTablet,
    isDesktop: state.isDesktop,
    isLargeDesktop: state.isLargeDesktop
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

// Hook to use responsive context
export function useResponsive(): ResponsiveContextType {
  const context = useContext(ResponsiveContext);
  
  if (context === undefined) {
    throw new Error('useResponsive must be used within a ResponsiveProvider');
  }
  
  return context;
}

// Hook for breakpoint-specific logic
export function useBreakpoint(breakpoint: string): boolean {
  const { isBreakpoint } = useResponsive();
  return isBreakpoint(breakpoint);
}

// Hook for device type checks
export function useDeviceType() {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isMobileOrTablet: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLargeDesktop
  };
}

// Hook for viewport dimensions
export function useViewport() {
  const { state } = useResponsive();
  
  return {
    width: state.viewportWidth,
    height: state.viewportHeight,
    orientation: state.orientation,
    safeAreaInsets: state.safeAreaInsets
  };
}

// Hook for responsive configuration
export function useResponsiveConfig() {
  const { getBreakpointConfig, state } = useResponsive();
  
  return {
    config: getBreakpointConfig(),
    breakpoint: state.breakpoint,
    columns: getBreakpointConfig().columns,
    containerWidth: getBreakpointConfig().containerWidth,
    gutter: getBreakpointConfig().gutter,
    typography: getBreakpointConfig().typography,
    spacing: getBreakpointConfig().spacing
  };
}

// Higher-order component for responsive behavior
export function withResponsive<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ResponsiveComponent(props: P) {
    return (
      <ResponsiveProvider>
        <Component {...props} />
      </ResponsiveProvider>
    );
  };
}

// Utility hook for responsive class names
export function useResponsiveClasses(
  baseClasses: string,
  mobileClasses?: string,
  tabletClasses?: string,
  desktopClasses?: string
): string {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  const classes = [baseClasses];
  
  if (isMobile && mobileClasses) {
    classes.push(mobileClasses);
  }
  
  if (isTablet && tabletClasses) {
    classes.push(tabletClasses);
  }
  
  if (isDesktop && desktopClasses) {
    classes.push(desktopClasses);
  }
  
  return classes.join(' ');
}

// Hook for responsive values
export function useResponsiveValue<T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return mobileValue;
  if (isTablet) return tabletValue;
  return desktopValue;
}

// Hook for responsive array values
export function useResponsiveArray<T>(
  values: [T, T, T] // [mobile, tablet, desktop]
): T {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) return values[0];
  if (isTablet) return values[1];
  return values[2];
}
