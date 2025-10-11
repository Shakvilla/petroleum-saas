// Documentation: /docs/branding-preset-themes/theme-validation-tests.md

import {
  calculateContrastRatio,
  checkWCAGCompliance,
  validateColorScheme,
  validateTypography,
  validateThemePreset,
  generateAccessibilityMetadata,
  isColorCombinationAccessible,
  getAccessibleColorSuggestions,
} from '../theme-validation';
import type { ColorScheme, TypographyConfig } from '@/types/settings';
import type { ThemePreset } from '@/types/theme-presets';

describe('Theme Validation Utilities', () => {
  describe('calculateContrastRatio', () => {
    it('should calculate correct contrast ratio for black on white', () => {
      const ratio = calculateContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = calculateContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate correct contrast ratio for medium contrast', () => {
      const ratio = calculateContrastRatio('#666666', '#ffffff');
      expect(ratio).toBeGreaterThan(4);
      expect(ratio).toBeLessThan(10);
    });

    it('should handle invalid hex colors gracefully', () => {
      const ratio = calculateContrastRatio('invalid', '#ffffff');
      expect(ratio).toBe(1);
    });
  });

  describe('checkWCAGCompliance', () => {
    it('should return AAA compliance for high contrast', () => {
      const result = checkWCAGCompliance(8.5);
      expect(result.compliant).toBe(true);
      expect(result.level).toBe('AAA');
    });

    it('should return AA compliance for medium contrast', () => {
      const result = checkWCAGCompliance(5.0);
      expect(result.compliant).toBe(true);
      expect(result.level).toBe('AA');
    });

    it('should return FAIL for low contrast', () => {
      const result = checkWCAGCompliance(2.0);
      expect(result.compliant).toBe(false);
      expect(result.level).toBe('FAIL');
    });

    it('should apply large text thresholds correctly', () => {
      const result = checkWCAGCompliance(3.5, true);
      expect(result.compliant).toBe(true);
      expect(result.level).toBe('AA');
    });
  });

  describe('validateColorScheme', () => {
    const validColorScheme: ColorScheme = {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    };

    const invalidColorScheme: ColorScheme = {
      primary: '#ffffff',
      secondary: '#ffffff',
      accent: '#ffffff',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#ffffff',
      success: '#ffffff',
      warning: '#ffffff',
      error: '#ffffff',
    };

    it('should validate accessible color scheme', () => {
      const result = validateColorScheme(validColorScheme);
      
      expect(result.isCompliant).toBe(true);
      expect(result.score).toBeGreaterThan(80);
      expect(result.warnings).toHaveLength(0);
      expect(result.recommendations).toHaveLength(0);
      expect(result.contrastRatios).toHaveProperty('text-background');
    });

    it('should identify accessibility issues in invalid color scheme', () => {
      const result = validateColorScheme(invalidColorScheme);
      
      expect(result.isCompliant).toBe(false);
      expect(result.score).toBeLessThan(50);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should include all required contrast ratios', () => {
      const result = validateColorScheme(validColorScheme);
      
      expect(result.contrastRatios).toHaveProperty('text-background');
      expect(result.contrastRatios).toHaveProperty('primary-background');
      expect(result.contrastRatios).toHaveProperty('secondary-background');
      expect(result.contrastRatios).toHaveProperty('accent-background');
      expect(result.contrastRatios).toHaveProperty('surface-text');
      expect(result.contrastRatios).toHaveProperty('success-text');
      expect(result.contrastRatios).toHaveProperty('warning-text');
      expect(result.contrastRatios).toHaveProperty('error-text');
    });
  });

  describe('validateTypography', () => {
    const validTypography: TypographyConfig = {
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
    };

    const invalidTypography: TypographyConfig = {
      fontFamily: '',
      headingFont: '',
      fontSizes: {
        xs: '0.5rem',
        sm: '0.6rem',
        base: '0.7rem',
        lg: '0.8rem',
        xl: '0.9rem',
        '2xl': '1rem',
        '3xl': '1.1rem',
        '4xl': '1.2rem',
      },
    };

    it('should validate accessible typography', () => {
      const result = validateTypography(validTypography);
      
      expect(result.isCompliant).toBe(true);
      expect(result.score).toBeGreaterThan(80);
      expect(result.warnings).toHaveLength(0);
    });

    it('should identify typography issues', () => {
      const result = validateTypography(invalidTypography);
      
      expect(result.isCompliant).toBe(false);
      expect(result.score).toBeLessThan(50);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should warn about missing font family', () => {
      const result = validateTypography({ fontFamily: '', fontSizes: {} });
      
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          type: 'readability',
          severity: 'medium',
          element: 'fontFamily',
        })
      );
    });
  });

  describe('validateThemePreset', () => {
    const validPreset: ThemePreset = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'Test description',
      category: 'corporate',
      icon: null,
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
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
      },
      tags: ['test'],
      accessibility: {
        contrastRatio: 4.5,
        wcagCompliant: true,
        recommendations: [],
        score: 95,
      },
      metadata: {
        createdBy: 'test',
        version: '1.0.0',
        lastUpdated: new Date(),
        industry: ['test'],
      },
    };

    it('should validate complete theme preset', () => {
      const result = validateThemePreset(validPreset);
      
      expect(result.isCompliant).toBe(true);
      expect(result.score).toBeGreaterThan(80);
      expect(result.lastValidated).toBeInstanceOf(Date);
    });

    it('should combine color and typography validation results', () => {
      const result = validateThemePreset(validPreset);
      
      expect(result.contrastRatios).toBeDefined();
      expect(result.warnings).toBeDefined();
      expect(result.recommendations).toBeDefined();
    });
  });

  describe('generateAccessibilityMetadata', () => {
    const testPreset: ThemePreset = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'Test description',
      category: 'corporate',
      icon: null,
      colors: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        accent: '#60a5fa',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
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
      },
      tags: ['test'],
      accessibility: {
        contrastRatio: 4.5,
        wcagCompliant: true,
        recommendations: [],
        score: 95,
      },
      metadata: {
        createdBy: 'test',
        version: '1.0.0',
        lastUpdated: new Date(),
        industry: ['test'],
      },
    };

    it('should generate accessibility metadata', () => {
      const metadata = generateAccessibilityMetadata(testPreset);
      
      expect(metadata.contrastRatio).toBeGreaterThan(0);
      expect(metadata.wcagCompliant).toBeDefined();
      expect(metadata.recommendations).toBeInstanceOf(Array);
      expect(metadata.score).toBeGreaterThanOrEqual(0);
      expect(metadata.score).toBeLessThanOrEqual(100);
    });
  });

  describe('isColorCombinationAccessible', () => {
    it('should return true for accessible color combinations', () => {
      expect(isColorCombinationAccessible('#000000', '#ffffff')).toBe(true);
      expect(isColorCombinationAccessible('#1e293b', '#ffffff')).toBe(true);
    });

    it('should return false for inaccessible color combinations', () => {
      expect(isColorCombinationAccessible('#ffffff', '#ffffff')).toBe(false);
      expect(isColorCombinationAccessible('#cccccc', '#ffffff')).toBe(false);
    });

    it('should handle large text thresholds', () => {
      expect(isColorCombinationAccessible('#666666', '#ffffff', true)).toBe(true);
      expect(isColorCombinationAccessible('#666666', '#ffffff', false)).toBe(false);
    });
  });

  describe('getAccessibleColorSuggestions', () => {
    it('should return current color if already accessible', () => {
      const suggestions = getAccessibleColorSuggestions('#000000', '#ffffff');
      expect(suggestions).toContain('#000000');
    });

    it('should return suggestions for inaccessible colors', () => {
      const suggestions = getAccessibleColorSuggestions('#ffffff', '#ffffff');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.length).toBeLessThanOrEqual(5);
    });

    it('should handle large text thresholds', () => {
      const suggestions = getAccessibleColorSuggestions('#666666', '#ffffff', true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });
});
