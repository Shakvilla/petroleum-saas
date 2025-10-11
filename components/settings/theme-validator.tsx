// Documentation: /docs/branding-preset-themes/theme-validator.md

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  RefreshCw,
  Eye,
  Palette,
  Type,
  Shield,
  Target
} from 'lucide-react';
import type { ValidationResults, ValidationWarning } from '@/types/theme-presets';

interface ThemeValidatorProps {
  validationResults: ValidationResults | null;
  onValidate: () => void;
  isLoading?: boolean;
  className?: string;
}

export function ThemeValidator({ 
  validationResults, 
  onValidate, 
  isLoading = false,
  className 
}: ThemeValidatorProps) {
  if (!validationResults) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Theme Validation
          </CardTitle>
          <CardDescription>
            Validate your theme for accessibility compliance and best practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No theme validation results available
            </p>
            <Button onClick={onValidate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Validate Theme
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { isCompliant, score, warnings, recommendations, contrastRatios, lastValidated } = validationResults;

  // Group warnings by severity
  const criticalWarnings = warnings.filter(w => w.severity === 'high');
  const mediumWarnings = warnings.filter(w => w.severity === 'medium');
  const lowWarnings = warnings.filter(w => w.severity === 'low');

  // Get compliance badge
  const getComplianceBadge = () => {
    if (isCompliant) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          WCAG Compliant
        </Badge>
      );
    }
    
    if (score >= 70) {
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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Theme Validation
            </CardTitle>
            <CardDescription>
              Last validated: {lastValidated.toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getComplianceBadge()}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onValidate} 
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Accessibility Score</span>
            <span className={`text-lg font-bold ${getScoreColor(score)}`}>
              {score}/100
            </span>
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Based on WCAG 2.1 AA compliance standards
          </p>
        </div>

        <Separator />

        {/* Contrast Ratios */}
        {Object.keys(contrastRatios).length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Contrast Ratios
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(contrastRatios).map(([pair, ratio]) => (
                <div key={pair} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-xs font-medium">{pair.replace('-', ' vs ')}</span>
                  <Badge 
                    variant={ratio >= 4.5 ? "default" : ratio >= 3 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {ratio.toFixed(1)}:1
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Issues Found ({warnings.length})
            </h4>
            
            {/* Critical Warnings */}
            {criticalWarnings.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-red-600">Critical Issues</h5>
                {criticalWarnings.map((warning, index) => (
                  <Alert key={index} variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium">{warning.message}</div>
                      {warning.suggestion && (
                        <div className="text-sm mt-1 opacity-90">
                          Suggestion: {warning.suggestion}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Medium Warnings */}
            {mediumWarnings.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-yellow-600">Medium Priority</h5>
                {mediumWarnings.map((warning, index) => (
                  <Alert key={index} variant="default" className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <div className="font-medium text-yellow-800">{warning.message}</div>
                      {warning.suggestion && (
                        <div className="text-sm mt-1 text-yellow-700">
                          Suggestion: {warning.suggestion}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Low Warnings */}
            {lowWarnings.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-blue-600">Low Priority</h5>
                {lowWarnings.map((warning, index) => (
                  <Alert key={index} variant="default" className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                      <div className="font-medium text-blue-800">{warning.message}</div>
                      {warning.suggestion && (
                        <div className="text-sm mt-1 text-blue-700">
                          Suggestion: {warning.suggestion}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Recommendations
            </h4>
            <div className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success State */}
        {isCompliant && warnings.length === 0 && (
          <Alert variant="default" className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="font-medium text-green-800">
                Excellent! Your theme meets all accessibility standards.
              </div>
              <div className="text-sm text-green-700 mt-1">
                Your theme is WCAG 2.1 AA compliant and provides an excellent user experience.
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component for individual warning display
function WarningItem({ warning }: { warning: ValidationWarning }) {
  const getIcon = () => {
    switch (warning.severity) {
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (warning.severity) {
      case 'high':
        return 'destructive' as const;
      case 'medium':
        return 'default' as const;
      case 'low':
        return 'default' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Alert variant={getVariant()}>
      {getIcon()}
      <AlertDescription>
        <div className="font-medium">{warning.message}</div>
        {warning.suggestion && (
          <div className="text-sm mt-1 opacity-90">
            Suggestion: {warning.suggestion}
          </div>
        )}
        {warning.element && (
          <div className="text-xs mt-1 opacity-75">
            Element: {warning.element}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

// Export individual components for flexibility
export { WarningItem };
