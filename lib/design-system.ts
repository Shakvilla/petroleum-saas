/**
 * Design System Tokens and Utilities
 *
 * This file provides a centralized design system that extends the existing
 * shadcn/ui foundation with consistent patterns for the PetroManager platform.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind classes
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Design System Color Tokens
export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Semantic colors
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
    },
  },

  // Neutral colors
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;

// Typography Scale
export const typography = {
  // Font families
  fontFamily: {
    sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// Spacing Scale
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

// Component Variants
export const componentVariants = {
  // Button variants
  button: {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary:
      'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2',
    outline:
      'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    ghost:
      'text-neutral-700 hover:bg-neutral-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    destructive:
      'bg-semantic-error-600 text-white hover:bg-semantic-error-700 focus:ring-2 focus:ring-semantic-error-500 focus:ring-offset-2',
  },

  // Card variants
  card: {
    default: 'bg-white border border-neutral-200 rounded-lg shadow-sm',
    elevated:
      'bg-white border border-neutral-200 rounded-lg shadow-md hover:shadow-lg transition-shadow',
    flat: 'bg-neutral-50 border-0 rounded-lg',
    outlined: 'bg-white border-2 border-neutral-200 rounded-lg',
  },

  // Badge variants
  badge: {
    default: 'bg-primary-100 text-primary-800 border border-primary-200',
    success:
      'bg-semantic-success-100 text-semantic-success-800 border border-semantic-success-200',
    warning:
      'bg-semantic-warning-100 text-semantic-warning-800 border border-semantic-warning-200',
    error:
      'bg-semantic-error-100 text-semantic-error-800 border border-semantic-error-200',
    info: 'bg-semantic-info-100 text-semantic-info-800 border border-semantic-info-200',
    neutral: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
  },

  // Status indicators
  status: {
    active:
      'bg-semantic-success-100 text-semantic-success-800 border border-semantic-success-200',
    inactive: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    pending:
      'bg-semantic-warning-100 text-semantic-warning-800 border border-semantic-warning-200',
    error:
      'bg-semantic-error-100 text-semantic-error-800 border border-semantic-error-200',
  },
} as const;

// Responsive Breakpoints (aligned with responsive-config.ts)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Touch Target Sizes (aligned with responsive-config.ts)
export const touchTargets = {
  minimum: 'min-h-[44px] min-w-[44px]',
  comfortable: 'min-h-[48px] min-w-[48px]',
  large: 'min-h-[56px] min-w-[56px]',
} as const;

// Animation Durations
export const animations = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
} as const;

// Z-Index Scale
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;

// Utility Functions
export const designSystemUtils = {
  // Get color with opacity
  colorWithOpacity: (color: string, opacity: number) => {
    return `${color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`;
  },

  // Get responsive class
  responsive: (classes: Record<string, string>) => {
    return Object.entries(classes)
      .map(([breakpoint, className]) => {
        if (breakpoint === 'base') return className;
        return `${breakpoint}:${className}`;
      })
      .join(' ');
  },

  // Get status color
  getStatusColor: (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'semantic-success',
      inactive: 'neutral',
      pending: 'semantic-warning',
      error: 'semantic-error',
      success: 'semantic-success',
      warning: 'semantic-warning',
    };
    return statusMap[status.toLowerCase()] || 'neutral';
  },
} as const;

// Export all design system tokens
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  componentVariants,
  breakpoints,
  touchTargets,
  animations,
  zIndex,
  utils: designSystemUtils,
} as const;

export default designSystem;
