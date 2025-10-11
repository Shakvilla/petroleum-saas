// Documentation: /docs/branding-preset-themes/responsive-preview.md

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  Eye,
  Settings,
  RefreshCw,
  Play,
  Pause,
  Square
} from 'lucide-react';
import type { ColorScheme, TypographyConfig } from '@/types/settings';

interface ResponsivePreviewProps {
  theme: {
    colors: ColorScheme;
    typography: TypographyConfig;
  };
  className?: string;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type Orientation = 'portrait' | 'landscape';
type ZoomLevel = '50%' | '75%' | '100%' | '125%' | '150%' | '200%';

// Device configurations
const DEVICE_CONFIGS = {
  desktop: {
    width: 1200,
    height: 800,
    name: 'Desktop',
    icon: Monitor,
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'Tablet',
    icon: Tablet,
  },
  mobile: {
    width: 375,
    height: 667,
    name: 'Mobile',
    icon: Smartphone,
  },
};

export function ResponsivePreview({
  theme,
  className
}: ResponsivePreviewProps) {
  const [activeTab, setActiveTab] = useState('layout');
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('100%');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<string>('desktop');

  const currentDevice = DEVICE_CONFIGS[deviceType];
  const DeviceIcon = currentDevice.icon;

  // Get responsive dimensions
  const getResponsiveDimensions = () => {
    let { width, height } = currentDevice;
    
    // Adjust for orientation
    if (orientation === 'landscape' && (deviceType === 'tablet' || deviceType === 'mobile')) {
      [width, height] = [height, width];
    }
    
    return { width, height };
  };

  const dimensions = getResponsiveDimensions();
  const zoomValue = parseFloat(zoomLevel.replace('%', '')) / 100;

  // Breakpoint configurations
  const breakpoints = [
    { name: 'Mobile', width: 375, height: 667, type: 'mobile' as DeviceType },
    { name: 'Tablet', width: 768, height: 1024, type: 'tablet' as DeviceType },
    { name: 'Desktop', width: 1200, height: 800, type: 'desktop' as DeviceType },
    { name: 'Large Desktop', width: 1440, height: 900, type: 'desktop' as DeviceType },
  ];

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Responsive Preview
              </CardTitle>
              <CardDescription>
                Preview your theme across different devices and screen sizes
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
          {/* Device Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Device Selector */}
                <div className="flex items-center gap-2">
                  <DeviceIcon className="h-4 w-4 text-muted-foreground" />
                  <Select value={deviceType} onValueChange={(value) => setDeviceType(value as DeviceType)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DEVICE_CONFIGS).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-3 w-3" />
                            {config.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Orientation (for tablet/mobile) */}
                {(deviceType === 'tablet' || deviceType === 'mobile') && (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <Select value={orientation} onValueChange={(value) => setOrientation(value as Orientation)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portrait">Portrait</SelectItem>
                        <SelectItem value="landscape">Landscape</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <Select value={zoomLevel} onValueChange={(value) => setZoomLevel(value as ZoomLevel)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50%">50%</SelectItem>
                      <SelectItem value="75%">75%</SelectItem>
                      <SelectItem value="100%">100%</SelectItem>
                      <SelectItem value="125%">125%</SelectItem>
                      <SelectItem value="150%">150%</SelectItem>
                      <SelectItem value="200%">200%</SelectItem>
                    </SelectContent>
                  </Select>
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Fullscreen Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="h-3 w-3 mr-1" />
                      Exit
                    </>
                  ) : (
                    <>
                      <Maximize2 className="h-3 w-3 mr-1" />
                      Fullscreen
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Device Info */}
            <div className="text-xs text-muted-foreground">
              {currentDevice.name} • {dimensions.width} × {dimensions.height}px • {zoomLevel}
              {orientation && ` • ${orientation.charAt(0).toUpperCase() + orientation.slice(1)}`}
            </div>
          </div>

          {/* Breakpoint Overview */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Breakpoint Overview</h4>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {breakpoints.map((breakpoint) => (
                <Button
                  key={breakpoint.name}
                  variant={selectedBreakpoint === breakpoint.name ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBreakpoint(breakpoint.name)}
                  className="flex-shrink-0"
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">{breakpoint.name}</div>
                    <div className="text-xs opacity-70">{breakpoint.width}px</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Preview Content */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
              </TabsList>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-4">
                <LayoutPreview 
                  theme={theme}
                  dimensions={dimensions}
                  zoom={zoomValue}
                  deviceType={deviceType}
                  orientation={orientation}
                />
              </TabsContent>

              {/* Components Tab */}
              <TabsContent value="components" className="space-y-4">
                <ComponentsPreview 
                  theme={theme}
                  dimensions={dimensions}
                  zoom={zoomValue}
                  deviceType={deviceType}
                  orientation={orientation}
                />
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-4">
                <TypographyPreview 
                  theme={theme}
                  dimensions={dimensions}
                  zoom={zoomValue}
                  deviceType={deviceType}
                  orientation={orientation}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Layout Preview Component
function LayoutPreview({ 
  theme, 
  dimensions, 
  zoom, 
  deviceType, 
  orientation 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  dimensions: { width: number; height: number }; 
  zoom: number; 
  deviceType: DeviceType; 
  orientation: Orientation; 
}) {
  return (
    <div className="space-y-4">
      {/* Device Frame */}
      <div className="flex justify-center">
        <div 
          className="border-4 border-gray-300 rounded-lg shadow-lg overflow-hidden"
          style={{
            width: `${dimensions.width * zoom}px`,
            height: `${dimensions.height * zoom}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          <div 
            className="w-full h-full p-4"
            style={{ 
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontFamily: theme.typography.fontFamily,
            }}
          >
            {/* Header */}
            <div 
              className="p-3 rounded mb-4"
              style={{ 
                backgroundColor: theme.colors.surface,
                color: theme.colors.text
              }}
            >
              <div className="flex items-center justify-between">
                <h1 
                  className="text-lg font-bold"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  {deviceType === 'mobile' ? 'App' : 'Application'}
                </h1>
                <div className="flex gap-2">
                  <button 
                    className="px-2 py-1 rounded text-xs"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background
                    }}
                  >
                    {deviceType === 'mobile' ? 'Menu' : 'Login'}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {deviceType !== 'mobile' && (
              <nav 
                className="p-2 rounded mb-4"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }}
              >
                <div className="flex gap-4">
                  <a href="#" style={{ color: theme.colors.primary }}>Dashboard</a>
                  <a href="#" style={{ color: theme.colors.text }}>Settings</a>
                  <a href="#" style={{ color: theme.colors.text }}>Profile</a>
                  <a href="#" style={{ color: theme.colors.text }}>Help</a>
                </div>
              </nav>
            )}

            {/* Main Content */}
            <div className="space-y-3">
              <h2 
                className="text-base font-semibold"
                style={{ 
                  color: theme.colors.primary,
                  fontFamily: theme.typography.headingFont
                }}
              >
                Main Content
              </h2>
              <p className="text-sm">
                This is how your layout will appear on {deviceType} devices
                {orientation && ` in ${orientation} orientation`}.
              </p>
              
              {/* Content Grid */}
              <div className={`grid gap-3 ${deviceType === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                  }}
                >
                  <h3 className="font-medium text-sm mb-1">Feature 1</h3>
                  <p className="text-xs">Description</p>
                </div>
                <div 
                  className="p-3 rounded"
                  style={{ 
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                  }}
                >
                  <h3 className="font-medium text-sm mb-1">Feature 2</h3>
                  <p className="text-xs">Description</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components Preview Component
function ComponentsPreview({ 
  theme, 
  dimensions, 
  zoom, 
  deviceType, 
  orientation 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  dimensions: { width: number; height: number }; 
  zoom: number; 
  deviceType: DeviceType; 
  orientation: Orientation; 
}) {
  return (
    <div className="space-y-4">
      {/* Component Showcase */}
      <div className="flex justify-center">
        <div 
          className="border rounded p-4"
          style={{
            width: `${Math.min(dimensions.width * zoom, 800)}px`,
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <div className="space-y-4">
            {/* Buttons */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Buttons</h4>
              <div className={`flex gap-2 ${deviceType === 'mobile' ? 'flex-col' : 'flex-wrap'}`}>
                <button 
                  className="px-3 py-2 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.background
                  }}
                >
                  Primary
                </button>
                <button 
                  className="px-3 py-2 rounded text-sm font-medium border"
                  style={{ 
                    backgroundColor: theme.colors.secondary,
                    color: theme.colors.text,
                    borderColor: theme.colors.secondary
                  }}
                >
                  Secondary
                </button>
                <button 
                  className="px-3 py-2 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: theme.colors.success,
                    color: theme.colors.background
                  }}
                >
                  Success
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Form Elements</h4>
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Sample input"
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
                  <option>Select option</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Cards</h4>
              <div 
                className="p-3 rounded border"
                style={{ 
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text
                }}
              >
                <h3 
                  className="font-medium text-sm mb-1"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Card Title
                </h3>
                <p className="text-xs">
                  This is a sample card component showing responsive behavior.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Typography Preview Component
function TypographyPreview({ 
  theme, 
  dimensions, 
  zoom, 
  deviceType, 
  orientation 
}: { 
  theme: { colors: ColorScheme; typography: TypographyConfig }; 
  dimensions: { width: number; height: number }; 
  zoom: number; 
  deviceType: DeviceType; 
  orientation: Orientation; 
}) {
  return (
    <div className="space-y-4">
      {/* Typography Showcase */}
      <div className="flex justify-center">
        <div 
          className="border rounded p-4"
          style={{
            width: `${Math.min(dimensions.width * zoom, 800)}px`,
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          <div className="space-y-4">
            {/* Headings */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Headings</h4>
              <div className="space-y-1">
                <h1 
                  className="text-2xl font-bold"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Heading 1
                </h1>
                <h2 
                  className="text-xl font-semibold"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Heading 2
                </h2>
                <h3 
                  className="text-lg font-medium"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Heading 3
                </h3>
                <h4 
                  className="text-base font-medium"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Heading 4
                </h4>
              </div>
            </div>

            {/* Body Text */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Body Text</h4>
              <div className="space-y-1">
                <p className="text-base">
                  This is base body text size. It should be comfortable to read for extended periods.
                </p>
                <p className="text-sm">
                  This is small body text, suitable for captions, footnotes, or secondary information.
                </p>
                <p className="text-xs">
                  This is extra small text, typically used for labels, metadata, or fine print.
                </p>
              </div>
            </div>

            {/* Sample Content */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Sample Content</h4>
              <div className="space-y-2">
                <h2 
                  className="text-lg font-semibold"
                  style={{ 
                    color: theme.colors.primary,
                    fontFamily: theme.typography.headingFont
                  }}
                >
                  Responsive Typography
                </h2>
                <p className="text-sm">
                  This demonstrates how your typography will scale across different devices. 
                  The font sizes and line heights are optimized for {deviceType} screens
                  {orientation && ` in ${orientation} orientation`}.
                </p>
                <blockquote 
                  className="border-l-4 pl-3 italic text-sm"
                  style={{ 
                    borderLeftColor: theme.colors.primary,
                    color: theme.colors.text
                  }}
                >
                  "Good typography is invisible. Great typography is invisible and beautiful."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { LayoutPreview, ComponentsPreview, TypographyPreview };
