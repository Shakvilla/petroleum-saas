// Documentation: /docs/comprehensive-theming-system/unified-theme-provider.md

'use client';

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useThemeApplication } from '@/components/theme-application-provider';
import { useThemeStore } from '@/stores/theme-store';
import { realTimeThemeApplication } from '@/lib/real-time-theme-application';
import type { UnifiedTheme } from '@/types/unified-theme';

// Unified Theme Context
interface UnifiedThemeContextValue {
  // Current theme state
  currentTheme: UnifiedTheme | null;
  isApplying: boolean;
  lastApplied: Date | null;
  errors: string[];
  
  // Theme management
  applyTheme: (theme: UnifiedTheme) => Promise<void>;
  applyPreset: (presetId: string) => Promise<void>;
  applyCustomization: (customization: any) => Promise<void>;
  
  // Theme utilities
  getThemeById: (id: string) => UnifiedTheme | null;
  searchThemes: (query: string) => UnifiedTheme[];
  getThemesByCategory: (category: string) => UnifiedTheme[];
  
  // Validation
  validateTheme: (theme: UnifiedTheme) => any;
  
  // History
  undoThemeChange: () => void;
  redoThemeChange: () => void;
  
  // Export/Import
  exportTheme: (theme: UnifiedTheme) => string;
  importTheme: (themeData: string) => any;
}

const UnifiedThemeContext = createContext<UnifiedThemeContextValue | null>(null);

// Unified Theme Provider Props
interface UnifiedThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Unified Theme Provider
 * 
 * Provides unified theme management that integrates:
 * - Tenant-aware theming
 * - Theme presets and customizations
 * - Real-time theme updates
 * - Performance monitoring
 * - Accessibility validation
 */
export function UnifiedThemeProvider({ children }: UnifiedThemeProviderProps) {
  const { tenant } = useTenant();
  const themeApplication = useThemeApplication();
  
  // Use specific selectors to avoid infinite rerenders
  const currentTheme = useThemeStore(state => state.currentTheme);
  const isApplying = useThemeStore(state => state.isApplying);
  const lastApplied = useThemeStore(state => state.lastApplied);
  const errors = useThemeStore(state => state.errors);
  const setThemePresets = useThemeStore(state => state.setThemePresets);
  const applyTheme = useThemeStore(state => state.applyTheme);
  const applyPreset = useThemeStore(state => state.applyPreset);
  const applyCustomization = useThemeStore(state => state.applyCustomization);
  const getThemeById = useThemeStore(state => state.getThemeById);
  const searchThemes = useThemeStore(state => state.searchThemes);
  const getThemesByCategory = useThemeStore(state => state.getThemesByCategory);
  const validateTheme = useThemeStore(state => state.validateTheme);
  const undoThemeChange = useThemeStore(state => state.undoThemeChange);
  const redoThemeChange = useThemeStore(state => state.redoThemeChange);
  const exportTheme = useThemeStore(state => state.exportTheme);
  const importTheme = useThemeStore(state => state.importTheme);

  // Initialize theme presets on mount
  useEffect(() => {
    // Load theme presets from the existing system
    const loadThemePresets = async () => {
      try {
        // Import theme presets data
        const { THEME_PRESETS } = await import('@/lib/theme-presets-data');
        
        // Convert to Map and set in store
        const presetsMap = new Map();
        THEME_PRESETS.forEach(preset => {
          presetsMap.set(preset.id, preset);
        });
        
        setThemePresets(presetsMap);
      } catch (error) {
        console.error('Failed to load theme presets:', error);
      }
    };

    loadThemePresets();
  }, [setThemePresets]);

  // Apply tenant theme when tenant changes
  useEffect(() => {
    const applyTenantTheme = async () => {
      if (tenant) {
        try {
          // Import tenant theme integration
          const { getTenantThemeIntegration } = await import('@/lib/tenant-theme-integration');
          const tenantThemeIntegration = await getTenantThemeIntegration();
          
          // Get the unified theme and apply it with real-time updates
          const unifiedTheme = tenantThemeIntegration.getCurrentUnifiedTheme();
          if (unifiedTheme) {
            // Use real-time theme application
            await realTimeThemeApplication.applyThemeRealTime(unifiedTheme);
            
            // Also apply through theme application provider for consistency
            await themeApplication.applyTheme(unifiedTheme);
          }
        } catch (error) {
          console.error('Error applying tenant theme:', error);
        }
      }
    };

    applyTenantTheme();
  }, [tenant, themeApplication.applyTheme]);

  // Context value
  const contextValue: UnifiedThemeContextValue = useMemo(() => ({
    // Current theme state
    currentTheme,
    isApplying,
    lastApplied,
    errors,
    
    // Theme management
    applyTheme,
    applyPreset,
    applyCustomization,
    
    // Theme utilities
    getThemeById,
    searchThemes,
    getThemesByCategory,
    
    // Validation
    validateTheme,
    
    // History
    undoThemeChange,
    redoThemeChange,
    
    // Export/Import
    exportTheme,
    importTheme,
  }), [
    currentTheme,
    isApplying,
    lastApplied,
    errors,
    applyTheme,
    applyPreset,
    applyCustomization,
    getThemeById,
    searchThemes,
    getThemesByCategory,
    validateTheme,
    undoThemeChange,
    redoThemeChange,
    exportTheme,
    importTheme,
  ]);

  return (
    <UnifiedThemeContext.Provider value={contextValue}>
      {children}
    </UnifiedThemeContext.Provider>
  );
}

/**
 * Hook to use unified theme context
 */
export function useUnifiedThemeContext(): UnifiedThemeContextValue {
  const context = useContext(UnifiedThemeContext);
  
  if (!context) {
    throw new Error('useUnifiedThemeContext must be used within a UnifiedThemeProvider');
  }
  
  return context;
}

/**
 * Hook to use current theme
 */
export function useCurrentTheme() {
  const { currentTheme } = useUnifiedThemeContext();
  return currentTheme;
}

/**
 * Hook to use theme management
 */
export function useThemeManagement() {
  const { applyTheme, applyPreset, applyCustomization } = useUnifiedThemeContext();
  return { applyTheme, applyPreset, applyCustomization };
}

/**
 * Hook to use theme utilities
 */
export function useThemeUtils() {
  const { getThemeById, searchThemes, getThemesByCategory } = useUnifiedThemeContext();
  return { getThemeById, searchThemes, getThemesByCategory };
}

/**
 * Hook to use theme validation
 */
export function useThemeValidation() {
  const { validateTheme } = useUnifiedThemeContext();
  return { validateTheme };
}

/**
 * Hook to use theme history
 */
export function useThemeHistory() {
  const { undoThemeChange, redoThemeChange } = useUnifiedThemeContext();
  return { undoThemeChange, redoThemeChange };
}

/**
 * Hook to use theme export/import
 */
export function useThemeExportImport() {
  const { exportTheme, importTheme } = useUnifiedThemeContext();
  return { exportTheme, importTheme };
}

/**
 * Hook to use theme state
 */
export function useThemeState() {
  const { currentTheme, isApplying, lastApplied, errors } = useUnifiedThemeContext();
  return { currentTheme, isApplying, lastApplied, errors };
}

/**
 * Higher-order component for theme-aware components
 */
export function withUnifiedTheming<P extends object>(
  Component: React.ComponentType<P>
) {
  return React.forwardRef<HTMLDivElement, P>((props, ref) => {
    const { currentTheme } = useUnifiedThemeContext();
    
    // Generate theme styles
    const themeStyles = useMemo(() => {
      if (!currentTheme) return {};
      
      return {
        '--color-primary': currentTheme.colors.primary,
        '--color-secondary': currentTheme.colors.secondary,
        '--color-accent': currentTheme.colors.accent,
        '--color-background': currentTheme.colors.background,
        '--color-surface': currentTheme.colors.surface,
        '--color-text': currentTheme.colors.text,
        '--color-text-secondary': currentTheme.colors.textSecondary,
        '--color-border': currentTheme.colors.border,
        '--color-error': currentTheme.colors.error,
        '--color-warning': currentTheme.colors.warning,
        '--color-success': currentTheme.colors.success,
        '--color-info': currentTheme.colors.info,
        '--font-family': currentTheme.typography.fontFamily,
        '--font-heading': currentTheme.typography.headingFont,
      } as React.CSSProperties;
    }, [currentTheme]);
    
    return (
      <div style={themeStyles} ref={ref} className="unified-themed">
        <Component {...props} />
      </div>
    );
  });
}

/**
 * Hook to get theme-aware styles
 */
export function useThemeStyles() {
  const { currentTheme } = useUnifiedThemeContext();
  
  return useMemo(() => {
    if (!currentTheme) return {};
    
    return {
      colors: currentTheme.colors,
      typography: currentTheme.typography,
      spacing: currentTheme.spacing,
      borderRadius: currentTheme.borderRadius,
      shadows: currentTheme.shadows,
      animations: currentTheme.animations,
      transitions: currentTheme.transitions,
      effects: currentTheme.effects,
    };
  }, [currentTheme]);
}

/**
 * Hook to get theme-aware CSS variables
 */
export function useThemeCSSVariables() {
  const { currentTheme } = useUnifiedThemeContext();
  
  return useMemo(() => {
    if (!currentTheme) return {};
    
    return {
      '--color-primary': currentTheme.colors.primary,
      '--color-secondary': currentTheme.colors.secondary,
      '--color-accent': currentTheme.colors.accent,
      '--color-background': currentTheme.colors.background,
      '--color-surface': currentTheme.colors.surface,
      '--color-text': currentTheme.colors.text,
      '--color-text-secondary': currentTheme.colors.textSecondary,
      '--color-border': currentTheme.colors.border,
      '--color-error': currentTheme.colors.error,
      '--color-warning': currentTheme.colors.warning,
      '--color-success': currentTheme.colors.success,
      '--color-info': currentTheme.colors.info,
      '--font-family': currentTheme.typography.fontFamily,
      '--font-heading': currentTheme.typography.headingFont,
    } as React.CSSProperties;
  }, [currentTheme]);
}
