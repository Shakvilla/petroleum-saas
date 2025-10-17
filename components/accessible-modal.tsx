import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFocusTrap } from '@/hooks/utils/use-accessibility';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  mobileFullscreen?: boolean;
  showCloseButton?: boolean;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  closeOnEscape = true,
  closeOnOverlayClick = true,
  mobileFullscreen = true,
  showCloseButton = true,
}: AccessibleModalProps) {
  const containerRef = useFocusTrap(isOpen);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const { isMobile, isTablet } = useResponsive();

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else if (previousActiveElement.current) {
      // Restore focus when modal closes
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  const getSizeClasses = () => {
    if (isMobile && mobileFullscreen) {
      return 'w-full h-full max-w-none max-h-none m-0 rounded-none';
    }
    
    if (isTablet) {
      switch (size) {
        case 'sm':
          return 'max-w-sm';
        case 'md':
          return 'max-w-md';
        case 'lg':
          return 'max-w-lg';
        case 'xl':
          return 'max-w-2xl';
        case 'full':
          return 'max-w-4xl';
        default:
          return 'max-w-md';
      }
    }
    
    // Desktop sizes
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-6xl';
      default:
        return 'max-w-md';
    }
  };

  const getPaddingClasses = () => {
    if (isMobile && mobileFullscreen) {
      return 'p-4';
    }
    if (isTablet) {
      return 'p-6';
    }
    return 'p-6';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={containerRef as any}
        className={cn(
          'focus:outline-none',
          getSizeClasses(),
          getPaddingClasses(),
          isMobile && mobileFullscreen && 'fixed inset-0',
          className
        )}
        onPointerDownOutside={e => {
          if (!closeOnOverlayClick || (isMobile && mobileFullscreen)) {
            e.preventDefault();
          }
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader className={cn(
          isMobile ? 'pb-3' : 'pb-4'
        )}>
          <div className="flex items-center justify-between">
            <DialogTitle 
              id="modal-title" 
              className={cn(
                'font-semibold',
                isMobile ? 'text-base' : 'text-lg'
              )}
            >
              {title}
            </DialogTitle>
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'rounded-md p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isMobile ? 'p-1' : 'p-2'
                )}
                aria-label="Close modal"
              >
                <svg
                  className={cn(
                    'text-gray-400',
                    isMobile ? 'h-4 w-4' : 'h-5 w-5'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </DialogHeader>

        <div 
          id="modal-description" 
          className={cn(
            'overflow-y-auto',
            isMobile ? 'mt-3' : 'mt-4',
            isMobile && mobileFullscreen ? 'flex-1' : ''
          )}
        >
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Accessible modal trigger button
interface AccessibleModalTriggerProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function AccessibleModalTrigger({
  onClick,
  children,
  className,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: AccessibleModalTriggerProps) {
  const { isMobile } = useResponsive();

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      case 'outline':
        return 'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500';
      case 'ghost':
        return 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  const getSizeClasses = () => {
    if (isMobile) {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm';
        case 'lg':
          return 'px-6 py-3 text-base';
        default:
          return 'px-4 py-2 text-sm';
      }
    }
    
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-md font-medium transition-colors duration-200',
        'focus:ring-2 focus:ring-offset-2 focus:outline-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        getVariantClasses(),
        getSizeClasses(),
        fullWidth && 'w-full',
        className
      )}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

// Mobile-optimized modal actions
interface AccessibleModalActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function AccessibleModalActions({
  children,
  className,
  align = 'right',
}: AccessibleModalActionsProps) {
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

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        isMobile ? 'flex-col space-y-2' : 'flex-row',
        getAlignClasses(),
        isMobile ? 'pt-4' : 'pt-6',
        className
      )}
    >
      {children}
    </div>
  );
}
