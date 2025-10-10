'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Truck,
  MapPin,
  Fuel,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Wrench,
  Search,
  Filter,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';

// Mock fleet data
// const vehicles = [
//   {
//     id: 'TRK-001',
//     driver: 'John Smith',
//     status: 'in-transit',
//     location: 'Downtown Route',
//     fuelLevel: 75,
//     lastUpdate: '2 min ago',
//     currentDelivery: 'Shell Station Downtown',
//     mileage: '45,230 km',
//     nextMaintenance: '2,770 km',
//     speed: '65 km/h',
//     eta: '15 min',
//   },
//   {
//     id: 'TRK-002',
//     driver: 'Sarah Wilson',
//     status: 'available',
//     location: 'Depot',
//     fuelLevel: 90,
//     lastUpdate: '5 min ago',
//     currentDelivery: null,
//     mileage: '38,450 km',
//     nextMaintenance: '1,550 km',
//     speed: '0 km/h',
//     eta: null,
//   },
//   {
//     id: 'TRK-003',
//     driver: 'Mike Johnson',
//     status: 'loading',
//     location: 'Loading Bay 2',
//     fuelLevel: 85,
//     lastUpdate: '1 min ago',
//     currentDelivery: 'BP Express Highway',
//     mileage: '52,100 km',
//     nextMaintenance: '7,900 km',
//     speed: '0 km/h',
//     eta: '30 min',
//   },
//   {
//     id: 'TRK-004',
//     driver: 'David Brown',
//     status: 'maintenance',
//     location: 'Service Center',
//     fuelLevel: 60,
//     lastUpdate: '30 min ago',
//     currentDelivery: null,
//     mileage: '67,890 km',
//     nextMaintenance: 'Scheduled',
//     speed: '0 km/h',
//     eta: null,
//   },
//   {
//     id: 'TRK-005',
//     driver: 'Lisa Garcia',
//     status: 'in-transit',
//     location: 'Highway 101',
//     fuelLevel: 45,
//     lastUpdate: '3 min ago',
//     currentDelivery: 'Chevron North Plaza',
//     mileage: '41,200 km',
//     nextMaintenance: '3,800 km',
//     speed: '80 km/h',
//     eta: '25 min',
//   },
//   {
//     id: 'TRK-006',
//     driver: 'Robert Chen',
//     status: 'available',
//     location: 'Depot',
//     fuelLevel: 95,
//     lastUpdate: '8 min ago',
//     currentDelivery: null,
//     mileage: '29,750 km',
//     nextMaintenance: '250 km',
//     speed: '0 km/h',
//     eta: null,
//   },
// ];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available':
      return <CheckCircle className="h-4 w-4 text-emerald-600" />;
    case 'in-transit':
      return <Navigation className="h-4 w-4 text-blue-600" />;
    case 'loading':
      return <Clock className="h-4 w-4 text-amber-600" />;
    case 'maintenance':
      return <Wrench className="h-4 w-4 text-red-600" />;
    default:
      return <Truck className="h-4 w-4 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'in-transit':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'loading':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'maintenance':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getFuelLevelColor = (level: number) => {
  if (level >= 70) return 'bg-emerald-500';
  if (level >= 30) return 'bg-amber-500';
  return 'bg-red-500';
};

export function FleetTracker() {
  const { tenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load fleet data from API
  const {
    data: fleetData,
    isLoading,
    error,
  } = useTenantQuery(
    ['fleet', 'overview'],
    async () => {
      // console.log('Fetching fleet data for tenant:', tenant?.id);
      const response = await fetch(`/api/tenants/${tenant?.id}/fleet`);
      if (!response.ok) throw new Error('Failed to load fleet data');
      const data = await response.json();
      // console.log('Fleet API response:', data);
      return data;
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          Error loading fleet data: {error.message}
        </div>
        <div className="text-sm text-gray-600">Tenant ID: {tenant?.id}</div>
      </div>
    );
  }

  const vehicles = fleetData?.data?.vehicles || [];

  // Debug logging
  // console.log('FleetTracker Debug:', {
  //   tenant: tenant?.id,
  //   fleetData,
  //   vehicles,
  //   vehiclesLength: vehicles.length,
  // });

  const availableVehicles = vehicles.filter(
    (v: any) => v.status === 'ACTIVE'
  ).length;
  const inTransitVehicles = vehicles.filter(
    (v: any) => v.status === 'IN_PROGRESS'
  ).length;
  const maintenanceVehicles = vehicles.filter(
    (v: any) => v.status === 'MAINTENANCE'
  ).length;

  const filteredVehicles = vehicles.filter((vehicle: any) => {
    const matchesSearch =
      vehicle.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.location?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || vehicle.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Fleet Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden bg-white/80 border-gray-200 hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {availableVehicles}
                </p>
                <p className="text-xs text-slate-500">Ready for dispatch</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 " />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">In Transit</p>
                <p className="text-2xl font-bold text-blue-600">
                  {inTransitVehicles}
                </p>
                <p className="text-xs text-slate-500">Active deliveries</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Navigation className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border-gray-200  hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 " />
          <CardContent className="relative p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">
                  Maintenance
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {maintenanceVehicles}
                </p>
                <p className="text-xs text-slate-500">Under service</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Wrench className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search vehicles..."
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
                selectedStatus === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''
              }
            >
              All
            </Button>
            <Button
              variant={selectedStatus === 'available' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus('available')}
              className={
                selectedStatus === 'available'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : ''
              }
            >
              Available
            </Button>
            <Button
              variant={selectedStatus === 'in-transit' ? 'default' : 'outline'}
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
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-white/50">
          <Filter className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Vehicle List */}
      <div className="space-y-4">
        {filteredVehicles.map((vehicle: any) => (
          <Card
            key={vehicle.id}
            className="relative overflow-hidden bg-white backdrop-blur-sm border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
          >
            <div className="absolute inset-0" />
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vehicle.status)}
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {vehicle.id}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={`${getStatusColor(vehicle.status)} text-xs font-medium border`}
                      >
                        {vehicle.status.replace('-', ' ')}
                      </Badge>
                      {vehicle.fuelLevel < 30 && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs font-medium border">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Low Fuel
                        </Badge>
                      )}
                      {vehicle.status === 'in-transit' && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium border">
                          {vehicle.speed}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>Driver</span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {vehicle.driver?.name || 'No driver assigned'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span>Location</span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {vehicle.location}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Fuel className="h-4 w-4 text-slate-400" />
                        <span>Fuel Level</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getFuelLevelColor(vehicle.fuelLevel)}`}
                            style={{ width: `${vehicle.fuelLevel}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {vehicle.fuelLevel}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span>Last Update</span>
                      </div>
                      <p className="font-medium text-slate-900">
                        {vehicle.lastUpdate}
                      </p>
                    </div>
                  </div>

                  {vehicle.currentDelivery && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <p className="text-sm text-blue-800">
                          <strong>Current Delivery:</strong>{' '}
                          {vehicle.currentDelivery}
                        </p>
                        {vehicle.eta && (
                          <p className="text-sm text-blue-600 font-medium">
                            ETA: {vehicle.eta}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-600">
                    <span>
                      Mileage:{' '}
                      <span className="font-medium text-slate-900">
                        {vehicle.mileage}
                      </span>
                    </span>
                    <span>
                      Next Maintenance:{' '}
                      <span className="font-medium text-slate-900">
                        {vehicle.nextMaintenance}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-row space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 lg:ml-4">
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
                    Contact
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

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No vehicles found
          </h3>
          <p className="text-slate-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
