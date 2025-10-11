// Documentation: /docs/branding-preset-themes/typography-customizer.md

'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Type, 
  RotateCcw, 
  RefreshCw, 
  Copy, 
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Eye,
  Download,
  Upload
} from 'lucide-react';
import type { TypographyConfig } from '@/types/settings';
import type { ValidationResults } from '@/types/theme-presets';

interface TypographyCustomizerProps {
  baseTypography: TypographyConfig;
  customTypography: Partial<TypographyConfig>;
  onTypographyChange: (typographyKey: keyof TypographyConfig, value: string) => void;
  onBulkChange: (typography: Partial<TypographyConfig>) => void;
  validationResults?: ValidationResults | null;
  className?: string;
}

export function TypographyCustomizer({
  baseTypography,
  customTypography,
  onTypographyChange,
  onBulkChange,
  validationResults,
  className
}: TypographyCustomizerProps) {
  const [activeTab, setActiveTab] = useState('fonts');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Get current typography value (custom or base)
  const getCurrentValue = (key: keyof TypographyConfig) => {
    if (key === 'fontSizes') {
      return customTypography[key] || baseTypography[key];
    }
    return customTypography[key] || baseTypography[key];
  };

  // Font family options
  const fontFamilyOptions = [
    { value: 'Inter, sans-serif', label: 'Inter', category: 'Sans-serif' },
    { value: 'Roboto, sans-serif', label: 'Roboto', category: 'Sans-serif' },
    { value: 'Open Sans, sans-serif', label: 'Open Sans', category: 'Sans-serif' },
    { value: 'Lato, sans-serif', label: 'Lato', category: 'Sans-serif' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat', category: 'Sans-serif' },
    { value: 'Poppins, sans-serif', label: 'Poppins', category: 'Sans-serif' },
    { value: 'Source Sans Pro, sans-serif', label: 'Source Sans Pro', category: 'Sans-serif' },
    { value: 'Nunito, sans-serif', label: 'Nunito', category: 'Sans-serif' },
    { value: 'Playfair Display, serif', label: 'Playfair Display', category: 'Serif' },
    { value: 'Merriweather, serif', label: 'Merriweather', category: 'Serif' },
    { value: 'Lora, serif', label: 'Lora', category: 'Serif' },
    { value: 'Crimson Text, serif', label: 'Crimson Text', category: 'Serif' },
    { value: 'Fira Code, monospace', label: 'Fira Code', category: 'Monospace' },
    { value: 'JetBrains Mono, monospace', label: 'JetBrains Mono', category: 'Monospace' },
    { value: 'Source Code Pro, monospace', label: 'Source Code Pro', category: 'Monospace' },
  ];

  // Font size options
  const fontSizeOptions = [
    { key: 'xs', label: 'Extra Small', description: '12px (0.75rem)' },
    { key: 'sm', label: 'Small', description: '14px (0.875rem)' },
    { key: 'base', label: 'Base', description: '16px (1rem)' },
    { key: 'lg', label: 'Large', description: '18px (1.125rem)' },
    { key: 'xl', label: 'Extra Large', description: '20px (1.25rem)' },
    { key: '2xl', label: '2X Large', description: '24px (1.5rem)' },
    { key: '3xl', label: '3X Large', description: '30px (1.875rem)' },
    { key: '4xl', label: '4X Large', description: '36px (2.25rem)' },
  ];

  // Handle font family change
  const handleFontFamilyChange = (value: string) => {
    onTypographyChange('fontFamily', value);
  };

  // Handle heading font change
  const handleHeadingFontChange = (value: string) => {
    onTypographyChange('headingFont', value);
  };

  // Handle font size change
  const handleFontSizeChange = (sizeKey: string, value: string) => {
    const currentSizes = getCurrentValue('fontSizes') as Record<string, string>;
    const newSizes = {
      ...currentSizes,
      [sizeKey]: value,
    };
    onTypographyChange('fontSizes', JSON.stringify(newSizes));
  };

  // Reset typography to base
  const resetTypography = (key: keyof TypographyConfig) => {
    onTypographyChange(key, baseTypography[key] as string);
  };

  // Reset all typography
  const resetAllTypography = () => {
    onBulkChange({});
  };

  // Apply preset typography
  const applyPresetTypography = (preset: 'modern' | 'classic' | 'minimal' | 'creative') => {
    const presets = {
      modern: {
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
      classic: {
        fontFamily: 'Times New Roman, serif',
        headingFont: 'Georgia, serif',
        fontSizes: {
          xs: '0.8rem',
          sm: '0.9rem',
          base: '1rem',
          lg: '1.1rem',
          xl: '1.3rem',
          '2xl': '1.6rem',
          '3xl': '2rem',
          '4xl': '2.5rem',
        },
      },
      minimal: {
        fontFamily: 'Helvetica, sans-serif',
        headingFont: 'Helvetica, sans-serif',
        fontSizes: {
          xs: '0.7rem',
          sm: '0.8rem',
          base: '0.9rem',
          lg: '1rem',
          xl: '1.1rem',
          '2xl': '1.3rem',
          '3xl': '1.6rem',
          '4xl': '2rem',
        },
      },
      creative: {
        fontFamily: 'Poppins, sans-serif',
        headingFont: 'Playfair Display, serif',
        fontSizes: {
          xs: '0.8rem',
          sm: '0.9rem',
          base: '1rem',
          lg: '1.2rem',
          xl: '1.4rem',
          '2xl': '1.8rem',
          '3xl': '2.2rem',
          '4xl': '2.8rem',
        },
      },
    };

    onBulkChange(presets[preset]);
  };

  // Get current font sizes
  const currentFontSizes = getCurrentValue('fontSizes') as Record<string, string>;

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography Customization
              </CardTitle>
              <CardDescription>
                Customize fonts, sizes, and typography settings
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetAllTypography}>
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
                onClick={() => applyPresetTypography('modern')}
              >
                Modern
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetTypography('classic')}
              >
                Classic
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetTypography('minimal')}
              >
                Minimal
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => applyPresetTypography('creative')}
              >
                Creative
              </Button>
            </div>
          </div>

          {/* Typography Controls */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fonts">Fonts</TabsTrigger>
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            {/* Fonts Tab */}
            <TabsContent value="fonts" className="space-y-4">
              {/* Body Font */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Body Font</Label>
                    <p className="text-xs text-muted-foreground">
                      Primary font for body text and content
                    </p>
                  </div>
                  {getCurrentValue('fontFamily') !== baseTypography.fontFamily && (
                    <Badge variant="secondary" className="text-xs">
                      Modified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Select 
                      value={getCurrentValue('fontFamily')} 
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilyOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span>{font.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {font.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetTypography('fontFamily')}
                    disabled={getCurrentValue('fontFamily') === baseTypography.fontFamily}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>

                {/* Font Preview */}
                <div 
                  className="p-3 border rounded"
                  style={{ fontFamily: getCurrentValue('fontFamily') }}
                >
                  <p className="text-sm">
                    The quick brown fox jumps over the lazy dog. This is a sample of how your body text will appear.
                  </p>
                </div>
              </div>

              {/* Heading Font */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Heading Font</Label>
                    <p className="text-xs text-muted-foreground">
                      Font for headings and titles
                    </p>
                  </div>
                  {getCurrentValue('headingFont') !== baseTypography.headingFont && (
                    <Badge variant="secondary" className="text-xs">
                      Modified
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Select 
                      value={getCurrentValue('headingFont')} 
                      onValueChange={handleHeadingFontChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select heading font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilyOptions.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            <div className="flex items-center gap-2">
                              <span>{font.label}</span>
                              <Badge variant="outline" className="text-xs">
                                {font.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetTypography('headingFont')}
                    disabled={getCurrentValue('headingFont') === baseTypography.headingFont}
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>

                {/* Heading Preview */}
                <div 
                  className="p-3 border rounded"
                  style={{ fontFamily: getCurrentValue('headingFont') }}
                >
                  <h1 className="text-2xl font-bold">Sample Heading</h1>
                  <h2 className="text-xl font-semibold">Subheading</h2>
                  <h3 className="text-lg font-medium">Section Title</h3>
                </div>
              </div>
            </TabsContent>

            {/* Sizes Tab */}
            <TabsContent value="sizes" className="space-y-4">
              {fontSizeOptions.map((size) => (
                <FontSizeControl
                  key={size.key}
                  size={size}
                  currentValue={currentFontSizes[size.key] || baseTypography.fontSizes[size.key]}
                  baseValue={baseTypography.fontSizes[size.key]}
                  onChange={(value) => handleFontSizeChange(size.key, value)}
                  onReset={() => {
                    const currentSizes = getCurrentValue('fontSizes') as Record<string, string>;
                    const newSizes = { ...currentSizes };
                    delete newSizes[size.key];
                    onTypographyChange('fontSizes', JSON.stringify(newSizes));
                  }}
                  isModified={currentFontSizes[size.key] !== baseTypography.fontSizes[size.key]}
                />
              ))}
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-4">
              <TypographyPreview
                fontFamily={getCurrentValue('fontFamily')}
                headingFont={getCurrentValue('headingFont')}
                fontSizes={currentFontSizes}
              />
            </TabsContent>
          </Tabs>

          {/* Validation Warnings */}
          {validationResults && validationResults.warnings.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-red-600">Typography Issues</Label>
              {validationResults.warnings
                .filter(warning => warning.type === 'typography' || warning.element?.includes('font'))
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

// Font size control component
function FontSizeControl({
  size,
  currentValue,
  baseValue,
  onChange,
  onReset,
  isModified
}: {
  size: { key: string; label: string; description: string };
  currentValue: string;
  baseValue: string;
  onChange: (value: string) => void;
  onReset: () => void;
  isModified: boolean;
}) {
  const [inputValue, setInputValue] = useState(currentValue);

  React.useEffect(() => {
    setInputValue(currentValue);
  }, [currentValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (/^\d+(\.\d+)?(rem|px|em)$/.test(value)) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{size.label}</Label>
          <p className="text-xs text-muted-foreground">{size.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isModified && (
            <Badge variant="secondary" className="text-xs">
              Modified
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Size Preview */}
        <div 
          className="w-16 h-16 border rounded flex items-center justify-center text-center"
          style={{ fontSize: currentValue }}
        >
          <span className="text-xs">Aa</span>
        </div>

        {/* Size Input */}
        <div className="flex-1 space-y-2">
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="1rem"
            className="font-mono text-sm"
          />
          <div className="text-xs text-muted-foreground">
            Base: {baseValue} • Current: {currentValue}
          </div>
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

// Typography preview component
function TypographyPreview({
  fontFamily,
  headingFont,
  fontSizes
}: {
  fontFamily: string;
  headingFont: string;
  fontSizes: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Heading Styles</h4>
        <div style={{ fontFamily: headingFont }}>
          <h1 style={{ fontSize: fontSizes['4xl'] || '2.25rem' }} className="font-bold">
            Heading 1 - Main Title
          </h1>
          <h2 style={{ fontSize: fontSizes['3xl'] || '1.875rem' }} className="font-semibold">
            Heading 2 - Section Title
          </h2>
          <h3 style={{ fontSize: fontSizes['2xl'] || '1.5rem' }} className="font-medium">
            Heading 3 - Subsection
          </h3>
          <h4 style={{ fontSize: fontSizes['xl'] || '1.25rem' }} className="font-medium">
            Heading 4 - Minor Heading
          </h4>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Body Text</h4>
        <div style={{ fontFamily }}>
          <p style={{ fontSize: fontSizes['base'] || '1rem' }} className="mb-2">
            This is the base body text size. It should be comfortable to read for extended periods.
          </p>
          <p style={{ fontSize: fontSizes['lg'] || '1.125rem' }} className="mb-2">
            This is large body text, useful for important content or introductory paragraphs.
          </p>
          <p style={{ fontSize: fontSizes['sm'] || '0.875rem' }} className="mb-2">
            This is small body text, suitable for captions, footnotes, or secondary information.
          </p>
          <p style={{ fontSize: fontSizes['xs'] || '0.75rem' }} className="mb-2">
            This is extra small text, typically used for labels, metadata, or fine print.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Sample Content</h4>
        <div style={{ fontFamily }}>
          <h1 style={{ fontFamily: headingFont, fontSize: fontSizes['3xl'] || '1.875rem' }} className="font-bold mb-3">
            Welcome to Our Application
          </h1>
          <p style={{ fontSize: fontSizes['base'] || '1rem' }} className="mb-4">
            This is a sample of how your typography will appear in your application. 
            The combination of fonts and sizes creates a cohesive visual hierarchy.
          </p>
          <blockquote style={{ fontSize: fontSizes['lg'] || '1.125rem' }} className="border-l-4 border-gray-300 pl-4 italic">
            "Good typography is invisible. Great typography is invisible and beautiful."
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export { FontSizeControl, TypographyPreview };
