'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertTriangle,
  Droplets,
  Thermometer,
  Gauge,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Fuel,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModernTankOverviewProps {
  tenant: string;
  searchTerm: string;
}

export function ModernTankOverview({
  tenant,
  searchTerm,
}: ModernTankOverviewProps) {
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  const tanks = [
    {
      id: 'T001',
      name: 'Premium Gasoline Tank 1',
      type: 'Premium Gasoline',
      capacity: 50000,
      current: 42500,
      temperature: 18.5,
      pressure: 1.2,
      status: 'optimal',
      lastUpdated: '2 mins ago',
      trend: 'stable',
      efficiency: 94.2,
      alerts: 0,
      location: 'Bay A-1',
      supplier: 'PetroMax',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'T002',
      name: 'Regular Gasoline Tank 2',
      type: 'Regular Gasoline',
      capacity: 75000,
      current: 15750,
      temperature: 19.2,
      pressure: 1.1,
      status: 'low',
      lastUpdated: '1 min ago',
      trend: 'down',
      efficiency: 89.1,
      alerts: 2,
      location: 'Bay B-2',
      supplier: 'FuelCorp',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'T003',
      name: 'Diesel Tank 1',
      type: 'Diesel',
      capacity: 60000,
      current: 48000,
      temperature: 17.8,
      pressure: 1.3,
      status: 'optimal',
      lastUpdated: '3 mins ago',
      trend: 'up',
      efficiency: 96.7,
      alerts: 0,
      location: 'Bay C-1',
      supplier: 'DieselPlus',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'T004',
      name: 'Kerosene Tank 1',
      type: 'Kerosene',
      capacity: 40000,
      current: 8000,
      temperature: 18.9,
      pressure: 1.0,
      status: 'critical',
      lastUpdated: '30 secs ago',
      trend: 'down',
      efficiency: 78.3,
      alerts: 3,
      location: 'Bay D-1',
      supplier: 'KeroSupply',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'T005',
      name: 'Premium Diesel Tank 2',
      type: 'Premium Diesel',
      capacity: 55000,
      current: 44000,
      temperature: 18.1,
      pressure: 1.2,
      status: 'optimal',
      lastUpdated: '4 mins ago',
      trend: 'stable',
      efficiency: 92.8,
      alerts: 0,
      location: 'Bay E-1',
      supplier: 'PremiumFuel',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'T006',
      name: 'Heating Oil Tank 1',
      type: 'Heating Oil',
      capacity: 45000,
      current: 13500,
      temperature: 19.5,
      pressure: 1.1,
      status: 'low',
      lastUpdated: '2 mins ago',
      trend: 'down',
      efficiency: 85.4,
      alerts: 1,
      location: 'Bay F-1',
      supplier: 'HeatOil Co',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'bg-white',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
        );
      case 'down':
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />;
      default:
        return <div className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const filteredTanks = tanks.filter(tank => {
    const matchesSearch =
      tank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tank.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterBy === 'all' ||
      (filterBy === 'critical' && tank.status === 'critical') ||
      (filterBy === 'low' && tank.status === 'low') ||
      (filterBy === 'optimal' && tank.status === 'optimal');

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Controls - Mobile Optimized */}
      <Card className="border-200 backdrop-blur-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/50 border-gray-200 rounded-lg h-10 sm:h-12 text-sm sm:rounded-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="level">Fuel Level</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="efficiency">Efficiency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="bg-white/50 border-gray-200 rounded-lg sm:rounded-xl h-10 sm:h-12 text-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tanks</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="low">Low Level</SelectItem>
                  <SelectItem value="optimal">Optimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tank Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredTanks.map(tank => {
          const fillPercentage = (tank.current / tank.capacity) * 100;

          return (
            <Card
              key={tank.id}
              className="group relative overflow-hidden border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br bg-white ${tank.bgGradient} opacity-30`}
              ></div>
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10 sm:-translate-y-16 sm:translate-x-16"></div>

              <CardHeader className="relative pb-2 sm:pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`p-1.5 sm:p-2 bg-gradient-to-br ${tank.gradient} rounded-lg sm:rounded-xl shadow-lg flex-shrink-0`}
                      >
                        <Fuel className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                          {tank.name}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {tank.id} • {tank.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <Badge className={`${getStatusColor(tank.status)} text-xs`}>
                      {tank.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                        <DropdownMenuItem>Download Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Maintenance Mode
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                {/* Fuel Level with Modern Progress */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Fuel Level
                    </span>
                    <div className="flex items-center gap-1 sm:gap-2">
                      {getTrendIcon(tank.trend)}
                      <span className="text-sm sm:text-lg font-bold text-gray-900">
                        {fillPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${tank.gradient} transition-all duration-1000 ease-out rounded-full`}
                        style={{ width: `${fillPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                    <span>{tank.current.toLocaleString()}L</span>
                    <span>{tank.capacity.toLocaleString()}L</span>
                  </div>
                </div>

                {/* Metrics Grid - Responsive */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Thermometer className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      <span className="text-xs font-medium text-gray-600">
                        Temperature
                      </span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">
                      {tank.temperature}°C
                    </p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-600">
                        Pressure
                      </span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">
                      {tank.pressure} bar
                    </p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
                      <span className="text-xs font-medium text-gray-600">
                        Efficiency
                      </span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">
                      {tank.efficiency}%
                    </p>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                      <span className="text-xs font-medium text-gray-600">
                        Alerts
                      </span>
                    </div>
                    <p className="text-sm sm:text-lg font-bold text-gray-900">
                      {tank.alerts}
                    </p>
                  </div>
                </div>

                {/* Additional Info - Mobile Optimized */}
                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Supplier:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {tank.supplier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Product:</span>
                    <span className="font-medium text-gray-900 truncate ml-2">
                      {tank.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Updated {tank.lastUpdated}</span>
                  </div>
                </div>

                {/* Alert Banner */}
                {tank.alerts > 0 && (
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg sm:rounded-xl">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-orange-800">
                        {tank.alerts} active alert{tank.alerts > 1 ? 's' : ''} -
                        Requires attention
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTanks.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 sm:p-12 text-center">
            <Droplets className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              No tanks found
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
