// Documentation: /docs/responsive-design/responsive-dashboard-grid.md

'use client';

import React from 'react';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';

interface ResponsiveDashboardGridProps {
  children: React.ReactNode;
  className?: string;
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ResponsiveDashboardCardProps {
  children: React.ReactNode;
  className?: string;
  mobileSpan?: number;
  tabletSpan?: number;
  desktopSpan?: number;
  priority?: 'high' | 'medium' | 'low';
}

interface ResponsiveDashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

// Main responsive dashboard grid component
export function ResponsiveDashboardGrid({
  children,
  className,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 'md'
}: ResponsiveDashboardGridProps) {
  const { isMobile, isTablet } = useResponsive();
  
  const getGridCols = () => {
    if (isMobile) return `grid-cols-${mobileCols}`;
    if (isTablet) return `grid-cols-${tabletCols}`;
    return `grid-cols-${desktopCols}`;
  };
  
  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return isMobile ? 'gap-3' : isTablet ? 'gap-4' : 'gap-4';
      case 'md':
        return isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-6';
      case 'lg':
        return isMobile ? 'gap-6' : isTablet ? 'gap-8' : 'gap-8';
      case 'xl':
        return isMobile ? 'gap-8' : isTablet ? 'gap-10' : 'gap-12';
      default:
        return isMobile ? 'gap-4' : isTablet ? 'gap-6' : 'gap-6';
    }
  };

  return (
    <div className={cn(
      'grid',
      getGridCols(),
      getGapClass(),
      className
    )}>
      {children}
    </div>
  );
}

// Responsive dashboard card component
export function ResponsiveDashboardCard({
  children,
  className,
  mobileSpan = 1,
  tabletSpan = 1,
  desktopSpan = 1,
  priority = 'medium'
}: ResponsiveDashboardCardProps) {
  const { isMobile, isTablet } = useResponsive();
  
  const getSpanClass = () => {
    if (isMobile) return `col-span-${mobileSpan}`;
    if (isTablet) return `col-span-${tabletSpan}`;
    return `col-span-${desktopSpan}`;
  };
  
  const getPriorityClass = () => {
    switch (priority) {
      case 'high':
        return 'order-first';
      case 'medium':
        return 'order-none';
      case 'low':
        return 'order-last';
      default:
        return 'order-none';
    }
  };

  return (
    <div className={cn(
      getSpanClass(),
      getPriorityClass(),
      className
    )}>
      {children}
    </div>
  );
}

// Responsive dashboard widget component
export function ResponsiveDashboardWidget({
  title,
  children,
  className,
  icon: Icon,
  actions,
  loading = false,
  error,
  onRetry
}: ResponsiveDashboardWidgetProps) {
  const { isMobile, isTablet } = useResponsive();
  
  if (loading) {
    return (
      <div className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6',
        className
      )}>
        <div className={cn(
          'flex items-center justify-between mb-4',
          isMobile ? 'mb-3' : 'mb-4'
        )}>
          <div className="flex items-center">
            {Icon && (
              <Icon className={cn(
                'text-gray-400',
                isMobile ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'
              )} />
            )}
            <h3 className={cn(
              'font-semibold text-gray-900',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {title}
            </h3>
          </div>
          {actions && (
            <div className={cn(
              isMobile ? 'scale-75' : 'scale-100'
            )}>
              {actions}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6',
        className
      )}>
        <div className={cn(
          'flex items-center justify-between mb-4',
          isMobile ? 'mb-3' : 'mb-4'
        )}>
          <div className="flex items-center">
            {Icon && (
              <Icon className={cn(
                'text-red-400',
                isMobile ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'
              )} />
            )}
            <h3 className={cn(
              'font-semibold text-gray-900',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {title}
            </h3>
          </div>
          {actions && (
            <div className={cn(
              isMobile ? 'scale-75' : 'scale-100'
            )}>
              {actions}
            </div>
          )}
        </div>
        <div className="text-center py-8">
          <p className={cn(
            'text-red-600 mb-4',
            isMobile ? 'text-sm' : 'text-base'
          )}>
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors',
                isMobile ? 'text-sm' : 'text-base'
              )}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow',
      isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6',
      className
    )}>
      <div className={cn(
        'flex items-center justify-between mb-4',
        isMobile ? 'mb-3' : 'mb-4'
      )}>
        <div className="flex items-center">
          {Icon && (
            <Icon className={cn(
              'text-blue-600',
              isMobile ? 'h-4 w-4 mr-2' : 'h-5 w-5 mr-3'
            )} />
          )}
          <h3 className={cn(
            'font-semibold text-gray-900',
            isMobile ? 'text-sm' : 'text-base'
          )}>
            {title}
          </h3>
        </div>
        {actions && (
          <div className={cn(
            isMobile ? 'scale-75' : 'scale-100'
          )}>
            {actions}
          </div>
        )}
      </div>
      <div className={cn(
        isMobile ? 'space-y-2' : 'space-y-3'
      )}>
        {children}
      </div>
    </div>
  );
}

// Responsive dashboard section component
export function ResponsiveDashboardSection({
  title,
  children,
  className,
  description,
  actions
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <div className={cn(
      'space-y-4',
      isMobile ? 'space-y-3' : 'space-y-4',
      className
    )}>
      <div className={cn(
        'flex items-center justify-between',
        isMobile && 'flex-col items-start space-y-2'
      )}>
        <div>
          <h2 className={cn(
            'font-bold text-gray-900',
            isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              'text-gray-600',
              isMobile ? 'text-sm' : 'text-base'
            )}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className={cn(
            isMobile ? 'w-full' : 'flex-shrink-0'
          )}>
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// Responsive dashboard metrics component
export function ResponsiveDashboardMetrics({
  metrics,
  className
}: {
  metrics: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}) {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <ResponsiveDashboardGrid
      mobileCols={2}
      tabletCols={2}
      desktopCols={4}
      gap="md"
      className={className}
    >
      {metrics.map((metric, index) => (
        <ResponsiveDashboardCard key={index}>
          <div className={cn(
            'bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow',
            isMobile ? 'p-3' : 'p-4'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className={cn(
                  'text-gray-600',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  {metric.label}
                </p>
                <p className={cn(
                  'font-bold text-gray-900',
                  isMobile ? 'text-lg' : 'text-xl'
                )}>
                  {metric.value}
                </p>
                {metric.change && (
                  <div className="flex items-center mt-1">
                    <span className={cn(
                      'text-xs font-medium',
                      metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' :
                      'text-gray-600'
                    )}>
                      {metric.change}
                    </span>
                  </div>
                )}
              </div>
              {metric.icon && (
                <metric.icon className={cn(
                  'text-gray-400',
                  isMobile ? 'h-5 w-5' : 'h-6 w-6'
                )} />
              )}
            </div>
          </div>
        </ResponsiveDashboardCard>
      ))}
    </ResponsiveDashboardGrid>
  );
}

// Responsive dashboard chart container
export function ResponsiveDashboardChart({
  title,
  children,
  className,
  height = 'auto'
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: 'auto' | 'sm' | 'md' | 'lg';
}) {
  const { isMobile, isTablet } = useResponsive();
  
  const getHeight = () => {
    if (height === 'auto') {
      return isMobile ? 'h-48' : isTablet ? 'h-64' : 'h-80';
    }
    
    switch (height) {
      case 'sm':
        return isMobile ? 'h-32' : isTablet ? 'h-40' : 'h-48';
      case 'md':
        return isMobile ? 'h-48' : isTablet ? 'h-64' : 'h-80';
      case 'lg':
        return isMobile ? 'h-64' : isTablet ? 'h-80' : 'h-96';
      default:
        return isMobile ? 'h-48' : isTablet ? 'h-64' : 'h-80';
    }
  };

  return (
    <ResponsiveDashboardCard>
      <div className={cn(
        'bg-white rounded-lg border border-gray-200 shadow-sm',
        isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6',
        className
      )}>
        <h3 className={cn(
          'font-semibold text-gray-900 mb-4',
          isMobile ? 'text-sm mb-3' : 'text-base mb-4'
        )}>
          {title}
        </h3>
        <div className={getHeight()}>
          {children}
        </div>
      </div>
    </ResponsiveDashboardCard>
  );
}
