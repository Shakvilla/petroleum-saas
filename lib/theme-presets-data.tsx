// Documentation: /docs/branding-preset-themes/theme-presets-data.md

import type { ThemePreset, ThemeCategory } from '@/types/theme-presets';
import { generateAccessibilityMetadata } from './theme-validation';
import {
  Crown,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Droplets,
  Star,
  Heart,
  Flame,
} from 'lucide-react';

/**
 * Corporate theme presets for professional environments
 */
const corporatePresets: ThemePreset[] = [
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional and trustworthy blue theme for corporate environments',
    category: 'corporate',
    icon: <Crown className="h-5 w-5" />,
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
    tags: ['professional', 'corporate', 'blue', 'trustworthy'],
    accessibility: {
      contrastRatio: 4.5,
      wcagCompliant: true,
      recommendations: ['Excellent contrast ratios for all text elements'],
      score: 95,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'corporate'],
    },
  },
  {
    id: 'corporate-gray',
    name: 'Corporate Gray',
    description: 'Sophisticated gray theme for professional services',
    category: 'corporate',
    icon: <Crown className="h-5 w-5" />,
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
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
    tags: ['professional', 'corporate', 'gray', 'sophisticated'],
    accessibility: {
      contrastRatio: 4.8,
      wcagCompliant: true,
      recommendations: ['High contrast ratios ensure excellent readability'],
      score: 92,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'corporate'],
    },
  },
];

/**
 * Modern theme presets for contemporary brands
 */
const modernPresets: ThemePreset[] = [
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    description: 'Contemporary purple theme with modern aesthetics',
    category: 'modern',
    icon: <Sparkles className="h-5 w-5" /> as React.ReactNode,
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#ffffff',
      surface: '#faf5ff',
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
    tags: ['modern', 'purple', 'contemporary', 'innovative'],
    accessibility: {
      contrastRatio: 4.2,
      wcagCompliant: true,
      recommendations: ['Good contrast ratios with modern color palette'],
      score: 88,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'modern'],
    },
  },
  {
    id: 'modern-green',
    name: 'Modern Green',
    description: 'Fresh green theme for eco-friendly and health-focused brands',
    category: 'modern',
    icon: <Sparkles className="h-5 w-5" />,
    colors: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399',
      background: '#ffffff',
      surface: '#f0fdf4',
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
    tags: ['modern', 'green', 'eco-friendly', 'sustainable'],
    accessibility: {
      contrastRatio: 4.6,
      wcagCompliant: true,
      recommendations: ['Excellent contrast ratios with eco-friendly colors'],
      score: 94,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'eco-friendly'],
    },
  },
];

/**
 * Vibrant theme presets for energetic brands
 */
const vibrantPresets: ThemePreset[] = [
  {
    id: 'vibrant-orange',
    name: 'Vibrant Orange',
    description: 'Energetic orange theme for creative and dynamic brands',
    category: 'vibrant',
    icon: <Flame className="h-5 w-5" />,
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#ffffff',
      surface: '#fff7ed',
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
    tags: ['vibrant', 'orange', 'energetic', 'creative'],
    accessibility: {
      contrastRatio: 4.1,
      wcagCompliant: true,
      recommendations: ['Good contrast ratios with vibrant color scheme'],
      score: 87,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'creative'],
    },
  },
  {
    id: 'vibrant-pink',
    name: 'Vibrant Pink',
    description: 'Bold pink theme for fashion and lifestyle brands',
    category: 'vibrant',
    icon: <Heart className="h-5 w-5" />,
    colors: {
      primary: '#db2777',
      secondary: '#ec4899',
      accent: '#f472b6',
      background: '#ffffff',
      surface: '#fdf2f8',
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
    tags: ['vibrant', 'pink', 'fashion', 'lifestyle'],
    accessibility: {
      contrastRatio: 4.3,
      wcagCompliant: true,
      recommendations: ['Good contrast ratios with bold color scheme'],
      score: 89,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'fashion'],
    },
  },
];

/**
 * Minimal theme presets for clean designs
 */
const minimalPresets: ThemePreset[] = [
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Clean white theme for minimalist and content-focused designs',
    category: 'minimal',
    icon: <Sun className="h-5 w-5" />,
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#6b7280',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
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
    tags: ['minimal', 'white', 'clean', 'content-focused'],
    accessibility: {
      contrastRatio: 5.2,
      wcagCompliant: true,
      recommendations: ['Excellent contrast ratios for maximum readability'],
      score: 98,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'minimal'],
    },
  },
  {
    id: 'minimal-black',
    name: 'Minimal Black',
    description: 'Elegant black theme for premium and luxury brands',
    category: 'minimal',
    icon: <Moon className="h-5 w-5" />,
    colors: {
      primary: '#ffffff',
      secondary: '#f3f4f6',
      accent: '#d1d5db',
      background: '#000000',
      surface: '#111827',
      text: '#ffffff',
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
    tags: ['minimal', 'black', 'luxury', 'premium'],
    accessibility: {
      contrastRatio: 5.8,
      wcagCompliant: true,
      recommendations: ['Outstanding contrast ratios for luxury experience'],
      score: 96,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'luxury'],
    },
  },
];

/**
 * Dark theme presets for modern applications
 */
const darkPresets: ThemePreset[] = [
  {
    id: 'dark-blue',
    name: 'Dark Blue',
    description: 'Sophisticated dark blue theme for tech and innovation',
    category: 'dark',
    icon: <Droplets className="h-5 w-5" />,
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93c5fd',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
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
    tags: ['dark', 'blue', 'tech', 'innovation'],
    accessibility: {
      contrastRatio: 4.7,
      wcagCompliant: true,
      recommendations: ['Excellent contrast ratios for dark theme'],
      score: 93,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'tech'],
    },
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    description: 'Mysterious dark purple theme for creative and artistic brands',
    category: 'dark',
    icon: <Star className="h-5 w-5" />,
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#c4b5fd',
      background: '#0f0f23',
      surface: '#1e1b4b',
      text: '#f1f5f9',
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
    tags: ['dark', 'purple', 'creative', 'artistic'],
    accessibility: {
      contrastRatio: 4.4,
      wcagCompliant: true,
      recommendations: ['Good contrast ratios for creative dark theme'],
      score: 90,
    },
    metadata: {
      createdBy: 'Petroleum SaaS Team',
      version: '1.0.0',
      lastUpdated: new Date('2024-01-15'),
      industry: ['petroleum', 'energy', 'creative'],
    },
  },
];

/**
 * All theme presets combined
 */
export const THEME_PRESETS: ThemePreset[] = [
  ...corporatePresets,
  ...modernPresets,
  ...vibrantPresets,
  ...minimalPresets,
  ...darkPresets,
];

/**
 * Get theme presets by category
 * @param category Theme category to filter by
 * @returns Array of theme presets for the category
 */
export function getThemePresetsByCategory(category: ThemeCategory): ThemePreset[] {
  return THEME_PRESETS.filter(preset => preset.category === category);
}

/**
 * Get theme preset by ID
 * @param id Theme preset ID
 * @returns Theme preset or undefined if not found
 */
export function getThemePresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find(preset => preset.id === id);
}

/**
 * Search theme presets by query
 * @param query Search query
 * @returns Array of matching theme presets
 */
export function searchThemePresets(query: string): ThemePreset[] {
  const lowercaseQuery = query.toLowerCase();
  
  return THEME_PRESETS.filter(preset => 
    preset.name.toLowerCase().includes(lowercaseQuery) ||
    preset.description.toLowerCase().includes(lowercaseQuery) ||
    preset.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get theme presets by accessibility score
 * @param minScore Minimum accessibility score
 * @param maxScore Maximum accessibility score
 * @returns Array of theme presets within the score range
 */
export function getThemePresetsByAccessibilityScore(
  minScore: number = 0,
  maxScore: number = 100
): ThemePreset[] {
  return THEME_PRESETS.filter(preset => 
    preset.accessibility.score >= minScore && preset.accessibility.score <= maxScore
  );
}

/**
 * Get WCAG compliant theme presets
 * @returns Array of WCAG compliant theme presets
 */
export function getWCAGCompliantThemePresets(): ThemePreset[] {
  return THEME_PRESETS.filter(preset => preset.accessibility.wcagCompliant);
}

/**
 * Get theme presets by industry
 * @param industry Industry to filter by
 * @returns Array of theme presets for the industry
 */
export function getThemePresetsByIndustry(industry: string): ThemePreset[] {
  return THEME_PRESETS.filter(preset => 
    preset.metadata.industry.includes(industry.toLowerCase())
  );
}

/**
 * Get all available theme categories
 * @returns Array of theme categories
 */
export function getThemeCategories(): ThemeCategory[] {
  return Array.from(new Set(THEME_PRESETS.map(preset => preset.category)));
}

/**
 * Get all available tags
 * @returns Array of unique tags
 */
export function getThemeTags(): string[] {
  const allTags = THEME_PRESETS.flatMap(preset => preset.tags);
  return Array.from(new Set(allTags));
}

/**
 * Get theme preset statistics
 * @returns Statistics about theme presets
 */
export function getThemePresetStatistics() {
  const categories = getThemeCategories();
  const tags = getThemeTags();
  const wcagCompliant = getWCAGCompliantThemePresets();
  
  return {
    total: THEME_PRESETS.length,
    categories: categories.length,
    tags: tags.length,
    wcagCompliant: wcagCompliant.length,
    averageAccessibilityScore: Math.round(
      THEME_PRESETS.reduce((sum, preset) => sum + preset.accessibility.score, 0) / THEME_PRESETS.length
    ),
    categoryBreakdown: categories.map(category => ({
      category,
      count: getThemePresetsByCategory(category).length,
    })),
  };
}
