// Documentation: /docs/branding-preset-themes/settings-store-tests.md

import { renderHook, act } from '@testing-library/react';
import { useSettingsStore } from '../settings-store';
import { THEME_PRESETS } from '@/lib/theme-presets-data';
import type { ThemePreset, ThemeCustomization } from '@/types/theme-presets';

// Mock the validation functions
jest.mock('@/lib/theme-validation', () => ({
  validateThemePreset: jest.fn(() => ({
    isCompliant: true,
    contrastRatios: {},
    warnings: [],
    recommendations: [],
    score: 95,
    lastValidated: new Date(),
  })),
  validateColorScheme: jest.fn(() => ({
    isCompliant: true,
    contrastRatios: {},
    warnings: [],
    recommendations: [],
    score: 95,
    lastValidated: new Date(),
  })),
  validateTypography: jest.fn(() => ({
    isCompliant: true,
    contrastRatios: {},
    warnings: [],
    recommendations: [],
    score: 95,
    lastValidated: new Date(),
  })),
}));

describe('Settings Store Theme Management', () => {
  beforeEach(() => {
    // Reset store state before each test
    useSettingsStore.getState().resetSettings();
  });

  describe('Theme Preset Management', () => {
    it('should set theme preset and update settings', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      expect(result.current.currentThemePreset).toEqual(testPreset);
      expect(result.current.settingsData.branding.themeManagement?.currentPresetId).toBe(testPreset.id);
      expect(result.current.settingsData.branding.visualBranding.colorScheme).toEqual(testPreset.colors);
      expect(result.current.settingsData.branding.visualBranding.typography).toEqual(testPreset.typography);
      expect(result.current.hasUnsavedChanges).toBe(true);
    });

    it('should validate theme preset when setting', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      expect(result.current.themeValidationResults).toBeDefined();
      expect(result.current.themeValidationResults?.isCompliant).toBe(true);
    });

    it('should add theme preset to history', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      expect(result.current.themeHistory).toHaveLength(1);
      expect(result.current.themeHistory[0].preset).toEqual(testPreset);
      expect(result.current.themeHistory[0].description).toContain(testPreset.name);
    });
  });

  describe('Theme Customization Management', () => {
    it('should apply theme customization', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];
      const customization: ThemeCustomization = {
        presetId: testPreset.id,
        customizations: {
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
          },
          typography: {
            fontFamily: 'Arial, sans-serif',
          },
        },
        appliedAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
      };

      // First set a preset
      act(() => {
        result.current.setThemePreset(testPreset);
      });

      // Then apply customization
      act(() => {
        result.current.applyThemeCustomization(customization);
      });

      expect(result.current.themeCustomizations).toEqual(customization);
      expect(result.current.settingsData.branding.visualBranding.colorScheme.primary).toBe('#ff0000');
      expect(result.current.settingsData.branding.visualBranding.colorScheme.secondary).toBe('#00ff00');
      expect(result.current.settingsData.branding.visualBranding.typography.fontFamily).toBe('Arial, sans-serif');
    });

    it('should validate theme after customization', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];
      const customization: ThemeCustomization = {
        presetId: testPreset.id,
        customizations: {
          colors: {
            primary: '#ff0000',
          },
        },
        appliedAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
      };

      act(() => {
        result.current.setThemePreset(testPreset);
        result.current.applyThemeCustomization(customization);
      });

      expect(result.current.themeValidationResults).toBeDefined();
    });

    it('should add customization to history', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];
      const customization: ThemeCustomization = {
        presetId: testPreset.id,
        customizations: {
          colors: {
            primary: '#ff0000',
          },
        },
        appliedAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
      };

      act(() => {
        result.current.setThemePreset(testPreset);
        result.current.applyThemeCustomization(customization);
      });

      expect(result.current.themeHistory).toHaveLength(2);
      expect(result.current.themeHistory[1].customizations).toEqual(customization);
    });
  });

  describe('Theme Export/Import', () => {
    it('should export theme configuration', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      const exportedData = result.current.exportTheme();
      const parsedData = JSON.parse(exportedData);

      expect(parsedData.preset).toEqual(testPreset);
      expect(parsedData.exportedAt).toBeDefined();
    });

    it('should import valid theme configuration', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];
      const customization: ThemeCustomization = {
        presetId: testPreset.id,
        customizations: {
          colors: {
            primary: '#ff0000',
          },
        },
        appliedAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
      };

      const themeData = JSON.stringify({
        preset: testPreset,
        customizations: customization,
        exportedAt: new Date().toISOString(),
      });

      act(() => {
        result.current.importTheme(themeData);
      });

      expect(result.current.currentThemePreset).toEqual(testPreset);
      expect(result.current.themeCustomizations).toEqual(customization);
    });

    it('should throw error for invalid theme data', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(() => {
        act(() => {
          result.current.importTheme('invalid json');
        });
      }).toThrow('Invalid theme data format');
    });

    it('should throw error for incomplete theme data', () => {
      const { result } = renderHook(() => useSettingsStore());

      const incompleteData = JSON.stringify({
        // Missing preset, customizations, and settings
      });

      expect(() => {
        act(() => {
          result.current.importTheme(incompleteData);
        });
      }).toThrow('Invalid theme data: missing preset, customizations, or settings');
    });
  });

  describe('Theme Validation', () => {
    it('should validate theme configuration', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      const validationResults = result.current.validateTheme(result.current.settingsData);

      expect(validationResults).toBeDefined();
      expect(validationResults.isCompliant).toBe(true);
      expect(validationResults.score).toBeGreaterThan(0);
      expect(result.current.themeValidationResults).toEqual(validationResults);
    });

    it('should handle incomplete theme validation', () => {
      const { result } = renderHook(() => useSettingsStore());

      const incompleteTheme = {
        ...result.current.settingsData,
        branding: {
          ...result.current.settingsData.branding,
          visualBranding: undefined,
        },
      };

      const validationResults = result.current.validateTheme(incompleteTheme);

      expect(validationResults.isCompliant).toBe(false);
      expect(validationResults.score).toBe(0);
      expect(validationResults.recommendations).toContain('Theme configuration is incomplete');
    });
  });

  describe('Theme History Management', () => {
    it('should add entry to theme history', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      const historyEntry = {
        id: 'test-entry',
        preset: testPreset,
        customizations: undefined,
        appliedAt: new Date(),
        appliedBy: 'test-user',
        description: 'Test history entry',
      };

      act(() => {
        result.current.addToThemeHistory(historyEntry);
      });

      expect(result.current.themeHistory).toHaveLength(1);
      expect(result.current.themeHistory[0]).toEqual(historyEntry);
    });

    it('should limit history to 50 entries', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      // Add 55 entries
      for (let i = 0; i < 55; i++) {
        act(() => {
          result.current.addToThemeHistory({
            id: `entry-${i}`,
            preset: testPreset,
            customizations: undefined,
            appliedAt: new Date(),
            appliedBy: 'test-user',
            description: `Entry ${i}`,
          });
        });
      }

      expect(result.current.themeHistory).toHaveLength(50);
      expect(result.current.themeHistory[0].id).toBe('entry-5'); // First 5 entries should be removed
    });

    it('should undo theme change', () => {
      const { result } = renderHook(() => useSettingsStore());
      const preset1 = THEME_PRESETS[0];
      const preset2 = THEME_PRESETS[1];

      // Apply first preset
      act(() => {
        result.current.setThemePreset(preset1);
      });

      const initialState = result.current.settingsData;

      // Apply second preset
      act(() => {
        result.current.setThemePreset(preset2);
      });

      // Undo to first preset
      act(() => {
        result.current.undoThemeChange();
      });

      expect(result.current.currentThemePreset).toEqual(preset1);
      expect(result.current.settingsData.branding.visualBranding.colorScheme).toEqual(preset1.colors);
      expect(result.current.themeHistory).toHaveLength(1); // One entry removed
    });

    it('should handle undo when no history available', () => {
      const { result } = renderHook(() => useSettingsStore());
      const initialState = result.current;

      act(() => {
        result.current.undoThemeChange();
      });

      // Should not change state when no history
      expect(result.current).toEqual(initialState);
    });
  });

  describe('Theme Reset and Save', () => {
    it('should reset theme customization', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];
      const customization: ThemeCustomization = {
        presetId: testPreset.id,
        customizations: {
          colors: {
            primary: '#ff0000',
          },
        },
        appliedAt: new Date(),
        lastModified: new Date(),
        version: '1.0.0',
      };

      act(() => {
        result.current.setThemePreset(testPreset);
        result.current.applyThemeCustomization(customization);
      });

      expect(result.current.themeCustomizations).toEqual(customization);

      act(() => {
        result.current.resetThemeCustomization();
      });

      expect(result.current.themeCustomizations).toBeNull();
      expect(result.current.settingsData.branding.themeManagement?.customizations).toBeUndefined();
    });

    it('should save theme customization', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      expect(result.current.hasUnsavedChanges).toBe(true);

      act(() => {
        result.current.saveThemeCustomization();
      });

      expect(result.current.hasUnsavedChanges).toBe(false);
      expect(result.current.settingsData.branding.themeManagement?.lastApplied).toBeDefined();
    });
  });

  describe('Store Persistence', () => {
    it('should persist theme management state', () => {
      const { result } = renderHook(() => useSettingsStore());
      const testPreset = THEME_PRESETS[0];

      act(() => {
        result.current.setThemePreset(testPreset);
      });

      // Check that theme management properties are included in persistence
      const storeState = useSettingsStore.getState();
      expect(storeState.currentThemePreset).toBeDefined();
      expect(storeState.themeValidationResults).toBeDefined();
      expect(storeState.themeHistory).toBeDefined();
    });
  });
});
