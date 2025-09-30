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
import { AlertTriangle, Fuel, Truck, Clock, X, Bell, Zap } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'critical',
    icon: AlertTriangle,
    title: 'Critical Tank Level',
    message:
      'Kerosene tank is at 23% capacity. Immediate refill required to avoid stockout.',
    time: '5 minutes ago',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 2,
    type: 'warning',
    icon: Truck,
    title: 'Delivery Delay Alert',
    message:
      'Truck #TK-045 is 2 hours behind schedule for Shell Station #42 delivery.',
    time: '1 hour ago',
    gradient: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    id: 3,
    type: 'info',
    icon: Fuel,
    title: 'Inventory Updated',
    message:
      'Premium gasoline delivery completed successfully. Tank level updated to 78%.',
    time: '3 hours ago',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 4,
    type: 'warning',
    icon: Clock,
    title: 'Maintenance Reminder',
    message:
      'Truck #TK-023 is due for scheduled maintenance in 2 days. Schedule service appointment.',
    time: '6 hours ago',
    gradient: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
];

export function ModernAlertsPanel() {
  return (
    <Card className="border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mr-3">
                <Bell className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              System Alerts
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Important notifications and system updates
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-red-100 text-red-800 text-xs"
            >
              <Zap className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">3 Critical</span>
              <span className="sm:hidden">3</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`group p-3 lg:p-4 rounded-2xl ${alert.bgColor} border ${alert.borderColor} hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start space-x-3 lg:space-x-4">
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${alert.gradient} shadow-lg flex-shrink-0`}
                >
                  <alert.icon className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate pr-2">
                      {alert.title}
                    </p>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge
                        variant={
                          alert.type === 'critical'
                            ? 'destructive'
                            : alert.type === 'warning'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={`text-xs ${
                          alert.type === 'critical'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : alert.type === 'warning'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                        }`}
                      >
                        <span className="hidden sm:inline">{alert.type}</span>
                        <span className="sm:hidden">
                          {alert.type.charAt(0).toUpperCase()}
                        </span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200/50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.time}
                    </span>
                    {alert.type === 'critical' && (
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white text-xs"
                      >
                        <span className="hidden sm:inline">Take Action</span>
                        <span className="sm:hidden">Action</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 lg:mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full hover:bg-gray-50 bg-transparent text-sm"
          >
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
