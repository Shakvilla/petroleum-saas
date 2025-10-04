/**
 * Theme Preview Component
 *
 * Provides real-time preview of tenant theming changes
 * with interactive components and color palette display.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTenantAwareDesignSystem } from '@/lib/tenant-aware-design-system';
import {
  TenantAwareCard,
  TenantAwareCardContent,
  TenantAwareCardHeader,
  TenantAwareCardTitle,
} from '@/components/ui/tenant-aware-card';
import {
  TenantAwareButton,
  TenantPrimaryButton,
  TenantSecondaryButton,
  TenantOutlineButton,
  TenantGhostButton,
} from '@/components/ui/tenant-aware-button';
import {
  TenantAwareBadge,
  TenantPrimaryBadge,
  TenantSecondaryBadge,
  TenantOutlineBadge,
  TenantSolidBadge,
} from '@/components/ui/tenant-aware-badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Palette,
  Eye,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { BrandingSettingsData } from '@/types/settings';

interface ThemePreviewProps {
  brandingData: BrandingSettingsData;
  onThemeChange?: (theme: Partial<BrandingSettingsData>) => void;
  onExport?: () => void;
  onImport?: (theme: BrandingSettingsData) => void;
  onReset?: () => void;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  success: string;
  warning: string;
  error: string;
}

export function ThemePreview({
  brandingData,
  onThemeChange,
  onExport,
  onImport,
  onReset,
}: ThemePreviewProps) {
  const { getTenantStyles, generateTenantCSS } = useTenantAwareDesignSystem();
  const [previewTheme, setPreviewTheme] =
    useState<BrandingSettingsData>(brandingData);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('primary');

  // Update preview theme when branding data changes
  useEffect(() => {
    setPreviewTheme(brandingData);
  }, [brandingData]);

  // Generate preview styles
  const previewStyles = React.useMemo(() => {
    if (!isPreviewMode) return {};

    return {
      '--tenant-primary': previewTheme.visualBranding.colorScheme.primary,
      '--tenant-secondary': previewTheme.visualBranding.colorScheme.secondary,
      '--tenant-accent': previewTheme.visualBranding.colorScheme.accent,
      '--tenant-background': previewTheme.visualBranding.colorScheme.background,
      '--tenant-surface': previewTheme.visualBranding.colorScheme.surface,
      '--tenant-text': previewTheme.visualBranding.colorScheme.text,
      '--tenant-font-family': previewTheme.visualBranding.typography.fontFamily,
    } as React.CSSProperties;
  }, [previewTheme, isPreviewMode]);

  // Handle color changes
  const handleColorChange = (colorKey: string, value: string) => {
    const updatedTheme = {
      ...previewTheme,
      visualBranding: {
        ...previewTheme.visualBranding,
        colorScheme: {
          ...previewTheme.visualBranding.colorScheme,
          [colorKey]: value,
        },
      },
    };

    setPreviewTheme(updatedTheme);
    onThemeChange?.(updatedTheme);
  };

  // Handle typography changes
  const handleTypographyChange = (fontKey: string, value: string) => {
    const updatedTheme = {
      ...previewTheme,
      visualBranding: {
        ...previewTheme.visualBranding,
        typography: {
          ...previewTheme.visualBranding.typography,
          [fontKey]: value,
        },
      },
    };

    setPreviewTheme(updatedTheme);
    onThemeChange?.(updatedTheme);
  };

  // Color palette component
  const ColorPalette = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Color Palette</Label>
        <TenantAwareButton
          variant="ghost"
          size="sm"
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <Palette className="h-4 w-4 mr-2" />
          {showColorPicker ? 'Hide' : 'Show'} Picker
        </TenantAwareButton>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(previewTheme.visualBranding.colorScheme).map(
          ([key, value]) => (
            <div key={key} className="space-y-2">
              <Label className="text-xs text-gray-600 capitalize">{key}</Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: value }}
                  onClick={() => setSelectedColor(key)}
                />
                {showColorPicker && selectedColor === key && (
                  <Input
                    type="color"
                    value={value}
                    onChange={e => handleColorChange(key, e.target.value)}
                    className="w-20 h-8 p-1"
                  />
                )}
              </div>
              <Input
                value={value}
                onChange={e => handleColorChange(key, e.target.value)}
                className="text-xs"
                placeholder="#000000"
              />
            </div>
          )
        )}
      </div>
    </div>
  );

  // Component showcase
  const ComponentShowcase = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Button Variants
        </Label>
        <div className="flex flex-wrap gap-3">
          <TenantPrimaryButton size="sm">Primary</TenantPrimaryButton>
          <TenantSecondaryButton size="sm">Secondary</TenantSecondaryButton>
          <TenantOutlineButton size="sm">Outline</TenantOutlineButton>
          <TenantGhostButton size="sm">Ghost</TenantGhostButton>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Badge Variants</Label>
        <div className="flex flex-wrap gap-2">
          <TenantPrimaryBadge>Primary</TenantPrimaryBadge>
          <TenantSecondaryBadge>Secondary</TenantSecondaryBadge>
          <TenantOutlineBadge>Outline</TenantOutlineBadge>
          <TenantSolidBadge>Solid</TenantSolidBadge>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Status Badges</Label>
        <div className="flex flex-wrap gap-2">
          <TenantAwareBadge variant="success">
            <Check className="h-3 w-3 mr-1" />
            Success
          </TenantAwareBadge>
          <TenantAwareBadge variant="warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </TenantAwareBadge>
          <TenantAwareBadge variant="error">
            <X className="h-3 w-3 mr-1" />
            Error
          </TenantAwareBadge>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Card Example</Label>
        <TenantAwareCard className="max-w-md">
          <TenantAwareCardHeader>
            <TenantAwareCardTitle>Sample Card</TenantAwareCardTitle>
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <p className="text-sm text-gray-600 mb-4">
              This is a sample card to preview your theme colors and typography.
            </p>
            <div className="flex gap-2">
              <TenantPrimaryButton size="sm">Action</TenantPrimaryButton>
              <TenantOutlineButton size="sm">Cancel</TenantOutlineButton>
            </div>
          </TenantAwareCardContent>
        </TenantAwareCard>
      </div>
    </div>
  );

  // Typography preview
  const TypographyPreview = () => (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-3 block">Typography</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-gray-600">Font Family</Label>
            <Input
              value={previewTheme.visualBranding.typography.fontFamily}
              onChange={e =>
                handleTypographyChange('fontFamily', e.target.value)
              }
              placeholder="Inter, sans-serif"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Heading Font</Label>
            <Input
              value={previewTheme.visualBranding.typography.headingFont}
              onChange={e =>
                handleTypographyChange('headingFont', e.target.value)
              }
              placeholder="Inter, sans-serif"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Text Preview</Label>
        <div className="space-y-2">
          <h1
            className="text-2xl font-bold"
            style={{
              fontFamily: previewTheme.visualBranding.typography.headingFont,
            }}
          >
            Heading 1
          </h1>
          <h2
            className="text-xl font-semibold"
            style={{
              fontFamily: previewTheme.visualBranding.typography.headingFont,
            }}
          >
            Heading 2
          </h2>
          <h3
            className="text-lg font-medium"
            style={{
              fontFamily: previewTheme.visualBranding.typography.headingFont,
            }}
          >
            Heading 3
          </h3>
          <p
            className="text-base"
            style={{
              fontFamily: previewTheme.visualBranding.typography.fontFamily,
            }}
          >
            This is a paragraph with the selected font family. It demonstrates
            how text will appear with your chosen typography settings.
          </p>
          <p
            className="text-sm text-gray-600"
            style={{
              fontFamily: previewTheme.visualBranding.typography.fontFamily,
            }}
          >
            This is smaller text for captions and secondary information.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Theme Preview</h3>
          <p className="text-sm text-gray-600">
            Preview your theme changes in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isPreviewMode} onCheckedChange={setIsPreviewMode} />
          <Label className="text-sm">Preview Mode</Label>
        </div>
      </div>

      {/* Preview Container */}
      <div className="border rounded-lg p-6 bg-white" style={previewStyles}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Palette */}
          <TenantAwareCard>
            <TenantAwareCardHeader>
              <TenantAwareCardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Colors
              </TenantAwareCardTitle>
            </TenantAwareCardHeader>
            <TenantAwareCardContent>
              <ColorPalette />
            </TenantAwareCardContent>
          </TenantAwareCard>

          {/* Typography */}
          <TenantAwareCard>
            <TenantAwareCardHeader>
              <TenantAwareCardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Typography
              </TenantAwareCardTitle>
            </TenantAwareCardHeader>
            <TenantAwareCardContent>
              <TypographyPreview />
            </TenantAwareCardContent>
          </TenantAwareCard>
        </div>

        <Separator className="my-6" />

        {/* Component Showcase */}
        <TenantAwareCard>
          <TenantAwareCardHeader>
            <TenantAwareCardTitle>Component Showcase</TenantAwareCardTitle>
          </TenantAwareCardHeader>
          <TenantAwareCardContent>
            <ComponentShowcase />
          </TenantAwareCardContent>
        </TenantAwareCard>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TenantAwareButton
            variant="outline"
            onClick={onReset}
            disabled={!isPreviewMode}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </TenantAwareButton>
        </div>

        <div className="flex items-center gap-2">
          <TenantAwareButton variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Theme
          </TenantAwareButton>
          <TenantAwareButton
            variant="outline"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = e => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = e => {
                    try {
                      const theme = JSON.parse(e.target?.result as string);
                      onImport?.(theme);
                    } catch (error) {
                      // Log error for debugging in development
                      if (process.env.NODE_ENV === 'development') {
                        console.error('Invalid theme file:', error);
                      }
                    }
                  };
                  reader.readAsText(file);
                }
              };
              input.click();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Theme
          </TenantAwareButton>
        </div>
      </div>
    </div>
  );
}
