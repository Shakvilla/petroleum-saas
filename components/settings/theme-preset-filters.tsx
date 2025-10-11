// Documentation: /docs/branding-preset-themes/theme-preset-filters.md

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Search, 
  Filter, 
  X, 
  RefreshCw,
  Star,
  Shield,
  Palette,
  Type,
  Eye
} from 'lucide-react';
import type { ThemeCategory } from '@/types/theme-presets';

interface ThemePresetFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ThemeCategory | 'all';
  onCategoryChange: (category: ThemeCategory | 'all') => void;
  accessibilityFilter: 'all' | 'wcag' | 'high-score' | 'custom';
  onAccessibilityFilterChange: (filter: 'all' | 'wcag' | 'high-score' | 'custom') => void;
  minScore: number;
  onMinScoreChange: (score: number) => void;
  maxScore: number;
  onMaxScoreChange: (score: number) => void;
  wcagCompliantOnly: boolean;
  onWcagCompliantOnlyChange: (compliant: boolean) => void;
  sortBy: 'name' | 'score' | 'category' | 'date';
  onSortByChange: (sort: 'name' | 'score' | 'category' | 'date') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  onReset: () => void;
  className?: string;
}

export function ThemePresetFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  accessibilityFilter,
  onAccessibilityFilterChange,
  minScore,
  onMinScoreChange,
  maxScore,
  onMaxScoreChange,
  wcagCompliantOnly,
  onWcagCompliantOnlyChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  className
}: ThemePresetFiltersProps) {
  const hasActiveFilters = 
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    accessibilityFilter !== 'all' ||
    minScore > 0 ||
    maxScore < 100 ||
    wcagCompliantOnly ||
    sortBy !== 'name';

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Search Themes
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => onSearchChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={selectedCategory} onValueChange={(value) => onCategoryChange(value as ThemeCategory | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          </div>

          {/* Accessibility Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Accessibility</Label>
            <Select value={accessibilityFilter} onValueChange={(value) => onAccessibilityFilterChange(value as 'all' | 'wcag' | 'high-score' | 'custom')}>
              <SelectTrigger>
                <SelectValue placeholder="Select accessibility level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="wcag">WCAG Compliant Only</SelectItem>
                <SelectItem value="high-score">High Score (90+)</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Score Range */}
          {accessibilityFilter === 'custom' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Score Range</Label>
                <div className="px-2">
                  <Slider
                    value={[minScore, maxScore]}
                    onValueChange={([min, max]) => {
                      onMinScoreChange(min);
                      onMaxScoreChange(max);
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{minScore}</span>
                  <span>{maxScore}</span>
                </div>
              </div>
            </div>
          )}

          {/* WCAG Compliant Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wcag-compliant"
              checked={wcagCompliantOnly}
              onCheckedChange={(checked) => onWcagCompliantOnlyChange(checked as boolean)}
            />
            <Label htmlFor="wcag-compliant" className="text-sm">
              WCAG 2.1 Compliant Only
            </Label>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <div className="grid grid-cols-2 gap-2">
              <Select value={sortBy} onValueChange={(value) => onSortByChange(value as 'name' | 'score' | 'category' | 'date')}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="date">Date Added</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as 'asc' | 'desc')}>
                <SelectTrigger>
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={accessibilityFilter === 'wcag' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onAccessibilityFilterChange(accessibilityFilter === 'wcag' ? 'all' : 'wcag')}
              >
                <Shield className="h-3 w-3 mr-1" />
                WCAG
              </Button>
              <Button
                variant={accessibilityFilter === 'high-score' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onAccessibilityFilterChange(accessibilityFilter === 'high-score' ? 'all' : 'high-score')}
              >
                <Star className="h-3 w-3 mr-1" />
                90+
              </Button>
              <Button
                variant={selectedCategory === 'corporate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(selectedCategory === 'corporate' ? 'all' : 'corporate')}
              >
                <Palette className="h-3 w-3 mr-1" />
                Corporate
              </Button>
              <Button
                variant={selectedCategory === 'modern' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(selectedCategory === 'modern' ? 'all' : 'modern')}
              >
                <Type className="h-3 w-3 mr-1" />
                Modern
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for filter chips
function FilterChip({ 
  label, 
  onRemove 
}: { 
  label: string; 
  onRemove: () => void; 
}) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      {label}
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0 hover:bg-transparent"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}

// Helper component for active filters display
function ActiveFilters({ 
  filters, 
  onRemoveFilter 
}: { 
  filters: Array<{ key: string; label: string; value: string }>; 
  onRemoveFilter: (key: string) => void; 
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={`${filter.label}: ${filter.value}`}
          onRemove={() => onRemoveFilter(filter.key)}
        />
      ))}
    </div>
  );
}

export { FilterChip, ActiveFilters };
