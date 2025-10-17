// Documentation: /docs/responsive-design/responsive-config.md

/**
 * Responsive Breakpoint Configuration
 * 
 * Centralized breakpoint system for the PetroManager application.
 * Provides consistent breakpoint definitions across all components.
 */

export interface BreakpointConfig {
  name: string;
  minWidth: number;
  maxWidth: number;
  containerWidth: number;
  columns: number;
  gutter: number;
  typography: {
    base: string;
    scale: number;
    lineHeight: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface ResponsiveState {
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  viewportWidth: number;
  viewportHeight: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Breakpoint configurations
export const BREAKPOINTS: Record<string, BreakpointConfig> = {
  mobile: {
    name: 'mobile',
    minWidth: 320,
    maxWidth: 767,
    containerWidth: 100,
    columns: 4,
    gutter: 16,
    typography: {
      base: '14px',
      scale: 1.125,
      lineHeight: 1.5
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32
    }
  },
  tablet: {
    name: 'tablet',
    minWidth: 768,
    maxWidth: 1023,
    containerWidth: 90,
    columns: 8,
    gutter: 24,
    typography: {
      base: '16px',
      scale: 1.2,
      lineHeight: 1.6
    },
    spacing: {
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48
    }
  },
  desktop: {
    name: 'desktop',
    minWidth: 1024,
    maxWidth: 1439,
    containerWidth: 1200,
    columns: 12,
    gutter: 32,
    typography: {
      base: '16px',
      scale: 1.25,
      lineHeight: 1.6
    },
    spacing: {
      xs: 8,
      sm: 16,
      md: 32,
      lg: 48,
      xl: 64
    }
  },
  largeDesktop: {
    name: 'largeDesktop',
    minWidth: 1440,
    maxWidth: Infinity,
    containerWidth: 1400,
    columns: 16,
    gutter: 40,
    typography: {
      base: '18px',
      scale: 1.3,
      lineHeight: 1.7
    },
    spacing: {
      xs: 12,
      sm: 24,
      md: 40,
      lg: 64,
      xl: 80
    }
  }
};

// Breakpoint order for iteration
export const BREAKPOINT_ORDER = ['mobile', 'tablet', 'desktop', 'largeDesktop'] as const;

// Utility functions
export function getBreakpoint(width: number): string {
  for (const breakpointName of BREAKPOINT_ORDER) {
    const config = BREAKPOINTS[breakpointName];
    if (width >= config.minWidth && width <= config.maxWidth) {
      return breakpointName;
    }
  }
  return 'desktop'; // fallback
}

export function getBreakpointConfig(width: number): BreakpointConfig {
  const breakpointName = getBreakpoint(width);
  return BREAKPOINTS[breakpointName];
}

export function isBreakpoint(width: number, breakpoint: string): boolean {
  return getBreakpoint(width) === breakpoint;
}

export function isMobile(width: number): boolean {
  return isBreakpoint(width, 'mobile');
}

export function isTablet(width: number): boolean {
  return isBreakpoint(width, 'tablet');
}

export function isDesktop(width: number): boolean {
  return isBreakpoint(width, 'desktop');
}

export function isLargeDesktop(width: number): boolean {
  return isBreakpoint(width, 'largeDesktop');
}

// CSS breakpoint values for Tailwind compatibility
export const CSS_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Touch target sizes
export const TOUCH_TARGETS = {
  minimum: 44, // iOS/Android minimum touch target
  comfortable: 48, // Comfortable touch target
  large: 56 // Large touch target for important actions
} as const;

// Safe area insets for mobile devices
export function getSafeAreaInsets(): ResponsiveState['safeAreaInsets'] {
  if (typeof window === 'undefined') {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const computedStyle = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
    bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
    left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
    right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0')
  };
}

// Orientation detection
export function getOrientation(): 'portrait' | 'landscape' {
  if (typeof window === 'undefined') {
    return 'portrait';
  }
  
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

// Device type detection
export function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (isMobile(width)) return 'mobile';
  if (isTablet(width)) return 'tablet';
  return 'desktop';
}

// Responsive class name generation
export function getResponsiveClasses(
  baseClasses: string,
  mobileClasses?: string,
  tabletClasses?: string,
  desktopClasses?: string
): string {
  const classes = [baseClasses];
  
  if (mobileClasses) {
    classes.push(`sm:${mobileClasses}`);
  }
  
  if (tabletClasses) {
    classes.push(`md:${tabletClasses}`);
  }
  
  if (desktopClasses) {
    classes.push(`lg:${desktopClasses}`);
  }
  
  return classes.join(' ');
}

// Grid column utilities
export function getGridColumns(breakpoint: string): number {
  return BREAKPOINTS[breakpoint]?.columns || 12;
}

export function getContainerWidth(breakpoint: string): number {
  return BREAKPOINTS[breakpoint]?.containerWidth || 1200;
}

export function getGutterSize(breakpoint: string): number {
  return BREAKPOINTS[breakpoint]?.gutter || 32;
}
