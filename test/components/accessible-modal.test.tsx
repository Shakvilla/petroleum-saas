// Documentation: /docs/responsive-design/accessible-modal-tests.md

import { render, screen, fireEvent } from '@testing-library/react';
import {
  AccessibleModal,
  AccessibleModalTrigger,
  AccessibleModalActions
} from '@/components/accessible-modal';
import { ResponsiveProvider } from '@/components/responsive-provider';

// Mock responsive provider with different breakpoints
const MockResponsiveProvider = ({ 
  children, 
  breakpoint = 'desktop' 
}: { 
  children: React.ReactNode;
  breakpoint?: string;
}) => {
  const mockState = {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isLargeDesktop: breakpoint === 'largeDesktop',
    orientation: 'portrait' as const,
    viewportWidth: breakpoint === 'mobile' ? 375 : breakpoint === 'tablet' ? 768 : 1024,
    viewportHeight: breakpoint === 'mobile' ? 667 : breakpoint === 'tablet' ? 1024 : 768,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  };

  return (
    <ResponsiveProvider initialState={mockState}>
      {children}
    </ResponsiveProvider>
  );
};

describe('AccessibleModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop behavior', () => {
    it('should render modal with default size', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should render modal with different sizes', () => {
      const { rerender } = render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} size="sm" />
        </MockResponsiveProvider>
      );
      
      let modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-sm');

      rerender(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} size="lg" />
        </MockResponsiveProvider>
      );
      
      modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-lg');
    });

    it('should render close button by default', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('should hide close button when showCloseButton is false', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} showCloseButton={false} />
        </MockResponsiveProvider>
      );
      
      const closeButton = screen.queryByLabelText('Close modal');
      expect(closeButton).not.toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} onClose={onClose} />
        </MockResponsiveProvider>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Mobile behavior', () => {
    it('should render fullscreen modal on mobile by default', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('w-full', 'h-full', 'max-w-none', 'max-h-none', 'm-0', 'rounded-none');
    });

    it('should render normal modal when mobileFullscreen is false', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModal {...defaultProps} mobileFullscreen={false} />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).not.toHaveClass('w-full', 'h-full', 'max-w-none');
    });

    it('should have smaller padding on mobile', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('p-4');
    });

    it('should have smaller title text on mobile', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const title = screen.getByText('Test Modal');
      expect(title).toHaveClass('text-base');
    });
  });

  describe('Tablet behavior', () => {
    it('should render modal with tablet-optimized sizes', () => {
      render(
        <MockResponsiveProvider breakpoint="tablet">
          <AccessibleModal {...defaultProps} size="xl" />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('max-w-2xl');
    });

    it('should have tablet padding', () => {
      render(
        <MockResponsiveProvider breakpoint="tablet">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveClass('p-6');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const modal = document.querySelector('[role="dialog"]');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    });

    it('should handle escape key', () => {
      const onClose = jest.fn();
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} onClose={onClose} />
        </MockResponsiveProvider>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalled();
    });

    it('should not handle escape key when closeOnEscape is false', () => {
      const onClose = jest.fn();
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModal {...defaultProps} onClose={onClose} closeOnEscape={false} />
        </MockResponsiveProvider>
      );
      
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});

describe('AccessibleModalTrigger', () => {
  const defaultProps = {
    onClick: jest.fn(),
    children: 'Open Modal'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop behavior', () => {
    it('should render trigger button with default variant', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toHaveClass('bg-blue-600', 'hover:bg-blue-700');
    });

    it('should render trigger button with different variants', () => {
      const { rerender } = render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} variant="secondary" />
        </MockResponsiveProvider>
      );
      
      let button = screen.getByText('Open Modal');
      expect(button).toHaveClass('bg-gray-600', 'hover:bg-gray-700');

      rerender(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} variant="outline" />
        </MockResponsiveProvider>
      );
      
      button = screen.getByText('Open Modal');
      expect(button).toHaveClass('bg-transparent', 'border', 'border-blue-600', 'text-blue-600');
    });

    it('should render trigger button with different sizes', () => {
      const { rerender } = render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} size="sm" />
        </MockResponsiveProvider>
      );
      
      let button = screen.getByText('Open Modal');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

      rerender(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} size="lg" />
        </MockResponsiveProvider>
      );
      
      button = screen.getByText('Open Modal');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('should render full width button', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} fullWidth />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Mobile behavior', () => {
    it('should have smaller text on mobile', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModalTrigger {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toHaveClass('text-sm');
    });

    it('should have smaller padding on mobile for large size', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModalTrigger {...defaultProps} size="lg" />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    });

    it('should be disabled when disabled prop is true', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalTrigger {...defaultProps} disabled />
        </MockResponsiveProvider>
      );
      
      const button = screen.getByText('Open Modal');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });
});

describe('AccessibleModalActions', () => {
  const defaultProps = {
    children: [
      <button key="cancel">Cancel</button>,
      <button key="save">Save</button>
    ]
  };

  describe('Desktop behavior', () => {
    it('should render actions in a row by default', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalActions {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('flex-row');
    });

    it('should align actions to the right by default', () => {
      render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalActions {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('justify-end');
    });

    it('should align actions based on align prop', () => {
      const { rerender } = render(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalActions {...defaultProps} align="center" />
        </MockResponsiveProvider>
      );
      
      let container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('justify-center');

      rerender(
        <MockResponsiveProvider breakpoint="desktop">
          <AccessibleModalActions {...defaultProps} align="between" />
        </MockResponsiveProvider>
      );
      
      container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('justify-between');
    });
  });

  describe('Mobile behavior', () => {
    it('should render actions in a column on mobile', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModalActions {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('flex-col', 'space-y-2');
    });

    it('should have smaller top padding on mobile', () => {
      render(
        <MockResponsiveProvider breakpoint="mobile">
          <AccessibleModalActions {...defaultProps} />
        </MockResponsiveProvider>
      );
      
      const container = document.querySelector('.flex.items-center.gap-2');
      expect(container).toHaveClass('pt-4');
    });
  });
});
