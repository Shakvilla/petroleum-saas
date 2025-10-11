// Documentation: /docs/branding-preset-themes/wcag-compliance-indicators.md

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Target,
  Eye,
  Palette,
  Type,
  Zap
} from 'lucide-react';

interface WCAGComplianceIndicatorsProps {
  validationResults: {
    isCompliant: boolean;
    score: number;
    contrastRatios: Record<string, number>;
    warnings: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      message: string;
      element?: string;
      suggestion?: string;
    }>;
  } | null;
  className?: string;
}

export function WCAGComplianceIndicators({ validationResults, className }: WCAGComplianceIndicatorsProps) {
  if (!validationResults) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            WCAG Compliance
          </CardTitle>
          <CardDescription>
            Accessibility compliance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No compliance data available
            </p>
            <p className="text-sm text-muted-foreground">
              Apply a theme to see WCAG 2.1 compliance analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { isCompliant, score, contrastRatios, warnings } = validationResults;

  // Calculate compliance metrics
  const totalRatios = Object.keys(contrastRatios).length;
  const compliantRatios = Object.values(contrastRatios).filter(ratio => ratio >= 4.5).length;
  const contrastCompliance = totalRatios > 0 ? Math.round((compliantRatios / totalRatios) * 100) : 0;

  // Group warnings by type
  const colorWarnings = warnings.filter(w => w.type === 'color' || w.element?.includes('color'));
  const typographyWarnings = warnings.filter(w => w.type === 'typography' || w.element?.includes('font'));
  const contrastWarnings = warnings.filter(w => w.type === 'contrast');
  const otherWarnings = warnings.filter(w => !['color', 'typography', 'contrast'].includes(w.type));

  // Get overall compliance level
  const getComplianceLevel = () => {
    if (score >= 95) return { level: 'AAA', color: 'green', icon: CheckCircle };
    if (score >= 85) return { level: 'AA+', color: 'blue', icon: CheckCircle };
    if (score >= 70) return { level: 'AA', color: 'blue', icon: CheckCircle };
    if (score >= 50) return { level: 'Partial', color: 'yellow', icon: AlertTriangle };
    return { level: 'Fail', color: 'red', icon: XCircle };
  };

  const compliance = getComplianceLevel();
  const ComplianceIcon = compliance.icon;

  // Get compliance badge
  const getComplianceBadge = () => {
    const baseClasses = "flex items-center gap-1";
    
    switch (compliance.color) {
      case 'green':
        return (
          <Badge variant="default" className={`${baseClasses} bg-green-100 text-green-800 border-green-200`}>
            <ComplianceIcon className="h-3 w-3" />
            {compliance.level}
          </Badge>
        );
      case 'blue':
        return (
          <Badge variant="default" className={`${baseClasses} bg-blue-100 text-blue-800 border-blue-200`}>
            <ComplianceIcon className="h-3 w-3" />
            {compliance.level}
          </Badge>
        );
      case 'yellow':
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`}>
            <ComplianceIcon className="h-3 w-3" />
            {compliance.level}
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className={`${baseClasses} bg-red-100 text-red-800 border-red-200`}>
            <ComplianceIcon className="h-3 w-3" />
            {compliance.level}
          </Badge>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              WCAG 2.1 Compliance
            </CardTitle>
            <CardDescription>
              Web Content Accessibility Guidelines compliance analysis
            </CardDescription>
          </div>
          {getComplianceBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <span className={`text-lg font-bold ${
              compliance.color === 'green' ? 'text-green-600' :
              compliance.color === 'blue' ? 'text-blue-600' :
              compliance.color === 'yellow' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {score}/100
            </span>
          </div>
          <Progress 
            value={score} 
            className="h-2"
            style={{
              backgroundColor: 'var(--muted)',
            }}
          />
          <p className="text-xs text-muted-foreground">
            Based on WCAG 2.1 AA compliance standards
          </p>
        </div>

        {/* Compliance Breakdown */}
        <div className="grid grid-cols-2 gap-4">
          {/* Contrast Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Contrast</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ratios</span>
                <span className="text-xs font-medium">{contrastCompliance}%</span>
              </div>
              <Progress value={contrastCompliance} className="h-1.5" />
            </div>
          </div>

          {/* Color Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Colors</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Issues</span>
                <span className="text-xs font-medium">{colorWarnings.length}</span>
              </div>
              <Progress 
                value={colorWarnings.length === 0 ? 100 : Math.max(0, 100 - (colorWarnings.length * 20))} 
                className="h-1.5" 
              />
            </div>
          </div>

          {/* Typography Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Typography</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Issues</span>
                <span className="text-xs font-medium">{typographyWarnings.length}</span>
              </div>
              <Progress 
                value={typographyWarnings.length === 0 ? 100 : Math.max(0, 100 - (typographyWarnings.length * 20))} 
                className="h-1.5" 
              />
            </div>
          </div>

          {/* Other Compliance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Other</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Issues</span>
                <span className="text-xs font-medium">{otherWarnings.length}</span>
              </div>
              <Progress 
                value={otherWarnings.length === 0 ? 100 : Math.max(0, 100 - (otherWarnings.length * 20))} 
                className="h-1.5" 
              />
            </div>
          </div>
        </div>

        {/* WCAG Standards Reference */}
        <div className="p-3 bg-muted rounded-lg">
          <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            WCAG 2.1 Success Criteria
          </h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>1.4.3 Contrast (Minimum):</span>
              <span className="font-mono">4.5:1</span>
            </div>
            <div className="flex justify-between">
              <span>1.4.6 Contrast (Enhanced):</span>
              <span className="font-mono">7.0:1</span>
            </div>
            <div className="flex justify-between">
              <span>1.4.11 Non-text Contrast:</span>
              <span className="font-mono">3.0:1</span>
            </div>
            <div className="flex justify-between">
              <span>1.4.12 Text Spacing:</span>
              <span className="text-green-600">✓</span>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className={`p-3 rounded-lg border ${
          isCompliant 
            ? 'bg-green-50 border-green-200' 
            : score >= 70 
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-2">
            <ComplianceIcon className={`h-4 w-4 mt-0.5 ${
              isCompliant 
                ? 'text-green-600' 
                : score >= 70 
                ? 'text-yellow-600'
                : 'text-red-600'
            }`} />
            <div className="space-y-1">
              <p className={`text-sm font-medium ${
                isCompliant 
                  ? 'text-green-800' 
                  : score >= 70 
                  ? 'text-yellow-800'
                  : 'text-red-800'
              }`}>
                {isCompliant 
                  ? 'WCAG 2.1 AA Compliant' 
                  : score >= 70 
                  ? 'Partially Compliant - Needs Improvement'
                  : 'Not WCAG Compliant'
                }
              </p>
              <p className={`text-xs ${
                isCompliant 
                  ? 'text-green-700' 
                  : score >= 70 
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {isCompliant 
                  ? 'Your theme meets all WCAG 2.1 AA accessibility standards.'
                  : score >= 70 
                  ? 'Your theme meets most accessibility standards but has some issues to address.'
                  : 'Your theme has significant accessibility issues that need to be resolved.'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for individual compliance indicator
function ComplianceIndicator({ 
  label, 
  value, 
  maxValue = 100, 
  icon: Icon, 
  color = 'default' 
}: { 
  label: string; 
  value: number; 
  maxValue?: number; 
  icon: React.ComponentType<{ className?: string }>; 
  color?: 'default' | 'green' | 'blue' | 'yellow' | 'red';
}) {
  const percentage = Math.round((value / maxValue) * 100);
  
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'blue':
        return 'text-blue-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${getColorClasses()}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Score</span>
          <span className="text-xs font-medium">{value}/{maxValue}</span>
        </div>
        <Progress value={percentage} className="h-1.5" />
      </div>
    </div>
  );
}

export { ComplianceIndicator };
