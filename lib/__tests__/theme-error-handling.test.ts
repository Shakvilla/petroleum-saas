// Documentation: /docs/branding-preset-themes/theme-error-handling-tests.md

import {
  ThemeErrorHandler,
  ThemeErrorType,
  ThemeValidationErrorHandler,
  ThemeOperationErrorHandler,
  ThemeErrorRecovery,
  ThemeErrorReporter,
} from '../theme-error-handling';
import type { ThemePreset } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

describe('Theme Error Handling', () => {
  let errorHandler: ThemeErrorHandler;

  beforeEach(() => {
    errorHandler = ThemeErrorHandler.getInstance();
    errorHandler.clearErrors();
  });

  describe('ThemeErrorHandler', () => {
    it('should create and log errors', () => {
      const error = errorHandler.createError(
        ThemeErrorType.VALIDATION_ERROR,
        'Test error message',
        { test: 'data' },
        { operation: 'test' }
      );

      expect(error.type).toBe(ThemeErrorType.VALIDATION_ERROR);
      expect(error.message).toBe('Test error message');
      expect(error.details).toEqual({ test: 'data' });
      expect(error.context).toEqual({ operation: 'test' });
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it('should retrieve recent errors', () => {
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Error 1');
      errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Error 2');
      errorHandler.createError(ThemeErrorType.EXPORT_ERROR, 'Error 3');

      const recentErrors = errorHandler.getRecentErrors(2);
      expect(recentErrors).toHaveLength(2);
      expect(recentErrors[0].message).toBe('Error 3'); // Most recent first
      expect(recentErrors[1].message).toBe('Error 2');
    });

    it('should filter errors by type', () => {
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Validation Error 1');
      errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Import Error 1');
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Validation Error 2');

      const validationErrors = errorHandler.getErrorsByType(ThemeErrorType.VALIDATION_ERROR);
      expect(validationErrors).toHaveLength(2);
      expect(validationErrors.every(e => e.type === ThemeErrorType.VALIDATION_ERROR)).toBe(true);
    });

    it('should provide error statistics', () => {
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Error 1');
      errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Error 2');
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Error 3');

      const stats = errorHandler.getErrorStats();
      expect(stats.total).toBe(3);
      expect(stats.byType[ThemeErrorType.VALIDATION_ERROR]).toBe(2);
      expect(stats.byType[ThemeErrorType.IMPORT_ERROR]).toBe(1);
    });

    it('should clear error log', () => {
      errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Error 1');
      errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Error 2');

      expect(errorHandler.getRecentErrors()).toHaveLength(2);
      
      errorHandler.clearErrors();
      expect(errorHandler.getRecentErrors()).toHaveLength(0);
    });
  });

  describe('ThemeValidationErrorHandler', () => {
    const validThemePreset: ThemePreset = {
      id: 'test-preset',
      name: 'Test Preset',
      description: 'Test description',
      category: 'corporate',
      icon: 'test-icon',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#000000',
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
        colorBlindnessFriendly: true,
        largeTextCompliant: true,
      },
    };

    it('should validate theme preset successfully', () => {
      const result = ThemeValidationErrorHandler.validateThemePreset(validThemePreset);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing colors', () => {
      const invalidPreset = { ...validThemePreset, colors: undefined as any };
      const result = ThemeValidationErrorHandler.validateThemePreset(invalidPreset);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ThemeErrorType.VALIDATION_ERROR);
      expect(result.errors[0].message).toContain('missing colors');
    });

    it('should detect missing typography', () => {
      const invalidPreset = { ...validThemePreset, typography: undefined as any };
      const result = ThemeValidationErrorHandler.validateThemePreset(invalidPreset);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ThemeErrorType.VALIDATION_ERROR);
      expect(result.errors[0].message).toContain('missing typography');
    });

    it('should detect missing accessibility metadata', () => {
      const invalidPreset = { ...validThemePreset, accessibility: undefined as any };
      const result = ThemeValidationErrorHandler.validateThemePreset(invalidPreset);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].type).toBe(ThemeErrorType.VALIDATION_ERROR);
      expect(result.errors[0].message).toContain('missing accessibility metadata');
    });

    it('should validate colors correctly', () => {
      const invalidColors: ColorScheme = {
        primary: 'invalid-color',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#000000',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      };

      const errors = ThemeValidationErrorHandler.validateColors(invalidColors, 'test-preset');
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ThemeErrorType.INVALID_COLOR);
      expect(errors[0].message).toContain('Invalid color format');
    });

    it('should validate typography correctly', () => {
      const invalidTypography: TypographyConfig = {
        fontFamily: '',
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

      const errors = ThemeValidationErrorHandler.validateTypography(invalidTypography, 'test-preset');
      
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ThemeErrorType.INVALID_TYPOGRAPHY);
      expect(errors[0].message).toContain('Missing font family');
    });
  });

  describe('ThemeOperationErrorHandler', () => {
    it('should handle successful operations', async () => {
      const result = await ThemeOperationErrorHandler.safeThemeOperation(
        async () => 'success',
        'test-operation'
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.error).toBeUndefined();
    });

    it('should handle failed operations', async () => {
      const result = await ThemeOperationErrorHandler.safeThemeOperation(
        async () => {
          throw new Error('Test error');
        },
        'test-operation'
      );

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ThemeErrorType.UNKNOWN_ERROR);
      expect(result.error?.message).toContain('Failed to execute test-operation');
    });

    it('should handle theme import successfully', async () => {
      const validThemeData = JSON.stringify({
        id: 'test-preset',
        name: 'Test Preset',
        colors: { primary: '#3b82f6' },
        typography: { fontFamily: 'Inter' },
        accessibility: { contrastRatio: 4.5 },
      });

      const result = await ThemeOperationErrorHandler.safeThemeImport(validThemeData);
      
      expect(result.success).toBe(true);
      expect(result.theme).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should handle theme import errors', async () => {
      const invalidThemeData = 'invalid-json';

      const result = await ThemeOperationErrorHandler.safeThemeImport(invalidThemeData);
      
      expect(result.success).toBe(false);
      expect(result.theme).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe(ThemeErrorType.IMPORT_ERROR);
    });

    it('should handle theme export successfully', async () => {
      const validTheme: ThemePreset = {
        id: 'test-preset',
        name: 'Test Preset',
        description: 'Test description',
        category: 'corporate',
        icon: 'test-icon',
        colors: {
          primary: '#3b82f6',
          secondary: '#6b7280',
          accent: '#8b5cf6',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#000000',
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
          colorBlindnessFriendly: true,
          largeTextCompliant: true,
        },
      };

      const result = await ThemeOperationErrorHandler.safeThemeExport(validTheme);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });
  });

  describe('ThemeErrorRecovery', () => {
    const fallbackTheme: ThemePreset = {
      id: 'fallback-preset',
      name: 'Fallback Preset',
      description: 'Fallback description',
      category: 'corporate',
      icon: 'fallback-icon',
      colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#000000',
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
      tags: ['fallback'],
      accessibility: {
        contrastRatio: 4.5,
        colorBlindnessFriendly: true,
        largeTextCompliant: true,
      },
    };

    it('should recover from validation errors', () => {
      const errors = [
        errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Validation error'),
      ];

      const result = ThemeErrorRecovery.recoverFromValidationError(errors, fallbackTheme);
      
      expect(result.recovered).toBe(true);
      expect(result.theme).toEqual(fallbackTheme);
      expect(result.warnings).toContain('Using fallback theme due to validation errors');
    });

    it('should handle recovery without fallback theme', () => {
      const errors = [
        errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Validation error'),
      ];

      const result = ThemeErrorRecovery.recoverFromValidationError(errors);
      
      expect(result.recovered).toBe(false);
      expect(result.theme).toBeUndefined();
      expect(result.warnings).toContain('No fallback theme available');
    });

    it('should recover from import errors', () => {
      const error = errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Import error');

      const result = ThemeErrorRecovery.recoverFromImportError(error, fallbackTheme);
      
      expect(result.recovered).toBe(true);
      expect(result.theme).toEqual(fallbackTheme);
      expect(result.warnings).toContain('Import failed, using fallback theme');
    });

    it('should recover from storage errors', () => {
      const error = errorHandler.createError(ThemeErrorType.STORAGE_ERROR, 'Storage error');

      const result = ThemeErrorRecovery.recoverFromStorageError(error, fallbackTheme);
      
      expect(result.recovered).toBe(true);
      expect(result.theme).toEqual(fallbackTheme);
      expect(result.warnings).toContain('Storage error, using default theme');
    });
  });

  describe('ThemeErrorReporter', () => {
    it('should report errors', async () => {
      const error = errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Test error');
      
      // Mock console.error to avoid actual logging during tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await ThemeErrorReporter.reportError(error);
      
      expect(consoleSpy).toHaveBeenCalledWith('Theme Error Report:', expect.objectContaining({
        type: error.type,
        message: error.message,
        timestamp: error.timestamp,
        context: error.context,
        details: error.details,
      }));
      
      consoleSpy.mockRestore();
    });

    it('should report error batches', async () => {
      const errors = [
        errorHandler.createError(ThemeErrorType.VALIDATION_ERROR, 'Error 1'),
        errorHandler.createError(ThemeErrorType.IMPORT_ERROR, 'Error 2'),
      ];
      
      // Mock console.error to avoid actual logging during tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      await ThemeErrorReporter.reportErrorBatch(errors);
      
      expect(consoleSpy).toHaveBeenCalledTimes(2);
      
      consoleSpy.mockRestore();
    });
  });
});
