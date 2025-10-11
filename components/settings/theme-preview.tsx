// Documentation: /docs/branding-preset-themes/theme-preview.md

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Palette,
  Type,
  Shield,
  Info,
  Settings,
  Download,
  Upload,
  Copy,
  RotateCcw
} from 'lucide-react';
import type { ValidationResults } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

interface ThemePreviewProps {
  theme: {
    colors: ColorScheme;
    typography: TypographyConfig;
  };
  validationResults?: ValidationResults | null;
  onValidationChange?: (results: ValidationResults) => void;
  className?: string;
}

export function ThemePreview({
  theme,
  validationResults,
  onValidationChange,
  className
}: ThemePreviewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isValidating, setIsValidating] = useState(false);

  // Validate theme when it changes
  useEffect(() => {
    if (onValidationChange) {
      setIsValidating(true);
      // Simulate validation delay
      setTimeout(() => {
        const mockResults: ValidationResults = {
          isCompliant: true,
          score: 95,
          contrastRatios: {
            'text-background': 4.8,
            'primary-background': 3.2,
            'secondary-background': 2.8,
          },
          warnings: [],
          recommendations: ['Excellent contrast ratios'],
          lastValidated: new Date(),
        };
        onValidationChange(mockResults);
        setIsValidating(false);
      }, 500);
    }
  }, [theme, onValidationChange]);

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Theme Preview
              </CardTitle>
              <CardDescription>
                Live preview of your customized theme
              </CardDescription>
            </div>
            {getValidationStatus()}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                {/* Color Palette */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color Palette
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(theme.colors).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1">
                          <div className="text-xs font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Typography
                  </h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Body Font: </span>
                      <span style={{ fontFamily: theme.typography.fontFamily }}>
                        {theme.typography.fontFamily}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Heading Font: </span>
                      <span style={{ fontFamily: theme.typography.headingFont }}>
                        {theme.typography.headingFont}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Live Preview</h4>
                  <div 
                    className="p-6 rounded-lg border"
                    style={{ 
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text,
                      fontFamily: theme.typography.fontFamily
                    }}
                  >
                    <h1 
                      className="text-2xl font-bold mb-4"
                      style={{ 
                        color: theme.colors.primary,
                        fontFamily: theme.typography.headingFont
                      }}
                    >
                      Sample Application
                    </h1>
                    <p className="mb-4">
                      This is a preview of how your theme will look in your application. 
                      The colors and typography are applied in real-time as you make changes.
                    </p>
                    <div className="flex gap-2 mb-4">
                      <button 
                        className="px-4 py-2 rounded text-sm font-medium"
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background
                        }}
                      >
                        Primary Button
                      </button>
                      <button 
                        className="px-4 py-2 rounded text-sm font-medium border"
                        style={{ 
                          backgroundColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                      >
                        Secondary Button
                      </button>
                    </div>
                    <div 
                      className="p-3 rounded text-sm"
                      style={{ 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.colors.success }}
                        />
                        <span>Success message</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.colors.warning }}
                        />
                        <span>Warning message</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: theme.colors.error }}
                        />
                        <span>Error message</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-4">
              <div className="space-y-4">
                {/* Buttons */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Buttons</h4>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      className="px-4 py-2 rounded text-sm font-medium"
                      style={{ 
                        backgroundColor: theme.colors.primary,
                        color: theme.colors.background
                      }}
                    >
                      Primary
                    </button>
                    <button 
                      className="px-4 py-2 rounded text-sm font-medium border"
                      style={{ 
                        backgroundColor: theme.colors.secondary,
                        color: theme.colors.text
                      }}
                    >
                      Secondary
                    </button>
                    <button 
                      className="px-4 py-2 rounded text-sm font-medium border"
                      style={{ 
                        backgroundColor: theme.colors.accent,
                        color: theme.colors.background
                      }}
                    >
                      Accent
                    </button>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Cards</h4>
                  <div 
                    className="p-4 rounded border"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text
                    }}
                  >
                    <h3 
                      className="text-lg font-semibold mb-2"
                      style={{ 
                        color: theme.colors.primary,
                        fontFamily: theme.typography.headingFont
                      }}
                    >
                      Card Title
                    </h3>
                    <p className="text-sm">
                      This is a sample card component showing how your theme colors 
                      will be applied to different UI elements.
                    </p>
                  </div>
                </div>

                {/* Form Elements */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Form Elements</h4>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Sample input field"
                      className="w-full px-3 py-2 border rounded text-sm"
                      style={{ 
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.secondary
                      }}
                    />
                    <select 
                      className="w-full px-3 py-2 border rounded text-sm"
                      style={{ 
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.secondary
                      }}
                    >
                      <option>Select an option</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <div className="space-y-4">
                {/* Header */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Header</h4>
                  <div 
                    className="p-4 rounded"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h1 
                        className="text-xl font-bold"
                        style={{ 
                          color: theme.colors.primary,
                          fontFamily: theme.typography.headingFont
                        }}
                      >
                        Application Header
                      </h1>
                      <div className="flex gap-2">
                        <button 
                          className="px-3 py-1 rounded text-sm"
                          style={{ 
                            backgroundColor: theme.colors.primary,
                            color: theme.colors.background
                          }}
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Sidebar</h4>
                  <div 
                    className="p-4 rounded"
                    style={{ 
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text
                    }}
                  >
                    <nav className="space-y-2">
                      <div 
                        className="p-2 rounded text-sm"
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background
                        }}
                      >
                        Dashboard
                      </div>
                      <div className="p-2 text-sm">Settings</div>
                      <div className="p-2 text-sm">Profile</div>
                      <div className="p-2 text-sm">Help</div>
                    </nav>
                  </div>
                </div>

                {/* Content Area */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Content Area</h4>
                  <div 
                    className="p-4 rounded"
                    style={{ 
                      backgroundColor: theme.colors.background,
                      color: theme.colors.text
                    }}
                  >
                    <h2 
                      className="text-lg font-semibold mb-3"
                      style={{ 
                        color: theme.colors.primary,
                        fontFamily: theme.typography.headingFont
                      }}
                    >
                      Main Content
                    </h2>
                    <p className="text-sm mb-3">
                      This is the main content area where your application content will be displayed. 
                      The background and text colors are applied according to your theme.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className="p-3 rounded border"
                        style={{ 
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text
                        }}
                      >
                        <h3 className="font-medium mb-1">Feature 1</h3>
                        <p className="text-xs">Description of feature</p>
                      </div>
                      <div 
                        className="p-3 rounded border"
                        style={{ 
                          backgroundColor: theme.colors.surface,
                          color: theme.colors.text
                        }}
                      >
                        <h3 className="font-medium mb-1">Feature 2</h3>
                        <p className="text-xs">Description of feature</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility" className="space-y-4">
              <div className="space-y-4">
                {/* Validation Results */}
                {validationResults && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Accessibility Validation
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold mb-1">
                          {validationResults.score}
                        </div>
                        <div className="text-xs text-muted-foreground">Accessibility Score</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded">
                        <div className="text-2xl font-bold mb-1">
                          {validationResults.isCompliant ? '✓' : '✗'}
                        </div>
                        <div className="text-xs text-muted-foreground">WCAG Compliance</div>
                      </div>
                    </div>

                    {/* Contrast Ratios */}
                    {Object.keys(validationResults.contrastRatios).length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Contrast Ratios</h5>
                        <div className="space-y-1">
                          {Object.entries(validationResults.contrastRatios).map(([pair, ratio]) => (
                            <div key={pair} className="flex justify-between text-xs">
                              <span>{pair.replace('-', ' vs ')}</span>
                              <span className="font-mono">{ratio.toFixed(1)}:1</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warnings */}
                    {validationResults.warnings.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-red-600">Issues Found</h5>
                        {validationResults.warnings.map((warning, index) => (
                          <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                            <div className="font-medium text-red-800">{warning.message}</div>
                            {warning.suggestion && (
                              <div className="text-red-700 mt-1">{warning.suggestion}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {validationResults.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-green-600">Recommendations</h5>
                        {validationResults.recommendations.map((recommendation, index) => (
                          <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                            <div className="text-green-800">{recommendation}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Validation Status */}
                {isValidating && (
                  <div className="text-center py-4">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Validating accessibility...</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for color contrast display
function ColorContrastDisplay({ 
  foreground, 
  background, 
  ratio 
}: { 
  foreground: string; 
  background: string; 
  ratio: number; 
}) {
  const getContrastStatus = () => {
    if (ratio >= 4.5) return { status: 'Good', color: 'green' };
    if (ratio >= 3.0) return { status: 'Warning', color: 'yellow' };
    return { status: 'Poor', color: 'red' };
  };

  const contrastStatus = getContrastStatus();

  return (
    <div className="flex items-center gap-3 p-3 border rounded">
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: foreground }}
        />
        <span className="text-xs">on</span>
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: background }}
        />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{ratio.toFixed(1)}:1</div>
        <div className={`text-xs ${
          contrastStatus.color === 'green' ? 'text-green-600' :
          contrastStatus.color === 'yellow' ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {contrastStatus.status}
        </div>
      </div>
    </div>
  );
}

export { ColorContrastDisplay };