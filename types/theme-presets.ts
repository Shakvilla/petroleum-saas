// Documentation: /docs/branding-preset-themes/theme-presets.md

import type { ColorScheme, TypographyConfig, LogoConfig } from './settings';

/**
 * Theme preset categories for organizing presets
 */
export type ThemeCategory = 'corporate' | 'modern' | 'vibrant' | 'minimal' | 'dark';

/**
 * Validation warning severity levels
 */
export type ValidationSeverity = 'low' | 'medium' | 'high';

/**
 * Validation warning types
 */
export type ValidationWarningType = 'contrast' | 'readability' | 'accessibility';

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  type: ValidationWarningType;
  severity: ValidationSeverity;
  message: string;
  element: string;
  suggestion: string;
}

/**
 * Accessibility metadata for theme presets
 */
export interface AccessibilityMetadata {
  contrastRatio: number;
  wcagCompliant: boolean;
  recommendations: string[];
  score: number; // 0-100 accessibility score
}

/**
 * Theme preset metadata
 */
export interface ThemePresetMetadata {
  createdBy: string;
  version: string;
  lastUpdated: Date;
  industry: string[];
}

/**
 * Enhanced theme preset interface with accessibility metadata
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  icon: React.ReactNode;
  colors: ColorScheme;
  typography: TypographyConfig;
  tags: string[];
  accessibility: AccessibilityMetadata;
  metadata: ThemePresetMetadata;
}

/**
 * Theme customization interface for tracking changes
 */
export interface ThemeCustomization {
  presetId: string;
  customizations: {
    colors: Partial<ColorScheme>;
    typography: Partial<TypographyConfig>;
    logo?: LogoConfig;
    favicon?: string;
  };
  appliedAt: Date;
  lastModified: Date;
  version: string;
}

/**
 * Validation results interface
 */
export interface ValidationResults {
  isCompliant: boolean;
  contrastRatios: Record<string, number>;
  warnings: ValidationWarning[];
  recommendations: string[];
  score: number; // 0-100 accessibility score
  lastValidated: Date;
}

/**
 * Theme error types
 */
export type ThemeErrorType = 'APPLICATION_ERROR' | 'VALIDATION_ERROR' | 'IMPORT_ERROR' | 'EXPORT_ERROR';

/**
 * Theme error interface
 */
export interface ThemeError {
  type: ThemeErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  recoverable: boolean;
  suggestions: string[];
}

/**
 * Theme preset filter options
 */
export interface ThemePresetFilters {
  category?: ThemeCategory;
  accessibilityScore?: {
    min: number;
    max: number;
  };
  wcagCompliant?: boolean;
  tags?: string[];
  searchQuery?: string;
}

/**
 * Theme preset sort options
 */
export type ThemePresetSortBy = 'name' | 'category' | 'accessibilityScore' | 'lastUpdated';

/**
 * Theme preset sort order
 */
export type ThemePresetSortOrder = 'asc' | 'desc';

/**
 * Theme preset sort configuration
 */
export interface ThemePresetSort {
  by: ThemePresetSortBy;
  order: ThemePresetSortOrder;
}

/**
 * Theme preset search and filter configuration
 */
export interface ThemePresetSearchConfig {
  filters: ThemePresetFilters;
  sort: ThemePresetSort;
  limit?: number;
  offset?: number;
}

/**
 * Theme preset search results
 */
export interface ThemePresetSearchResults {
  presets: ThemePreset[];
  total: number;
  hasMore: boolean;
  filters: ThemePresetFilters;
  sort: ThemePresetSort;
}

/**
 * Theme preset application result
 */
export interface ThemePresetApplicationResult {
  success: boolean;
  preset: ThemePreset;
  customizations?: ThemeCustomization;
  error?: ThemeError;
  appliedAt: Date;
}

/**
 * Theme export configuration
 */
export interface ThemeExportConfig {
  includeCustomizations: boolean;
  includeMetadata: boolean;
  format: 'json' | 'css' | 'scss';
  compress: boolean;
}

/**
 * Theme import configuration
 */
export interface ThemeImportConfig {
  validateBeforeImport: boolean;
  backupCurrentTheme: boolean;
  mergeWithExisting: boolean;
  preserveCustomizations: boolean;
}

/**
 * Theme import result
 */
export interface ThemeImportResult {
  success: boolean;
  preset?: ThemePreset;
  customizations?: ThemeCustomization;
  error?: ThemeError;
  importedAt: Date;
  warnings: ValidationWarning[];
}

/**
 * Theme history entry
 */
export interface ThemeHistoryEntry {
  id: string;
  preset: ThemePreset;
  customizations?: ThemeCustomization;
  appliedAt: Date;
  appliedBy: string;
  description?: string;
}

/**
 * Theme history configuration
 */
export interface ThemeHistoryConfig {
  maxEntries: number;
  retentionDays: number;
  includeMetadata: boolean;
  compressOldEntries: boolean;
}

/**
 * Theme comparison configuration
 */
export interface ThemeComparisonConfig {
  currentTheme: ThemePreset;
  comparisonTheme: ThemePreset;
  showDifferences: boolean;
  highlightChanges: boolean;
  includeAccessibility: boolean;
}

/**
 * Theme comparison result
 */
export interface ThemeComparisonResult {
  differences: {
    colors: Record<string, { current: string; comparison: string }>;
    typography: Record<string, { current: string; comparison: string }>;
    accessibility: {
      current: AccessibilityMetadata;
      comparison: AccessibilityMetadata;
    };
  };
  summary: {
    totalDifferences: number;
    colorDifferences: number;
    typographyDifferences: number;
    accessibilityImprovement: number;
  };
}
