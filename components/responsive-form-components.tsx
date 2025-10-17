// Documentation: /docs/responsive-design/responsive-form-components.md

'use client';

import React from 'react';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// Form field variants
type FormFieldVariant = 'default' | 'compact' | 'spacious';
type FormFieldSize = 'sm' | 'md' | 'lg';

// Base form field props
interface BaseFormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: FormFieldVariant;
  size?: FormFieldSize;
}

// Responsive form field wrapper
interface ResponsiveFormFieldProps extends BaseFormFieldProps {
  children: React.ReactNode;
  id?: string;
}

export function ResponsiveFormField({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  children,
  id,
}: ResponsiveFormFieldProps) {
  const { isMobile, isTablet } = useResponsive();

  const getSizeClasses = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'space-y-1';
        case 'lg':
          return 'space-y-3';
        default:
          return 'space-y-2';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'space-y-1';
      case 'lg':
        return 'space-y-3';
      default:
        return 'space-y-2';
    }
  };

  const getLabelSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'text-xs';
        case 'lg':
          return 'text-sm';
        default:
          return 'text-sm';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <div className={cn('w-full', getSizeClasses(), className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            'font-medium text-gray-700',
            getLabelSize(),
            required && 'after:content-["*"] after:ml-1 after:text-red-500',
            disabled && 'text-gray-400'
          )}
        >
          {label}
        </Label>
      )}
      
      {description && (
        <p className={cn(
          'text-gray-500',
          isMobile ? 'text-xs' : 'text-sm'
        )}>
          {description}
        </p>
      )}
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <div className="flex items-center space-x-1">
          <AlertCircle className={cn(
            'text-red-500',
            isMobile ? 'h-3 w-3' : 'h-4 w-4'
          )} />
          <span className={cn(
            'text-red-600',
            isMobile ? 'text-xs' : 'text-sm'
          )}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}

// Responsive text input
interface ResponsiveInputProps extends BaseFormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

export function ResponsiveInput({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  name,
  autoComplete,
  showPasswordToggle = false,
}: ResponsiveInputProps) {
  const { isMobile, isTablet } = useResponsive();
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputType, setInputType] = React.useState(type);

  React.useEffect(() => {
    if (type === 'password' && showPasswordToggle) {
      setInputType(showPassword ? 'text' : 'password');
    } else {
      setInputType(type);
    }
  }, [type, showPassword, showPasswordToggle]);

  const getInputSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'h-8 text-sm';
        case 'lg':
          return 'h-12 text-base';
        default:
          return 'h-10 text-sm';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'h-8 text-sm';
      case 'lg':
        return 'h-12 text-base';
      default:
        return 'h-10 text-base';
    }
  };

  return (
    <ResponsiveFormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
      id={id}
    >
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            getInputSize(),
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            showPasswordToggle && type === 'password' && 'pr-10'
          )}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600',
              isMobile ? 'p-1' : 'p-1.5'
            )}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className={cn(
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            ) : (
              <Eye className={cn(
                isMobile ? 'h-3 w-3' : 'h-4 w-4'
              )} />
            )}
          </button>
        )}
      </div>
    </ResponsiveFormField>
  );
}

// Responsive textarea
interface ResponsiveTextareaProps extends BaseFormFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export function ResponsiveTextarea({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  name,
  rows = 3,
  resize = 'vertical',
}: ResponsiveTextareaProps) {
  const { isMobile } = useResponsive();

  const getTextareaSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'text-sm min-h-[60px]';
        case 'lg':
          return 'text-base min-h-[120px]';
        default:
          return 'text-sm min-h-[80px]';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'text-sm min-h-[60px]';
      case 'lg':
        return 'text-base min-h-[120px]';
      default:
        return 'text-base min-h-[100px]';
    }
  };

  const getResizeClass = () => {
    switch (resize) {
      case 'none':
        return 'resize-none';
      case 'vertical':
        return 'resize-y';
      case 'horizontal':
        return 'resize-x';
      case 'both':
        return 'resize';
      default:
        return 'resize-y';
    }
  };

  return (
    <ResponsiveFormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
      id={id}
    >
      <Textarea
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        className={cn(
          getTextareaSize(),
          getResizeClass(),
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
      />
    </ResponsiveFormField>
  );
}

// Responsive select
interface ResponsiveSelectProps extends BaseFormFieldProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export function ResponsiveSelect({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  placeholder,
  value,
  onChange,
  onBlur,
  id,
  name,
  options,
}: ResponsiveSelectProps) {
  const { isMobile } = useResponsive();

  const getSelectSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'h-8 text-sm';
        case 'lg':
          return 'h-12 text-base';
        default:
          return 'h-10 text-sm';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'h-8 text-sm';
      case 'lg':
        return 'h-12 text-base';
      default:
        return 'h-10 text-base';
    }
  };

  return (
    <ResponsiveFormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
      id={id}
    >
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          name={name}
          onBlur={onBlur}
          className={cn(
            getSelectSize(),
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ResponsiveFormField>
  );
}

// Responsive checkbox
interface ResponsiveCheckboxProps extends BaseFormFieldProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  value?: string;
}

export function ResponsiveCheckbox({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  checked,
  onChange,
  onBlur,
  id,
  name,
  value,
}: ResponsiveCheckboxProps) {
  const { isMobile } = useResponsive();

  const getCheckboxSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'h-3 w-3';
        case 'lg':
          return 'h-5 w-5';
        default:
          return 'h-4 w-4';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <Checkbox
        id={id}
        name={name}
        value={value}
        checked={checked}
        onCheckedChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          getCheckboxSize(),
          error && 'border-red-500'
        )}
      />
      
      <div className="flex-1">
        {label && (
          <Label
            htmlFor={id}
            className={cn(
              'font-medium text-gray-700 cursor-pointer',
              isMobile ? 'text-sm' : 'text-sm',
              required && 'after:content-["*"] after:ml-1 after:text-red-500',
              disabled && 'text-gray-400 cursor-not-allowed'
            )}
          >
            {label}
          </Label>
        )}
        
        {description && (
          <p className={cn(
            'text-gray-500 mt-1',
            isMobile ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        )}
        
        {error && (
          <div className="flex items-center space-x-1 mt-1">
            <AlertCircle className={cn(
              'text-red-500',
              isMobile ? 'h-3 w-3' : 'h-4 w-4'
            )} />
            <span className={cn(
              'text-red-600',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Responsive radio group
interface ResponsiveRadioGroupProps extends BaseFormFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  name?: string;
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>;
  orientation?: 'horizontal' | 'vertical';
}

export function ResponsiveRadioGroup({
  label,
  description,
  error,
  required,
  disabled,
  className,
  variant = 'default',
  size = 'md',
  value,
  onChange,
  onBlur,
  id,
  name,
  options,
  orientation = 'vertical',
}: ResponsiveRadioGroupProps) {
  const { isMobile } = useResponsive();

  const getRadioSize = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'h-3 w-3';
        case 'lg':
          return 'h-5 w-5';
        default:
          return 'h-4 w-4';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };

  return (
    <ResponsiveFormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      variant={variant}
      size={size}
      className={className}
      id={id}
    >
      <RadioGroup
        value={value}
        onValueChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          orientation === 'horizontal' && !isMobile ? 'flex flex-wrap gap-6' : 'space-y-3'
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={option.value}
              id={`${id}-${option.value}`}
              name={name}
              disabled={option.disabled || disabled}
              className={cn(
                getRadioSize(),
                error && 'border-red-500'
              )}
            />
            <div className="flex-1">
              <Label
                htmlFor={`${id}-${option.value}`}
                className={cn(
                  'font-medium text-gray-700 cursor-pointer',
                  isMobile ? 'text-sm' : 'text-sm',
                  (option.disabled || disabled) && 'text-gray-400 cursor-not-allowed'
                )}
              >
                {option.label}
              </Label>
              {option.description && (
                <p className={cn(
                  'text-gray-500 mt-1',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
    </ResponsiveFormField>
  );
}

// Responsive form actions
interface ResponsiveFormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
  spacing?: 'sm' | 'md' | 'lg';
}

export function ResponsiveFormActions({
  children,
  className,
  align = 'right',
  spacing = 'md',
}: ResponsiveFormActionsProps) {
  const { isMobile } = useResponsive();

  const getAlignClasses = () => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'between':
        return 'justify-between';
      default:
        return 'justify-end';
    }
  };

  const getSpacingClasses = () => {
    if (isMobile) {
      switch (spacing) {
        case 'sm':
          return 'space-y-2';
        case 'lg':
          return 'space-y-4';
        default:
          return 'space-y-3';
      }
    }
    
    switch (spacing) {
      case 'sm':
        return 'space-x-2';
      case 'lg':
        return 'space-x-4';
      default:
        return 'space-x-3';
    }
  };

  return (
    <div
      className={cn(
        'flex items-center',
        isMobile ? 'flex-col' : 'flex-row',
        getAlignClasses(),
        getSpacingClasses(),
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive form section
interface ResponsiveFormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export function ResponsiveFormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultExpanded = true,
}: ResponsiveFormSectionProps) {
  const { isMobile } = useResponsive();
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className={cn(
      'border border-gray-200 rounded-lg',
      isMobile ? 'p-4' : 'p-6',
      className
    )}>
      {(title || description) && (
        <div className={cn(
          'mb-4',
          collapsible && 'cursor-pointer'
        )}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className={cn(
                  'font-semibold text-gray-900',
                  isMobile ? 'text-base' : 'text-lg'
                )}>
                  {title}
                </h3>
              )}
              {description && (
                <p className={cn(
                  'text-gray-600 mt-1',
                  isMobile ? 'text-sm' : 'text-base'
                )}>
                  {description}
                </p>
              )}
            </div>
            {collapsible && (
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                <svg
                  className={cn(
                    'transform transition-transform',
                    isExpanded ? 'rotate-180' : 'rotate-0',
                    isMobile ? 'h-4 w-4' : 'h-5 w-5'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      
      {(!collapsible || isExpanded) && (
        <div className={cn(
          'space-y-4',
          isMobile ? 'space-y-3' : 'space-y-4'
        )}>
          {children}
        </div>
      )}
    </div>
  );
}
