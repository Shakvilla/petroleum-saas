// Documentation: /docs/branding-preset-themes/theme-preset-preview.md

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Palette,
  Type,
  Shield,
  Download,
  Star,
  Crown,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Droplets,
  Heart,
  Flame,
  Info,
  ExternalLink
} from 'lucide-react';
import type { ThemePreset } from '@/types/theme-presets';

interface ThemePresetPreviewProps {
  preset: ThemePreset;
  isOpen: boolean;
  onClose: () => void;
  onApply: (preset: ThemePreset) => void;
  className?: string;
}

export function ThemePresetPreview({
  preset,
  isOpen,
  onClose,
  onApply,
  className
}: ThemePresetPreviewProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corporate':
        return <Crown className="h-5 w-5" />;
      case 'modern':
        return <Sparkles className="h-5 w-5" />;
      case 'vibrant':
        return <Zap className="h-5 w-5" />;
      case 'minimal':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'accessible':
        return <Shield className="h-5 w-5" />;
      default:
        return <Palette className="h-5 w-5" />;
    }
  };

  // Get accessibility badge
  const getAccessibilityBadge = (preset: ThemePreset) => {
    const { score, wcagCompliant } = preset.accessibility;
    
    if (wcagCompliant && score >= 95) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          AAA Compliant
        </Badge>
      );
    }
    
    if (wcagCompliant && score >= 85) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          AA Compliant
        </Badge>
      );
    }
    
    if (score >= 70) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Partial Compliance
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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(preset.category)}
              <div>
                <DialogTitle className="text-xl">{preset.name}</DialogTitle>
                <DialogDescription className="text-sm">
                  {preset.category.charAt(0).toUpperCase() + preset.category.slice(1)} Theme
                </DialogDescription>
              </div>
            </div>
            {getAccessibilityBadge(preset)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{preset.description}</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Color Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Color Palette
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(preset.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border"
                            style={{ backgroundColor: value }}
                          />
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {value}
                        </code>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Typography Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Typography
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Font Family</div>
                      <div className="text-sm text-muted-foreground" style={{ fontFamily: preset.typography.fontFamily }}>
                        {preset.typography.fontFamily}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Heading Font</div>
                      <div className="text-sm text-muted-foreground" style={{ fontFamily: preset.typography.headingFont }}>
                        {preset.typography.headingFont}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Font Sizes</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(preset.typography.fontSizes).map(([size, value]) => (
                          <div key={size} className="flex justify-between">
                            <span className="capitalize">{size}:</span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ 
                      backgroundColor: preset.colors.background,
                      color: preset.colors.text,
                      fontFamily: preset.typography.fontFamily
                    }}
                  >
                    <h1 
                      className="text-2xl font-bold mb-4"
                      style={{ 
                        color: preset.colors.primary,
                        fontFamily: preset.typography.headingFont
                      }}
                    >
                      Sample Heading
                    </h1>
                    <p className="mb-4">
                      This is a sample paragraph to demonstrate how the theme will look in your application. 
                      The text uses the body font and shows the contrast between text and background colors.
                    </p>
                    <div className="flex gap-2 mb-4">
                      <button 
                        className="px-4 py-2 rounded text-sm font-medium"
                        style={{ 
                          backgroundColor: preset.colors.primary,
                          color: preset.colors.background
                        }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-4 py-2 rounded text-sm font-medium border"
                        style={{ 
                          backgroundColor: preset.colors.secondary,
                          color: preset.colors.text
                        }}
                      >
                        Secondary Button
                      </button>
                    </div>
                    <div 
                      className="p-3 rounded text-sm"
                      style={{ 
                        backgroundColor: preset.colors.surface,
                        color: preset.colors.text
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: preset.colors.success }}
                        />
                        <span>Success message</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: preset.colors.warning }}
                        />
                        <span>Warning message</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: preset.colors.error }}
                        />
                        <span>Error message</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(preset.colors).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {value}
                          </code>
                        </div>
                        <div 
                          className="w-full h-16 rounded border"
                          style={{ backgroundColor: value }}
                        />
                        <div className="text-xs text-muted-foreground">
                          Used for {key === 'primary' ? 'main actions and links' :
                                   key === 'secondary' ? 'secondary actions' :
                                   key === 'accent' ? 'highlights and accents' :
                                   key === 'background' ? 'main background' :
                                   key === 'surface' ? 'cards and surfaces' :
                                   key === 'text' ? 'main text content' :
                                   key === 'success' ? 'success states' :
                                   key === 'warning' ? 'warning states' :
                                   key === 'error' ? 'error states' : 'various elements'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Font Families</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Body Font</div>
                      <div 
                        className="p-3 border rounded"
                        style={{ fontFamily: preset.typography.fontFamily }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {preset.typography.fontFamily}
                      </code>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Heading Font</div>
                      <div 
                        className="p-3 border rounded"
                        style={{ fontFamily: preset.typography.headingFont }}
                      >
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded block">
                        {preset.typography.headingFont}
                      </code>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Font Sizes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(preset.typography.fontSizes).map(([size, value]) => (
                      <div key={size} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{size}</span>
                        <div 
                          className="text-right"
                          style={{ fontSize: value }}
                        >
                          Sample Text
                        </div>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {value}
                        </code>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Accessibility Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(preset.accessibility.score)}`}>
                        {preset.accessibility.score}
                      </div>
                      <div className="text-sm text-muted-foreground">out of 100</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>WCAG Compliance</span>
                        <span className={preset.accessibility.wcagCompliant ? 'text-green-600' : 'text-red-600'}>
                          {preset.accessibility.wcagCompliant ? 'Compliant' : 'Not Compliant'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Contrast Ratio</span>
                        <span>{preset.accessibility.contrastRatio.toFixed(1)}:1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {preset.accessibility.recommendations.length > 0 ? (
                      <div className="space-y-2">
                        {preset.accessibility.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No recommendations needed
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Tags */}
          {preset.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {preset.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onApply(preset)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Theme
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for quick preview
function QuickPreview({ 
  preset, 
  onPreview 
}: { 
  preset: ThemePreset; 
  onPreview: (preset: ThemePreset) => void; 
}) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onPreview(preset)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{preset.name}</h4>
            <Badge variant={preset.accessibility.wcagCompliant ? 'default' : 'secondary'}>
              {preset.accessibility.score}/100
            </Badge>
          </div>
          
          <div className="flex gap-1">
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: preset.colors.primary }}
            />
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: preset.colors.secondary }}
            />
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: preset.colors.accent }}
            />
            <div 
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: preset.colors.background }}
            />
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { QuickPreview };
