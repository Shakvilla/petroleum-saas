'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Cpu,
  HardDrive,
  Clock,
} from 'lucide-react';
import { useMonitoring } from '@/lib/monitoring';
import { cn } from '@/lib/utils';

interface MonitoringDashboardProps {
  className?: string;
}

export function MonitoringDashboard({ className }: MonitoringDashboardProps) {
  const {
    getHealthChecks,
    getSystemMetrics,
    getAlerts,
    getActiveAlerts,
    createAlert,
    resolveAlert,
  } = useMonitoring();

  const [healthChecks, setHealthChecks] = useState(getHealthChecks());
  const [systemMetrics, setSystemMetrics] = useState(getSystemMetrics());
  const [alerts, setAlerts] = useState(getAlerts());
  const [activeAlerts, setActiveAlerts] = useState(getActiveAlerts());

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthChecks(getHealthChecks());
      setSystemMetrics(getSystemMetrics());
      setAlerts(getAlerts());
      setActiveAlerts(getActiveAlerts());
    }, 5000);

    return () => clearInterval(interval);
  }, [getHealthChecks, getSystemMetrics, getAlerts, getActiveAlerts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      healthy: 'default',
      degraded: 'secondary',
      unhealthy: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const latestMetrics = systemMetrics[systemMetrics.length - 1];
  const recentHealthChecks = healthChecks.slice(-5);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Monitoring</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setHealthChecks(getHealthChecks());
            setSystemMetrics(getSystemMetrics());
            setAlerts(getAlerts());
            setActiveAlerts(getActiveAlerts());
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* System Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  System Status
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(
                    recentHealthChecks.every(
                      check => check.status === 'healthy'
                    )
                      ? 'healthy'
                      : recentHealthChecks.some(
                            check => check.status === 'unhealthy'
                          )
                        ? 'unhealthy'
                        : 'degraded'
                  )}
                  <span className="text-2xl font-bold">
                    {recentHealthChecks.every(
                      check => check.status === 'healthy'
                    )
                      ? 'Healthy'
                      : recentHealthChecks.some(
                            check => check.status === 'unhealthy'
                          )
                        ? 'Unhealthy'
                        : 'Degraded'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {recentHealthChecks.length} checks running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {activeAlerts.filter(alert => alert.type === 'error').length}{' '}
                  errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Memory Usage
                </CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestMetrics?.memory.percentage.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(latestMetrics?.memory.used || 0)} /{' '}
                  {formatBytes(latestMetrics?.memory.total || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network</CardTitle>
                {latestMetrics?.network.online ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestMetrics?.network.online ? 'Online' : 'Offline'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestMetrics?.network.connectionType || 'Unknown'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Health Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentHealthChecks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="font-medium">{check.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(check.status)}
                      {check.duration && (
                        <span className="text-sm text-muted-foreground">
                          {formatDuration(check.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Check Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthChecks.map((check, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(check.status)}
                        <h3 className="font-semibold">{check.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(check.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(check.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    {check.message && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {check.message}
                      </p>
                    )}
                    {check.duration && (
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(check.duration)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={cn(
                      'border rounded-lg p-4',
                      alert.resolved ? 'opacity-60' : ''
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getAlertIcon(alert.type)}
                        <h3 className="font-semibold">{alert.title}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={alert.resolved ? 'secondary' : 'default'}
                        >
                          {alert.resolved ? 'Resolved' : 'Active'}
                        </Badge>
                        {!alert.resolved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.resolvedAt && (
                        <span>
                          Resolved:{' '}
                          {new Date(alert.resolvedAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemMetrics.slice(-10).map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">System Metrics</h3>
                      <span className="text-sm text-muted-foreground">
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium">Memory</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.memory.percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Network</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.network.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Session</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(metric.user.sessionDuration)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Page Views</p>
                        <p className="text-sm text-muted-foreground">
                          {metric.user.pageViews}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
