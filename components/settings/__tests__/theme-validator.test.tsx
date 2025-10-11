// Documentation: /docs/branding-preset-themes/theme-validator-tests.md

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeValidator } from '../theme-validator';
import { ContrastRatioDisplay } from '../contrast-ratio-display';
import { WCAGComplianceIndicators } from '../wcag-compliance-indicators';
import { ValidationRecommendations } from '../validation-recommendations';
import { ThemeValidationDashboard } from '../theme-validation-dashboard';
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

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) => (
    <div className={`alert ${variant} ${className}`}>{children}</div>
  ),
  AlertDescription: ({ children }: { children: React.ReactNode }) => (
    <div className="alert-description">{children}</div>
  ),
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: { value: number; className?: string }) => (
    <div className={`progress ${className}`} data-value={value} />
  ),
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: ({ className }: { className?: string }) => (
    <hr className={`separator ${className}`} />
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

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div className="tooltip">{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div className="tooltip-content">{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div className="tooltip-provider">{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div className="tooltip-trigger">{children}</div>,
}));

describe('Theme Validation Components', () => {
  const mockValidationResults: ValidationResults = {
    isCompliant: true,
    score: 95,
    contrastRatios: {
      'text-background': 4.8,
      'primary-background': 3.2,
      'secondary-background': 2.8,
    },
    warnings: [
      {
        type: 'contrast',
        severity: 'medium',
        message: 'Secondary color has low contrast',
        element: 'secondary',
        suggestion: 'Consider using a darker shade',
      },
    ],
    recommendations: [
      'Increase contrast ratio for secondary color',
      'Consider using web-safe fonts',
    ],
    lastValidated: new Date('2024-01-15T10:00:00Z'),
  };

  const mockNonCompliantResults: ValidationResults = {
    isCompliant: false,
    score: 45,
    contrastRatios: {
      'text-background': 2.1,
      'primary-background': 1.8,
    },
    warnings: [
      {
        type: 'contrast',
        severity: 'high',
        message: 'Text has insufficient contrast',
        element: 'text',
        suggestion: 'Use darker text color',
      },
      {
        type: 'color',
        severity: 'high',
        message: 'Primary color is too light',
        element: 'primary',
        suggestion: 'Choose a darker primary color',
      },
    ],
    recommendations: [
      'Fix critical contrast issues',
      'Update color palette for better accessibility',
    ],
    lastValidated: new Date('2024-01-15T10:00:00Z'),
  };

  describe('ThemeValidator', () => {
    it('should render validation results', () => {
      render(
        <ThemeValidator
          validationResults={mockValidationResults}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('Theme Validation')).toBeInTheDocument();
      expect(screen.getByText('WCAG Compliant')).toBeInTheDocument();
      expect(screen.getByText('95/100')).toBeInTheDocument();
      expect(screen.getByText('Accessibility Score')).toBeInTheDocument();
    });

    it('should render non-compliant results', () => {
      render(
        <ThemeValidator
          validationResults={mockNonCompliantResults}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('Not Compliant')).toBeInTheDocument();
      expect(screen.getByText('45/100')).toBeInTheDocument();
      expect(screen.getByText('Issues Found (2)')).toBeInTheDocument();
    });

    it('should render empty state when no results', () => {
      render(
        <ThemeValidator
          validationResults={null}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('No theme validation results available')).toBeInTheDocument();
      expect(screen.getByText('Validate Theme')).toBeInTheDocument();
    });

    it('should call onValidate when button is clicked', () => {
      const mockOnValidate = jest.fn();
      render(
        <ThemeValidator
          validationResults={null}
          onValidate={mockOnValidate}
        />
      );

      fireEvent.click(screen.getByText('Validate Theme'));
      expect(mockOnValidate).toHaveBeenCalledTimes(1);
    });

    it('should show loading state', () => {
      render(
        <ThemeValidator
          validationResults={null}
          onValidate={() => {}}
          isLoading={true}
        />
      );

      expect(screen.getByText('Validating...')).toBeInTheDocument();
    });
  });

  describe('ContrastRatioDisplay', () => {
    it('should render contrast ratios', () => {
      render(
        <ContrastRatioDisplay
          contrastRatios={mockValidationResults.contrastRatios}
        />
      );

      expect(screen.getByText('Contrast Ratios')).toBeInTheDocument();
      expect(screen.getByText('text vs background')).toBeInTheDocument();
      expect(screen.getByText('4.8:1')).toBeInTheDocument();
    });

    it('should render empty state when no ratios', () => {
      render(
        <ContrastRatioDisplay
          contrastRatios={{}}
        />
      );

      expect(screen.getByText('No contrast ratio data available')).toBeInTheDocument();
    });

    it('should show compliance badges', () => {
      render(
        <ContrastRatioDisplay
          contrastRatios={mockValidationResults.contrastRatios}
        />
      );

      expect(screen.getByText('AA')).toBeInTheDocument();
      expect(screen.getByText('AA Large')).toBeInTheDocument();
    });
  });

  describe('WCAGComplianceIndicators', () => {
    it('should render compliance indicators', () => {
      render(
        <WCAGComplianceIndicators
          validationResults={mockValidationResults}
        />
      );

      expect(screen.getByText('WCAG 2.1 Compliance')).toBeInTheDocument();
      expect(screen.getByText('AAA')).toBeInTheDocument();
      expect(screen.getByText('95/100')).toBeInTheDocument();
    });

    it('should render non-compliant indicators', () => {
      render(
        <WCAGComplianceIndicators
          validationResults={mockNonCompliantResults}
        />
      );

      expect(screen.getByText('Fail')).toBeInTheDocument();
      expect(screen.getByText('45/100')).toBeInTheDocument();
    });

    it('should render empty state when no results', () => {
      render(
        <WCAGComplianceIndicators
          validationResults={null}
        />
      );

      expect(screen.getByText('No compliance data available')).toBeInTheDocument();
    });
  });

  describe('ValidationRecommendations', () => {
    it('should render recommendations', () => {
      render(
        <ValidationRecommendations
          recommendations={mockValidationResults.recommendations}
          warnings={mockValidationResults.warnings}
        />
      );

      expect(screen.getByText('Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Increase contrast ratio for secondary color')).toBeInTheDocument();
      expect(screen.getByText('Consider using web-safe fonts')).toBeInTheDocument();
    });

    it('should render warnings', () => {
      render(
        <ValidationRecommendations
          recommendations={mockNonCompliantResults.recommendations}
          warnings={mockNonCompliantResults.warnings}
        />
      );

      expect(screen.getByText('High Priority')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Critical issues count
    });

    it('should render empty state when no recommendations', () => {
      render(
        <ValidationRecommendations
          recommendations={[]}
          warnings={[]}
        />
      );

      expect(screen.getByText('Excellent! No issues found')).toBeInTheDocument();
    });

    it('should call onApplyRecommendation when button is clicked', () => {
      const mockOnApply = jest.fn();
      render(
        <ValidationRecommendations
          recommendations={mockValidationResults.recommendations}
          warnings={mockValidationResults.warnings}
          onApplyRecommendation={mockOnApply}
        />
      );

      const applyButtons = screen.getAllByText('Apply Fix');
      fireEvent.click(applyButtons[0]);
      expect(mockOnApply).toHaveBeenCalledWith('Increase contrast ratio for secondary color');
    });
  });

  describe('ThemeValidationDashboard', () => {
    it('should render dashboard with tabs', () => {
      render(
        <ThemeValidationDashboard
          validationResults={mockValidationResults}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('Theme Validation Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Contrast')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
      expect(screen.getByText('Recommendations')).toBeInTheDocument();
    });

    it('should render compliant status', () => {
      render(
        <ThemeValidationDashboard
          validationResults={mockValidationResults}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('Compliant')).toBeInTheDocument();
      expect(screen.getByText('AA')).toBeInTheDocument();
    });

    it('should render non-compliant status', () => {
      render(
        <ThemeValidationDashboard
          validationResults={mockNonCompliantResults}
          onValidate={() => {}}
        />
      );

      expect(screen.getByText('Non-Compliant')).toBeInTheDocument();
      expect(screen.getByText('Fail')).toBeInTheDocument();
    });

    it('should call onValidate when button is clicked', () => {
      const mockOnValidate = jest.fn();
      render(
        <ThemeValidationDashboard
          validationResults={null}
          onValidate={mockOnValidate}
        />
      );

      fireEvent.click(screen.getByText('Validate'));
      expect(mockOnValidate).toHaveBeenCalledTimes(1);
    });

    it('should show loading state', () => {
      render(
        <ThemeValidationDashboard
          validationResults={null}
          onValidate={() => {}}
          isLoading={true}
        />
      );

      expect(screen.getByText('Validating...')).toBeInTheDocument();
    });
  });
});
