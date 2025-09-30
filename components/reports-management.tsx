'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface ReportsManagementProps {
  tenant?: string;
}

export function ReportsManagement({
  tenant: propTenant,
}: ReportsManagementProps) {
  const { tenant } = useTenant();
  const currentTenant = propTenant || tenant?.id;

  // Load reports data from API
  const { data: reportsData, isLoading } = useTenantQuery(
    ['reports', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${currentTenant}/reports`);
      if (!response.ok) throw new Error('Failed to load reports data');
      return response.json();
    },
    {
      enabled: !!currentTenant,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const reports = reportsData?.data || {};

  const handleExportReport = (reportType: string) => {
    // In a real app, this would trigger a download
    console.log(`Exporting ${reportType} report for tenant ${currentTenant}`);
  };

  const handleViewReport = (reportType: string) => {
    // In a real app, this would open a detailed view
    console.log(`Viewing ${reportType} report for tenant ${currentTenant}`);
  };

  return (
    <div className="space-y-6">
      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Inventory Report */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Inventory Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Current stock levels and inventory movements
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Tanks:</span>
                <span className="font-medium">
                  {reports.inventoryReport?.summary?.totalTanks || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Tanks:</span>
                <span className="font-medium">
                  {reports.inventoryReport?.summary?.activeTanks || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Volume:</span>
                <span className="font-medium">
                  {(
                    reports.inventoryReport?.summary?.totalVolume || 0
                  ).toLocaleString()}
                  L
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewReport('inventory')}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleExportReport('inventory')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Report */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Delivery Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Delivery performance and logistics metrics
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Deliveries:</span>
                <span className="font-medium">
                  {reports.deliveryReport?.summary?.totalDeliveries || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">
                  {reports.deliveryReport?.summary?.completedDeliveries || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Time:</span>
                <span className="font-medium">
                  {reports.deliveryReport?.summary?.averageDeliveryTime || 0}min
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewReport('delivery')}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleExportReport('delivery')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Report */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Sales Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Sales performance and revenue analysis
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-medium">
                  $
                  {(
                    reports.salesReport?.summary?.totalRevenue || 0
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Volume:</span>
                <span className="font-medium">
                  {(
                    reports.salesReport?.summary?.totalVolume || 0
                  ).toLocaleString()}
                  L
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transactions:</span>
                <span className="font-medium">
                  {reports.salesReport?.summary?.totalTransactions || 0}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleViewReport('sales')}
                >
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleExportReport('sales')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            System Alerts Report
          </CardTitle>
          <p className="text-sm text-gray-600">
            Current system alerts and notifications
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {reports.alertsReport?.summary?.totalAlerts || 0}
                </p>
                <p className="text-sm text-gray-600">Total Alerts</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {reports.alertsReport?.summary?.activeAlerts || 0}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {reports.alertsReport?.summary?.criticalAlerts || 0}
                </p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {reports.alertsReport?.summary?.resolvedAlerts || 0}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleViewReport('alerts')}
              >
                View All Alerts
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExportReport('alerts')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Alerts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Report Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Reports are generated in real-time from current system data</p>
            <p>• Export formats available: PDF, Excel, CSV</p>
            <p>• Reports include data from the last 30 days by default</p>
            <p>• Custom date ranges can be specified when generating reports</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
