// Documentation: /docs/branding-preset-themes/color-customizer.md

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Palette, 
  Eye, 
  RefreshCw, 
  Copy, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Zap,
  Sun,
  Moon,
  Droplets,
  Heart,
  Flame,
  Star,
  Crown,
  Sparkles,
  Settings
} from 'lucide-react';
import type { ColorScheme } from '@/types/settings';
import type { ValidationResults } from '@/types/theme-presets';

interface ColorCustomizerProps {
  baseColors: ColorScheme;
  customColors: Partial<ColorScheme>;
  onColorChange: (colorKey: keyof ColorScheme, value: string) => void;
  onBulkChange: (colors: Partial<ColorScheme>) => void;
  validationResults?: ValidationResults | null;
  className?: string;
}

export function ColorCustomizer({
  baseColors,
  customColors,
  onColorChange,
  onBulkChange,
  validationResults,
  className
}: ColorCustomizerProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get current color value (custom or base)
  const getCurrentColor = (colorKey: keyof ColorScheme) => {
    return customColors[colorKey] || baseColors[colorKey];
  };

  // Color definitions with icons and descriptions
  const colorDefinitions = [
    {
      key: 'primary' as keyof ColorScheme,
      label: 'Primary',
      description: 'Main brand color for buttons, links, and primary actions',
      icon: <Star className="h-4 w-4" />,
      category: 'brand',
    },
    {
      key: 'secondary' as keyof ColorScheme,
      label: 'Secondary',
      description: 'Secondary brand color for secondary actions and highlights',
      icon: <Sparkles className="h-4 w-4" />,
      category: 'brand',
    },
    {
      key: 'accent' as keyof ColorScheme,
      label: 'Accent',
      description: 'Accent color for highlights, badges, and special elements',
      icon: <Zap className="h-4 w-4" />,
      category: 'brand',
    },
    {
      key: 'background' as keyof ColorScheme,
      label: 'Background',
      description: 'Main background color for the application',
      icon: <Sun className="h-4 w-4" />,
      category: 'layout',
    },
    {
      key: 'surface' as keyof ColorScheme,
      label: 'Surface',
      description: 'Surface color for cards, panels, and elevated elements',
      icon: <Moon className="h-4 w-4" />,
      category: 'layout',
    },
    {
      key: 'text' as keyof ColorScheme,
      label: 'Text',
      description: 'Primary text color for content and headings',
      icon: <Info className="h-4 w-4" />,
      category: 'content',
    },
    {
      key: 'success' as keyof ColorScheme,
      label: 'Success',
      description: 'Color for success states, confirmations, and positive feedback',
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'status',
    },
    {
      key: 'warning' as keyof ColorScheme,
      label: 'Warning',
      description: 'Color for warning states and cautionary messages',
      icon: <AlertTriangle className="h-4 w-4" />,
      category: 'status',
    },
    {
      key: 'error' as keyof ColorScheme,
      label: 'Error',
      description: 'Color for error states, failures, and critical messages',
      icon: <XCircle className="h-4 w-4" />,
      category: 'status',
    },
  ];

  // Group colors by category
  const colorsByCategory = colorDefinitions.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, typeof colorDefinitions>);

  // Get contrast ratio for a color pair
  const getContrastRatio = (foreground: string, background: string) => {
    // This would use the actual contrast calculation from theme-validation.ts
    // For now, return a placeholder
    return 4.5;
  };

  // Get accessibility status for a color
  const getAccessibilityStatus = (colorKey: keyof ColorScheme) => {
    const color = getCurrentColor(colorKey);
    const background = getCurrentColor('background');
    const ratio = getContrastRatio(color, background);
    
    if (ratio >= 4.5) {
      return { status: 'good', ratio, color: 'green' };
    } else if (ratio >= 3.0) {
      return { status: 'warning', ratio, color: 'yellow' };
    } else {
      return { status: 'poor', ratio, color: 'red' };
    }
  };

  // Handle color input change
  const handleColorInputChange = (colorKey: keyof ColorScheme, value: string) => {
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onColorChange(colorKey, value);
    }
  };

  // Handle color picker change
  const handleColorPickerChange = (colorKey: keyof ColorScheme, value: string) => {
    onColorChange(colorKey, value);
  };

  // Reset color to base
  const resetColor = (colorKey: keyof ColorScheme) => {
    onColorChange(colorKey, baseColors[colorKey]);
  };

  // Reset all colors
  const resetAllColors = () => {
    onBulkChange({});
  };

  // Apply preset colors
  const applyPresetColors = (preset: 'dark' | 'light' | 'high-contrast') => {
    const presets = {
      dark: {
        background: '#000000',
        surface: '#111111',
        text: '#ffffff',
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      light: {
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#000000',
        primary: '#1e40af',
        secondary: '#6b7280',
        accent: '#7c3aed',
        success: '#059669',
        warning: '#d97706',
        error: '#dc2626',
      },
      'high-contrast': {
        background: '#ffffff',
        surface: '#f1f5f9',
        text: '#000000',
        primary: '#000000',
        secondary: '#374151',
        accent: '#1f2937',
        success: '#000000',
        warning: '#000000',
        error: '#000000',
      },
    };

    onBulkChange(presets[preset]);
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Customization
              </CardTitle>
              <CardDescription>
                Customize your theme colors with real-time preview
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetAllColors}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="h-4 w-4 mr-1" />
                {showAdvanced ? 'Basic' : 'Advanced'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Quick Presets</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetColors('light')}
              >
                <Sun className="h-3 w-3 mr-1" />
                Light
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetColors('dark')}
              >
                <Moon className="h-3 w-3 mr-1" />
                Dark
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetColors('high-contrast')}
              >
                <Eye className="h-3 w-3 mr-1" />
                High Contrast
              </Button>
            </div>
          </div>

          {/* Color Categories */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="brand">Brand</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
            </TabsList>

            {/* Basic Colors */}
            <TabsContent value="basic" className="space-y-4">
              {colorsByCategory.brand?.map((color) => (
                <ColorControl
                  key={color.key}
                  color={color}
                  currentValue={getCurrentColor(color.key)}
                  baseValue={baseColors[color.key]}
                  onChange={(value) => handleColorPickerChange(color.key, value)}
                  onReset={() => resetColor(color.key)}
                  accessibilityStatus={getAccessibilityStatus(color.key)}
                  showAdvanced={showAdvanced}
                />
              ))}
            </TabsContent>

            {/* Brand Colors */}
            <TabsContent value="brand" className="space-y-4">
              {colorsByCategory.brand?.map((color) => (
                <ColorControl
                  key={color.key}
                  color={color}
                  currentValue={getCurrentColor(color.key)}
                  baseValue={baseColors[color.key]}
                  onChange={(value) => handleColorPickerChange(color.key, value)}
                  onReset={() => resetColor(color.key)}
                  accessibilityStatus={getAccessibilityStatus(color.key)}
                  showAdvanced={showAdvanced}
                />
              ))}
            </TabsContent>

            {/* Layout Colors */}
            <TabsContent value="layout" className="space-y-4">
              {colorsByCategory.layout?.map((color) => (
                <ColorControl
                  key={color.key}
                  color={color}
                  currentValue={getCurrentColor(color.key)}
                  baseValue={baseColors[color.key]}
                  onChange={(value) => handleColorPickerChange(color.key, value)}
                  onReset={() => resetColor(color.key)}
                  accessibilityStatus={getAccessibilityStatus(color.key)}
                  showAdvanced={showAdvanced}
                />
              ))}
            </TabsContent>

            {/* Status Colors */}
            <TabsContent value="status" className="space-y-4">
              {colorsByCategory.status?.map((color) => (
                <ColorControl
                  key={color.key}
                  color={color}
                  currentValue={getCurrentColor(color.key)}
                  baseValue={baseColors[color.key]}
                  onChange={(value) => handleColorPickerChange(color.key, value)}
                  onReset={() => resetColor(color.key)}
                  accessibilityStatus={getAccessibilityStatus(color.key)}
                  showAdvanced={showAdvanced}
                />
              ))}
            </TabsContent>
          </Tabs>

          {/* Validation Warnings */}
          {validationResults && validationResults.warnings.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-red-600">Accessibility Issues</Label>
              {validationResults.warnings
                .filter(warning => warning.type === 'contrast' || warning.element?.includes('color'))
                .map((warning, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-red-800">{warning.message}</div>
                        {warning.suggestion && (
                          <div className="text-xs text-red-700 mt-1">{warning.suggestion}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Individual color control component
function ColorControl({
  color,
  currentValue,
  baseValue,
  onChange,
  onReset,
  accessibilityStatus,
  showAdvanced
}: {
  color: {
    key: keyof ColorScheme;
    label: string;
    description: string;
    icon: React.ReactNode;
    category: string;
  };
  currentValue: string;
  baseValue: string;
  onChange: (value: string) => void;
  onReset: () => void;
  accessibilityStatus: { status: string; ratio: number; color: string };
  showAdvanced: boolean;
}) {
  const [hexValue, setHexValue] = useState(currentValue);
  const [isModified, setIsModified] = useState(currentValue !== baseValue);

  // Update hex value when current value changes
  React.useEffect(() => {
    setHexValue(currentValue);
    setIsModified(currentValue !== baseValue);
  }, [currentValue, baseValue]);

  const handleHexChange = (value: string) => {
    setHexValue(value);
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onChange(value);
    }
  };

  const getStatusColor = () => {
    switch (accessibilityStatus.color) {
      case 'green': return 'text-green-600';
      case 'yellow': return 'text-yellow-600';
      case 'red': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {color.icon}
          <div>
            <Label className="text-sm font-medium">{color.label}</Label>
            <p className="text-xs text-muted-foreground">{color.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isModified && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor()}`}
          >
            {accessibilityStatus.ratio.toFixed(1)}:1
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Color Preview */}
        <div 
          className="w-12 h-12 rounded border-2 border-gray-200 shadow-sm"
          style={{ backgroundColor: currentValue }}
        />

        {/* Color Input */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Input
              value={hexValue}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="#000000"
              className="font-mono text-sm"
            />
            <input
              type="color"
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
            />
          </div>
          
          {showAdvanced && (
            <div className="text-xs text-muted-foreground">
              Base: {baseValue} • Current: {currentValue}
            </div>
          )}
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReset}
          disabled={!isModified}
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Helper component for color palette display
function ColorPalette({ 
  colors, 
  onColorSelect 
}: { 
  colors: ColorScheme; 
  onColorSelect: (colorKey: keyof ColorScheme, value: string) => void; 
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Object.entries(colors).map(([key, value]) => (
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-full h-16 rounded border-2 border-gray-200 hover:border-gray-300 transition-colors"
                style={{ backgroundColor: value }}
                onClick={() => onColorSelect(key as keyof ColorScheme, value)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium capitalize">{key}</p>
              <p className="text-xs font-mono">{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export { ColorControl, ColorPalette };
