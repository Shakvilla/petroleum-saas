/**
 * Theme Presets Component
 *
 * Provides pre-built theme templates and presets
 * for quick theme customization.
 */

'use client';

import React, { useState } from 'react';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import { TenantAwareButton } from '@/components/ui/tenant-aware-button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Palette,
  Sparkles,
  Zap,
  Crown,
  Heart,
  Star,
  Moon,
  Sun,
  Droplets,
  Flame,
} from 'lucide-react';
import type { BrandingSettingsData } from '@/types/settings';

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'corporate' | 'modern' | 'vibrant' | 'minimal' | 'dark';
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
  };
  tags: string[];
}

interface ThemePresetsProps {
  onPresetSelect: (preset: ThemePreset) => void;
  currentTheme?: BrandingSettingsData;
}

const themePresets: ThemePreset[] = [
  // Corporate Themes
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description:
      'Professional and trustworthy blue theme for corporate environments',
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
    },
    tags: ['professional', 'corporate', 'blue'],
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
    },
    tags: ['professional', 'corporate', 'gray'],
  },

  // Modern Themes
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    description: 'Contemporary purple theme with modern aesthetics',
    category: 'modern',
    icon: <Sparkles className="h-5 w-5" />,
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
    },
    tags: ['modern', 'purple', 'contemporary'],
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
    },
    tags: ['modern', 'green', 'eco-friendly'],
  },

  // Vibrant Themes
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
    },
    tags: ['vibrant', 'orange', 'energetic'],
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
    },
    tags: ['vibrant', 'pink', 'fashion'],
  },

  // Minimal Themes
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
    },
    tags: ['minimal', 'white', 'clean'],
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
    },
    tags: ['minimal', 'black', 'luxury'],
  },

  // Dark Themes
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
    },
    tags: ['dark', 'blue', 'tech'],
  },
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    description:
      'Mysterious dark purple theme for creative and artistic brands',
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
    },
    tags: ['dark', 'purple', 'creative'],
  },
];

const categoryIcons = {
  corporate: <Crown className="h-4 w-4" />,
  modern: <Sparkles className="h-4 w-4" />,
  vibrant: <Zap className="h-4 w-4" />,
  minimal: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
};

const categoryColors = {
  corporate: 'bg-blue-50 text-blue-700 border-blue-200',
  modern: 'bg-purple-50 text-purple-700 border-purple-200',
  vibrant: 'bg-orange-50 text-orange-700 border-orange-200',
  minimal: 'bg-gray-50 text-gray-700 border-gray-200',
  dark: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function ThemePresets({
  onPresetSelect,
  currentTheme,
}: ThemePresetsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter presets by category and search
  const filteredPresets = themePresets.filter(preset => {
    const matchesCategory =
      selectedCategory === 'all' || preset.category === selectedCategory;
    const matchesSearch =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = [
    'all',
    ...Array.from(new Set(themePresets.map(p => p.category))),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Theme Presets</h3>
        <p className="text-sm text-gray-600">
          Choose from pre-built themes or create your own
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? (
                <span className="flex items-center gap-1">
                  <Palette className="h-4 w-4" />
                  All
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map(preset => (
          <TenantAwareCard
            key={preset.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onPresetSelect(preset)}
          >
            <TenantAwareCardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {preset.icon}
                  </div>
                  <div>
                    <TenantAwareCardTitle className="text-base">
                      {preset.name}
                    </TenantAwareCardTitle>
                    <Badge
                      variant="outline"
                      className={`text-xs ${categoryColors[preset.category]}`}
                    >
                      {preset.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </TenantAwareCardHeader>

            <TenantAwareCardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4">{preset.description}</p>

              {/* Color Preview */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Colors
                </Label>
                <div className="flex gap-1">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: preset.colors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: preset.colors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: preset.colors.background }}
                    title="Background"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {preset.tags.slice(0, 3).map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {preset.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{preset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </TenantAwareCardContent>
          </TenantAwareCard>
        ))}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-8">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No themes found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or category filter
          </p>
        </div>
      )}
    </div>
  );
}
