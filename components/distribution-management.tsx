'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FleetTracker } from './fleet-tracker';
import { RouteOptimizer } from './route-optimizer';
import { DistributionAnalytics } from './distribution-analytics';
import { DeliveryScheduler } from './delivery-scheduler';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Plus,
  Search,
  Filter,
  Users,
  Fuel,
  AlertTriangle,
  Navigation,
  CheckCircle,
  ArrowUp,
} from 'lucide-react';

// Mock data for deliveries
const deliveries = [
  {
    id: 'DEL-001',
    customer: 'Shell Station Downtown',
    address: '123 Main St, Downtown',
    product: 'Premium Gasoline',
    quantity: '5,000L',
    status: 'in-transit',
    driver: 'John Smith',
    vehicle: 'TRK-001',
    estimatedTime: '2:30 PM',
    priority: 'high',
    progress: 65,
  },
  {
    id: 'DEL-002',
    customer: 'BP Express Highway',
    address: '456 Highway Rd',
    product: 'Diesel',
    quantity: '8,000L',
    status: 'scheduled',
    driver: 'Mike Johnson',
    vehicle: 'TRK-003',
    estimatedTime: '4:15 PM',
    priority: 'medium',
    progress: 0,
  },
  {
    id: 'DEL-003',
    customer: 'Exxon City Center',
    address: '789 Center Ave',
    product: 'Regular Gasoline',
    quantity: '6,500L',
    status: 'completed',
    driver: 'Sarah Wilson',
    vehicle: 'TRK-002',
    estimatedTime: 'Completed',
    priority: 'low',
    progress: 100,
  },
  {
    id: 'DEL-004',
    customer: 'Chevron North Plaza',
    address: '321 North Plaza Dr',
    product: 'Premium Gasoline',
    quantity: '4,200L',
    status: 'loading',
    driver: 'David Brown',
    vehicle: 'TRK-004',
    estimatedTime: '1:45 PM',
    priority: 'high',
    progress: 25,
  },
];

const deliveryStats = [
  {
    id: 1,
    title: 'Active Deliveries',
    value: 12,
    icon: <Truck className="h-4 w-4 text-blue-600" />,
    percentage: '+2 from yesterday',
    percentageColor: 'text-emerald-600',
    percentageIcon: <ArrowUp className="h-4 w-4 text-emerald-600" />,
  },
  {
    id: 2,
    title: 'Fleet Utilization',
    value: 85,
    icon: <Users className="h-4 w-4 text-emerald-600" />,
    percentage: 'Optimal range',
    percentageColor: 'text-emerald-600',
    percentageIcon: <ArrowUp className="h-4 w-4 text-emerald-600" />,
  },
  {
    id: 3,
    title: 'Fuel Efficiency',
    value: 7.2,
    icon: <Fuel className="h-4 w-4 text-amber-600" />,
    percentage: 'per 100km',
    percentageColor: 'text-emerald-600',
    percentageIcon: <ArrowUp className="h-4 w-4 text-emerald-600" />,
  },
  {
    id: 4,
    title: 'Active Alerts',
    value: 3,
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    percentage: 'Needs attention',
    percentageColor: 'text-red-600',
    percentageIcon: <ArrowUp className="h-4 w-4 text-red-600" />,
  },
];
const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'in-transit':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'loading':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'scheduled':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case 'in-transit':
      return <Navigation className="h-4 w-4 text-blue-600" />;
    case 'loading':
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'scheduled':
      return <Package className="h-4 w-4 text-slate-600" />;
    default:
      return <Truck className="h-4 w-4 text-gray-600" />;
  }
};

export function DistributionManagement() {
  const { tenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load distribution data from API
  const { data: distributionData, isLoading } = useTenantQuery(
    ['distribution', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${tenant?.id}/distribution`);
      if (!response.ok) throw new Error('Failed to load distribution data');
      return response.json();
    },
    {
      enabled: !!tenant?.id,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const deliveries = distributionData?.data?.deliveries || [];
  console.log('deliveries', deliveries);

  const filteredDeliveries = deliveries.filter((delivery: any) => {
    const matchesSearch =
      delivery?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery?.driver?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || delivery.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // console.log('filteredDeliveries', filteredDeliveries);

  return (
    <div className="min-h-screen">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Distribution Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Manage deliveries, routes, and fleet operations
            </p>
          </div>
          <Button
            onClick={() => setShowScheduler(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Schedule Delivery</span>
            <span className="sm:hidden">Schedule</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {deliveryStats.map(stat => (
            <Card
              className="relative overflow-hidden bg-white  border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              key={stat.id}
            >
              {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" /> */}
              <CardContent className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-600">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">
                      {stat.percentage}
                    </p>
                  </div>
                  <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}


        </div>

        {/* Main Content */}
        <Card className="bg-gray-100  border-gray-200">
          <Tabs defaultValue="deliveries" className="w-full bg-gradient-to-b from-white to-gray-50">
            <div className="border-b border-slate-200/50 px-4 sm:px-6">
              <TabsList className="bg-transparent border-0 p-0 h-auto space-x-0">
                <TabsTrigger
                  value="deliveries"
                  className="relative bg-transparent border-0 rounded-none px-4 py-3 text-slate-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-blue-600 transition-colors"
                >
                  <span className="relative z-10 font-medium">Deliveries</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 data-[state=active]:scale-x-100 transition-transform" />
                </TabsTrigger>
                <TabsTrigger
                  value="fleet"
                  className="relative bg-transparent border-0 rounded-none px-4 py-3 text-slate-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-blue-600 transition-colors"
                >
                  <span className="relative z-10 font-medium">
                    Fleet Tracker
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 data-[state=active]:scale-x-100 transition-transform" />
                </TabsTrigger>
                <TabsTrigger
                  value="routes"
                  className="relative bg-transparent border-0 rounded-none px-4 py-3 text-slate-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-blue-600 transition-colors"
                >
                  <span className="relative z-10 font-medium">Routes</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 data-[state=active]:scale-x-100 transition-transform" />
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="relative bg-transparent border-0 rounded-none px-4 py-3 text-slate-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-blue-600 transition-colors"
                >
                  <span className="relative z-10 font-medium">Analytics</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transform scale-x-0 data-[state=active]:scale-x-100 transition-transform" />
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="deliveries" className="p-4 sm:p-6 space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search deliveries..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedStatus === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedStatus('all')}
                      className={
                        selectedStatus === 'all'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : ''
                      }
                    >
                      All
                    </Button>
                    <Button
                      variant={
                        selectedStatus === 'in-transit' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedStatus('in-transit')}
                      className={
                        selectedStatus === 'in-transit'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : ''
                      }
                    >
                      In Transit
                    </Button>
                    <Button
                      variant={
                        selectedStatus === 'scheduled' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedStatus('scheduled')}
                      className={
                        selectedStatus === 'scheduled'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : ''
                      }
                    >
                      Scheduled
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="bg-white/50">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">More Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
              </div>

              {/* Deliveries List */}
              <div className="space-y-4">
                {filteredDeliveries.map((delivery: any) => (
                  <Card
                    key={delivery.id}
                    className="relative overflow-hidden bg-white  border-gray-200  hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 bg-white" />
                    <CardContent className="relative p-4 sm:p-6">
                      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(delivery.status)}
                              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                                {delivery.driverId}
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                className={`${getStatusColor(delivery.status)} text-xs font-medium border`}
                              >
                                {delivery.status.replace('-', ' ')}
                              </Badge>
                              <Badge
                                className={`${getPriorityColor(delivery.priority)} text-xs font-medium border`}
                              >
                                {delivery.priority} priority
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm text-slate-600">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-slate-400" />
                              <span className="truncate">
                                {delivery.address}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-slate-400" />
                              <span>
                                {delivery.fuelType} - {delivery.quantity}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-slate-400" />
                              <span>{delivery.driverId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>{delivery.estimatedTime}</span>
                            </div>
                          </div>

                          {delivery.status === 'in-transit' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>Progress</span>
                                <span>{delivery.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${delivery.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-row space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none bg-white/50 hover:bg-white"
                          >
                            Track
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none bg-white/50 hover:bg-white"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredDeliveries.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No deliveries found
                  </h3>
                  <p className="text-slate-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="fleet" className="p-4 sm:p-6">
              <FleetTracker />
            </TabsContent>

            <TabsContent value="routes" className="p-4 sm:p-6">
              <RouteOptimizer />
            </TabsContent>

            <TabsContent value="analytics" className="p-4 sm:p-6">
              <DistributionAnalytics />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Delivery Scheduler Dialog */}
        <DeliveryScheduler
          open={showScheduler}
          onOpenChange={setShowScheduler}
        />
      </div>
    </div>
  );
}
