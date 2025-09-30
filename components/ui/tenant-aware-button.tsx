/**
 * Tenant-Aware Button Component
 *
 * Extends the EnhancedButton with tenant-specific theming
 * and branding customization support.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTenantAwareDesignSystem } from '@/lib/tenant-aware-design-system';
import { EnhancedButton, type EnhancedButtonProps } from './enhanced-button';

const tenantAwareButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Base variants
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary',
        ghost:
          'hover:bg-accent hover:text-accent-foreground focus:ring-primary',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
        success:
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        warning:
          'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
        link: 'text-primary underline-offset-4 hover:underline focus:ring-primary',

        // Tenant-aware variants
        'tenant-primary':
          'bg-[var(--tenant-primary)] text-white hover:bg-[var(--tenant-primary)]/90 focus:ring-[var(--tenant-primary)]',
        'tenant-secondary':
          'bg-[var(--tenant-secondary)] text-white hover:bg-[var(--tenant-secondary)]/90 focus:ring-[var(--tenant-secondary)]',
        'tenant-outline':
          'border border-[var(--tenant-primary)] bg-transparent text-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)] hover:text-white focus:ring-[var(--tenant-primary)]',
        'tenant-ghost':
          'text-[var(--tenant-primary)] hover:bg-[var(--tenant-primary)]/10 focus:ring-[var(--tenant-primary)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface TenantAwareButtonProps
  extends Omit<EnhancedButtonProps, 'variant'>,
    VariantProps<typeof tenantAwareButtonVariants> {
  useTenantTheme?: boolean;
  customTenantColor?: string;
}

const TenantAwareButton = React.forwardRef<
  HTMLButtonElement,
  TenantAwareButtonProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
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
        variant === 'primary' ||
        variant === 'outline');

    // Get tenant-specific styles
    const tenantStyles = shouldUseTenantTheme ? getTenantStyles() : {};

    // Override with custom color if provided
    if (customTenantColor) {
      tenantStyles['--tenant-primary'] = customTenantColor;
    }

    // Map base variants to tenant variants when tenant theming is enabled
    const mappedVariant = shouldUseTenantTheme
      ? variant === 'primary'
        ? 'tenant-primary'
        : variant === 'outline'
          ? 'tenant-outline'
          : variant === 'ghost'
            ? 'tenant-ghost'
            : variant
      : variant;

    return (
      <div style={tenantStyles}>
        <button
          className={cn(
            tenantAwareButtonVariants({
              variant: mappedVariant,
              size,
              fullWidth,
              className,
            })
          )}
          ref={ref}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);

TenantAwareButton.displayName = 'TenantAwareButton';

// Pre-built tenant-aware button variants
export const TenantPrimaryButton = React.forwardRef<
  HTMLButtonElement,
  Omit<TenantAwareButtonProps, 'variant'>
>((props, ref) => (
  <TenantAwareButton ref={ref} variant="tenant-primary" {...props} />
));
TenantPrimaryButton.displayName = 'TenantPrimaryButton';

export const TenantSecondaryButton = React.forwardRef<
  HTMLButtonElement,
  Omit<TenantAwareButtonProps, 'variant'>
>((props, ref) => (
  <TenantAwareButton ref={ref} variant="tenant-secondary" {...props} />
));
TenantSecondaryButton.displayName = 'TenantSecondaryButton';

export const TenantOutlineButton = React.forwardRef<
  HTMLButtonElement,
  Omit<TenantAwareButtonProps, 'variant'>
>((props, ref) => (
  <TenantAwareButton ref={ref} variant="tenant-outline" {...props} />
));
TenantOutlineButton.displayName = 'TenantOutlineButton';

export const TenantGhostButton = React.forwardRef<
  HTMLButtonElement,
  Omit<TenantAwareButtonProps, 'variant'>
>((props, ref) => (
  <TenantAwareButton ref={ref} variant="tenant-ghost" {...props} />
));
TenantGhostButton.displayName = 'TenantGhostButton';

export { TenantAwareButton, tenantAwareButtonVariants };
