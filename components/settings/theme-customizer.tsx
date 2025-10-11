// Documentation: /docs/branding-preset-themes/theme-customizer.md

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Palette, 
  Type, 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Settings,
  Download,
  Upload,
  Copy,
  RotateCcw
} from 'lucide-react';
import { ColorCustomizer } from './color-customizer';
import { TypographyCustomizer } from './typography-customizer';
import { ThemePreview } from './theme-preview';
import type { ValidationResults } from '@/types/theme-presets';
import type { ThemePreset, ThemeCustomization } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

interface ThemeCustomizerProps {
  basePreset: ThemePreset;
  customizations?: ThemeCustomization;
  onCustomizationChange: (customization: ThemeCustomization) => void;
  onSave: () => void;
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function ThemeCustomizer({
  basePreset,
  customizations,
  onCustomizationChange,
  onSave,
  onReset,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  isLoading = false,
  className
}: ThemeCustomizerProps) {
  const [activeTab, setActiveTab] = useState('colors');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);

  // Create current theme state from base preset and customizations
  const currentTheme = React.useMemo(() => {
    if (!customizations) {
      return {
        colors: basePreset.colors,
        typography: basePreset.typography,
      };
    }

    return {
      colors: {
        ...basePreset.colors,
        ...customizations.customizations.colors,
      },
      typography: {
        ...basePreset.typography,
        ...customizations.customizations.typography,
      },
    };
  }, [basePreset, customizations]);

  // Handle color changes
  const handleColorChange = useCallback((colorKey: keyof ColorScheme, value: string) => {
    const newCustomization: ThemeCustomization = {
      presetId: basePreset.id,
      customizations: {
        colors: {
          [colorKey]: value,
        },
        typography: {},
      },
      appliedAt: new Date(),
      lastModified: new Date(),
      version: '1.0.0',
    };

    // Merge with existing customizations
    if (customizations) {
      newCustomization.customizations.colors = {
        ...customizations.customizations.colors,
        [colorKey]: value,
      };
      newCustomization.customizations.typography = customizations.customizations.typography;
    }

    onCustomizationChange(newCustomization);
    setHasUnsavedChanges(true);
  }, [basePreset.id, customizations, onCustomizationChange]);

  // Handle typography changes
  const handleTypographyChange = useCallback((typographyKey: keyof TypographyConfig, value: string) => {
    const newCustomization: ThemeCustomization = {
      presetId: basePreset.id,
      customizations: {
        colors: {},
        typography: {
          [typographyKey]: value,
        },
      },
      appliedAt: new Date(),
      lastModified: new Date(),
      version: '1.0.0',
    };

    // Merge with existing customizations
    if (customizations) {
      newCustomization.customizations.colors = customizations.customizations.colors;
      newCustomization.customizations.typography = {
        ...customizations.customizations.typography,
        [typographyKey]: value,
      };
    }

    onCustomizationChange(newCustomization);
    setHasUnsavedChanges(true);
  }, [basePreset.id, customizations, onCustomizationChange]);

  // Handle bulk changes
  const handleBulkChange = useCallback((changes: Partial<ThemeCustomization['customizations']>) => {
    const newCustomization: ThemeCustomization = {
      presetId: basePreset.id,
      customizations: {
        colors: {
          ...(customizations?.customizations.colors || {}),
          ...(changes.colors || {}),
        },
        typography: {
          ...(customizations?.customizations.typography || {}),
          ...(changes.typography || {}),
        },
      },
      appliedAt: new Date(),
      lastModified: new Date(),
      version: '1.0.0',
    };

    onCustomizationChange(newCustomization);
    setHasUnsavedChanges(true);
  }, [basePreset.id, customizations, onCustomizationChange]);

  // Reset to base preset
  const handleReset = () => {
    onReset();
    setHasUnsavedChanges(false);
    setValidationResults(null);
  };

  // Save customizations
  const handleSave = () => {
    onSave();
    setHasUnsavedChanges(false);
  };

  // Get validation status
  const getValidationStatus = () => {
    if (!validationResults) return null;
    
    if (validationResults.isCompliant) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Compliant
        </Badge>
      );
    }
    
    if (validationResults.score >= 70) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Needs Improvement
        </Badge>
      );
    }
    
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Not Compliant
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
              <Settings className="h-6 w-6" />
              Theme Customizer
            </h2>
            <p className="text-muted-foreground mt-1">
              Customize "{basePreset.name}" theme with real-time preview
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Validation Status */}
            {getValidationStatus()}
            
            {/* Undo/Redo */}
            {onUndo && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onUndo}
                disabled={!canUndo || isLoading}
              >
                <Undo className="h-4 w-4" />
              </Button>
            )}
            {onRedo && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRedo}
                disabled={!canRedo || isLoading}
              >
                <Redo className="h-4 w-4" />
              </Button>
            )}

            {/* Reset */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>

            {/* Save */}
            <Button 
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Controls */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <ColorCustomizer
                baseColors={basePreset.colors}
                customColors={customizations?.customizations.colors || {}}
                onColorChange={handleColorChange}
                onBulkChange={(colors) => handleBulkChange({ colors })}
                validationResults={validationResults}
              />
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-4">
              <TypographyCustomizer
                baseTypography={basePreset.typography}
                customTypography={customizations?.customizations.typography || {}}
                onTypographyChange={handleTypographyChange}
                onBulkChange={(typography) => handleBulkChange({ typography })}
                validationResults={validationResults}
              />
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-3 w-3 mr-1" />
                  Copy Colors
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Export Theme
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-3 w-3 mr-1" />
                  Import Theme
                </Button>
                <Button variant="outline" size="sm">
                  <Info className="h-3 w-3 mr-1" />
                  Help
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <ThemePreview
            theme={currentTheme}
            validationResults={validationResults}
            onValidationChange={setValidationResults}
          />

          {/* Customization Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Theme:</span>
                  <span className="font-medium">{basePreset.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Customizations:</span>
                  <span className="font-medium">
                    {customizations ? 'Modified' : 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Last Modified:</span>
                  <span className="font-medium">
                    {customizations?.lastModified.toLocaleString() || 'Never'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    hasUnsavedChanges ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {hasUnsavedChanges ? 'Unsaved Changes' : 'Saved'}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Validation Summary */}
              {validationResults && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accessibility Score:</span>
                    <span className="font-medium">{validationResults.score}/100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>WCAG Compliance:</span>
                    <span className={`font-medium ${
                      validationResults.isCompliant ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {validationResults.isCompliant ? 'Compliant' : 'Not Compliant'}
                    </span>
                  </div>
                  {validationResults.warnings.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Issues:</span>
                      <span className="font-medium text-red-600">
                        {validationResults.warnings.length}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for customization status
function CustomizationStatus({ 
  hasChanges, 
  lastModified 
}: { 
  hasChanges: boolean; 
  lastModified?: Date; 
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        hasChanges ? 'bg-yellow-500' : 'bg-green-500'
      }`} />
      <span className="text-muted-foreground">
        {hasChanges ? 'Unsaved changes' : 'All changes saved'}
      </span>
      {lastModified && (
        <span className="text-muted-foreground">
          • Last modified: {lastModified.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// Helper component for quick customization buttons
function QuickCustomizationButtons({ 
  onPresetApply, 
  onRandomize, 
  onDarkMode, 
  onLightMode 
}: { 
  onPresetApply: () => void; 
  onRandomize: () => void; 
  onDarkMode: () => void; 
  onLightMode: () => void; 
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onPresetApply}>
        <RefreshCw className="h-3 w-3 mr-1" />
        Apply Preset
      </Button>
      <Button variant="outline" size="sm" onClick={onRandomize}>
        <Palette className="h-3 w-3 mr-1" />
        Randomize
      </Button>
      <Button variant="outline" size="sm" onClick={onDarkMode}>
        <Eye className="h-3 w-3 mr-1" />
        Dark Mode
      </Button>
      <Button variant="outline" size="sm" onClick={onLightMode}>
        <Eye className="h-3 w-3 mr-1" />
        Light Mode
      </Button>
    </div>
  );
}

export { CustomizationStatus, QuickCustomizationButtons };
