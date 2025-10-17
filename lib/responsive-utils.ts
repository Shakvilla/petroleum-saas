// Documentation: /docs/responsive-design/responsive-utils.md

import { cn } from '@/lib/utils';
import { BREAKPOINTS, getBreakpoint, TOUCH_TARGETS } from '@/lib/responsive-config';

// Responsive class name generation utilities
export function getResponsiveClasses(
  baseClasses: string,
  mobileClasses?: string,
  tabletClasses?: string,
  desktopClasses?: string,
  largeDesktopClasses?: string
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
  
  if (largeDesktopClasses) {
    classes.push(`xl:${largeDesktopClasses}`);
  }
  
  return cn(...classes);
}

// Responsive spacing helpers
export function getResponsiveSpacing(
  width: number,
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
): number {
  const breakpoint = getBreakpoint(width);
  const config = BREAKPOINTS[breakpoint];
  return config.spacing[spacing];
}

// Responsive typography helpers
export function getResponsiveFontSize(
  width: number,
  baseSize: number
): number {
  const breakpoint = getBreakpoint(width);
  const config = BREAKPOINTS[breakpoint];
  return baseSize * config.typography.scale;
}

// Device-specific configuration getters
export function getDeviceConfig(width: number) {
  const breakpoint = getBreakpoint(width);
  return BREAKPOINTS[breakpoint];
}

// Touch target utilities
export function getTouchTargetClass(size: keyof typeof TOUCH_TARGETS): string {
  return TOUCH_TARGETS[size];
}

// Responsive grid utilities
export function getResponsiveGridCols(
  width: number,
  mobileCols: number = 1,
  tabletCols: number = 2,
  desktopCols: number = 3
): string {
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return `grid-cols-${mobileCols}`;
    case 'tablet':
      return `grid-cols-${tabletCols}`;
    case 'desktop':
    case 'largeDesktop':
      return `grid-cols-${desktopCols}`;
    default:
      return `grid-cols-${desktopCols}`;
  }
}

// Responsive container utilities
export function getResponsiveContainerClass(width: number): string {
  const breakpoint = getBreakpoint(width);
  const config = BREAKPOINTS[breakpoint];
  
  if (config.containerWidth === 100) {
    return 'w-full px-4';
  }
  
  return `max-w-${config.containerWidth} mx-auto px-4`;
}

// Responsive visibility utilities
export function getResponsiveVisibility(
  width: number,
  hideOnMobile: boolean = false,
  hideOnTablet: boolean = false,
  hideOnDesktop: boolean = false
): string {
  const breakpoint = getBreakpoint(width);
  const classes = [];
  
  if (hideOnMobile && breakpoint === 'mobile') {
    classes.push('hidden');
  }
  
  if (hideOnTablet && breakpoint === 'tablet') {
    classes.push('hidden');
  }
  
  if (hideOnDesktop && (breakpoint === 'desktop' || breakpoint === 'largeDesktop')) {
    classes.push('hidden');
  }
  
  return cn(...classes);
}

// Responsive image utilities
export function getResponsiveImageSizes(width: number): string {
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return '(max-width: 768px) 100vw, 50vw';
    case 'tablet':
      return '(max-width: 1024px) 50vw, 33vw';
    case 'desktop':
    case 'largeDesktop':
      return '33vw';
    default:
      return '33vw';
  }
}

// Responsive breakpoint utilities
export function isBreakpointUp(width: number, breakpoint: string): boolean {
  const currentBreakpoint = getBreakpoint(width);
  const breakpointOrder = ['mobile', 'tablet', 'desktop', 'largeDesktop'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex >= targetIndex;
}

export function isBreakpointDown(width: number, breakpoint: string): boolean {
  const currentBreakpoint = getBreakpoint(width);
  const breakpointOrder = ['mobile', 'tablet', 'desktop', 'largeDesktop'];
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
  const targetIndex = breakpointOrder.indexOf(breakpoint);
  
  return currentIndex <= targetIndex;
}

// Responsive value utilities
export function getResponsiveValue<T>(
  width: number,
  mobileValue: T,
  tabletValue: T,
  desktopValue: T,
  largeDesktopValue?: T
): T {
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return mobileValue;
    case 'tablet':
      return tabletValue;
    case 'desktop':
      return desktopValue;
    case 'largeDesktop':
      return largeDesktopValue ?? desktopValue;
    default:
      return desktopValue;
  }
}

// Responsive array utilities
export function getResponsiveArrayValue<T>(
  width: number,
  values: [T, T, T, T?] // [mobile, tablet, desktop, largeDesktop?]
): T {
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return values[0];
    case 'tablet':
      return values[1];
    case 'desktop':
      return values[2];
    case 'largeDesktop':
      return values[3] ?? values[2];
    default:
      return values[2];
  }
}

// Responsive media query utilities
export function getResponsiveMediaQuery(breakpoint: string): string {
  const config = BREAKPOINTS[breakpoint];
  return `(min-width: ${config.minWidth}px) and (max-width: ${config.maxWidth}px)`;
}

// Responsive animation utilities
export function getResponsiveAnimation(
  width: number,
  prefersReducedMotion: boolean = false
): string {
  if (prefersReducedMotion) {
    return 'transition-none';
  }
  
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return 'transition-all duration-200 ease-out';
    case 'tablet':
      return 'transition-all duration-300 ease-out';
    case 'desktop':
    case 'largeDesktop':
      return 'transition-all duration-300 ease-out';
    default:
      return 'transition-all duration-300 ease-out';
  }
}

// Responsive z-index utilities
export function getResponsiveZIndex(
  width: number,
  baseZIndex: number = 10
): number {
  const breakpoint = getBreakpoint(width);
  
  switch (breakpoint) {
    case 'mobile':
      return baseZIndex + 5; // Higher z-index for mobile overlays
    case 'tablet':
      return baseZIndex + 2;
    case 'desktop':
    case 'largeDesktop':
      return baseZIndex;
    default:
      return baseZIndex;
  }
}

// Responsive shadow utilities
export function getResponsiveShadow(
  width: number,
  shadowType: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const breakpoint = getBreakpoint(width);
  
  // Mobile devices typically need more prominent shadows
  if (breakpoint === 'mobile') {
    switch (shadowType) {
      case 'sm':
        return 'shadow-md';
      case 'md':
        return 'shadow-lg';
      case 'lg':
        return 'shadow-xl';
      case 'xl':
        return 'shadow-2xl';
    }
  }
  
  // Desktop devices can use more subtle shadows
  switch (shadowType) {
    case 'sm':
      return 'shadow-sm';
    case 'md':
      return 'shadow-md';
    case 'lg':
      return 'shadow-lg';
    case 'xl':
      return 'shadow-xl';
  }
}

// Responsive border radius utilities
export function getResponsiveBorderRadius(
  width: number,
  baseRadius: 'sm' | 'md' | 'lg' | 'xl' = 'md'
): string {
  const breakpoint = getBreakpoint(width);
  
  // Mobile devices often benefit from larger border radius
  if (breakpoint === 'mobile') {
    switch (baseRadius) {
      case 'sm':
        return 'rounded-md';
      case 'md':
        return 'rounded-lg';
      case 'lg':
        return 'rounded-xl';
      case 'xl':
        return 'rounded-2xl';
    }
  }
  
  // Desktop devices use standard border radius
  switch (baseRadius) {
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-md';
    case 'lg':
      return 'rounded-lg';
    case 'xl':
      return 'rounded-xl';
  }
}
