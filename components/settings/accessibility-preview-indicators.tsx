// Documentation: /docs/branding-preset-themes/accessibility-preview-indicators.md

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Copy,
  RotateCcw,
  Accessibility,
  Contrast,
  Type,
  MousePointer,
  Keyboard,
  Volume2,
  VolumeX
} from 'lucide-react';
import type { ValidationResults } from '@/types/theme-presets';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

interface AccessibilityPreviewIndicatorsProps {
  theme: {
    colors: ColorScheme;
    typography: TypographyConfig;
  };
  validationResults?: ValidationResults | null;
  className?: string;
}

type AccessibilityMode = 'normal' | 'colorblind' | 'high-contrast' | 'reduced-motion';
type ScreenReaderMode = 'off' | 'on';

export function AccessibilityPreviewIndicators({
  theme,
  validationResults,
  className
}: AccessibilityPreviewIndicatorsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>('normal');
  const [screenReaderMode, setScreenReaderMode] = useState<ScreenReaderMode>('off');
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Get validation status
  const getValidationStatus = () => {
    if (!validationResults) return null;
    
    if (validationResults.isCompliant) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          WCAG Compliant
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

  // Apply accessibility transformations
  const getAccessibilityTheme = () => {
    if (accessibilityMode === 'high-contrast') {
      return {
        colors: {
          ...theme.colors,
          primary: '#000000',
          secondary: '#000000',
          text: '#000000',
          background: '#ffffff',
          surface: '#ffffff',
          success: '#000000',
          warning: '#000000',
          error: '#000000',
        },
        typography: theme.typography,
      };
    }
    
    if (accessibilityMode === 'colorblind') {
      // Simulate colorblindness by reducing saturation
      return {
        colors: {
          ...theme.colors,
          primary: '#666666',
          secondary: '#888888',
          accent: '#777777',
          success: '#666666',
          warning: '#888888',
          error: '#666666',
        },
        typography: theme.typography,
      };
    }
    
    return theme;
  };

  const accessibilityTheme = getAccessibilityTheme();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility Preview Indicators
              </CardTitle>
              <CardDescription>
                Test and visualize accessibility features of your theme
              </CardDescription>
            </div>
            {getValidationStatus()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Accessibility Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Accessibility Mode */}
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={accessibilityMode}
                    onChange={(e) => setAccessibilityMode(e.target.value as AccessibilityMode)}
                    className="px-3 py-1 border rounded text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="colorblind">Colorblind</option>
                    <option value="high-contrast">High Contrast</option>
                    <option value="reduced-motion">Reduced Motion</option>
                  </select>
                </div>

                {/* Screen Reader Mode */}
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setScreenReaderMode(screenReaderMode === 'off' ? 'on' : 'off')}
                  >
                    {screenReaderMode === 'off' ? (
                      <>
                        <VolumeX className="h-3 w-3 mr-1" />
                        Screen Reader Off
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3 w-3 mr-1" />
                        Screen Reader On
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSimulating(!isSimulating)}
                >
                  {isSimulating ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Simulating
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Simulate
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Mode Info */}
            <div className="text-xs text-muted-foreground">
              Mode: {accessibilityMode.charAt(0).toUpperCase() + accessibilityMode.slice(1)} • 
              Screen Reader: {screenReaderMode === 'on' ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          {/* Accessibility Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contrast">Contrast</TabsTrigger>
                <TabsTrigger value="navigation">Navigation</TabsTrigger>
                <TabsTrigger value="testing">Testing</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <OverviewPreview 
                  theme={accessibilityTheme}
                  validationResults={validationResults}
                  accessibilityMode={accessibilityMode}
                  screenReaderMode={screenReaderMode}
                />
              </TabsContent>

              {/* Contrast Tab */}
              <TabsContent value="contrast" className="space-y-4">
                <ContrastPreview 
                  theme={accessibilityTheme}
                  validationResults={validationResults}
                  accessibilityMode={accessibilityMode}
                />
              </TabsContent>

              {/* Navigation Tab */}
              <TabsContent value="navigation" className="space-y-4">
                <NavigationPreview 
                  theme={accessibilityTheme}
                  validationResults={validationResults}
                  accessibilityMode={accessibilityMode}
                  screenReaderMode={screenReaderMode}
                />
              </TabsContent>

              {/* Testing Tab */}
              <TabsContent value="testing" className="space-y-4">
                <TestingPreview 
                  theme={accessibilityTheme}
                  validationResults={validationResults}
                  accessibilityMode={accessibilityMode}
                  screenReaderMode={screenReaderMode}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Overview Preview Component
function OverviewPreview({ 
  theme, 
  validationResults,
  accessibilityMode,
  screenReaderMode 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  validationResults?: ValidationResults | null;
  accessibilityMode: AccessibilityMode;
  screenReaderMode: ScreenReaderMode;
}) {
  return (
    <div className="space-y-4">
      {/* Accessibility Score */}
      {validationResults && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Accessibility Score
          </h4>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-2xl font-bold mb-1">
                {validationResults.score}
              </div>
              <div className="text-xs text-muted-foreground">Overall Score</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-2xl font-bold mb-1">
                {validationResults.isCompliant ? '✓' : '✗'}
              </div>
              <div className="text-xs text-muted-foreground">WCAG Compliance</div>
            </div>
            <div className="text-center p-3 bg-muted rounded">
              <div className="text-2xl font-bold mb-1">
                {validationResults.warnings.length}
              </div>
              <div className="text-xs text-muted-foreground">Issues Found</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Accessibility Progress</span>
              <span>{validationResults.score}%</span>
            </div>
            <Progress 
              value={validationResults.score} 
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Mode Preview */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Mode Preview</h4>
        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily
          }}
        >
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ 
              color: theme.colors.primary,
              fontFamily: theme.typography.headingFont
            }}
          >
            Sample Content
          </h3>
          <p className="mb-3">
            This preview shows how your theme appears in {accessibilityMode} mode.
            {screenReaderMode === 'on' && ' Screen reader annotations are enabled.'}
          </p>
          <div className="flex gap-2 mb-3">
            <button 
              className="px-3 py-2 rounded text-sm font-medium"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background
              }}
            >
              Primary Button
            </button>
            <button 
              className="px-3 py-2 rounded text-sm font-medium border"
              style={{ 
                backgroundColor: theme.colors.secondary,
                color: theme.colors.text,
                borderColor: theme.colors.secondary
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
  );
}

// Contrast Preview Component
function ContrastPreview({ 
  theme, 
  validationResults,
  accessibilityMode 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  validationResults?: ValidationResults | null;
  accessibilityMode: AccessibilityMode;
}) {
  // Calculate contrast ratios
  const getContrastRatio = (foreground: string, background: string) => {
    // This would use the actual contrast calculation from theme-validation.ts
    // For now, return mock values
    const ratios: Record<string, number> = {
      'text-background': 4.8,
      'primary-background': 3.2,
      'secondary-background': 2.8,
      'success-background': 4.1,
      'warning-background': 3.9,
      'error-background': 4.3,
    };
    return ratios[`${foreground}-background`] || 4.5;
  };

  const contrastPairs = [
    { foreground: 'text', background: 'background', label: 'Text on Background' },
    { foreground: 'primary', background: 'background', label: 'Primary on Background' },
    { foreground: 'secondary', background: 'background', label: 'Secondary on Background' },
    { foreground: 'success', background: 'background', label: 'Success on Background' },
    { foreground: 'warning', background: 'background', label: 'Warning on Background' },
    { foreground: 'error', background: 'background', label: 'Error on Background' },
  ];

  return (
    <div className="space-y-4">
      {/* Contrast Ratios */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Contrast className="h-4 w-4" />
          Contrast Ratios
        </h4>
        
        <div className="space-y-2">
          {contrastPairs.map((pair) => {
            const ratio = getContrastRatio(pair.foreground, pair.background);
            const status = ratio >= 4.5 ? 'good' : ratio >= 3.0 ? 'warning' : 'poor';
            const statusColor = status === 'good' ? 'green' : status === 'warning' ? 'yellow' : 'red';
            
            return (
              <div key={pair.label} className="flex items-center gap-3 p-3 border rounded">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: theme.colors[pair.foreground as keyof ColorScheme] }}
                  />
                  <span className="text-xs">on</span>
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: theme.colors[pair.background as keyof ColorScheme] }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{pair.label}</div>
                  <div className="text-xs text-muted-foreground">Ratio: {ratio.toFixed(1)}:1</div>
                </div>
                <div className={`text-xs font-medium ${
                  statusColor === 'green' ? 'text-green-600' :
                  statusColor === 'yellow' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {status === 'good' ? 'WCAG AA' : status === 'warning' ? 'WCAG A' : 'Fail'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WCAG Compliance */}
      {validationResults && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">WCAG Compliance</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded">
              <div className="text-sm font-medium mb-1">Level AA</div>
              <div className="text-xs text-muted-foreground">
                Minimum contrast ratio of 4.5:1 for normal text
              </div>
              <div className={`text-xs font-medium mt-1 ${
                validationResults.score >= 85 ? 'text-green-600' : 'text-red-600'
              }`}>
                {validationResults.score >= 85 ? 'Compliant' : 'Not Compliant'}
              </div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm font-medium mb-1">Level AAA</div>
              <div className="text-xs text-muted-foreground">
                Enhanced contrast ratio of 7:1 for normal text
              </div>
              <div className={`text-xs font-medium mt-1 ${
                validationResults.score >= 95 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {validationResults.score >= 95 ? 'Compliant' : 'Partial'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Navigation Preview Component
function NavigationPreview({ 
  theme, 
  validationResults,
  accessibilityMode,
  screenReaderMode 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  validationResults?: ValidationResults | null;
  accessibilityMode: AccessibilityMode;
  screenReaderMode: ScreenReaderMode;
}) {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Keyboard Navigation */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <Keyboard className="h-4 w-4" />
          Keyboard Navigation
        </h4>
        
        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily
          }}
        >
          <div className="space-y-3">
            <nav className="flex gap-4">
              <a 
                href="#" 
                className="px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: focusedElement === 'nav-1' ? theme.colors.primary : theme.colors.surface,
                  color: focusedElement === 'nav-1' ? theme.colors.background : theme.colors.text,
                  '--tw-ring-color': theme.colors.primary
                } as any}
                onFocus={() => setFocusedElement('nav-1')}
                onBlur={() => setFocusedElement(null)}
                tabIndex={0}
              >
                Dashboard
              </a>
              <a 
                href="#" 
                className="px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: focusedElement === 'nav-2' ? theme.colors.primary : theme.colors.surface,
                  color: focusedElement === 'nav-2' ? theme.colors.background : theme.colors.text,
                  '--tw-ring-color': theme.colors.primary
                } as any}
                onFocus={() => setFocusedElement('nav-2')}
                onBlur={() => setFocusedElement(null)}
                tabIndex={0}
              >
                Settings
              </a>
              <a 
                href="#" 
                className="px-3 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: focusedElement === 'nav-3' ? theme.colors.primary : theme.colors.surface,
                  color: focusedElement === 'nav-3' ? theme.colors.background : theme.colors.text,
                  '--tw-ring-color': theme.colors.primary
                } as any}
                onFocus={() => setFocusedElement('nav-3')}
                onBlur={() => setFocusedElement(null)}
                tabIndex={0}
              >
                Profile
              </a>
            </nav>
            
            {screenReaderMode === 'on' && (
              <div className="text-xs text-muted-foreground">
                Screen reader: "Navigation menu with 3 items. Dashboard, Settings, Profile. Use Tab to navigate."
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Focus Indicators */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Focus Indicators</h4>
        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily
          }}
        >
          <div className="space-y-3">
            <button 
              className="px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                '--tw-ring-color': theme.colors.accent
              } as any}
              onFocus={() => setFocusedElement('button-1')}
              onBlur={() => setFocusedElement(null)}
            >
              Focus Me
            </button>
            <input 
              type="text" 
              placeholder="Focus me to see focus ring"
              className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.secondary,
                '--tw-ring-color': theme.colors.primary
              } as any}
              onFocus={() => setFocusedElement('input-1')}
              onBlur={() => setFocusedElement(null)}
            />
          </div>
        </div>
      </div>

      {/* ARIA Labels */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">ARIA Labels</h4>
        <div 
          className="p-4 rounded border"
          style={{ 
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily
          }}
        >
          <div className="space-y-3">
            <button 
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.background
              }}
              aria-label="Close dialog"
            >
              ×
            </button>
            <div 
              className="p-3 rounded"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text
              }}
              role="alert"
              aria-live="polite"
            >
              This is an alert message
            </div>
            {screenReaderMode === 'on' && (
              <div className="text-xs text-muted-foreground">
                Screen reader: "Close dialog button. Alert: This is an alert message"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Testing Preview Component
function TestingPreview({ 
  theme, 
  validationResults,
  accessibilityMode,
  screenReaderMode 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  validationResults?: ValidationResults | null;
  accessibilityMode: AccessibilityMode;
  screenReaderMode: ScreenReaderMode;
}) {
  return (
    <div className="space-y-4">
      {/* Testing Tools */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Testing Tools</h4>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            Color Contrast
          </Button>
          <Button variant="outline" size="sm">
            <Keyboard className="h-3 w-3 mr-1" />
            Keyboard Test
          </Button>
          <Button variant="outline" size="sm">
            <Volume2 className="h-3 w-3 mr-1" />
            Screen Reader
          </Button>
          <Button variant="outline" size="sm">
            <MousePointer className="h-3 w-3 mr-1" />
            Focus Test
          </Button>
        </div>
      </div>

      {/* Validation Results */}
      {validationResults && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Validation Results</h4>
          
          {/* Warnings */}
          {validationResults.warnings.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-red-600">Issues Found</h5>
              {validationResults.warnings.map((warning, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
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

          {/* Recommendations */}
          {validationResults.recommendations.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-green-600">Recommendations</h5>
              {validationResults.recommendations.map((recommendation, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">{recommendation}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Testing Checklist */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Testing Checklist</h4>
        <div className="space-y-2">
          {[
            'All interactive elements are keyboard accessible',
            'Focus indicators are visible and clear',
            'Color contrast meets WCAG standards',
            'Text is readable and properly sized',
            'ARIA labels are present where needed',
            'Screen reader compatibility verified',
            'Motion respects reduced motion preferences',
            'Color is not the only way to convey information',
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { OverviewPreview, ContrastPreview, NavigationPreview, TestingPreview };
