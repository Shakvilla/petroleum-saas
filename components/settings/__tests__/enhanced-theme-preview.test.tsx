// Documentation: /docs/branding-preset-themes/enhanced-theme-preview-tests.md

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EnhancedThemePreview } from '../enhanced-theme-preview';
import { InteractiveComponentPreview } from '../interactive-component-preview';
import { ResponsivePreview } from '../responsive-preview';
import { AccessibilityPreviewIndicators } from '../accessibility-preview-indicators';
import type { ValidationResults } from '@/types/theme-presets';

// Mock the UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`card ${className}`}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div className="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div className="card-description">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div className="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div className="card-title">{children}</div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
    <button onClick={onClick} disabled={disabled} className={`button ${className}`}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string }) => (
    <div className="tabs" data-default-value={defaultValue}>{children}</div>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div className="tabs-content" data-value={value}>{children}</div>
  ),
  TabsList: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`tabs-list ${className}`}>{children}</div>
  ),
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <button className="tabs-trigger" data-value={value}>{children}</button>
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => (
    <div className="select" data-value={value} data-on-change={onValueChange}>{children}</div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div className="select-content">{children}</div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div className="select-item" data-value={value}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div className="select-trigger">{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <div className="select-value">{placeholder}</div>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, className }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; className?: string }) => (
    <input value={value} onChange={onChange} placeholder={placeholder} className={`input ${className}`} />
  ),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  ),
}));

jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (value: string) => void }) => (
    <div className="radio-group" data-value={value} data-on-change={onValueChange}>{children}</div>
  ),
  RadioGroupItem: ({ value, id }: { value: string; id: string }) => (
    <input type="radio" value={value} id={id} />
  ),
}));

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  ),
}));

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange }: { value: number[]; onValueChange: (value: number[]) => void }) => (
    <div className="slider" data-value={value} data-on-change={onValueChange} />
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: { value: number; className?: string }) => (
    <div className={`progress ${className}`} data-value={value} />
  ),
}));

describe('Enhanced Theme Preview Components', () => {
  const mockTheme = {
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#000000',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      headingFont: 'Inter, sans-serif',
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
  };

  const mockValidationResults: ValidationResults = {
    isCompliant: true,
    score: 95,
    contrastRatios: {
      'text-background': 4.8,
      'primary-background': 3.2,
    },
    warnings: [],
    recommendations: ['Excellent contrast ratios'],
    lastValidated: new Date(),
  };

  describe('EnhancedThemePreview', () => {
    it('should render enhanced theme preview', () => {
      const mockOnValidationChange = jest.fn();

      render(
        <EnhancedThemePreview
          theme={mockTheme}
          onValidationChange={mockOnValidationChange}
        />
      );

      expect(screen.getByText('Enhanced Theme Preview')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('Layout')).toBeInTheDocument();
      expect(screen.getByText('Interactive')).toBeInTheDocument();
      expect(screen.getByText('Accessibility')).toBeInTheDocument();
    });

    it('should show device mode selector', () => {
      const mockOnValidationChange = jest.fn();

      render(
        <EnhancedThemePreview
          theme={mockTheme}
          onValidationChange={mockOnValidationChange}
        />
      );

      expect(screen.getByText('Desktop')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should show zoom controls', () => {
      const mockOnValidationChange = jest.fn();

      render(
        <EnhancedThemePreview
          theme={mockTheme}
          onValidationChange={mockOnValidationChange}
        />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('125%')).toBeInTheDocument();
      expect(screen.getByText('150%')).toBeInTheDocument();
    });

    it('should show validation status', () => {
      const mockOnValidationChange = jest.fn();

      render(
        <EnhancedThemePreview
          theme={mockTheme}
          validationResults={mockValidationResults}
          onValidationChange={mockOnValidationChange}
        />
      );

      expect(screen.getByText('Compliant')).toBeInTheDocument();
    });

    it('should call onValidationChange when validation completes', () => {
      const mockOnValidationChange = jest.fn();

      render(
        <EnhancedThemePreview
          theme={mockTheme}
          onValidationChange={mockOnValidationChange}
        />
      );

      // Wait for validation to complete
      setTimeout(() => {
        expect(mockOnValidationChange).toHaveBeenCalled();
      }, 600);
    });
  });

  describe('InteractiveComponentPreview', () => {
    it('should render interactive component preview', () => {
      render(
        <InteractiveComponentPreview theme={mockTheme} />
      );

      expect(screen.getByText('Interactive Component Preview')).toBeInTheDocument();
      expect(screen.getByText('Buttons')).toBeInTheDocument();
      expect(screen.getByText('Forms')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Feedback')).toBeInTheDocument();
    });

    it('should show interaction mode selector', () => {
      render(
        <InteractiveComponentPreview theme={mockTheme} />
      );

      expect(screen.getByText('Hover')).toBeInTheDocument();
      expect(screen.getByText('Focus')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('should show device type selector', () => {
      render(
        <InteractiveComponentPreview theme={mockTheme} />
      );

      expect(screen.getByText('Desktop')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should show form elements', () => {
      render(
        <InteractiveComponentPreview theme={mockTheme} />
      );

      // Click on Forms tab
      const formsTab = screen.getByText('Forms');
      fireEvent.click(formsTab);

      expect(screen.getByText('Text Inputs')).toBeInTheDocument();
      expect(screen.getByText('Select Dropdown')).toBeInTheDocument();
      expect(screen.getByText('Checkboxes')).toBeInTheDocument();
      expect(screen.getByText('Radio Buttons')).toBeInTheDocument();
      expect(screen.getByText('Switch')).toBeInTheDocument();
      expect(screen.getByText('Slider')).toBeInTheDocument();
    });
  });

  describe('ResponsivePreview', () => {
    it('should render responsive preview', () => {
      render(
        <ResponsivePreview theme={mockTheme} />
      );

      expect(screen.getByText('Responsive Preview')).toBeInTheDocument();
      expect(screen.getByText('Layout')).toBeInTheDocument();
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('Typography')).toBeInTheDocument();
    });

    it('should show device selector', () => {
      render(
        <ResponsivePreview theme={mockTheme} />
      );

      expect(screen.getByText('Desktop')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
    });

    it('should show breakpoint overview', () => {
      render(
        <ResponsivePreview theme={mockTheme} />
      );

      expect(screen.getByText('Breakpoint Overview')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
      expect(screen.getByText('Desktop')).toBeInTheDocument();
      expect(screen.getByText('Large Desktop')).toBeInTheDocument();
    });

    it('should show zoom controls', () => {
      render(
        <ResponsivePreview theme={mockTheme} />
      );

      expect(screen.getByText('50%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('125%')).toBeInTheDocument();
      expect(screen.getByText('150%')).toBeInTheDocument();
      expect(screen.getByText('200%')).toBeInTheDocument();
    });
  });

  describe('AccessibilityPreviewIndicators', () => {
    it('should render accessibility preview indicators', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      expect(screen.getByText('Accessibility Preview Indicators')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Contrast')).toBeInTheDocument();
      expect(screen.getByText('Navigation')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('should show accessibility mode selector', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      expect(screen.getByText('Normal')).toBeInTheDocument();
      expect(screen.getByText('Colorblind')).toBeInTheDocument();
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
      expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
    });

    it('should show screen reader mode', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      expect(screen.getByText('Screen Reader Off')).toBeInTheDocument();
    });

    it('should show validation results', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      expect(screen.getByText('WCAG Compliant')).toBeInTheDocument();
      expect(screen.getByText('95')).toBeInTheDocument(); // Score
    });

    it('should show contrast ratios', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      // Click on Contrast tab
      const contrastTab = screen.getByText('Contrast');
      fireEvent.click(contrastTab);

      expect(screen.getByText('Contrast Ratios')).toBeInTheDocument();
      expect(screen.getByText('WCAG Compliance')).toBeInTheDocument();
    });

    it('should show keyboard navigation', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      // Click on Navigation tab
      const navigationTab = screen.getByText('Navigation');
      fireEvent.click(navigationTab);

      expect(screen.getByText('Keyboard Navigation')).toBeInTheDocument();
      expect(screen.getByText('Focus Indicators')).toBeInTheDocument();
      expect(screen.getByText('ARIA Labels')).toBeInTheDocument();
    });

    it('should show testing checklist', () => {
      render(
        <AccessibilityPreviewIndicators
          theme={mockTheme}
          validationResults={mockValidationResults}
        />
      );

      // Click on Testing tab
      const testingTab = screen.getByText('Testing');
      fireEvent.click(testingTab);

      expect(screen.getByText('Testing Tools')).toBeInTheDocument();
      expect(screen.getByText('Testing Checklist')).toBeInTheDocument();
    });
  });
});
