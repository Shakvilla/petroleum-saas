// Documentation: /docs/branding-preset-themes/interactive-component-preview.md

'use client';

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load heavy UI components
const Select = lazy(() => import('@/components/ui/select').then(m => ({ default: m.Select })));
const SelectContent = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectContent })));
const SelectItem = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectItem })));
const SelectTrigger = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectTrigger })));
const SelectValue = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectValue })));
const Checkbox = lazy(() => import('@/components/ui/checkbox').then(m => ({ default: m.Checkbox })));
const RadioGroup = lazy(() => import('@/components/ui/radio-group').then(m => ({ default: m.RadioGroup })));
const RadioGroupItem = lazy(() => import('@/components/ui/radio-group').then(m => ({ default: m.RadioGroupItem })));
const Switch = lazy(() => import('@/components/ui/switch').then(m => ({ default: m.Switch })));
const Slider = lazy(() => import('@/components/ui/slider').then(m => ({ default: m.Slider })));
const Progress = lazy(() => import('@/components/ui/progress').then(m => ({ default: m.Progress })));
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Settings,
  Eye,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  Tablet,
  Touchpad
} from 'lucide-react';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

interface InteractiveComponentPreviewProps {
  theme: {
    colors: ColorScheme;
    typography: TypographyConfig;
  };
  className?: string;
}

type InteractionMode = 'hover' | 'focus' | 'active' | 'disabled';
type DeviceType = 'desktop' | 'tablet' | 'mobile';

function InteractiveComponentPreviewComponent({
  theme,
  className
}: InteractiveComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState('buttons');
  const [interactionMode, setInteractionMode] = useState<InteractionMode>('hover');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // Sample form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 25,
    newsletter: false,
    theme: 'light',
    notifications: true,
    volume: 50,
  });

  // Handle form changes
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get device-specific styles
  const getDeviceStyles = () => {
    switch (deviceType) {
      case 'mobile':
        return { width: 375, fontSize: '14px', padding: '8px' };
      case 'tablet':
        return { width: 768, fontSize: '16px', padding: '12px' };
      default:
        return { width: 1200, fontSize: '16px', padding: '16px' };
    }
  };

  const deviceStyles = getDeviceStyles();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                Interactive Component Preview
              </CardTitle>
              <CardDescription>
                Test interactive states and behaviors of your theme components
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimating(!isAnimating)}
              >
                {isAnimating ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    Animate
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Interaction Mode */}
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <Select value={interactionMode} onValueChange={(value) => setInteractionMode(value as InteractionMode)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hover">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-3 w-3" />
                        Hover
                      </div>
                    </SelectItem>
                    <SelectItem value="focus">
                      <div className="flex items-center gap-2">
                        <Keyboard className="h-3 w-3" />
                        Focus
                      </div>
                    </SelectItem>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <Touchpad className="h-3 w-3" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="disabled">
                      <div className="flex items-center gap-2">
                        <Square className="h-3 w-3" />
                        Disabled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Device Type */}
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <Select value={deviceType} onValueChange={(value) => setDeviceType(value as DeviceType)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-3 w-3" />
                        Desktop
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-3 w-3" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-3 w-3" />
                        Mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} • {interactionMode.charAt(0).toUpperCase() + interactionMode.slice(1)}
            </div>
          </div>

          {/* Interactive Components */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            {/* Buttons Tab */}
            <TabsContent value="buttons" className="space-y-4">
              <div 
                className="p-6 rounded border"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: deviceStyles.fontSize,
                }}
              >
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ 
                      color: theme.colors.primary,
                      fontFamily: theme.typography.headingFont
                    }}
                  >
                    Button States
                  </h3>
                  
                  {/* Primary Buttons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Primary Buttons</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="transition-all duration-200"
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background
                        }}
                        onMouseEnter={() => setSelectedElement('primary-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                        onFocus={() => setSelectedElement('primary-focus')}
                        onBlur={() => setSelectedElement(null)}
                      >
                        Primary Button
                      </Button>
                      <Button
                        variant="outline"
                        className="transition-all duration-200"
                        style={{ 
                          borderColor: theme.colors.primary,
                          color: theme.colors.primary
                        }}
                        onMouseEnter={() => setSelectedElement('primary-outline-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Primary Outline
                      </Button>
                      <Button
                        variant="ghost"
                        className="transition-all duration-200"
                        style={{ 
                          color: theme.colors.primary
                        }}
                        onMouseEnter={() => setSelectedElement('primary-ghost-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Primary Ghost
                      </Button>
                    </div>
                  </div>

                  {/* Secondary Buttons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Secondary Buttons</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="transition-all duration-200"
                        style={{ 
                          backgroundColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                        onMouseEnter={() => setSelectedElement('secondary-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Secondary Button
                      </Button>
                      <Button
                        variant="outline"
                        className="transition-all duration-200"
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.secondary
                        }}
                        onMouseEnter={() => setSelectedElement('secondary-outline-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Secondary Outline
                      </Button>
                    </div>
                  </div>

                  {/* Status Buttons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Status Buttons</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        className="transition-all duration-200"
                        style={{ 
                          backgroundColor: theme.colors.success,
                          color: theme.colors.background
                        }}
                        onMouseEnter={() => setSelectedElement('success-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Success
                      </Button>
                      <Button
                        className="transition-all duration-200"
                        style={{ 
                          backgroundColor: theme.colors.warning,
                          color: theme.colors.background
                        }}
                        onMouseEnter={() => setSelectedElement('warning-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Warning
                      </Button>
                      <Button
                        className="transition-all duration-200"
                        style={{ 
                          backgroundColor: theme.colors.error,
                          color: theme.colors.background
                        }}
                        onMouseEnter={() => setSelectedElement('error-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Error
                      </Button>
                    </div>
                  </div>

                  {/* Disabled Buttons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Disabled Buttons</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        disabled
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background,
                          opacity: 0.5
                        }}
                      >
                        Disabled Primary
                      </Button>
                      <Button
                        variant="outline"
                        disabled
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.secondary,
                          opacity: 0.5
                        }}
                      >
                        Disabled Outline
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Forms Tab */}
            <TabsContent value="forms" className="space-y-4">
              <div 
                className="p-6 rounded border"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: deviceStyles.fontSize,
                }}
              >
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ 
                      color: theme.colors.primary,
                      fontFamily: theme.typography.headingFont
                    }}
                  >
                    Form Elements
                  </h3>
                  
                  {/* Text Inputs */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Text Inputs</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        style={{ 
                          backgroundColor: theme.colors.background,
                          color: theme.colors.text,
                          borderColor: theme.colors.secondary
                        }}
                        onFocus={() => setSelectedElement('input-focus')}
                        onBlur={() => setSelectedElement(null)}
                      />
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        style={{ 
                          backgroundColor: theme.colors.background,
                          color: theme.colors.text,
                          borderColor: theme.colors.secondary
                        }}
                      />
                    </div>
                  </div>

                  {/* Select Dropdown */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Select Dropdown</h4>
                    <Select
                      value={formData.theme}
                      onValueChange={(value) => handleFormChange('theme', value)}
                    >
                      <SelectTrigger style={{ 
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                        borderColor: theme.colors.secondary
                      }}>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent style={{ 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text
                      }}>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Checkboxes</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="newsletter"
                        checked={formData.newsletter}
                        onCheckedChange={(checked) => handleFormChange('newsletter', checked)}
                        style={{ 
                          accentColor: theme.colors.primary
                        }}
                      />
                      <label htmlFor="newsletter" className="text-sm">
                        Subscribe to newsletter
                      </label>
                    </div>
                  </div>

                  {/* Radio Buttons */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Radio Buttons</h4>
                    <RadioGroup
                      value={formData.theme}
                      onValueChange={(value) => handleFormChange('theme', value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <label htmlFor="light" className="text-sm">Light Theme</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <label htmlFor="dark" className="text-sm">Dark Theme</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Switch */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Switch</h4>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleFormChange('notifications', checked)}
                        style={{ 
                          '--switch-color': theme.colors.primary
                        } as any}
                      />
                      <label className="text-sm">Enable notifications</label>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Slider</h4>
                    <div className="space-y-2">
                      <Slider
                        value={[formData.volume]}
                        onValueChange={([value]) => handleFormChange('volume', value)}
                        max={100}
                        step={1}
                        className="w-full"
                        style={{ 
                          '--slider-color': theme.colors.primary
                        } as any}
                      />
                      <div className="text-xs text-muted-foreground">
                        Volume: {formData.volume}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Navigation Tab */}
            <TabsContent value="navigation" className="space-y-4">
              <div 
                className="p-6 rounded border"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: deviceStyles.fontSize,
                }}
              >
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ 
                      color: theme.colors.primary,
                      fontFamily: theme.typography.headingFont
                    }}
                  >
                    Navigation Elements
                  </h3>
                  
                  {/* Breadcrumbs */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Breadcrumbs</h4>
                    <nav className="flex items-center space-x-2 text-sm">
                      <a 
                        href="#" 
                        className="hover:underline"
                        style={{ color: theme.colors.primary }}
                        onMouseEnter={() => setSelectedElement('breadcrumb-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        Home
                      </a>
                      <span style={{ color: theme.colors.secondary }}>/</span>
                      <a 
                        href="#" 
                        className="hover:underline"
                        style={{ color: theme.colors.primary }}
                      >
                        Settings
                      </a>
                      <span style={{ color: theme.colors.secondary }}>/</span>
                      <span style={{ color: theme.colors.text }}>Branding</span>
                    </nav>
                  </div>

                  {/* Tabs */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Tabs</h4>
                    <Tabs defaultValue="tab1" className="w-full">
                      <TabsList style={{ 
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text
                      }}>
                        <TabsTrigger value="tab1">General</TabsTrigger>
                        <TabsTrigger value="tab2">Advanced</TabsTrigger>
                        <TabsTrigger value="tab3">Security</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="mt-2">
                        <div 
                          className="p-3 rounded text-sm"
                          style={{ 
                            backgroundColor: theme.colors.surface,
                            color: theme.colors.text
                          }}
                        >
                          General settings content
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Pagination */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Pagination</h4>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.secondary,
                          opacity: 0.5
                        }}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background,
                          borderColor: theme.colors.primary
                        }}
                      >
                        1
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                        onMouseEnter={() => setSelectedElement('pagination-hover')}
                        onMouseLeave={() => setSelectedElement(null)}
                      >
                        2
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                      >
                        3
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ 
                          borderColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback" className="space-y-4">
              <div 
                className="p-6 rounded border"
                style={{ 
                  backgroundColor: theme.colors.background,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: deviceStyles.fontSize,
                }}
              >
                <div className="space-y-4">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ 
                      color: theme.colors.primary,
                      fontFamily: theme.typography.headingFont
                    }}
                  >
                    Feedback Elements
                  </h3>
                  
                  {/* Progress Bars */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Progress Bars</h4>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <div className="text-xs">Loading...</div>
                        <Progress 
                          value={75} 
                          className="w-full"
                          style={{ 
                            '--progress-color': theme.colors.primary
                          } as any}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs">Upload Progress</div>
                        <Progress 
                          value={45} 
                          className="w-full"
                          style={{ 
                            '--progress-color': theme.colors.success
                          } as any}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Alerts</h4>
                    <div className="space-y-2">
                      <div 
                        className="p-3 rounded border-l-4 text-sm"
                        style={{ 
                          backgroundColor: `${theme.colors.success}20`,
                          borderLeftColor: theme.colors.success,
                          color: theme.colors.text
                        }}
                      >
                        <div className="font-medium">Success!</div>
                        <div>Your changes have been saved successfully.</div>
                      </div>
                      <div 
                        className="p-3 rounded border-l-4 text-sm"
                        style={{ 
                          backgroundColor: `${theme.colors.warning}20`,
                          borderLeftColor: theme.colors.warning,
                          color: theme.colors.text
                        }}
                      >
                        <div className="font-medium">Warning</div>
                        <div>Please review your settings before proceeding.</div>
                      </div>
                      <div 
                        className="p-3 rounded border-l-4 text-sm"
                        style={{ 
                          backgroundColor: `${theme.colors.error}20`,
                          borderLeftColor: theme.colors.error,
                          color: theme.colors.text
                        }}
                      >
                        <div className="font-medium">Error</div>
                        <div>Something went wrong. Please try again.</div>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Badges</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        style={{ 
                          backgroundColor: theme.colors.primary,
                          color: theme.colors.background
                        }}
                      >
                        Primary
                      </Badge>
                      <Badge
                        variant="secondary"
                        style={{ 
                          backgroundColor: theme.colors.secondary,
                          color: theme.colors.text
                        }}
                      >
                        Secondary
                      </Badge>
                      <Badge
                        style={{ 
                          backgroundColor: theme.colors.success,
                          color: theme.colors.background
                        }}
                      >
                        Success
                      </Badge>
                      <Badge
                        style={{ 
                          backgroundColor: theme.colors.warning,
                          color: theme.colors.background
                        }}
                      >
                        Warning
                      </Badge>
                      <Badge
                        style={{ 
                          backgroundColor: theme.colors.error,
                          color: theme.colors.background
                        }}
                      >
                        Error
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Selected Element Info */}
          {selectedElement && (
            <div className="mt-4 p-3 bg-muted rounded text-sm">
              <div className="font-medium">Selected: {selectedElement}</div>
              <div className="text-muted-foreground">
                Interaction mode: {interactionMode} • Device: {deviceType}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Export with Suspense wrapper for lazy-loaded components
export function InteractiveComponentPreview(props: InteractiveComponentPreviewProps) {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading preview...</div>}>
      <InteractiveComponentPreviewComponent {...props} />
    </Suspense>
  );
}

export default InteractiveComponentPreview;
