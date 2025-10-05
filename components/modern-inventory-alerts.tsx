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
  AlertTriangle,
  Clock,
  CheckCircle,
  X,
  Bell,
  BellOff,
  Zap,
  Fuel,
  Shield,
} from 'lucide-react';

interface ModernInventoryAlertsProps {
  tenant: string;
}

export function ModernInventoryAlerts({ tenant }: ModernInventoryAlertsProps) {
  const alerts = [
    {
      id: 'ALT001',
      type: 'Critical',
      title: 'Kerosene Tank 1 - Critical Low Level',
      description:
        'Tank level has dropped below 20%. Immediate refill required to avoid stockout.',
      tank: 'T004',
      timestamp: '2 minutes ago',
      status: 'active',
      priority: 'critical',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-white to-gray-50',
      icon: AlertTriangle,
    },
    {
      id: 'ALT002',
      type: 'Warning',
      title: 'Regular Gasoline Tank 2 - Low Level Alert',
      description:
        'Tank level is at 21%. Schedule refill within 3 days to maintain operations.',
      tank: 'T002',
      timestamp: '15 minutes ago',
      status: 'active',
      priority: 'high',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-white to-gray-50',
      icon: Fuel,
    },
    {
      id: 'ALT003',
      type: 'Maintenance',
      title: 'Pressure Sensor Offline',
      description:
        'IoT sensor IOT003 has been offline for 2 hours. Check connection and battery status.',
      tank: 'T002',
      timestamp: '2 hours ago',
      status: 'active',
      priority: 'medium',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-white to-gray-50',
      icon: Zap,
    },
    {
      id: 'ALT004',
      type: 'Temperature',
      title: 'Temperature Anomaly Detected',
      description:
        'Tank T001 temperature reading outside normal range. Monitor for safety compliance.',
      tank: 'T001',
      timestamp: '3 hours ago',
      status: 'acknowledged',
      priority: 'medium',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-white to-gray-50',
      icon: Shield,
    },
    {
      id: 'ALT005',
      type: 'Security',
      title: 'Unauthorized Access Attempt',
      description:
        'Motion detected in restricted area after hours. Security team has been notified.',
      tank: 'N/A',
      timestamp: '5 hours ago',
      status: 'resolved',
      priority: 'high',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-white to-gray-50',
      icon: Shield,
    },
    {
      id: 'ALT006',
      type: 'System',
      title: 'Backup System Activated',
      description:
        'Primary monitoring system switched to backup due to scheduled maintenance.',
      tank: 'All',
      timestamp: '1 day ago',
      status: 'resolved',
      priority: 'low',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-white to-gray-50',
      icon: CheckCircle,
    },
  ];

  const alertStats = [
    {
      title: 'Active Alerts',
      value: '3',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-white to-gray-50',
      icon: AlertTriangle,
      description: 'Require immediate attention',
    },
    {
      title: 'Acknowledged',
      value: '1',
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-white to-gray-50',
      icon: Clock,
      description: 'Being addressed',
    },
    {
      title: 'Resolved Today',
      value: '2',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-white to-gray-50',
      icon: CheckCircle,
      description: 'Successfully handled',
    },
    {
      title: 'Response Time',
      value: '4.2m',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-white to-gray-50',
      icon: Zap,
      description: 'Average response time',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {alertStats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
            ></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>

            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-1.5 bg-gradient-to-br ${stat.gradient} rounded-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-3 w-3 text-white" />
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

      {/* Alerts List */}
      <Card className="border-gray-200  bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-1.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                <Bell className="h-3 w-3 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Alert Management Center
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Monitor and manage all system alerts and notifications
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Button
                variant="outline"
                className="bg-white/50 border-gray-200 hover:bg-white"
              >
                <BellOff className="h-4 w-4 mr-2" />
                Mute All
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {alerts.map(alert => (
            <Card
              key={alert.id}
              className="group relative overflow-hidden border-gray-200 bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${alert.bgGradient} opacity-30`}
              ></div>

              <CardContent className="relative p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`p-1.5 bg-gradient-to-br ${alert.gradient} rounded-sm shadow-lg flex-shrink-0`}
                    >
                      <alert.icon className="h-2.5 w-2.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {alert.title}
                        </h3>
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="font-medium">Tank: {alert.tank}</span>
                        <span>ID: {alert.id}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {alert.status === 'active' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/50 border-gray-200 hover:bg-white"
                        >
                          Acknowledge
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Configure Alert Rules
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Export Alert Log
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Zap className="h-4 w-4 mr-2" />
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
