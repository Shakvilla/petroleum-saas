// Documentation: /docs/comprehensive-theming-system/theme-application-provider.md

'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { UnifiedTheme, ThemeApplicationResult } from '@/types/unified-theme';
import { UnifiedThemeManager } from '@/lib/unified-theme-manager';
import { EnhancedCSSVariableManager } from '@/lib/enhanced-css-variables';

// Theme Application Context
interface ThemeApplicationContextValue {
  // Current state
  currentTheme: UnifiedTheme | null;
  isApplying: boolean;
  lastApplied: Date | null;
  errors: string[];
  
  // Actions
  applyTheme: (theme: UnifiedTheme) => Promise<ThemeApplicationResult>;
  applyPreset: (presetId: string) => Promise<ThemeApplicationResult>;
  applyCustomization: (customization: any) => Promise<ThemeApplicationResult>;
  
  // Theme management
  saveTheme: (theme: UnifiedTheme) => void;
  loadTheme: (themeId: string) => UnifiedTheme | null;
  deleteTheme: (themeId: string) => void;
  
  // Validation
  validateTheme: (theme: UnifiedTheme) => any;
  
  // History
  undoThemeChange: () => void;
  redoThemeChange: () => void;
  clearHistory: () => void;
  
  // Export/Import
  exportTheme: (theme: UnifiedTheme) => string;
  importTheme: (themeData: string) => any;
  
  // Performance
  getPerformanceMetrics: () => any;
  clearPerformanceMetrics: () => void;
  
  // Cache
  clearCache: () => void;
  getCacheStats: () => { size: number; hitRate: number };
  
  // Reset
  resetToDefault: () => void;
  resetToPreset: (presetId: string) => void;
}

const ThemeApplicationContext = createContext<ThemeApplicationContextValue | null>(null);

// Theme Application Provider Props
interface ThemeApplicationProviderProps {
  children: React.ReactNode;
  config?: {
    enableCaching?: boolean;
    enablePerformanceMonitoring?: boolean;
    enableRealTimeUpdates?: boolean;
    enableAccessibilityValidation?: boolean;
    cacheSize?: number;
    cacheTTL?: number;
    debounceDelay?: number;
    validationLevel?: 'basic' | 'standard' | 'strict';
  };
}

/**
 * Theme Application Provider
 * 
 * Provides theme management context to the entire application.
 * Handles real-time theme updates, validation, and performance monitoring.
 */
export function ThemeApplicationProvider({ 
  children, 
  config = {} 
}: ThemeApplicationProviderProps) {
  // Theme manager instance
  const themeManager = useMemo(() => {
    return new UnifiedThemeManager(config);
  }, [config]);

  // CSS variable manager instance
  const cssVariableManager = useMemo(() => {
    return new EnhancedCSSVariableManager();
  }, []);

  // State
  const [currentTheme, setCurrentTheme] = useState<UnifiedTheme | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [lastApplied, setLastApplied] = useState<Date | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Apply theme with real-time updates
  const applyTheme = async (theme: UnifiedTheme): Promise<ThemeApplicationResult> => {
    try {
      setIsApplying(true);
      setErrors([]);

      // Apply theme using manager
      const result = await themeManager.applyTheme(theme);

      if (result.success) {
        // Generate and inject CSS variables
        const cssVariables = cssVariableManager.generateVariables(theme);
        cssVariableManager.injectVariables(cssVariables);

        // Update state
        setCurrentTheme(theme);
        setLastApplied(result.appliedAt);
      } else {
        setErrors(result.errors);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      
      return {
        success: false,
        theme,
        appliedAt: new Date(),
        duration: 0,
        errors: [errorMessage],
        warnings: [],
      };
    } finally {
      setIsApplying(false);
    }
  };

  // Apply preset
  const applyPreset = async (presetId: string): Promise<ThemeApplicationResult> => {
    try {
      setIsApplying(true);
      setErrors([]);

      const result = await themeManager.applyPreset(presetId);

      if (result.success) {
        // Generate and inject CSS variables
        const cssVariables = cssVariableManager.generateVariables(result.theme);
        cssVariableManager.injectVariables(cssVariables);

        // Update state
        setCurrentTheme(result.theme);
        setLastApplied(result.appliedAt);
      } else {
        setErrors(result.errors);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      
      return {
        success: false,
        theme: currentTheme || {} as UnifiedTheme,
        appliedAt: new Date(),
        duration: 0,
        errors: [errorMessage],
        warnings: [],
      };
    } finally {
      setIsApplying(false);
    }
  };

  // Apply customization
  const applyCustomization = async (customization: any): Promise<ThemeApplicationResult> => {
    try {
      setIsApplying(true);
      setErrors([]);

      const result = await themeManager.applyCustomization(customization);

      if (result.success) {
        // Generate and inject CSS variables
        const cssVariables = cssVariableManager.generateVariables(result.theme);
        cssVariableManager.injectVariables(cssVariables);

        // Update state
        setCurrentTheme(result.theme);
        setLastApplied(result.appliedAt);
      } else {
        setErrors(result.errors);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors([errorMessage]);
      
      return {
        success: false,
        theme: currentTheme || {} as UnifiedTheme,
        appliedAt: new Date(),
        duration: 0,
        errors: [errorMessage],
        warnings: [],
      };
    } finally {
      setIsApplying(false);
    }
  };

  // Theme management actions
  const saveTheme = (theme: UnifiedTheme) => {
    themeManager.saveTheme(theme);
  };

  const loadTheme = (themeId: string) => {
    return themeManager.loadTheme(themeId);
  };

  const deleteTheme = (themeId: string) => {
    themeManager.deleteTheme(themeId);
  };

  // Validation
  const validateTheme = (theme: UnifiedTheme) => {
    return themeManager.validateTheme(theme);
  };

  // History management
  const undoThemeChange = () => {
    themeManager.undoThemeChange();
  };

  const redoThemeChange = () => {
    themeManager.redoThemeChange();
  };

  const clearHistory = () => {
    themeManager.clearHistory();
  };

  // Export/Import
  const exportTheme = (theme: UnifiedTheme) => {
    return themeManager.exportTheme(theme);
  };

  const importTheme = (themeData: string) => {
    return themeManager.importTheme(themeData);
  };

  // Performance
  const getPerformanceMetrics = () => {
    return themeManager.getPerformanceMetrics();
  };

  const clearPerformanceMetrics = () => {
    themeManager.clearPerformanceMetrics();
  };

  // Cache
  const clearCache = () => {
    themeManager.clearCache();
    cssVariableManager.clearInjectedVariables();
  };

  const getCacheStats = () => {
    return themeManager.getCacheStats();
  };

  // Reset
  const resetToDefault = () => {
    themeManager.resetToDefault();
  };

  const resetToPreset = (presetId: string) => {
    themeManager.resetToPreset(presetId);
  };

  // Context value
  const contextValue: ThemeApplicationContextValue = {
    // Current state
    currentTheme,
    isApplying,
    lastApplied,
    errors,
    
    // Actions
    applyTheme,
    applyPreset,
    applyCustomization,
    
    // Theme management
    saveTheme,
    loadTheme,
    deleteTheme,
    
    // Validation
    validateTheme,
    
    // History
    undoThemeChange,
    redoThemeChange,
    clearHistory,
    
    // Export/Import
    exportTheme,
    importTheme,
    
    // Performance
    getPerformanceMetrics,
    clearPerformanceMetrics,
    
    // Cache
    clearCache,
    getCacheStats,
    
    // Reset
    resetToDefault,
    resetToPreset,
  };

  // Initialize with default theme on mount
  useEffect(() => {
    if (!currentTheme) {
      // Load default theme or first available preset
      const defaultTheme = themeManager.loadTheme('default');
      if (defaultTheme) {
        applyTheme(defaultTheme);
      }
    }
  }, [currentTheme, themeManager]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cssVariableManager.clearInjectedVariables();
    };
  }, [cssVariableManager]);

  return (
    <ThemeApplicationContext.Provider value={contextValue}>
      {children}
    </ThemeApplicationContext.Provider>
  );
}

/**
 * Hook to use theme application context
 */
export function useThemeApplication(): ThemeApplicationContextValue {
  const context = useContext(ThemeApplicationContext);
  
  if (!context) {
    throw new Error('useThemeApplication must be used within a ThemeApplicationProvider');
  }
  
  return context;
}

/**
 * Hook to use unified theme manager
 */
export function useUnifiedTheme() {
  const { currentTheme, applyTheme, applyPreset, applyCustomization } = useThemeApplication();
  
  return {
    currentTheme,
    applyTheme,
    applyPreset,
    applyCustomization,
  };
}

/**
 * Hook to use theme validation
 */
export function useThemeValidation() {
  const { validateTheme, getPerformanceMetrics } = useThemeApplication();
  
  return {
    validateTheme,
    getPerformanceMetrics,
  };
}

/**
 * Hook to use theme history
 */
export function useThemeHistory() {
  const { undoThemeChange, redoThemeChange, clearHistory } = useThemeApplication();
  
  return {
    undoThemeChange,
    redoThemeChange,
    clearHistory,
  };
}

/**
 * Hook to use theme export/import
 */
export function useThemeExportImport() {
  const { exportTheme, importTheme } = useThemeApplication();
  
  return {
    exportTheme,
    importTheme,
  };
}

/**
 * Hook to use theme performance
 */
export function useThemePerformance() {
  const { getPerformanceMetrics, clearPerformanceMetrics, getCacheStats, clearCache } = useThemeApplication();
  
  return {
    getPerformanceMetrics,
    clearPerformanceMetrics,
    getCacheStats,
    clearCache,
  };
}
