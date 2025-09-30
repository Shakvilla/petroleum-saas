import React, { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AccessibleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
}

export const AccessibleInput = forwardRef<
  HTMLInputElement,
  AccessibleInputProps
>(
  (
    {
      className,
      label,
      error,
      helperText,
      required = false,
      showRequiredIndicator = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(' ');

    return (
      <div className="space-y-2">
        <Label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium',
            error && 'text-red-600',
            required &&
              showRequiredIndicator &&
              'after:content-["*"] after:text-red-500 after:ml-1'
          )}
        >
          {label}
        </Label>

        <Input
          ref={ref}
          id={inputId}
          className={cn(
            'transition-colors',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          aria-required={required}
          {...props}
        />

        {helperText && (
          <p id={helperId} className="text-sm text-gray-600">
            {helperText}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';
