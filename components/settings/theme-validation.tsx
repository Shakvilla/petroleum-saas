/**
 * Theme Validation Component
 *
 * Provides real-time validation for theme settings
 * including color contrast, accessibility, and best practices.
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareBadge } from '@/components/ui/tenant-aware-badge';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Eye,
  Palette,
  Type,
  Contrast,
} from 'lucide-react';
import type { BrandingSettingsData } from '@/types/settings';

interface ValidationResult {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  description?: string;
  category: 'color' | 'typography' | 'accessibility' | 'performance';
}

interface ThemeValidationProps {
  brandingData: BrandingSettingsData;
  onValidationChange?: (results: ValidationResult[]) => void;
}

// Get luminance of a color
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Color contrast calculation
function getContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// Validate color format
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Validate font family
function isValidFontFamily(fontFamily: string): boolean {
  return fontFamily.trim().length > 0;
}

export function ThemeValidation({
  brandingData,
  onValidationChange,
}: ThemeValidationProps) {
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);

  useEffect(() => {
    const results: ValidationResult[] = [];

    // Color validation
    const colors = brandingData.visualBranding.colorScheme;

    // Check if colors are valid hex
    Object.entries(colors).forEach(([key, value]) => {
      if (!isValidHexColor(value)) {
        results.push({
          id: `color-${key}-invalid`,
          type: 'error',
          message: `Invalid color format for ${key}`,
          description: `The ${key} color must be a valid hex color (e.g., #ff0000)`,
          category: 'color',
        });
      }
    });

    // Check color contrast
    const textColor = colors.text;
    const backgroundColor = colors.background;
    const primaryColor = colors.primary;
    const secondaryColor = colors.secondary;
    const surfaceColor = colors.surface;

    if (isValidHexColor(textColor) && isValidHexColor(backgroundColor)) {
      const contrastRatio = getContrastRatio(textColor, backgroundColor);

      if (contrastRatio < 4.5) {
        results.push({
          id: 'contrast-text-background',
          type: 'error',
          message: 'Insufficient text contrast',
          description: `Contrast ratio: ${contrastRatio.toFixed(2)}:1 (minimum: 4.5:1)`,
          category: 'accessibility',
        });
      } else if (contrastRatio < 7) {
        results.push({
          id: 'contrast-text-background',
          type: 'warning',
          message: 'Low text contrast',
          description: `Contrast ratio: ${contrastRatio.toFixed(2)}:1 (recommended: 7:1)`,
          category: 'accessibility',
        });
      } else {
        results.push({
          id: 'contrast-text-background',
          type: 'success',
          message: 'Good text contrast',
          description: `Contrast ratio: ${contrastRatio.toFixed(2)}:1`,
          category: 'accessibility',
        });
      }
    }

    // Check primary color contrast
    if (isValidHexColor(primaryColor) && isValidHexColor(backgroundColor)) {
      const contrastRatio = getContrastRatio(primaryColor, backgroundColor);

      if (contrastRatio < 3) {
        results.push({
          id: 'contrast-primary-background',
          type: 'warning',
          message: 'Low primary color contrast',
          description: `Contrast ratio: ${contrastRatio.toFixed(2)}:1 (recommended: 3:1)`,
          category: 'accessibility',
        });
      }
    }

    // Check for color similarity
    if (isValidHexColor(primaryColor) && isValidHexColor(secondaryColor)) {
      const contrastRatio = getContrastRatio(primaryColor, secondaryColor);

      if (contrastRatio < 2) {
        results.push({
          id: 'color-similarity',
          type: 'warning',
          message: 'Primary and secondary colors are too similar',
          description: `Consider using more distinct colors for better visual hierarchy`,
          category: 'color',
        });
      }
    }

    // Typography validation
    const typography = brandingData.visualBranding.typography;

    if (!isValidFontFamily(typography.fontFamily)) {
      results.push({
        id: 'font-family-invalid',
        type: 'error',
        message: 'Invalid font family',
        description: 'Font family cannot be empty',
        category: 'typography',
      });
    }

    if (typography.headingFont && !isValidFontFamily(typography.headingFont)) {
      results.push({
        id: 'heading-font-invalid',
        type: 'error',
        message: 'Invalid heading font family',
        description: 'Heading font family cannot be empty',
        category: 'typography',
      });
    }

    // Check if fonts are web-safe or Google Fonts
    const webSafeFonts = [
      'Arial',
      'Helvetica',
      'Times New Roman',
      'Courier New',
      'Verdana',
      'Georgia',
      'Palatino',
      'Garamond',
      'Bookman',
      'Comic Sans MS',
      'Trebuchet MS',
      'Arial Black',
      'Impact',
    ];

    const isWebSafe = webSafeFonts.some(font =>
      typography.fontFamily.toLowerCase().includes(font.toLowerCase())
    );

    if (
      !isWebSafe &&
      !typography.fontFamily.includes('Inter') &&
      !typography.fontFamily.includes('Roboto')
    ) {
      results.push({
        id: 'font-web-safe',
        type: 'info',
        message: 'Consider using web-safe fonts',
        description:
          'Web-safe fonts ensure consistent rendering across devices',
        category: 'typography',
      });
    }

    // Performance validation
    if (
      typography.fontFamily.includes('Inter') ||
      typography.fontFamily.includes('Roboto')
    ) {
      results.push({
        id: 'font-performance',
        type: 'success',
        message: 'Good font choice',
        description: 'Inter and Roboto are optimized for web performance',
        category: 'performance',
      });
    }

    // Color scheme validation
    const hasDarkBackground =
      isValidHexColor(backgroundColor) && getLuminance(backgroundColor) < 0.5;

    if (hasDarkBackground) {
      results.push({
        id: 'dark-theme',
        type: 'info',
        message: 'Dark theme detected',
        description: 'Ensure sufficient contrast for all text elements',
        category: 'color',
      });
    }

    // Brand consistency validation
    const primaryLuminance = isValidHexColor(primaryColor)
      ? getLuminance(primaryColor)
      : 0;
    const secondaryLuminance = isValidHexColor(secondaryColor)
      ? getLuminance(secondaryColor)
      : 0;

    if (Math.abs(primaryLuminance - secondaryLuminance) > 0.3) {
      results.push({
        id: 'brand-consistency',
        type: 'warning',
        message: 'Consider brand consistency',
        description:
          'Primary and secondary colors should have similar luminance for brand cohesion',
        category: 'color',
      });
    }

    setValidationResults(results);
    onValidationChange?.(results);
  }, [brandingData, onValidationChange]);

  const getIcon = (type: ValidationResult['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: ValidationResult['category']) => {
    switch (category) {
      case 'color':
        return <Palette className="h-4 w-4" />;
      case 'typography':
        return <Type className="h-4 w-4" />;
      case 'accessibility':
        return <Eye className="h-4 w-4" />;
      case 'performance':
        return <Contrast className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: ValidationResult['category']) => {
    switch (category) {
      case 'color':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'typography':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accessibility':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'performance':
        return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  const groupedResults = validationResults.reduce(
    (acc, result) => {
      if (!acc[result.category]) {
        acc[result.category] = [];
      }
      acc[result.category].push(result);
      return acc;
    },
    {} as Record<string, ValidationResult[]>
  );

  const getSummary = () => {
    const errors = validationResults.filter(r => r.type === 'error').length;
    const warnings = validationResults.filter(r => r.type === 'warning').length;
    const successes = validationResults.filter(
      r => r.type === 'success'
    ).length;

    return { errors, warnings, successes };
  };

  const summary = getSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Theme Validation</h3>
        <p className="text-sm text-gray-600">
          Real-time validation of your theme settings
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <TenantAwareCard>
          <TenantAwareCardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {summary.errors}
                </div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>
          </TenantAwareCardContent>
        </TenantAwareCard>

        <TenantAwareCard>
          <TenantAwareCardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.warnings}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          </TenantAwareCardContent>
        </TenantAwareCard>

        <TenantAwareCard>
          <TenantAwareCardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {summary.successes}
                </div>
                <div className="text-sm text-gray-600">Success</div>
              </div>
            </div>
          </TenantAwareCardContent>
        </TenantAwareCard>
      </div>

      {/* Validation Results */}
      {Object.entries(groupedResults).map(([category, results]) => (
        <TenantAwareCard key={category}>
          <TenantAwareCardHeader>
            <TenantAwareCardTitle className="flex items-center gap-2">
              {getCategoryIcon(category as ValidationResult['category'])}
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <TenantAwareBadge
                variant="outline"
                className={getCategoryColor(
                  category as ValidationResult['category']
                )}
              >
                {results.length}
              </TenantAwareBadge>
            </TenantAwareCardTitle>
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <div className="space-y-3">
              {results.map(result => (
                <div
                  key={result.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200"
                >
                  {getIcon(result.type)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{result.message}</div>
                    {result.description && (
                      <div className="text-sm text-gray-600 mt-1">
                        {result.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TenantAwareCardContent>
        </TenantAwareCard>
      ))}

      {validationResults.length === 0 && (
        <TenantAwareCard>
          <TenantAwareCardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All validations passed!
            </h3>
            <p className="text-gray-600">
              Your theme settings meet all validation criteria
            </p>
          </TenantAwareCardContent>
        </TenantAwareCard>
      )}
    </div>
  );
}
