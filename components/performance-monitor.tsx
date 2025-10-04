'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Clock,
  Zap,
  Eye,
  MousePointer,
  Wifi,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { useAnalytics } from '@/lib/analytics';
import { cn } from '@/lib/utils';

interface PerformanceMonitorProps {
  className?: string;
}

interface PerformanceData {
  timestamp: number;
  metrics: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
    ttfb?: number; // Time to First Byte
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    online: boolean;
    connectionType?: string;
    downlink?: number;
    rtt?: number;
  };
}

interface MonitoringDashboardProps {
  className?: string;
}

export function PerformanceMonitor({ className }: MonitoringDashboardProps) {
  // const { getPerformanceMetrics } = useAnalytics();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // const metrics = getPerformanceMetrics();
      const metrics: any[] = []; // Temporary placeholder
      const latest = metrics[metrics.length - 1];

      if (latest) {
        const data: PerformanceData = {
          timestamp: Date.now(),
          metrics: {
            fcp:
              latest.name === 'first_contentful_paint'
                ? latest.value
                : undefined,
            lcp:
              latest.name === 'largest_contentful_paint'
                ? latest.value
                : undefined,
            fid: latest.name === 'first_input_delay' ? latest.value : undefined,
            cls:
              latest.name === 'cumulative_layout_shift'
                ? latest.value
                : undefined,
            ttfb:
              latest.name === 'time_to_first_byte' ? latest.value : undefined,
          },
          memory: getMemoryInfo(),
          network: getNetworkInfo(),
        };

        setPerformanceData(prev => [...prev.slice(-19), data]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getMemoryInfo = () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
      };
    }
    return { used: 0, total: 0, percentage: 0 };
  };

  const getNetworkInfo = () => {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    return {
      online: navigator.onLine,
      connectionType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    };
  };

  const getPerformanceScore = (
    value: number,
    thresholds: { good: number; poor: number }
  ) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getScoreBadge = (score: string) => {
    const variants = {
      good: 'default',
      'needs-improvement': 'secondary',
      poor: 'destructive',
    } as const;

    return (
      <Badge variant={variants[score as keyof typeof variants] || 'default'}>
        {score.replace('-', ' ')}
      </Badge>
    );
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

  const latestData = performanceData[performanceData.length - 1];
  const memoryInfo = getMemoryInfo();
  const networkInfo = getNetworkInfo();

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Monitor</h2>
        <Badge variant={isMonitoring ? 'default' : 'secondary'}>
          {isMonitoring ? 'Monitoring' : 'Paused'}
        </Badge>
      </div>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              First Contentful Paint
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData?.metrics.fcp
                ? formatDuration(latestData.metrics.fcp)
                : 'N/A'}
            </div>
            {latestData?.metrics.fcp && (
              <div className="flex items-center space-x-2 mt-2">
                {getScoreBadge(
                  getPerformanceScore(latestData.metrics.fcp, {
                    good: 1800,
                    poor: 3000,
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Largest Contentful Paint
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData?.metrics.lcp
                ? formatDuration(latestData.metrics.lcp)
                : 'N/A'}
            </div>
            {latestData?.metrics.lcp && (
              <div className="flex items-center space-x-2 mt-2">
                {getScoreBadge(
                  getPerformanceScore(latestData.metrics.lcp, {
                    good: 2500,
                    poor: 4000,
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              First Input Delay
            </CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData?.metrics.fid
                ? formatDuration(latestData.metrics.fid)
                : 'N/A'}
            </div>
            {latestData?.metrics.fid && (
              <div className="flex items-center space-x-2 mt-2">
                {getScoreBadge(
                  getPerformanceScore(latestData.metrics.fid, {
                    good: 100,
                    poor: 300,
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cumulative Layout Shift
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestData?.metrics.cls
                ? latestData.metrics.cls.toFixed(3)
                : 'N/A'}
            </div>
            {latestData?.metrics.cls && (
              <div className="flex items-center space-x-2 mt-2">
                {getScoreBadge(
                  getPerformanceScore(latestData.metrics.cls, {
                    good: 0.1,
                    poor: 0.25,
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5" />
              <span>Memory Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Used Memory</span>
                  <span>{memoryInfo.percentage.toFixed(1)}%</span>
                </div>
                <Progress value={memoryInfo.percentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Used</p>
                  <p className="font-medium">{formatBytes(memoryInfo.used)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{formatBytes(memoryInfo.total)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Network Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection</span>
                <Badge variant={networkInfo.online ? 'default' : 'destructive'}>
                  {networkInfo.online ? 'Online' : 'Offline'}
                </Badge>
              </div>
              {networkInfo.connectionType && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Type</span>
                  <span className="text-sm font-medium">
                    {networkInfo.connectionType}
                  </span>
                </div>
              )}
              {networkInfo.downlink && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Downlink</span>
                  <span className="text-sm font-medium">
                    {networkInfo.downlink} Mbps
                  </span>
                </div>
              )}
              {networkInfo.rtt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">RTT</span>
                  <span className="text-sm font-medium">
                    {networkInfo.rtt}ms
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance History */}
      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.slice(-5).map((data, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Performance Snapshot</h3>
                  <span className="text-sm text-muted-foreground">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {data.metrics.fcp && (
                    <div>
                      <p className="text-muted-foreground">FCP</p>
                      <p className="font-medium">
                        {formatDuration(data.metrics.fcp)}
                      </p>
                    </div>
                  )}
                  {data.metrics.lcp && (
                    <div>
                      <p className="text-muted-foreground">LCP</p>
                      <p className="font-medium">
                        {formatDuration(data.metrics.lcp)}
                      </p>
                    </div>
                  )}
                  {data.metrics.fid && (
                    <div>
                      <p className="text-muted-foreground">FID</p>
                      <p className="font-medium">
                        {formatDuration(data.metrics.fid)}
                      </p>
                    </div>
                  )}
                  {data.metrics.cls && (
                    <div>
                      <p className="text-muted-foreground">CLS</p>
                      <p className="font-medium">
                        {data.metrics.cls.toFixed(3)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
