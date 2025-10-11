// Documentation: /docs/branding-preset-themes/contrast-ratio-display.md

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Palette
} from 'lucide-react';

interface ContrastRatioDisplayProps {
  contrastRatios: Record<string, number>;
  className?: string;
}

export function ContrastRatioDisplay({ contrastRatios, className }: ContrastRatioDisplayProps) {
  if (Object.keys(contrastRatios).length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Contrast Ratios
          </CardTitle>
          <CardDescription>
            No contrast ratio data available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Palette className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Apply a theme to see contrast ratio analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // WCAG thresholds
  const WCAG_AA_NORMAL = 4.5;
  const WCAG_AA_LARGE = 3.0;
  const WCAG_AAA_NORMAL = 7.0;
  const WCAG_AAA_LARGE = 4.5;

  // Get compliance level for a ratio
  const getComplianceLevel = (ratio: number) => {
    if (ratio >= WCAG_AAA_NORMAL) return 'AAA';
    if (ratio >= WCAG_AA_NORMAL) return 'AA';
    if (ratio >= WCAG_AA_LARGE) return 'AA Large';
    return 'Fail';
  };

  // Get compliance badge
  const getComplianceBadge = (ratio: number) => {
    const level = getComplianceLevel(ratio);
    
    switch (level) {
      case 'AAA':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            AAA
          </Badge>
        );
      case 'AA':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            AA
          </Badge>
        );
      case 'AA Large':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            AA Large
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Fail
          </Badge>
        );
    }
  };

  // Get progress color
  const getProgressColor = (ratio: number) => {
    if (ratio >= WCAG_AA_NORMAL) return 'bg-green-500';
    if (ratio >= WCAG_AA_LARGE) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Calculate overall compliance
  const ratios = Object.values(contrastRatios);
  const compliantRatios = ratios.filter(ratio => ratio >= WCAG_AA_NORMAL).length;
  const overallCompliance = Math.round((compliantRatios / ratios.length) * 100);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Contrast Ratios
        </CardTitle>
        <CardDescription>
          WCAG 2.1 compliance analysis for text readability
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Compliance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Compliance</span>
            <span className="text-sm text-muted-foreground">
              {compliantRatios}/{ratios.length} ratios compliant
            </span>
          </div>
          <Progress value={overallCompliance} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {overallCompliance}% of color combinations meet WCAG AA standards
          </p>
        </div>

        {/* Individual Ratios */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Color Combinations</h4>
          <div className="grid gap-3">
            {Object.entries(contrastRatios).map(([pair, ratio]) => {
              const [foreground, background] = pair.split('-');
              const level = getComplianceLevel(ratio);
              const progressValue = Math.min((ratio / WCAG_AA_NORMAL) * 100, 100);
              
              return (
                <TooltipProvider key={pair}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-help">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-3 h-3 rounded border"
                                style={{ backgroundColor: foreground === 'text' ? '#000' : '#3b82f6' }}
                              />
                              <span className="text-xs font-medium capitalize">{foreground}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">on</span>
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-3 h-3 rounded border"
                                style={{ backgroundColor: background === 'background' ? '#fff' : '#f8fafc' }}
                              />
                              <span className="text-xs font-medium capitalize">{background}</span>
                            </div>
                          </div>
                          {getComplianceBadge(ratio)}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Ratio</span>
                            <span className="text-sm font-mono font-medium">{ratio.toFixed(1)}:1</span>
                          </div>
                          <Progress 
                            value={progressValue} 
                            className="h-1.5"
                            style={{ 
                              backgroundColor: 'var(--muted)',
                            }}
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{pair.replace('-', ' vs ')}</p>
                        <p className="text-sm">Contrast Ratio: {ratio.toFixed(2)}:1</p>
                        <p className="text-sm">WCAG Level: {level}</p>
                        {level === 'Fail' && (
                          <p className="text-sm text-red-600">
                            Minimum required: 4.5:1 for normal text
                          </p>
                        )}
                        {level === 'AA Large' && (
                          <p className="text-sm text-yellow-600">
                            Meets requirements for large text (18pt+)
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>

        {/* WCAG Standards Reference */}
        <div className="p-3 bg-muted rounded-lg">
          <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            WCAG 2.1 Standards
          </h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>AA Normal Text:</span>
              <span className="font-mono">4.5:1</span>
            </div>
            <div className="flex justify-between">
              <span>AA Large Text:</span>
              <span className="font-mono">3.0:1</span>
            </div>
            <div className="flex justify-between">
              <span>AAA Normal Text:</span>
              <span className="font-mono">7.0:1</span>
            </div>
            <div className="flex justify-between">
              <span>AAA Large Text:</span>
              <span className="font-mono">4.5:1</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for individual ratio display
function ContrastRatioItem({ 
  pair, 
  ratio 
}: { 
  pair: string; 
  ratio: number; 
}) {
  const [foreground, background] = pair.split('-');
  const level = getComplianceLevel(ratio);
  
  const getComplianceLevel = (ratio: number) => {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3.0) return 'AA Large';
    return 'Fail';
  };

  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded border"
            style={{ backgroundColor: foreground === 'text' ? '#000' : '#3b82f6' }}
          />
          <span className="text-xs font-medium capitalize">{foreground}</span>
        </div>
        <span className="text-xs text-muted-foreground">on</span>
        <div className="flex items-center gap-1">
          <div 
            className="w-3 h-3 rounded border"
            style={{ backgroundColor: background === 'background' ? '#fff' : '#f8fafc' }}
          />
          <span className="text-xs font-medium capitalize">{background}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-medium">{ratio.toFixed(1)}:1</span>
        <Badge variant={level === 'Fail' ? 'destructive' : 'default'} className="text-xs">
          {level}
        </Badge>
      </div>
    </div>
  );
}

export { ContrastRatioItem };
