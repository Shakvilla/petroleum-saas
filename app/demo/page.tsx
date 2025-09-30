'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_COMPANY, MOCK_ADMIN } from '@/lib/mock-company';
import { useAuthStore } from '@/stores/auth-store';
import { useTenant } from '@/components/tenant-provider';
import {
  ModernDashboardOverview,
  ModernTankOverview,
  ModernInventoryAlerts,
  ModernInventoryHistory,
  ModernIoTMonitoring,
  ModernPredictiveAnalytics,
  ModernSalesChart,
  ModernTransactions,
} from '@/components';
import {
  DistributionManagement,
  FleetTracker,
  InventoryManagement,
  RouteOptimizer,
} from '@/components';
import {
  ProtectedComponent,
  FeatureGate,
  PermissionGate,
} from '@/components/protected-component';

export default function DemoPage() {
  const { user, isAuthenticated, permissions } = useAuthStore();
  const { tenant } = useTenant();

  const handleLogin = async () => {
    try {
      await useAuthStore
        .getState()
        .login('admin@petromax-energy.com', 'admin123');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>PetroMax Energy Solutions - Demo Dashboard</span>
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <Badge variant="outline">
                      {user?.name} ({user?.role})
                    </Badge>
                    <Button onClick={handleLogout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleLogin} size="sm">
                    Login as Admin
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Complete access to all components with mock data. Company:{' '}
              {tenant?.name || MOCK_COMPANY.name}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modern Dashboard Overview</CardTitle>
                <CardDescription>
                  Complete dashboard with all widgets and real-time data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ModernDashboardOverview tenant="petromax-energy" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tank Overview</CardTitle>
                  <CardDescription>
                    Real-time tank levels and status monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernTankOverview tenant="petromax-energy" searchTerm="" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Alerts</CardTitle>
                  <CardDescription>
                    Critical alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernInventoryAlerts tenant="petromax-energy" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory History</CardTitle>
                  <CardDescription>
                    Transaction history and audit trail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernInventoryHistory tenant="petromax-energy" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Complete inventory management interface
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InventoryManagement tenant="petromax-energy" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Tracker</CardTitle>
                <CardDescription>
                  Real-time fleet monitoring and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FleetTracker />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Route Optimizer</CardTitle>
                <CardDescription>
                  Delivery route optimization and planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteOptimizer />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribution Management</CardTitle>
                <CardDescription>
                  Complete distribution and delivery management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DistributionManagement />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>
                    Sales performance and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernSalesChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest transaction activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernTransactions />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>IoT Monitoring</CardTitle>
                  <CardDescription>
                    Real-time sensor data and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernIoTMonitoring tenant="petromax-energy" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Predictive Analytics</CardTitle>
                  <CardDescription>
                    AI-powered insights and forecasting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernPredictiveAnalytics tenant="petromax-energy" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Permission System Demo</CardTitle>
                <CardDescription>
                  Testing permission gates and feature flags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Permission Gates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Permission Gates</h3>

                  <PermissionGate resource="tanks" action="read">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <p className="text-green-800">✅ Can read tanks</p>
                      </CardContent>
                    </Card>
                  </PermissionGate>

                  <PermissionGate resource="tanks" action="admin">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <p className="text-green-800">✅ Can admin tanks</p>
                      </CardContent>
                    </Card>
                  </PermissionGate>

                  <PermissionGate resource="users" action="create">
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <p className="text-green-800">✅ Can create users</p>
                      </CardContent>
                    </Card>
                  </PermissionGate>
                </div>

                {/* Feature Gates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Feature Gates</h3>

                  <FeatureGate feature="advancedAnalytics">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <p className="text-blue-800">
                          ✅ Advanced Analytics enabled
                        </p>
                      </CardContent>
                    </Card>
                  </FeatureGate>

                  <FeatureGate feature="realTimeUpdates">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <p className="text-blue-800">
                          ✅ Real-time Updates enabled
                        </p>
                      </CardContent>
                    </Card>
                  </FeatureGate>

                  <FeatureGate feature="apiAccess">
                    <Card className="border-blue-200 bg-blue-50">
                      <CardContent className="pt-4">
                        <p className="text-blue-800">✅ API Access enabled</p>
                      </CardContent>
                    </Card>
                  </FeatureGate>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current User Info</h3>

                  <Card>
                    <CardContent className="pt-4 space-y-2">
                      <p>
                        <strong>Name:</strong> {user?.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {user?.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {user?.role}
                      </p>
                      <p>
                        <strong>Tenant:</strong> {user?.tenantId}
                      </p>
                      <p>
                        <strong>Permissions:</strong> {permissions.length} total
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Permission List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">All Permissions</h3>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                        {permissions.map(permission => (
                          <Badge
                            key={permission.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {permission.resource}:{permission.action}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
