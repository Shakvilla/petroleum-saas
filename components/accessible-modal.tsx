import React, { useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFocusTrap } from '@/hooks/utils/use-accessibility';
import { cn } from '@/lib/utils';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
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
}: AccessibleModalProps) {
  const containerRef = useFocusTrap(isOpen);
  const previousActiveElement = useRef<HTMLElement | null>(null);

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

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        ref={containerRef as any}
        className={cn('focus:outline-none', sizeClasses[size], className)}
        onPointerDownOutside={e => {
          if (!closeOnOverlayClick) {
            e.preventDefault();
          }
        }}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        role="dialog"
        aria-modal="true"
      >
        <DialogHeader>
          <DialogTitle id="modal-title" className="text-lg font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div id="modal-description" className="mt-4">
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
}

export function AccessibleModalTrigger({
  onClick,
  children,
  className,
  disabled = false,
}: AccessibleModalTriggerProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 bg-blue-600 text-white rounded-md',
        'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}
