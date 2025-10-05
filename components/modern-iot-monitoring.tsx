'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Wifi,
  WifiOff,
  Activity,
  Thermometer,
  Gauge,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Zap,
  Radio,
} from 'lucide-react';

interface ModernIoTMonitoringProps {
  tenant: string;
}

export function ModernIoTMonitoring({ tenant }: ModernIoTMonitoringProps) {
  const sensors = [
    {
      id: 'IOT001',
      name: 'Tank T001 Level Sensor',
      type: 'Level',
      status: 'online',
      value: '85.2',
      unit: '%',
      lastUpdate: '30 secs ago',
      battery: 87,
      signal: 95,
      alerts: 0,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'IOT002',
      name: 'Tank T001 Temperature Sensor',
      type: 'Temperature',
      status: 'online',
      value: '18.5',
      unit: '°C',
      lastUpdate: '45 secs ago',
      battery: 92,
      signal: 88,
      alerts: 0,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'IOT003',
      name: 'Tank T002 Pressure Sensor',
      type: 'Pressure',
      status: 'offline',
      value: 'N/A',
      unit: 'bar',
      lastUpdate: '2 hours ago',
      battery: 23,
      signal: 0,
      alerts: 2,
      gradient: 'from-gray-500 to-gray-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'IOT004',
      name: 'Tank T003 Flow Sensor',
      type: 'Flow',
      status: 'online',
      value: '245.8',
      unit: 'L/min',
      lastUpdate: '15 secs ago',
      battery: 78,
      signal: 92,
      alerts: 0,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'IOT005',
      name: 'Environmental Sensor',
      type: 'Environment',
      status: 'warning',
      value: 'Normal',
      unit: '',
      lastUpdate: '1 min ago',
      battery: 45,
      signal: 76,
      alerts: 1,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'bg-white',
    },
    {
      id: 'IOT006',
      name: 'Security Motion Sensor',
      type: 'Security',
      status: 'online',
      value: 'No Motion',
      unit: '',
      lastUpdate: '10 secs ago',
      battery: 95,
      signal: 98,
      alerts: 0,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-white',
    },
  ];

  const networkStats = [
    {
      title: 'Total Sensors',
      value: '24',
      status: 'online',
      icon: Activity,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-white',
      description: 'IoT devices deployed',
    },
    {
      title: 'Online Sensors',
      value: '22',
      status: 'active',
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'bg-white',
      description: 'Currently active',
    },
    {
      title: 'Offline Sensors',
      value: '2',
      status: 'offline',
      icon: WifiOff,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'bg-white',
      description: 'Need attention',
    },
    {
      title: 'Network Health',
      value: '98%',
      status: 'excellent',
      icon: Radio,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'bg-white',
      description: 'Overall uptime',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-emerald-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'Level':
        return <Droplets className="h-5 w-5 text-white" />;
      case 'Temperature':
        return <Thermometer className="h-5 w-5 text-white" />;
      case 'Pressure':
        return <Gauge className="h-5 w-5 text-white" />;
      case 'Flow':
        return <Activity className="h-5 w-5 text-white" />;
      default:
        return <Zap className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {networkStats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
            ></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>

            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sensors.map(sensor => (
          <Card
            key={sensor.id}
            className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${sensor.bgGradient} opacity-30`}
            ></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>

            <CardHeader className="relative pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 bg-gradient-to-br ${sensor.gradient} rounded-xl shadow-lg`}
                    >
                      {getSensorIcon(sensor.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {sensor.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {sensor.type} • {sensor.id}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(sensor.status)}>
                    {sensor.status}
                  </Badge>
                  {getStatusIcon(sensor.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative space-y-6">
              {/* Current Reading */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Current Reading
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      {sensor.value}
                    </span>
                    {sensor.unit && (
                      <span className="text-sm text-gray-500 ml-1">
                        {sensor.unit}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Battery
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {sensor.battery}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          sensor.battery > 70
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : sensor.battery > 30
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${sensor.battery}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">
                      Signal
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {sensor.signal}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out rounded-full ${
                          sensor.signal > 70
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                            : sensor.signal > 30
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${sensor.signal}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {sensor.alerts > 0 && (
                <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      {sensor.alerts} active alert{sensor.alerts > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Last updated: {sensor.lastUpdate}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Panel */}
      <Card className="border-gray-200  bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                IoT Network Control Center
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Manage and monitor your entire sensor network
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg">
              <Activity className="h-4 w-4 mr-2" />
              Refresh All Sensors
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Configure Alerts
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Network Diagnostics
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Activity className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
