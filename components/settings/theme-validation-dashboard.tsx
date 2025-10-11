// Documentation: /docs/branding-preset-themes/theme-validation-dashboard.md

'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Target, 
  CheckCircle, 
  RefreshCw,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { ThemeValidator } from './theme-validator';
import { ContrastRatioDisplay } from './contrast-ratio-display';
import { WCAGComplianceIndicators } from './wcag-compliance-indicators';
import { ValidationRecommendations } from './validation-recommendations';
import type { ValidationResults } from '@/types/theme-presets';

interface ThemeValidationDashboardProps {
  validationResults: ValidationResults | null;
  onValidate: () => void;
  onExportResults?: () => void;
  onImportResults?: (data: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function ThemeValidationDashboard({
  validationResults,
  onValidate,
  onExportResults,
  onImportResults,
  isLoading = false,
  className
}: ThemeValidationDashboardProps) {
  const hasResults = validationResults !== null;
  const isCompliant = validationResults?.isCompliant ?? false;
  const score = validationResults?.score ?? 0;

  // Get overall status
  const getOverallStatus = () => {
    if (!hasResults) return { status: 'pending', color: 'gray', icon: Settings };
    if (isCompliant) return { status: 'compliant', color: 'green', icon: CheckCircle };
    if (score >= 70) return { status: 'partial', color: 'yellow', icon: Shield };
    return { status: 'non-compliant', color: 'red', icon: Shield };
  };

  const overallStatus = getOverallStatus();
  const StatusIcon = overallStatus.icon;

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Theme Validation Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Comprehensive accessibility analysis and compliance checking
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <Badge 
              variant={
                overallStatus.color === 'green' ? 'default' :
                overallStatus.color === 'yellow' ? 'secondary' :
                overallStatus.color === 'red' ? 'destructive' :
                'outline'
              }
              className={
                overallStatus.color === 'green' ? 'bg-green-100 text-green-800 border-green-200' :
                overallStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                overallStatus.color === 'red' ? 'bg-red-100 text-red-800 border-red-200' :
                ''
              }
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {overallStatus.status === 'pending' ? 'Pending' :
               overallStatus.status === 'compliant' ? 'Compliant' :
               overallStatus.status === 'partial' ? 'Partial' :
               'Non-Compliant'}
            </Badge>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {onExportResults && hasResults && (
                <Button variant="outline" size="sm" onClick={onExportResults}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              )}
              
              {onImportResults && (
                <Button variant="outline" size="sm" onClick={() => {
                  // This would typically open a file picker
                  console.log('Import results functionality');
                }}>
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              )}

              <Button onClick={onValidate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Validate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contrast">Contrast</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            <ThemeValidator
              validationResults={validationResults}
              onValidate={onValidate}
              isLoading={isLoading}
            />
            
            {hasResults && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContrastRatioDisplay
                  contrastRatios={validationResults.contrastRatios}
                />
                <WCAGComplianceIndicators
                  validationResults={validationResults}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* Contrast Tab */}
        <TabsContent value="contrast" className="space-y-4">
          <ContrastRatioDisplay
            contrastRatios={validationResults?.contrastRatios ?? {}}
          />
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <WCAGComplianceIndicators
            validationResults={validationResults}
          />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <ValidationRecommendations
            recommendations={validationResults?.recommendations ?? []}
            warnings={validationResults?.warnings ?? []}
            onApplyRecommendation={(recommendation) => {
              console.log('Apply recommendation:', recommendation);
              // This would typically trigger an automatic fix
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      {hasResults && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCompliant ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">WCAG Status</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {isCompliant ? 'AA' : 'Fail'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Accessibility Score</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {score}/100
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm font-medium">Issues Found</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {validationResults.warnings.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Recommendations</span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {validationResults.recommendations.length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Export individual components for flexibility
export {
  ThemeValidator,
  ContrastRatioDisplay,
  WCAGComplianceIndicators,
  ValidationRecommendations
};
