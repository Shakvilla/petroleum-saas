/**
 * Tenant-Aware Card Component
 *
 * Extends the EnhancedCard with tenant-specific theming
 * and branding customization support.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTenantAwareDesignSystem } from '@/lib/tenant-aware-design-system';
import {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
  type EnhancedCardProps,
} from './enhanced-card';

const tenantAwareCardVariants = cva(
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        // Base variants
        default: 'shadow-sm border-neutral-200',
        elevated: 'shadow-md hover:shadow-lg border-neutral-200',
        flat: 'shadow-none border-0 bg-neutral-50',
        outlined: 'shadow-none border-2 border-neutral-200',
        interactive:
          'shadow-sm border-neutral-200 hover:shadow-md hover:border-neutral-300 cursor-pointer',
        success: 'shadow-sm border-green-200 bg-green-50',
        warning: 'shadow-sm border-yellow-200 bg-yellow-50',
        error: 'shadow-sm border-red-200 bg-red-50',
        info: 'shadow-sm border-blue-200 bg-blue-50',

        // Tenant-aware variants
        'tenant-branded':
          'shadow-sm border-[var(--tenant-primary)]/20 bg-white hover:shadow-md hover:border-[var(--tenant-primary)]/40',
        'tenant-primary': 'bg-[var(--tenant-primary)] text-white shadow-sm',
        'tenant-outlined':
          'shadow-none border-2 border-[var(--tenant-primary)] bg-white',
        'tenant-elevated':
          'shadow-md border-[var(--tenant-primary)]/10 bg-white hover:shadow-lg hover:border-[var(--tenant-primary)]/20',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      hover: {
        true: 'hover:shadow-md hover:border-neutral-300',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: false,
    },
  }
);

export interface TenantAwareCardProps
  extends Omit<EnhancedCardProps, 'variant'>,
    VariantProps<typeof tenantAwareCardVariants> {
  useTenantTheme?: boolean;
  customTenantColor?: string;
}

const TenantAwareCard = React.forwardRef<HTMLDivElement, TenantAwareCardProps>(
  (
    {
      className,
      variant,
      padding,
      hover,
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
        variant === 'elevated');

    // Get tenant-specific styles
    const tenantStyles = shouldUseTenantTheme ? getTenantStyles() : {};

    // Override with custom color if provided
    if (customTenantColor) {
      tenantStyles['--tenant-primary'] = customTenantColor;
    }

    // Map base variants to tenant variants when tenant theming is enabled
    const mappedVariant = shouldUseTenantTheme
      ? variant === 'default'
        ? 'tenant-branded'
        : variant === 'elevated'
          ? 'tenant-elevated'
          : variant === 'outlined'
            ? 'tenant-outlined'
            : variant
      : variant;

    return (
      <div style={tenantStyles}>
        <div
          ref={ref}
          className={cn(
            tenantAwareCardVariants({
              variant: mappedVariant,
              padding,
              hover,
              className,
            })
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

TenantAwareCard.displayName = 'TenantAwareCard';

// Tenant-aware card sub-components
const TenantAwareCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
TenantAwareCardHeader.displayName = 'TenantAwareCardHeader';

const TenantAwareCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-neutral-900',
      className
    )}
    {...props}
  />
));
TenantAwareCardTitle.displayName = 'TenantAwareCardTitle';

const TenantAwareCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-neutral-600', className)}
    {...props}
  />
));
TenantAwareCardDescription.displayName = 'TenantAwareCardDescription';

const TenantAwareCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
TenantAwareCardContent.displayName = 'TenantAwareCardContent';

const TenantAwareCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
TenantAwareCardFooter.displayName = 'TenantAwareCardFooter';

// Pre-built tenant-aware card variants
export const TenantBrandedCard = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareCardProps, 'variant'>
>((props, ref) => (
  <TenantAwareCard ref={ref} variant="tenant-branded" {...props} />
));
TenantBrandedCard.displayName = 'TenantBrandedCard';

export const TenantPrimaryCard = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareCardProps, 'variant'>
>((props, ref) => (
  <TenantAwareCard ref={ref} variant="tenant-primary" {...props} />
));
TenantPrimaryCard.displayName = 'TenantPrimaryCard';

export const TenantOutlinedCard = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareCardProps, 'variant'>
>((props, ref) => (
  <TenantAwareCard ref={ref} variant="tenant-outlined" {...props} />
));
TenantOutlinedCard.displayName = 'TenantOutlinedCard';

export const TenantElevatedCard = React.forwardRef<
  HTMLDivElement,
  Omit<TenantAwareCardProps, 'variant'>
>((props, ref) => (
  <TenantAwareCard ref={ref} variant="tenant-elevated" {...props} />
));
TenantElevatedCard.displayName = 'TenantElevatedCard';

export {
  TenantAwareCard,
  TenantAwareCardHeader,
  TenantAwareCardFooter,
  TenantAwareCardTitle,
  TenantAwareCardDescription,
  TenantAwareCardContent,
  tenantAwareCardVariants,
};
