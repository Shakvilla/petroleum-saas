// Documentation: /docs/branding-preset-themes/theme-preset-selector.md

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Palette,
  Type,
  Shield,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Star,
  Crown,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Droplets,
  Heart,
  Flame,
  Settings,
  Save,
  Undo,
  Redo
} from 'lucide-react';
import { EnhancedThemePresets } from './enhanced-theme-presets';
import { ThemePresetPreview } from './theme-preset-preview';
import { ThemePresetFilters } from './theme-preset-filters';
import { THEME_PRESETS, getThemePresetsByCategory, searchThemePresets, getWCAGCompliantThemePresets } from '@/lib/theme-presets-data';
import type { ThemePreset, ThemeCategory } from '@/types/theme-presets';

interface ThemePresetSelectorProps {
  selectedPresetId?: string;
  onPresetSelect: (preset: ThemePreset) => void;
  onPresetApply: (preset: ThemePreset) => void;
  onPresetSave?: (preset: ThemePreset) => void;
  onPresetExport?: (preset: ThemePreset) => void;
  onPresetImport?: (preset: ThemePreset) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ThemePresetSelector({
  selectedPresetId,
  onPresetSelect,
  onPresetApply,
  onPresetSave,
  onPresetExport,
  onPresetImport,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isLoading = false,
  className
}: ThemePresetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory | 'all'>('all');
  const [accessibilityFilter, setAccessibilityFilter] = useState<'all' | 'wcag' | 'high-score' | 'custom'>('all');
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [wcagCompliantOnly, setWcagCompliantOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'category' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [previewPreset, setPreviewPreset] = useState<ThemePreset | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get selected preset
  const selectedPreset = useMemo(() => {
    return THEME_PRESETS.find(preset => preset.id === selectedPresetId);
  }, [selectedPresetId]);

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
    } else if (accessibilityFilter === 'custom') {
      presets = presets.filter(preset => 
        preset.accessibility.score >= minScore && 
        preset.accessibility.score <= maxScore
      );
    }

    // WCAG compliant only filter
    if (wcagCompliantOnly) {
      presets = presets.filter(preset => preset.accessibility.wcagCompliant);
    }

    // Search filter
    if (searchQuery.trim()) {
      presets = searchThemePresets(searchQuery);
    }

    // Sort presets
    presets.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'score':
          comparison = b.accessibility.score - a.accessibility.score;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'date':
          comparison = new Date(b.metadata.lastUpdated).getTime() - new Date(a.metadata.lastUpdated).getTime();
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return presets;
  }, [searchQuery, selectedCategory, accessibilityFilter, minScore, maxScore, wcagCompliantOnly, sortBy, sortOrder]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAccessibilityFilter('all');
    setMinScore(0);
    setMaxScore(100);
    setWcagCompliantOnly(false);
    setSortBy('name');
    setSortOrder('asc');
  };

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

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Theme Preset Selector
            </h2>
            <p className="text-muted-foreground mt-1">
              Choose and apply professional themes with built-in accessibility compliance
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUndo}
              disabled={!canUndo || isLoading}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRedo}
              disabled={!canRedo || isLoading}
            >
              <Redo className="h-4 w-4" />
            </Button>

            {/* Filter Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Settings className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Preset */}
      {selectedPreset && (
        <Card className="mb-6 border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getCategoryIcon(selectedPreset.category)}
                <div>
                  <CardTitle className="text-lg">{selectedPreset.name}</CardTitle>
                  <CardDescription>
                    {selectedPreset.category.charAt(0).toUpperCase() + selectedPreset.category.slice(1)} Theme
                  </CardDescription>
                </div>
              </div>
              {getAccessibilityBadge(selectedPreset)}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedPreset.description}</p>
              
              {/* Color Preview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Color Palette</span>
                </div>
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: selectedPreset.colors.primary }}
                    title={`Primary: ${selectedPreset.colors.primary}`}
                  />
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: selectedPreset.colors.secondary }}
                    title={`Secondary: ${selectedPreset.colors.secondary}`}
                  />
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: selectedPreset.colors.accent }}
                    title={`Accent: ${selectedPreset.colors.accent}`}
                  />
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: selectedPreset.colors.background }}
                    title={`Background: ${selectedPreset.colors.background}`}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setPreviewPreset(selectedPreset)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  onClick={() => onPresetApply(selectedPreset)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Apply Theme
                    </>
                  )}
                </Button>
                {onPresetSave && (
                  <Button 
                    variant="outline" 
                    onClick={() => onPresetSave(selectedPreset)}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                )}
                {onPresetExport && (
                  <Button 
                    variant="outline" 
                    onClick={() => onPresetExport(selectedPreset)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="mb-6">
          <ThemePresetFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            accessibilityFilter={accessibilityFilter}
            onAccessibilityFilterChange={setAccessibilityFilter}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            maxScore={maxScore}
            onMaxScoreChange={setMaxScore}
            wcagCompliantOnly={wcagCompliantOnly}
            onWcagCompliantOnlyChange={setWcagCompliantOnly}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onReset={resetFilters}
          />
        </div>
      )}

      {/* Theme Presets */}
      <EnhancedThemePresets
        selectedPresetId={selectedPresetId}
        onPresetSelect={onPresetSelect}
        onPresetPreview={setPreviewPreset}
      />

      {/* Preview Dialog */}
      {previewPreset && (
        <ThemePresetPreview
          preset={previewPreset}
          isOpen={!!previewPreset}
          onClose={() => setPreviewPreset(null)}
          onApply={(preset) => {
            onPresetApply(preset);
            setPreviewPreset(null);
          }}
        />
      )}
    </div>
  );
}

// Helper component for preset quick actions
function PresetQuickActions({ 
  preset, 
  onApply, 
  onPreview, 
  onSave, 
  onExport,
  isLoading 
}: { 
  preset: ThemePreset; 
  onApply: (preset: ThemePreset) => void; 
  onPreview: (preset: ThemePreset) => void; 
  onSave?: (preset: ThemePreset) => void; 
  onExport?: (preset: ThemePreset) => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onPreview(preset)}
      >
        <Eye className="h-3 w-3 mr-1" />
        Preview
      </Button>
      <Button 
        size="sm" 
        onClick={() => onApply(preset)}
        disabled={isLoading}
      >
        {isLoading ? (
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <CheckCircle className="h-3 w-3 mr-1" />
        )}
        Apply
      </Button>
      {onSave && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSave(preset)}
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      )}
      {onExport && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onExport(preset)}
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
      )}
    </div>
  );
}

export { PresetQuickActions };
