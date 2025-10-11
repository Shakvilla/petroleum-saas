// Documentation: /docs/branding-preset-themes/theme-validation.md

import type {
  ThemePreset,
  ValidationResults,
  ValidationWarning,
  ValidationSeverity,
  ValidationWarningType,
  AccessibilityMetadata,
} from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

/**
 * WCAG contrast ratio thresholds
 */
export const WCAG_THRESHOLDS = {
  AA: {
    normal: 4.5,
    large: 3.0,
  },
  AAA: {
    normal: 7.0,
    large: 4.5,
  },
} as const;

/**
 * Minimum font sizes for readability
 */
export const MINIMUM_FONT_SIZES = {
  body: 14, // px
  heading: 16, // px
  small: 12, // px
} as const;

/**
 * Calculate contrast ratio between two colors
 * @param color1 First color in hex format
 * @param color2 Second color in hex format
 * @returns Contrast ratio between 1 and 21
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 1;
  }

  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Convert hex color to RGB
 * @param hex Hex color string
 * @returns RGB object or null if invalid
 */
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

/**
 * Calculate relative luminance of a color
 * @param rgb RGB color object
 * @returns Luminance value between 0 and 1
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;

  // Convert to relative luminance
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * @param contrastRatio Contrast ratio to check
 * @param isLargeText Whether the text is large (18px+ or 14px+ bold)
 * @returns Object with compliance status and level
 */
export function checkWCAGCompliance(
  contrastRatio: number,
  isLargeText: boolean = false
): { compliant: boolean; level: 'AA' | 'AAA' | 'FAIL'; ratio: number } {
  const thresholds = isLargeText ? WCAG_THRESHOLDS.AA.large : WCAG_THRESHOLDS.AA.normal;
  const aaaThresholds = isLargeText ? WCAG_THRESHOLDS.AAA.large : WCAG_THRESHOLDS.AAA.normal;

  if (contrastRatio >= aaaThresholds) {
    return { compliant: true, level: 'AAA', ratio: contrastRatio };
  } else if (contrastRatio >= thresholds) {
    return { compliant: true, level: 'AA', ratio: contrastRatio };
  } else {
    return { compliant: false, level: 'FAIL', ratio: contrastRatio };
  }
}

/**
 * Validate color scheme for accessibility
 * @param colorScheme Color scheme to validate
 * @returns Validation results with warnings and recommendations
 */
export function validateColorScheme(colorScheme: ColorScheme): ValidationResults {
  const warnings: ValidationWarning[] = [];
  const contrastRatios: Record<string, number> = {};
  const recommendations: string[] = [];

  // Check text contrast against background
  const textBackgroundRatio = calculateContrastRatio(colorScheme.text, colorScheme.background);
  contrastRatios['text-background'] = textBackgroundRatio;

  const textCompliance = checkWCAGCompliance(textBackgroundRatio);
  if (!textCompliance.compliant) {
    warnings.push({
      type: 'contrast',
      severity: 'high',
      message: `Text color has insufficient contrast against background (${textCompliance.ratio.toFixed(2)}:1)`,
      element: 'text-background',
      suggestion: `Increase contrast ratio to at least ${WCAG_THRESHOLDS.AA.normal}:1 for WCAG AA compliance`,
    });
    recommendations.push('Consider using a darker text color or lighter background');
  }

  // Check primary color contrast against background
  const primaryBackgroundRatio = calculateContrastRatio(colorScheme.primary, colorScheme.background);
  contrastRatios['primary-background'] = primaryBackgroundRatio;

  const primaryCompliance = checkWCAGCompliance(primaryBackgroundRatio);
  if (!primaryCompliance.compliant) {
    warnings.push({
      type: 'contrast',
      severity: 'medium',
      message: `Primary color has insufficient contrast against background (${primaryCompliance.ratio.toFixed(2)}:1)`,
      element: 'primary-background',
      suggestion: `Ensure primary color is visible against background for interactive elements`,
    });
  }

  // Check secondary color contrast against background
  const secondaryBackgroundRatio = calculateContrastRatio(colorScheme.secondary, colorScheme.background);
  contrastRatios['secondary-background'] = secondaryBackgroundRatio;

  // Check accent color contrast against background
  const accentBackgroundRatio = calculateContrastRatio(colorScheme.accent, colorScheme.background);
  contrastRatios['accent-background'] = accentBackgroundRatio;

  // Check surface color contrast against text
  const surfaceTextRatio = calculateContrastRatio(colorScheme.text, colorScheme.surface);
  contrastRatios['surface-text'] = surfaceTextRatio;

  const surfaceCompliance = checkWCAGCompliance(surfaceTextRatio);
  if (!surfaceCompliance.compliant) {
    warnings.push({
      type: 'contrast',
      severity: 'medium',
      message: `Surface color has insufficient contrast with text (${surfaceCompliance.ratio.toFixed(2)}:1)`,
      element: 'surface-text',
      suggestion: `Adjust surface color to improve text readability`,
    });
  }

  // Check success, warning, and error colors
  const statusColors = [
    { name: 'success', color: colorScheme.success },
    { name: 'warning', color: colorScheme.warning },
    { name: 'error', color: colorScheme.error },
  ];

  statusColors.forEach(({ name, color }) => {
    const ratio = calculateContrastRatio(colorScheme.text, color);
    contrastRatios[`${name}-text`] = ratio;

    const compliance = checkWCAGCompliance(ratio);
    if (!compliance.compliant) {
      warnings.push({
        type: 'contrast',
        severity: 'medium',
        message: `${name} color has insufficient contrast with text (${compliance.ratio.toFixed(2)}:1)`,
        element: `${name}-text`,
        suggestion: `Ensure ${name} color is readable when used with text`,
      });
    }
  });

  // Calculate overall accessibility score
  const totalChecks = Object.keys(contrastRatios).length;
  const passedChecks = Object.values(contrastRatios).filter(ratio => ratio >= WCAG_THRESHOLDS.AA.normal).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  // Add general recommendations
  if (score < 80) {
    recommendations.push('Consider using a color palette generator to ensure proper contrast ratios');
  }
  if (warnings.length > 0) {
    recommendations.push('Review all color combinations to ensure accessibility compliance');
  }

  return {
    isCompliant: warnings.filter(w => w.severity === 'high').length === 0,
    contrastRatios,
    warnings,
    recommendations,
    score,
    lastValidated: new Date(),
  };
}

/**
 * Validate typography configuration for readability
 * @param typography Typography configuration to validate
 * @returns Validation results with warnings and recommendations
 */
export function validateTypography(typography: TypographyConfig): ValidationResults {
  const warnings: ValidationWarning[] = [];
  const recommendations: string[] = [];

  // Check font family
  if (!typography.fontFamily || typography.fontFamily.trim() === '') {
    warnings.push({
      type: 'readability',
      severity: 'medium',
      message: 'Font family is not specified',
      element: 'fontFamily',
      suggestion: 'Specify a web-safe font family for better compatibility',
    });
  }

  // Check font sizes
  const fontSizes = typography.fontSizes;
  if (fontSizes) {
    Object.entries(fontSizes).forEach(([key, value]) => {
      const sizeInPx = parseFloat((value as string).replace('rem', '')) * 16; // Convert rem to px
      
      if (key === 'base' && sizeInPx < MINIMUM_FONT_SIZES.body) {
        warnings.push({
          type: 'readability',
          severity: 'high',
          message: `Base font size (${value}) is too small for readability`,
          element: 'fontSizes.base',
          suggestion: `Use at least ${MINIMUM_FONT_SIZES.body}px for body text`,
        });
      }
      
      if (key.includes('heading') && sizeInPx < MINIMUM_FONT_SIZES.heading) {
        warnings.push({
          type: 'readability',
          severity: 'medium',
          message: `Heading font size (${value}) is too small`,
          element: `fontSizes.${key}`,
          suggestion: `Use at least ${MINIMUM_FONT_SIZES.heading}px for headings`,
        });
      }
    });
  }

  // Add general recommendations
  if (warnings.length > 0) {
    recommendations.push('Consider using larger font sizes for better readability');
    recommendations.push('Ensure font family is web-safe and accessible');
  }

  return {
    isCompliant: warnings.filter(w => w.severity === 'high').length === 0,
    contrastRatios: {},
    warnings,
    recommendations,
    score: warnings.length === 0 ? 100 : Math.max(0, 100 - warnings.length * 20),
    lastValidated: new Date(),
  };
}

/**
 * Validate complete theme preset for accessibility
 * @param preset Theme preset to validate
 * @returns Validation results with comprehensive accessibility analysis
 */
export function validateThemePreset(preset: ThemePreset): ValidationResults {
  const colorResults = validateColorScheme(preset.colors);
  const typographyResults = validateTypography(preset.typography);

  // Combine results
  const allWarnings = [...colorResults.warnings, ...typographyResults.warnings];
  const allRecommendations = [...colorResults.recommendations, ...typographyResults.recommendations];

  // Calculate overall score
  const overallScore = Math.round((colorResults.score + typographyResults.score) / 2);

  return {
    isCompliant: colorResults.isCompliant && typographyResults.isCompliant,
    contrastRatios: colorResults.contrastRatios,
    warnings: allWarnings,
    recommendations: allRecommendations,
    score: overallScore,
    lastValidated: new Date(),
  };
}

/**
 * Generate accessibility metadata for a theme preset
 * @param preset Theme preset to analyze
 * @returns Accessibility metadata with score and recommendations
 */
export function generateAccessibilityMetadata(preset: ThemePreset): AccessibilityMetadata {
  const validationResults = validateThemePreset(preset);
  
  return {
    contrastRatio: Math.min(...Object.values(validationResults.contrastRatios)),
    wcagCompliant: validationResults.isCompliant,
    recommendations: validationResults.recommendations,
    score: validationResults.score,
  };
}

/**
 * Check if a color combination is accessible
 * @param foregroundColor Foreground color
 * @param backgroundColor Background color
 * @param isLargeText Whether the text is large
 * @returns Accessibility check result
 */
export function isColorCombinationAccessible(
  foregroundColor: string,
  backgroundColor: string,
  isLargeText: boolean = false
): boolean {
  const contrastRatio = calculateContrastRatio(foregroundColor, backgroundColor);
  const compliance = checkWCAGCompliance(contrastRatio, isLargeText);
  return compliance.compliant;
}

/**
 * Get color suggestions for better accessibility
 * @param currentColor Current color
 * @param targetColor Target color to contrast against
 * @param isLargeText Whether the text is large
 * @returns Array of suggested colors with better contrast
 */
export function getAccessibleColorSuggestions(
  currentColor: string,
  targetColor: string,
  isLargeText: boolean = false
): string[] {
  const currentRatio = calculateContrastRatio(currentColor, targetColor);
  const targetRatio = isLargeText ? WCAG_THRESHOLDS.AA.large : WCAG_THRESHOLDS.AA.normal;

  if (currentRatio >= targetRatio) {
    return [currentColor]; // Already accessible
  }

  // Generate suggestions by adjusting lightness
  const suggestions: string[] = [];
  const rgb = hexToRgb(currentColor);
  
  if (rgb) {
    // Try lighter and darker versions
    for (let i = 0.1; i <= 0.9; i += 0.1) {
      const adjustedColor = adjustColorLightness(currentColor, i);
      const ratio = calculateContrastRatio(adjustedColor, targetColor);
      
      if (ratio >= targetRatio) {
        suggestions.push(adjustedColor);
      }
    }
  }

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

/**
 * Adjust color lightness
 * @param color Hex color
 * @param lightness Lightness value between 0 and 1
 * @returns Adjusted hex color
 */
function adjustColorLightness(color: string, lightness: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const hsl = rgbToHsl(rgb);
  const adjustedHsl = { ...hsl, l: lightness };
  const adjustedRgb = hslToRgb(adjustedHsl);

  return `#${adjustedRgb.r.toString(16).padStart(2, '0')}${adjustedRgb.g.toString(16).padStart(2, '0')}${adjustedRgb.b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert RGB to HSL
 * @param rgb RGB color object
 * @returns HSL color object
 */
function rgbToHsl(rgb: { r: number; g: number; b: number }): { h: number; s: number; l: number } {
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / diff) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / diff + 2;
    } else {
      h = (rNorm - gNorm) / diff + 4;
    }
  }

  const l = (max + min) / 2;
  const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));

  return {
    h: (h * 60 + 360) % 360,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 * @param hsl HSL color object
 * @returns RGB color object
 */
function hslToRgb(hsl: { h: number; s: number; l: number }): { r: number; g: number; b: number } {
  const { h, s, l } = hsl;
  const sNorm = s / 100;
  const lNorm = l / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}
