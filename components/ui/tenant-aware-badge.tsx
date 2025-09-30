/**
 * Tenant-Aware Badge Component
 *
 * Extends the EnhancedBadge with tenant-specific theming
 * and branding customization support.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTenantAwareDesignSystem } from '@/lib/tenant-aware-design-system';
import {
  EnhancedBadge,
  type EnhancedBadgeProps,
  getBadgeVariantFromStatus,
  getBadgeVariantFromRole,
} from './enhanced-badge';

const tenantAwareBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Base variants
        default:
          'border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200',
        secondary:
          'border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        destructive:
          'border-transparent bg-red-100 text-red-800 hover:bg-red-200',
        outline: 'text-neutral-700 border-neutral-300',
        success:
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        warning:
          'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',

        // Status variants
        active:
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        inactive:
          'border-transparent bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
        pending:
          'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        error: 'border-transparent bg-red-100 text-red-800 hover:bg-red-200',

        // Role variants
        admin:
          'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200',
        manager:
          'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        operator:
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        viewer:
          'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200',

        // Tenant-aware variants
        'tenant-primary':
          'border-transparent bg-[var(--tenant-primary)]/10 text-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)]/20',
        'tenant-secondary':
          'border-transparent bg-[var(--tenant-secondary)]/10 text-[var(--tenant-secondary)] hover:bg-[var(--tenant-secondary)]/20',
        'tenant-outline':
          'bg-transparent text-[var(--tenant-primary)] border border-[var(--tenant-primary)]/30 hover:border-[var(--tenant-primary)]/50',
        'tenant-solid':
          'border-transparent bg-[var(--tenant-primary)] text-white hover:bg-[var(--tenant-primary)]/90',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      dot: {
        true: 'pl-1.5',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      dot: false,
    },
  }
);

export interface TenantAwareBadgeProps
  extends Omit<EnhancedBadgeProps, 'variant'>,
    VariantProps<typeof tenantAwareBadgeVariants> {
  useTenantTheme?: boolean;
  customTenantColor?: string;
}

const TenantAwareBadge = React.forwardRef<
  HTMLDivElement,
  TenantAwareBadgeProps
>(
  (
    {
      className,
      variant,
      size,
      dot,
      dotColor,
      useTenantTheme = true,
      customTenantColor,
      children,
      ...props
    },
    ref
  ) => {
    const { tenant, getTenantStyles } = useTenantAwareDesignSystem();

    // Determine if we should use tenant theming
    const shouldUseTenantTheme =
      useTenantTheme &&
      tenant &&
      (variant?.startsWith('tenant-') ||
        variant === 'default' ||
        variant === 'outline');

    // Get tenant-specific styles
    const tenantStyles = shouldUseTenantTheme ? getTenantStyles() : {};

    // Override with custom color if provided
    if (customTenantColor) {
      tenantStyles['--tenant-primary'] = customTenantColor;
    }

    // Map base variants to tenant variants when tenant theming is enabled
    const mappedVariant = shouldUseTenantTheme
      ? variant === 'default'
        ? 'tenant-primary'
        : variant === 'outline'
          ? 'tenant-outline'
          : variant
      : variant;

    return (
      <div style={tenantStyles}>
        <div
          ref={ref}
          className={cn(
            tenantAwareBadgeVariants({
              variant: mappedVariant,
              size,
              dot,
              className,
            })
          )}
          {...props}
        >
          {dot && (
            <div
              className="mr-1 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: dotColor || 'currentColor' }}
            />
          )}
          {children}
        </div>
      </div>
    );
  }
);

TenantAwareBadge.displayName = 'TenantAwareBadge';

// Pre-built tenant-aware badge variants
export const TenantPrimaryBadge = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareBadgeProps, 'variant'>
>((props, ref) => (
  <TenantAwareBadge ref={ref} variant="tenant-primary" {...props} />
));
TenantPrimaryBadge.displayName = 'TenantPrimaryBadge';

export const TenantSecondaryBadge = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareBadgeProps, 'variant'>
>((props, ref) => (
  <TenantAwareBadge ref={ref} variant="tenant-secondary" {...props} />
));
TenantSecondaryBadge.displayName = 'TenantSecondaryBadge';

export const TenantOutlineBadge = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareBadgeProps, 'variant'>
>((props, ref) => (
  <TenantAwareBadge ref={ref} variant="tenant-outline" {...props} />
));
TenantOutlineBadge.displayName = 'TenantOutlineBadge';

export const TenantSolidBadge = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareBadgeProps, 'variant'>
>((props, ref) => (
  <TenantAwareBadge ref={ref} variant="tenant-solid" {...props} />
));
TenantSolidBadge.displayName = 'TenantSolidBadge';

// Enhanced utility functions for tenant-aware badges
export const getTenantAwareBadgeVariantFromStatus = (
  status: string,
  useTenantTheme = true
): VariantProps<typeof tenantAwareBadgeVariants>['variant'] => {
  const baseVariant = getBadgeVariantFromStatus(status);

  if (
    useTenantTheme &&
    (baseVariant === 'default' || baseVariant === 'outline')
  ) {
    return baseVariant === 'default' ? 'tenant-primary' : 'tenant-outline';
  }

  return baseVariant;
};

export const getTenantAwareBadgeVariantFromRole = (
  role: string,
  useTenantTheme = true
): VariantProps<typeof tenantAwareBadgeVariants>['variant'] => {
  const baseVariant = getBadgeVariantFromRole(role);

  if (
    useTenantTheme &&
    (baseVariant === 'default' || baseVariant === 'outline')
  ) {
    return baseVariant === 'default' ? 'tenant-primary' : 'tenant-outline';
  }

  return baseVariant;
};

export { TenantAwareBadge, tenantAwareBadgeVariants };
