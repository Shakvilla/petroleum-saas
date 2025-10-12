// Documentation: /docs/comprehensive-theming-system/theme-store.md

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UnifiedTheme,
  ThemePreset,
  ThemeCustomization,
  ThemeValidationResult,
  ThemeHistoryEntry,
  PerformanceMetrics,
  ThemeExportData,
  ThemeImportResult,
  ThemeManagerConfig,
} from '@/types/unified-theme';
import { UnifiedThemeManager } from '@/lib/unified-theme-manager';
import { EnhancedCSSVariableManager } from '@/lib/enhanced-css-variables';

// Theme store state interface
interface ThemeStoreState {
  // Current state
  currentTheme: UnifiedTheme | null;
  themePresets: Map<string, ThemePreset>;
  customThemes: Map<string, UnifiedTheme>;
  themeHistory: ThemeHistoryEntry[];
  validationResults: ThemeValidationResult | null;
  performanceMetrics: PerformanceMetrics | null;
  isApplying: boolean;
  lastApplied: Date | null;
  errors: string[];
  
  // Configuration
  config: ThemeManagerConfig;
  
  // Actions
  setCurrentTheme: (theme: UnifiedTheme) => void;
  setThemePresets: (presets: Map<string, ThemePreset>) => void;
  setCustomThemes: (themes: Map<string, UnifiedTheme>) => void;
  setThemeHistory: (history: ThemeHistoryEntry[]) => void;
  setValidationResults: (results: ThemeValidationResult | null) => void;
  setPerformanceMetrics: (metrics: PerformanceMetrics | null) => void;
  setIsApplying: (isApplying: boolean) => void;
  setLastApplied: (date: Date | null) => void;
  setErrors: (errors: string[]) => void;
  setConfig: (config: Partial<ThemeManagerConfig>) => void;
  
  // Theme management
  applyTheme: (theme: UnifiedTheme) => Promise<void>;
  applyPreset: (presetId: string, customizations?: ThemeCustomization) => Promise<void>;
  applyCustomization: (customization: ThemeCustomization) => Promise<void>;
  
  // Theme CRUD
  saveTheme: (theme: UnifiedTheme) => void;
  loadTheme: (themeId: string) => UnifiedTheme | null;
  deleteTheme: (themeId: string) => void;
  listThemes: () => UnifiedTheme[];
  
  // Validation
  validateTheme: (theme: UnifiedTheme) => ThemeValidationResult;
  
  // History
  undoThemeChange: () => void;
  redoThemeChange: () => void;
  clearHistory: () => void;
  
  // Export/Import
  exportTheme: (theme: UnifiedTheme) => string;
  importTheme: (themeData: string) => ThemeImportResult;
  
  // Performance
  getPerformanceMetrics: () => PerformanceMetrics | null;
  clearPerformanceMetrics: () => void;
  
  // Cache
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
  
  // Reset
  resetToDefault: () => void;
  resetToPreset: (presetId: string) => void;
  
  // Utility
  getThemeById: (id: string) => UnifiedTheme | null;
  searchThemes: (query: string) => UnifiedTheme[];
  getThemesByCategory: (category: string) => UnifiedTheme[];
}

// Default configuration
const defaultConfig: ThemeManagerConfig = {
  enableCaching: true,
  enablePerformanceMonitoring: true,
  enableRealTimeUpdates: true,
  enableAccessibilityValidation: true,
  cacheSize: 100,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  debounceDelay: 100,
  validationLevel: 'standard',
};

// Create the theme store
export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTheme: null,
      themePresets: new Map(),
      customThemes: new Map(),
      themeHistory: [],
      validationResults: null,
      performanceMetrics: null,
      isApplying: false,
      lastApplied: null,
      errors: [],
      config: defaultConfig,

      // Actions
      setCurrentTheme: (theme: UnifiedTheme) => {
        set({ currentTheme: theme });
      },

      setThemePresets: (presets: Map<string, ThemePreset>) => {
        set({ themePresets: presets });
      },

      setCustomThemes: (themes: Map<string, UnifiedTheme>) => {
        set({ customThemes: themes });
      },

      setThemeHistory: (history: ThemeHistoryEntry[]) => {
        set({ themeHistory: history });
      },

      setValidationResults: (results: ThemeValidationResult | null) => {
        set({ validationResults: results });
      },

      setPerformanceMetrics: (metrics: PerformanceMetrics | null) => {
        set({ performanceMetrics: metrics });
      },

      setIsApplying: (isApplying: boolean) => {
        set({ isApplying });
      },

      setLastApplied: (date: Date | null) => {
        set({ lastApplied: date });
      },

      setErrors: (errors: string[]) => {
        set({ errors });
      },

      setConfig: (newConfig: Partial<ThemeManagerConfig>) => {
        set(state => ({
          config: { ...state.config, ...newConfig }
        }));
      },

      // Theme management
      applyTheme: async (theme: UnifiedTheme) => {
        try {
          set({ isApplying: true, errors: [] });

          // Create theme manager instance
          const themeManager = new UnifiedThemeManager(get().config);
          const cssVariableManager = new EnhancedCSSVariableManager();

          // Apply theme
          const result = await themeManager.applyTheme(theme);

          if (result.success) {
            // Generate and inject CSS variables
            const cssVariables = cssVariableManager.generateVariables(theme);
            cssVariableManager.injectVariables(cssVariables);

            // Update state
            set({
              currentTheme: theme,
              lastApplied: result.appliedAt,
              themeHistory: [...get().themeHistory, {
                id: `theme-${theme.id}-${Date.now()}`,
                theme,
                appliedAt: result.appliedAt,
                appliedBy: 'user',
                description: `Applied theme: ${theme.name}`,
                duration: result.duration,
              }].slice(-50), // Keep last 50 entries
            });
          } else {
            set({ errors: result.errors });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ errors: [errorMessage] });
        } finally {
          set({ isApplying: false });
        }
      },

      applyPreset: async (presetId: string, customizations?: ThemeCustomization) => {
        try {
          set({ isApplying: true, errors: [] });

          const themeManager = new UnifiedThemeManager(get().config);
          const result = await themeManager.applyPreset(presetId, customizations);

          if (result.success) {
            // Update state
            set({
              currentTheme: result.theme,
              lastApplied: result.appliedAt,
              themeHistory: [...get().themeHistory, {
                id: `preset-${presetId}-${Date.now()}`,
                theme: result.theme,
                appliedAt: result.appliedAt,
                appliedBy: 'user',
                description: `Applied preset: ${presetId}`,
                duration: result.duration,
              }].slice(-50),
            });
          } else {
            set({ errors: result.errors });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ errors: [errorMessage] });
        } finally {
          set({ isApplying: false });
        }
      },

      applyCustomization: async (customization: ThemeCustomization) => {
        try {
          set({ isApplying: true, errors: [] });

          const themeManager = new UnifiedThemeManager(get().config);
          const result = await themeManager.applyCustomization(customization);

          if (result.success) {
            // Update state
            set({
              currentTheme: result.theme,
              lastApplied: result.appliedAt,
              themeHistory: [...get().themeHistory, {
                id: `customization-${Date.now()}`,
                theme: result.theme,
                appliedAt: result.appliedAt,
                appliedBy: 'user',
                description: 'Applied customization',
                duration: result.duration,
              }].slice(-50),
            });
          } else {
            set({ errors: result.errors });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ errors: [errorMessage] });
        } finally {
          set({ isApplying: false });
        }
      },

      // Theme CRUD
      saveTheme: (theme: UnifiedTheme) => {
        const customThemes = new Map(get().customThemes);
        customThemes.set(theme.id, theme);
        set({ customThemes });
      },

      loadTheme: (themeId: string) => {
        // Check custom themes first
        if (get().customThemes.has(themeId)) {
          return get().customThemes.get(themeId)!;
        }

        // Check presets
        if (get().themePresets.has(themeId)) {
          const preset = get().themePresets.get(themeId)!;
          // Convert preset to unified theme
          return {
            id: preset.id,
            name: preset.name,
            description: preset.description,
            colors: preset.colors,
            typography: preset.typography,
            spacing: {
              xs: '0.25rem',
              sm: '0.5rem',
              md: '1rem',
              lg: '1.5rem',
              xl: '2rem',
              '2xl': '3rem',
              '3xl': '4rem',
              '4xl': '6rem',
            },
            borderRadius: {
              none: '0',
              sm: '0.125rem',
              md: '0.375rem',
              lg: '0.5rem',
              xl: '0.75rem',
              '2xl': '1rem',
              '3xl': '1.5rem',
              full: '9999px',
            },
            shadows: {
              none: 'none',
              sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
              md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
              inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
            },
            branding: {
              logo: {
                primary: '',
                favicon: '',
                sizes: {
                  small: '',
                  medium: '',
                  large: '',
                },
              },
              favicon: '',
              appName: 'Petroleum SaaS',
            },
            animations: {
              duration: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms',
              },
              easing: {
                linear: 'linear',
                ease: 'ease',
                easeIn: 'ease-in',
                easeOut: 'ease-out',
                easeInOut: 'ease-in-out',
              },
              keyframes: {
                fadeIn: 'fadeIn 0.3s ease-in-out',
                fadeOut: 'fadeOut 0.3s ease-in-out',
                slideIn: 'slideIn 0.3s ease-out',
                slideOut: 'slideOut 0.3s ease-in',
                scaleIn: 'scaleIn 0.2s ease-out',
                scaleOut: 'scaleOut 0.2s ease-in',
              },
            },
            transitions: {
              duration: {
                fast: '150ms',
                normal: '300ms',
                slow: '500ms',
              },
              easing: {
                linear: 'linear',
                ease: 'ease',
                easeIn: 'ease-in',
                easeOut: 'ease-out',
                easeInOut: 'ease-in-out',
              },
              properties: ['color', 'background-color', 'border-color', 'opacity', 'transform'],
            },
            effects: {
              blur: {
                none: 'blur(0)',
                sm: 'blur(4px)',
                md: 'blur(8px)',
                lg: 'blur(12px)',
                xl: 'blur(16px)',
                '2xl': 'blur(24px)',
                '3xl': 'blur(40px)',
              },
              brightness: {
                '0': 'brightness(0)',
                '50': 'brightness(0.5)',
                '75': 'brightness(0.75)',
                '90': 'brightness(0.9)',
                '95': 'brightness(0.95)',
                '100': 'brightness(1)',
                '105': 'brightness(1.05)',
                '110': 'brightness(1.1)',
                '125': 'brightness(1.25)',
                '150': 'brightness(1.5)',
                '200': 'brightness(2)',
              },
              contrast: {
                '0': 'contrast(0)',
                '50': 'contrast(0.5)',
                '75': 'contrast(0.75)',
                '100': 'contrast(1)',
                '125': 'contrast(1.25)',
                '150': 'contrast(1.5)',
                '200': 'contrast(2)',
              },
              grayscale: {
                '0': 'grayscale(0)',
                '100': 'grayscale(1)',
              },
              hueRotate: {
                '0': 'hue-rotate(0deg)',
                '15': 'hue-rotate(15deg)',
                '30': 'hue-rotate(30deg)',
                '60': 'hue-rotate(60deg)',
                '90': 'hue-rotate(90deg)',
                '180': 'hue-rotate(180deg)',
              },
              invert: {
                '0': 'invert(0)',
                '100': 'invert(1)',
              },
              opacity: {
                '0': 'opacity(0)',
                '5': 'opacity(0.05)',
                '10': 'opacity(0.1)',
                '20': 'opacity(0.2)',
                '25': 'opacity(0.25)',
                '30': 'opacity(0.3)',
                '40': 'opacity(0.4)',
                '50': 'opacity(0.5)',
                '60': 'opacity(0.6)',
                '70': 'opacity(0.7)',
                '75': 'opacity(0.75)',
                '80': 'opacity(0.8)',
                '90': 'opacity(0.9)',
                '95': 'opacity(0.95)',
                '100': 'opacity(1)',
              },
              saturate: {
                '0': 'saturate(0)',
                '50': 'saturate(0.5)',
                '100': 'saturate(1)',
                '150': 'saturate(1.5)',
                '200': 'saturate(2)',
              },
              sepia: {
                '0': 'sepia(0)',
                '100': 'sepia(1)',
              },
            },
            accessibility: preset.accessibility,
            optimized: true,
            cached: false,
            metadata: {
              createdBy: preset.metadata?.createdBy || 'System',
              version: preset.metadata?.version || '1.0.0',
              lastUpdated: preset.metadata?.lastUpdated || new Date(),
              category: preset.category,
              tags: preset.tags,
              industry: preset.metadata?.industry || ['petroleum', 'energy'],
              license: 'MIT',
              compatibility: {
                minVersion: '1.0.0',
              },
            },
          };
        }

        return null;
      },

      deleteTheme: (themeId: string) => {
        const customThemes = new Map(get().customThemes);
        customThemes.delete(themeId);
        set({ customThemes });
      },

      listThemes: () => {
        const themes: UnifiedTheme[] = [];
        
        // Add custom themes
        get().customThemes.forEach(theme => {
          themes.push(theme);
        });
        
        // Add preset themes
        get().themePresets.forEach(preset => {
          const theme = get().loadTheme(preset.id);
          if (theme) {
            themes.push(theme);
          }
        });
        
        return themes;
      },

      // Validation
      validateTheme: (theme: UnifiedTheme) => {
        const themeManager = new UnifiedThemeManager(get().config);
        const result = themeManager.validateTheme(theme);
        set({ validationResults: result });
        return result;
      },

      // History
      undoThemeChange: () => {
        const history = get().themeHistory;
        if (history.length > 1) {
          const previousEntry = history[history.length - 2];
          get().applyTheme(previousEntry.theme);
        }
      },

      redoThemeChange: () => {
        // Implementation would require tracking undone changes
        console.warn('Redo functionality not yet implemented');
      },

      clearHistory: () => {
        set({ themeHistory: [] });
      },

      // Export/Import
      exportTheme: (theme: UnifiedTheme) => {
        const themeManager = new UnifiedThemeManager(get().config);
        return themeManager.exportTheme(theme);
      },

      importTheme: (themeData: string) => {
        const themeManager = new UnifiedThemeManager(get().config);
        const result = themeManager.importTheme(themeData);
        
        if (result.success && result.theme) {
          get().saveTheme(result.theme);
        }
        
        return result;
      },

      // Performance
      getPerformanceMetrics: () => {
        return get().performanceMetrics;
      },

      clearPerformanceMetrics: () => {
        set({ performanceMetrics: null });
      },

      // Cache
      clearCache: () => {
        const themeManager = new UnifiedThemeManager(get().config);
        themeManager.clearCache();
      },

      getCacheStats: () => {
        const themeManager = new UnifiedThemeManager(get().config);
        return themeManager.getCacheStats();
      },

      // Reset
      resetToDefault: () => {
        const themeManager = new UnifiedThemeManager(get().config);
        themeManager.resetToDefault();
        set({ currentTheme: null });
      },

      resetToPreset: (presetId: string) => {
        get().applyPreset(presetId);
      },

      // Utility
      getThemeById: (id: string) => {
        return get().loadTheme(id);
      },

      searchThemes: (query: string) => {
        const themes = get().listThemes();
        const lowercaseQuery = query.toLowerCase();
        
        return themes.filter(theme => 
          theme.name.toLowerCase().includes(lowercaseQuery) ||
          theme.description?.toLowerCase().includes(lowercaseQuery) ||
          theme.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
      },

      getThemesByCategory: (category: string) => {
        const themes = get().listThemes();
        return themes.filter(theme => theme.metadata.category === category);
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        customThemes: Array.from(state.customThemes.entries()),
        themeHistory: state.themeHistory,
        config: state.config,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert array back to Map
          state.customThemes = new Map(state.customThemes as any);
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useCurrentTheme = () => useThemeStore(state => state.currentTheme);
export const useThemePresets = () => useThemeStore(state => state.themePresets);
export const useCustomThemes = () => useThemeStore(state => state.customThemes);
export const useThemeHistory = () => useThemeStore(state => state.themeHistory);
export const useValidationResults = () => useThemeStore(state => state.validationResults);
export const usePerformanceMetrics = () => useThemeStore(state => state.performanceMetrics);
export const useIsApplying = () => useThemeStore(state => state.isApplying);
export const useLastApplied = () => useThemeStore(state => state.lastApplied);
export const useThemeErrors = () => useThemeStore(state => state.errors);
export const useThemeConfig = () => useThemeStore(state => state.config);

// Action hooks
export const useThemeActions = () => useThemeStore(state => ({
  applyTheme: state.applyTheme,
  applyPreset: state.applyPreset,
  applyCustomization: state.applyCustomization,
  saveTheme: state.saveTheme,
  loadTheme: state.loadTheme,
  deleteTheme: state.deleteTheme,
  validateTheme: state.validateTheme,
  undoThemeChange: state.undoThemeChange,
  redoThemeChange: state.redoThemeChange,
  clearHistory: state.clearHistory,
  exportTheme: state.exportTheme,
  importTheme: state.importTheme,
  getPerformanceMetrics: state.getPerformanceMetrics,
  clearPerformanceMetrics: state.clearPerformanceMetrics,
  clearCache: state.clearCache,
  getCacheStats: state.getCacheStats,
  resetToDefault: state.resetToDefault,
  resetToPreset: state.resetToPreset,
}));

// Utility hooks
export const useThemeUtils = () => useThemeStore(state => ({
  getThemeById: state.getThemeById,
  searchThemes: state.searchThemes,
  getThemesByCategory: state.getThemesByCategory,
  listThemes: state.listThemes,
}));
