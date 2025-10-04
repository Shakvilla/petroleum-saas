'use client';

import { useState } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { ProtectedComponent } from '@/components/protected-component';
import { TenantSafeDataList } from '@/components/tenant-safe-data-list';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Filter,
  Download,
  Search,
  Zap,
  TrendingUp,
  AlertTriangle,
  Fuel,
  Droplets,
  Activity,
  Target,
  Bell,
} from 'lucide-react';
import { ModernTankOverview } from './modern-tank-overview';
import { ModernPredictiveAnalytics } from './modern-predictive-analytics';
import { ModernIoTMonitoring } from './modern-iot-monitoring';
import { ModernInventoryAlerts } from './modern-inventory-alerts';
import { ModernInventoryHistory } from './modern-inventory-history';
import { AddInventoryDialog } from './add-inventory-dialog';

interface InventoryManagementProps {
  tenant?: string;
}

export const InventoryManagement = ({
  tenant: propTenant,
}: InventoryManagementProps) => {
  const { tenant } = useTenant();
  const currentTenant = propTenant || tenant?.id;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load inventory data
  const { data: inventoryData, isLoading } = useTenantQuery(
    ['inventory', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${currentTenant}/inventory`);
      if (!response.ok) throw new Error('Failed to load inventory');
      return response.json();
    },
    {
      enabled: !!currentTenant,
    }
  );

  const inventoryStats = [
    {
      title: 'Total Volume',
      value: '2.85M',
      unit: 'L',
      change: '+2.5%',
      trend: 'up',
      icon: Fuel,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      description: 'Across all tanks',
    },
    {
      title: 'Active Tanks',
      value: '24',
      unit: 'tanks',
      change: '100%',
      trend: 'stable',
      icon: Droplets,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      description: 'All operational',
    },
    {
      title: 'Critical Alerts',
      value: '3',
      unit: 'alerts',
      change: '-33%',
      trend: 'down',
      icon: AlertTriangle,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100',
      description: 'Require attention',
    },
    {
      title: 'Efficiency',
      value: '94.2',
      unit: '%',
      change: '+1.2%',
      trend: 'up',
      icon: Zap,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      description: 'System performance',
    },
  ];

  const quickActions = [
    {
      name: 'Add Inventory',
      icon: Plus,
      action: () => setShowAddDialog(true),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Generate Report',
      icon: Download,
      action: () => {},
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      name: 'Configure Alerts',
      icon: Bell,
      action: () => {},
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      name: 'Optimize Levels',
      icon: Target,
      action: () => {},
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="min-h-scree">
      {/* Modern Header with Glassmorphism */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10"></div>
        <div className="absolute inset-0 backdrop-blur-3xl"></div>

        <div className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col space-y-6">
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    {tenant?.name || currentTenant} Inventory Management
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                    Real-time monitoring and intelligent analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {quickActions.map(action => (
                <Button
                  key={action.name}
                  onClick={action.action}
                  className={`${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm h-10 sm:h-11 text-xs sm:text-sm`}
                  size="sm"
                >
                  <action.icon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline sm:hidden lg:inline">
                    {action.name}
                  </span>
                  <span className="xs:hidden sm:inline lg:hidden">
                    {action.name.split(' ')[0]}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:pb-8 space-y-6 sm:space-y-8 lg:pr-0 lg:pl-[3px] pt-[px]3px]">
        {/* Modern Stats Grid - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {inventoryStats.map((stat, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
              ></div>
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>

              <CardContent className="relative p-4 sm:p-6 bg-white">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div
                    className={`p-2 sm:p-3 bg-gradient-to-br ${stat.gradient} rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div
                      className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
                        stat.trend === 'up'
                          ? 'text-emerald-600'
                          : stat.trend === 'down'
                            ? 'text-red-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {stat.trend === 'up' && (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      {stat.trend === 'down' && (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />
                      )}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {stat.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar - Mobile Optimized */}
        <Card className="border-gray-200 cursor-pointer bg-white backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search tanks, products, or locations..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 h-10 sm:h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg text-sm sm:text-base sm:rounded-md"
                />
              </div>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 border-gray-200 hover:bg-white rounded-lg text-sm sm:rounded-md"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none h-10 sm:h-12 px-4 sm:px-6 bg-white/50 border-gray-200 hover:bg-white rounded-lg text-sm sm:rounded-md"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modern Tabs - Mobile Optimized */}
        <Tabs
          defaultValue="overview"
          className="space-y-6 sm:space-y-8 bg-white"
        >
          <div className="w-full overflow-x-auto">
            <div className="flex min-w-max px-4 gap-x-1 justify-stretch py-3 flex-col items-stretch">
              <TabsList className="grid grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 p-1 sm:p-2 rounded-xl min-w-max shadow-none sm:rounded-lg text-center sm:py-0">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:rounded-md"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:rounded-md"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger
                  value="monitoring"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:rounded-md"
                >
                  <span className="hidden sm:inline">IoT Monitoring</span>
                  <span className="sm:hidden">IoT</span>
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:rounded-md"
                >
                  Alerts
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4 py-2"
                >
                  History
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6 sm:space-y-8">
            <ProtectedComponent resource="tanks" action="read">
              <ModernTankOverview
                tenant={currentTenant || 'default'}
                searchTerm={searchTerm}
              />
            </ProtectedComponent>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 sm:space-y-8">
            <ProtectedComponent resource="analytics" action="read">
              <ModernPredictiveAnalytics tenant={currentTenant || 'default'} />
            </ProtectedComponent>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 sm:space-y-8">
            <ProtectedComponent resource="iot" action="read">
              <ModernIoTMonitoring tenant={currentTenant || 'default'} />
            </ProtectedComponent>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6 sm:space-y-8">
            <ProtectedComponent resource="alerts" action="read">
              <ModernInventoryAlerts tenant={currentTenant || 'default'} />
            </ProtectedComponent>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 sm:space-y-8">
            <ProtectedComponent resource="inventory" action="read">
              <ModernInventoryHistory tenant={currentTenant || 'default'} />
            </ProtectedComponent>
          </TabsContent>
        </Tabs>
      </div>

      <AddInventoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        tenant={tenant?.id || currentTenant || 'default'}
      />
    </div>
  );
};
