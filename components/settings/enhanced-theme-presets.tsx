// Documentation: /docs/branding-preset-themes/enhanced-theme-presets.md

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Star,
  Crown,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Droplets,
  Heart,
  Flame,
  Shield,
  Palette,
  Type,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { THEME_PRESETS, getThemePresetsByCategory, searchThemePresets, getWCAGCompliantThemePresets } from '@/lib/theme-presets-data';
import type { ThemePreset, ThemeCategory } from '@/types/theme-presets';

interface EnhancedThemePresetsProps {
  selectedPresetId?: string;
  onPresetSelect: (preset: ThemePreset) => void;
  onPresetPreview?: (preset: ThemePreset) => void;
  className?: string;
}

export function EnhancedThemePresets({
  selectedPresetId,
  onPresetSelect,
  onPresetPreview,
  className
}: EnhancedThemePresetsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [accessibilityFilter, setAccessibilityFilter] = useState<'all' | 'wcag' | 'high-score'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'category'>('name');

  // Filter and search presets
  const filteredPresets = useMemo(() => {
    let presets = THEME_PRESETS;

    // Filter by category
    if (selectedCategory !== 'all') {
      presets = getThemePresetsByCategory(selectedCategory);
    }

    // Filter by accessibility
    if (accessibilityFilter === 'wcag') {
      presets = getWCAGCompliantThemePresets();
    } else if (accessibilityFilter === 'high-score') {
      presets = presets.filter(preset => preset.accessibility.score >= 90);
    }

    // Search filter
    if (searchQuery.trim()) {
      presets = searchThemePresets(searchQuery);
    }

    // Sort presets
    presets.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.accessibility.score - a.accessibility.score;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return presets;
  }, [searchQuery, selectedCategory, accessibilityFilter, sortBy]);

  // Get category icon
  const getCategoryIcon = (category: ThemeCategory) => {
    switch (category) {
      case 'corporate':
        return <Crown className="h-4 w-4" />;
      case 'modern':
        return <Sparkles className="h-4 w-4" />;
      case 'vibrant':
        return <Zap className="h-4 w-4" />;
      case 'minimal':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'accessible':
        return <Shield className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  // Get accessibility badge
  const getAccessibilityBadge = (preset: ThemePreset) => {
    const { score, wcagCompliant } = preset.accessibility;
    
    if (wcagCompliant && score >= 95) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          AAA
        </Badge>
      );
    }
    
    if (wcagCompliant && score >= 85) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          AA
        </Badge>
      );
    }
    
    if (score >= 70) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Partial
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Fail
      </Badge>
    );
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Palette className="h-6 w-6" />
          Theme Presets
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose from professionally designed themes with built-in accessibility compliance
        </p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ThemeCategory | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="vibrant">Vibrant</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="accessible">Accessible</SelectItem>
              </SelectContent>
            </Select>

            {/* Accessibility Filter */}
            <Select value={accessibilityFilter} onValueChange={(value) => setAccessibilityFilter(value as 'all' | 'wcag' | 'high-score')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Accessibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="wcag">WCAG Compliant</SelectItem>
                <SelectItem value="high-score">High Score (90+)</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'score' | 'category')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPresets.length} of {THEME_PRESETS.length} themes
        </p>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((preset) => (
          <Card 
            key={preset.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPresetId === preset.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onPresetSelect(preset)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(preset.category)}
                  <div>
                    <CardTitle className="text-base">{preset.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {preset.category.charAt(0).toUpperCase() + preset.category.slice(1)}
                    </CardDescription>
                  </div>
                </div>
                {getAccessibilityBadge(preset)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {preset.description}
              </p>

              {/* Color Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Colors</span>
                </div>
                <div className="flex gap-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.primary }}
                    title={`Primary: ${preset.colors.primary}`}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.secondary }}
                    title={`Secondary: ${preset.colors.secondary}`}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.accent }}
                    title={`Accent: ${preset.colors.accent}`}
                  />
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: preset.colors.background }}
                    title={`Background: ${preset.colors.background}`}
                  />
                </div>
              </div>

              {/* Typography Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Type className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Typography</span>
                </div>
                <div className="text-xs" style={{ fontFamily: preset.typography.fontFamily }}>
                  <div className="font-medium">Heading Font</div>
                  <div className="text-muted-foreground">Body Text</div>
                </div>
              </div>

              {/* Accessibility Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">Accessibility</span>
                </div>
                <span className={`text-sm font-bold ${getScoreColor(preset.accessibility.score)}`}>
                  {preset.accessibility.score}/100
                </span>
              </div>

              {/* Tags */}
              {preset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {preset.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {preset.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{preset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPresetPreview?.(preset);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPresetSelect(preset);
                  }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Select
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPresets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No themes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setAccessibilityFilter('all');
                setSortBy('name');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper component for theme preset card
function ThemePresetCard({ 
  preset, 
  isSelected, 
  onSelect, 
  onPreview 
}: { 
  preset: ThemePreset; 
  isSelected: boolean; 
  onSelect: (preset: ThemePreset) => void; 
  onPreview: (preset: ThemePreset) => void; 
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onSelect(preset)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">{preset.name}</CardTitle>
              <CardDescription className="text-xs">
                {preset.category.charAt(0).toUpperCase() + preset.category.slice(1)}
              </CardDescription>
            </div>
          </div>
          <Badge variant={preset.accessibility.wcagCompliant ? 'default' : 'secondary'}>
            {preset.accessibility.score}/100
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {preset.description}
        </p>

        {/* Color Preview */}
        <div className="flex gap-1">
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: preset.colors.primary }}
          />
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: preset.colors.secondary }}
          />
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: preset.colors.accent }}
          />
          <div 
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: preset.colors.background }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(preset);
            }}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(preset);
            }}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ThemePresetCard };
