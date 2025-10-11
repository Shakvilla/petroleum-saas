// Documentation: /docs/branding-preset-themes/validation-recommendations.md

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Lightbulb,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

interface ValidationRecommendationsProps {
  recommendations: string[];
  warnings: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    element?: string;
    suggestion?: string;
  }>;
  onApplyRecommendation?: (recommendation: string) => void;
  className?: string;
}

export function ValidationRecommendations({ 
  recommendations, 
  warnings, 
  onApplyRecommendation,
  className 
}: ValidationRecommendationsProps) {
  // Group recommendations by category
  const colorRecommendations = recommendations.filter(rec => 
    rec.toLowerCase().includes('color') || 
    rec.toLowerCase().includes('contrast') ||
    rec.toLowerCase().includes('palette')
  );
  
  const typographyRecommendations = recommendations.filter(rec => 
    rec.toLowerCase().includes('font') || 
    rec.toLowerCase().includes('typography') ||
    rec.toLowerCase().includes('text') ||
    rec.toLowerCase().includes('size')
  );
  
  const accessibilityRecommendations = recommendations.filter(rec => 
    rec.toLowerCase().includes('accessibility') || 
    rec.toLowerCase().includes('wcag') ||
    rec.toLowerCase().includes('compliance')
  );
  
  const otherRecommendations = recommendations.filter(rec => 
    !colorRecommendations.includes(rec) &&
    !typographyRecommendations.includes(rec) &&
    !accessibilityRecommendations.includes(rec)
  );

  // Get priority level based on warnings
  const criticalWarnings = warnings.filter(w => w.severity === 'high');
  const mediumWarnings = warnings.filter(w => w.severity === 'medium');
  const lowWarnings = warnings.filter(w => w.severity === 'low');

  const getPriorityLevel = () => {
    if (criticalWarnings.length > 0) return 'high';
    if (mediumWarnings.length > 0) return 'medium';
    return 'low';
  };

  const priorityLevel = getPriorityLevel();

  // Get priority badge
  const getPriorityBadge = () => {
    switch (priorityLevel) {
      case 'high':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            High Priority
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium Priority
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
            <Info className="h-3 w-3 mr-1" />
            Low Priority
          </Badge>
        );
    }
  };

  if (recommendations.length === 0 && warnings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            No recommendations available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-green-600 font-medium mb-2">
              Excellent! No issues found
            </p>
            <p className="text-sm text-muted-foreground">
              Your theme meets all accessibility standards and best practices.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommendations
            </CardTitle>
            <CardDescription>
              {recommendations.length} recommendations, {warnings.length} issues found
            </CardDescription>
          </div>
          {getPriorityBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Priority Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{criticalWarnings.length}</div>
            <div className="text-xs text-red-700">Critical Issues</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">{mediumWarnings.length}</div>
            <div className="text-xs text-yellow-700">Medium Issues</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{lowWarnings.length}</div>
            <div className="text-xs text-blue-700">Low Issues</div>
          </div>
        </div>

        {/* Color Recommendations */}
        {colorRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              Color & Contrast
            </h4>
            <div className="space-y-2">
              {colorRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{recommendation}</p>
                    {onApplyRecommendation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => onApplyRecommendation(recommendation)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typography Recommendations */}
        {typographyRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Typography
            </h4>
            <div className="space-y-2">
              {typographyRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{recommendation}</p>
                    {onApplyRecommendation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => onApplyRecommendation(recommendation)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessibility Recommendations */}
        {accessibilityRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              Accessibility
            </h4>
            <div className="space-y-2">
              {accessibilityRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{recommendation}</p>
                    {onApplyRecommendation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => onApplyRecommendation(recommendation)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Recommendations */}
        {otherRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full" />
              Other Improvements
            </h4>
            <div className="space-y-2">
              {otherRecommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <Lightbulb className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">{recommendation}</p>
                    {onApplyRecommendation && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 h-6 px-2 text-xs"
                        onClick={() => onApplyRecommendation(recommendation)}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Copy className="h-3 w-3 mr-1" />
              Copy All Recommendations
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View WCAG Guidelines
            </Button>
          </div>
        </div>

        {/* Help Resources */}
        <div className="p-3 bg-muted rounded-lg">
          <h5 className="text-xs font-medium mb-2 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Help Resources
          </h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>• WCAG 2.1 Guidelines: <a href="#" className="text-blue-600 hover:underline">webaim.org</a></p>
            <p>• Color Contrast Checker: <a href="#" className="text-blue-600 hover:underline">webaim.org/resources/contrastchecker</a></p>
            <p>• Accessibility Testing Tools: <a href="#" className="text-blue-600 hover:underline">deque.com</a></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for individual recommendation item
function RecommendationItem({ 
  recommendation, 
  category, 
  onApply 
}: { 
  recommendation: string; 
  category: 'color' | 'typography' | 'accessibility' | 'other';
  onApply?: (recommendation: string) => void;
}) {
  const getCategoryColor = () => {
    switch (category) {
      case 'color':
        return 'text-red-600';
      case 'typography':
        return 'text-blue-600';
      case 'accessibility':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'color':
        return '🎨';
      case 'typography':
        return '📝';
      case 'accessibility':
        return '♿';
      default:
        return '💡';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
      <span className="text-lg">{getCategoryIcon()}</span>
      <div className="flex-1">
        <p className="text-sm">{recommendation}</p>
        {onApply && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-6 px-2 text-xs"
            onClick={() => onApply(recommendation)}
          >
            <ArrowRight className="h-3 w-3 mr-1" />
            Apply Fix
          </Button>
        )}
      </div>
    </div>
  );
}

export { RecommendationItem };
