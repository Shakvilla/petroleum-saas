// Documentation: /docs/branding-preset-themes/theme-error-handling.md

import type { ThemePreset, ThemeCustomization, ValidationResults } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

// Error types for theme operations
export enum ThemeErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PRESET_NOT_FOUND = 'PRESET_NOT_FOUND',
  INVALID_COLOR = 'INVALID_COLOR',
  INVALID_TYPOGRAPHY = 'INVALID_TYPOGRAPHY',
  IMPORT_ERROR = 'IMPORT_ERROR',
  EXPORT_ERROR = 'EXPORT_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ThemeError {
  type: ThemeErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  context?: {
    operation: string;
    presetId?: string;
    customization?: Partial<ThemeCustomization>;
    userId?: string;
  };
}

// Error handler class
export class ThemeErrorHandler {
  private static instance: ThemeErrorHandler;
  private errorLog: ThemeError[] = [];
  private maxLogSize = 100;

  static getInstance(): ThemeErrorHandler {
    if (!ThemeErrorHandler.instance) {
      ThemeErrorHandler.instance = new ThemeErrorHandler();
    }
    return ThemeErrorHandler.instance;
  }

  // Create and log an error
  createError(
    type: ThemeErrorType,
    message: string,
    details?: any,
    context?: ThemeError['context']
  ): ThemeError {
    const error: ThemeError = {
      type,
      message,
      details,
      timestamp: new Date(),
      context,
    };

    this.logError(error);
    return error;
  }

  // Log error to internal storage
  private logError(error: ThemeError): void {
    this.errorLog.unshift(error);
    
    // Keep only the most recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Theme Error:', error);
    }
  }

  // Get recent errors
  getRecentErrors(limit = 10): ThemeError[] {
    return this.errorLog.slice(0, limit);
  }

  // Get errors by type
  getErrorsByType(type: ThemeErrorType): ThemeError[] {
    return this.errorLog.filter(error => error.type === type);
  }

  // Clear error log
  clearErrors(): void {
    this.errorLog = [];
  }

  // Get error statistics
  getErrorStats(): {
    total: number;
    byType: Record<ThemeErrorType, number>;
    recent: number;
  } {
    const byType = Object.values(ThemeErrorType).reduce((acc, type) => {
      acc[type] = this.errorLog.filter(error => error.type === type).length;
      return acc;
    }, {} as Record<ThemeErrorType, number>);

    return {
      total: this.errorLog.length,
      byType,
      recent: this.errorLog.filter(error => 
        Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
      ).length,
    };
  }
}

// Theme validation error handling
export class ThemeValidationErrorHandler {
  static validateThemePreset(preset: ThemePreset): { isValid: boolean; errors: ThemeError[] } {
    const errors: ThemeError[] = [];
    const errorHandler = ThemeErrorHandler.getInstance();

    // Validate colors
    if (!preset.colors) {
      errors.push(errorHandler.createError(
        ThemeErrorType.VALIDATION_ERROR,
        'Theme preset missing colors',
        { presetId: preset.id },
        { operation: 'validateThemePreset', presetId: preset.id }
      ));
    } else {
      const colorErrors = this.validateColors(preset.colors, preset.id);
      errors.push(...colorErrors);
    }

    // Validate typography
    if (!preset.typography) {
      errors.push(errorHandler.createError(
        ThemeErrorType.VALIDATION_ERROR,
        'Theme preset missing typography',
        { presetId: preset.id },
        { operation: 'validateThemePreset', presetId: preset.id }
      ));
    } else {
      const typographyErrors = this.validateTypography(preset.typography, preset.id);
      errors.push(...typographyErrors);
    }

    // Validate accessibility
    if (!preset.accessibility) {
      errors.push(errorHandler.createError(
        ThemeErrorType.VALIDATION_ERROR,
        'Theme preset missing accessibility metadata',
        { presetId: preset.id },
        { operation: 'validateThemePreset', presetId: preset.id }
      ));
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateColors(colors: ColorScheme, presetId?: string): ThemeError[] {
    const errors: ThemeError[] = [];
    const errorHandler = ThemeErrorHandler.getInstance();

    // Check for required color properties
    const requiredColors = ['primary', 'secondary', 'background', 'text'];
    for (const colorKey of requiredColors) {
      if (!colors[colorKey as keyof ColorScheme]) {
        errors.push(errorHandler.createError(
          ThemeErrorType.INVALID_COLOR,
          `Missing required color: ${colorKey}`,
          { colorKey, presetId },
          { operation: 'validateColors', presetId }
        ));
      }
    }

    // Validate color format
    for (const [key, value] of Object.entries(colors)) {
      if (value && !this.isValidColor(value)) {
        errors.push(errorHandler.createError(
          ThemeErrorType.INVALID_COLOR,
          `Invalid color format: ${key} = ${value}`,
          { colorKey: key, colorValue: value, presetId },
          { operation: 'validateColors', presetId }
        ));
      }
    }

    return errors;
  }

  static validateTypography(typography: TypographyConfig, presetId?: string): ThemeError[] {
    const errors: ThemeError[] = [];
    const errorHandler = ThemeErrorHandler.getInstance();

    // Check for required typography properties
    if (!typography.fontFamily) {
      errors.push(errorHandler.createError(
        ThemeErrorType.INVALID_TYPOGRAPHY,
        'Missing font family',
        { presetId },
        { operation: 'validateTypography', presetId }
      ));
    }

    if (!typography.headingFont) {
      errors.push(errorHandler.createError(
        ThemeErrorType.INVALID_TYPOGRAPHY,
        'Missing heading font',
        { presetId },
        { operation: 'validateTypography', presetId }
      ));
    }

    // Validate font sizes
    if (typography.fontSizes) {
      for (const [sizeKey, sizeValue] of Object.entries(typography.fontSizes)) {
        if (!this.isValidFontSize(sizeValue)) {
          errors.push(errorHandler.createError(
            ThemeErrorType.INVALID_TYPOGRAPHY,
            `Invalid font size: ${sizeKey} = ${sizeValue}`,
            { sizeKey, sizeValue, presetId },
            { operation: 'validateTypography', presetId }
          ));
        }
      }
    }

    return errors;
  }

  private static isValidColor(color: string): boolean {
    // Check for hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      return true;
    }

    // Check for rgb/rgba colors
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }

    // Check for hsl/hsla colors
    if (/^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+\s*)?\)$/.test(color)) {
      return true;
    }

    // Check for named colors (basic check)
    const namedColors = [
      'red', 'green', 'blue', 'black', 'white', 'transparent',
      'currentColor', 'inherit', 'initial', 'unset'
    ];
    if (namedColors.includes(color.toLowerCase())) {
      return true;
    }

    return false;
  }

  private static isValidFontSize(size: string): boolean {
    // Check for rem, em, px, %, vw, vh units
    return /^\d+(\.\d+)?(rem|em|px|%|vw|vh)$/.test(size);
  }
}

// Theme operation error handling
export class ThemeOperationErrorHandler {
  static async safeThemeOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: ThemeError['context']
  ): Promise<{ success: boolean; data?: T; error?: ThemeError }> {
    const errorHandler = ThemeErrorHandler.getInstance();

    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      const themeError = errorHandler.createError(
        ThemeErrorType.UNKNOWN_ERROR,
        `Failed to execute ${operationName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { originalError: error },
        context
      );

      return { success: false, error: themeError };
    }
  }

  static async safeThemeImport(
    importData: string,
    context?: ThemeError['context']
  ): Promise<{ success: boolean; theme?: ThemePreset; error?: ThemeError }> {
    const errorHandler = ThemeErrorHandler.getInstance();

    try {
      const parsed = JSON.parse(importData);
      
      // Validate imported theme structure
      if (!parsed.id || !parsed.colors || !parsed.typography) {
        throw new Error('Invalid theme structure');
      }

      const validation = ThemeValidationErrorHandler.validateThemePreset(parsed);
      if (!validation.isValid) {
        const error = errorHandler.createError(
          ThemeErrorType.IMPORT_ERROR,
          'Imported theme failed validation',
          { validationErrors: validation.errors },
          context
        );
        return { success: false, error };
      }

      return { success: true, theme: parsed };
    } catch (error) {
      const themeError = errorHandler.createError(
        ThemeErrorType.IMPORT_ERROR,
        `Failed to import theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { importData, originalError: error },
        context
      );

      return { success: false, error: themeError };
    }
  }

  static async safeThemeExport(
    theme: ThemePreset,
    context?: ThemeError['context']
  ): Promise<{ success: boolean; data?: string; error?: ThemeError }> {
    const errorHandler = ThemeErrorHandler.getInstance();

    try {
      const validation = ThemeValidationErrorHandler.validateThemePreset(theme);
      if (!validation.isValid) {
        const error = errorHandler.createError(
          ThemeErrorType.EXPORT_ERROR,
          'Theme failed validation before export',
          { validationErrors: validation.errors },
          context
        );
        return { success: false, error };
      }

      const exportData = JSON.stringify(theme, null, 2);
      return { success: true, data: exportData };
    } catch (error) {
      const themeError = errorHandler.createError(
        ThemeErrorType.EXPORT_ERROR,
        `Failed to export theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        { theme, originalError: error },
        context
      );

      return { success: false, error: themeError };
    }
  }
}

// Error recovery strategies
export class ThemeErrorRecovery {
  static recoverFromValidationError(
    errors: ThemeError[],
    fallbackTheme?: ThemePreset
  ): { recovered: boolean; theme?: ThemePreset; warnings: string[] } {
    const warnings: string[] = [];
    
    if (!fallbackTheme) {
      return { recovered: false, warnings: ['No fallback theme available'] };
    }

    // Check if we can recover by using fallback theme
    const validation = ThemeValidationErrorHandler.validateThemePreset(fallbackTheme);
    if (validation.isValid) {
      warnings.push('Using fallback theme due to validation errors');
      return { recovered: true, theme: fallbackTheme, warnings };
    }

    return { recovered: false, warnings: ['Fallback theme also invalid'] };
  }

  static recoverFromImportError(
    error: ThemeError,
    fallbackTheme?: ThemePreset
  ): { recovered: boolean; theme?: ThemePreset; warnings: string[] } {
    const warnings: string[] = [];
    
    if (!fallbackTheme) {
      return { recovered: false, warnings: ['No fallback theme available'] };
    }

    warnings.push('Import failed, using fallback theme');
    return { recovered: true, theme: fallbackTheme, warnings };
  }

  static recoverFromStorageError(
    error: ThemeError,
    defaultTheme?: ThemePreset
  ): { recovered: boolean; theme?: ThemePreset; warnings: string[] } {
    const warnings: string[] = [];
    
    if (!defaultTheme) {
      return { recovered: false, warnings: ['No default theme available'] };
    }

    warnings.push('Storage error, using default theme');
    return { recovered: true, theme: defaultTheme, warnings };
  }
}

// Error reporting utilities
export class ThemeErrorReporter {
  static async reportError(error: ThemeError): Promise<void> {
    // In a real application, this would send errors to a monitoring service
    // For now, we'll just log them
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Theme Error Report:', {
        type: error.type,
        message: error.message,
        timestamp: error.timestamp,
        context: error.context,
        details: error.details,
      });
    }

    // TODO: Implement actual error reporting service
    // await fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(error),
    // });
  }

  static async reportErrorBatch(errors: ThemeError[]): Promise<void> {
    for (const error of errors) {
      await this.reportError(error);
    }
  }
}

// Export singleton instance
export const themeErrorHandler = ThemeErrorHandler.getInstance();
