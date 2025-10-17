import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/components/responsive-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface ResponsiveChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  height?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  showStats?: boolean;
  stats?: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const ResponsiveChartWrapper = React.forwardRef<
  HTMLDivElement,
  ResponsiveChartWrapperProps
>(({
  title,
  description,
  icon,
  badge,
  children,
  height = {
    mobile: 200,
    tablet: 250,
    desktop: 300,
  },
  showStats = false,
  stats = [],
  loading = false,
  error,
  className,
  ...props
}, ref) => {
  const { isMobile, isTablet } = useResponsive();

  const getChartHeight = () => {
    if (isMobile) return height.mobile || 200;
    if (isTablet) return height.tablet || 250;
    return height.desktop || 300;
  };

  const getResponsiveTextSize = (baseSize: string, mobileSize: string) => {
    return isMobile ? mobileSize : baseSize;
  };

  const getResponsiveIconSize = (baseSize: string, mobileSize: string) => {
    return isMobile ? mobileSize : baseSize;
  };

  if (loading) {
    return (
      <Card ref={ref} className={cn('border-gray-100 bg-white', className)} {...props}>
        <CardHeader className={cn(isMobile ? 'pb-3' : 'pb-4')}>
          <div className={cn(
            'flex flex-col space-y-2',
            isMobile ? 'space-y-2' : isTablet ? 'space-y-2' : 'sm:flex-row sm:items-center sm:justify-between sm:space-y-0'
          )}>
            <div>
              <div className="flex items-center space-x-3">
                <Skeleton className={cn(
                  'rounded-xl',
                  isMobile ? 'h-6 w-6' : 'h-8 w-8'
                )} />
                <Skeleton className={cn(
                  isMobile ? 'h-4 w-32' : 'h-5 w-40'
                )} />
              </div>
              <Skeleton className={cn(
                'mt-2',
                isMobile ? 'h-3 w-48' : 'h-4 w-56'
              )} />
            </div>
            {badge && (
              <Skeleton className={cn(
                isMobile ? 'h-6 w-16' : 'h-7 w-20'
              )} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton 
            className="w-full rounded-lg"
            style={{ height: `${getChartHeight()}px` }}
          />
          {showStats && (
            <div className={cn(
              'grid gap-4 mt-6 pt-4 border-t border-gray-200',
              isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
            )}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className={cn(
                    'mx-auto mb-1',
                    isMobile ? 'h-5 w-16' : 'h-6 w-20'
                  )} />
                  <Skeleton className={cn(
                    'mx-auto',
                    isMobile ? 'h-3 w-20' : 'h-4 w-24'
                  )} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card ref={ref} className={cn('border-red-200 bg-red-50', className)} {...props}>
        <CardHeader className={cn(isMobile ? 'pb-3' : 'pb-4')}>
          <CardTitle className={cn(
            'text-red-800',
            getResponsiveTextSize('text-lg lg:text-xl', 'text-base')
          )}>
            {title}
          </CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <p className="text-red-600 text-sm">Failed to load chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={ref} className={cn('border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white', className)} {...props}>
      <CardHeader className={cn(isMobile ? 'pb-3' : 'pb-4')}>
        <div className={cn(
          'flex flex-col space-y-2',
          isMobile ? 'space-y-2' : isTablet ? 'space-y-2' : 'sm:flex-row sm:items-center sm:justify-between sm:space-y-0'
        )}>
          <div>
            <CardTitle className={cn(
              'font-bold text-gray-900 flex items-center',
              getResponsiveTextSize('text-lg lg:text-xl', 'text-base')
            )}>
              {icon && (
                <div className={cn(
                  'rounded-xl mr-3',
                  isMobile ? 'p-1.5' : 'p-2'
                )}>
                  {React.cloneElement(icon as React.ReactElement, {
                    className: cn(
                      'text-white',
                      getResponsiveIconSize('h-4 w-4 lg:h-5 lg:w-5', 'h-3 w-3')
                    )
                  })}
                </div>
              )}
              {title}
            </CardTitle>
            {description && (
              <CardDescription className={cn(
                'text-gray-600',
                getResponsiveTextSize('text-sm', 'text-xs')
              )}>
                {description}
              </CardDescription>
            )}
          </div>
          {badge && (
            <div className="flex items-center space-x-2">
              {badge}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="w-full"
          style={{ height: `${getChartHeight()}px` }}
        >
          {children}
        </div>

        {showStats && stats.length > 0 && (
          <div className={cn(
            'grid gap-4 mt-6 pt-4 border-t border-gray-200',
            isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
          )}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={cn(
                  'font-bold',
                  getResponsiveTextSize('text-xl lg:text-2xl', 'text-lg'),
                  stat.color || 'text-gray-900'
                )}>
                  {stat.value}
                </div>
                <div className={cn(
                  'text-gray-600',
                  getResponsiveTextSize('text-xs lg:text-sm', 'text-xs')
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

ResponsiveChartWrapper.displayName = 'ResponsiveChartWrapper';

// Additional utility components for common chart patterns
export interface ResponsiveChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  height?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  loading?: boolean;
  error?: string;
}

export const ResponsiveChartContainer = React.forwardRef<
  HTMLDivElement,
  ResponsiveChartContainerProps
>(({
  children,
  height = {
    mobile: 200,
    tablet: 250,
    desktop: 300,
  },
  loading = false,
  error,
  className,
  ...props
}, ref) => {
  const { isMobile, isTablet } = useResponsive();

  const getChartHeight = () => {
    if (isMobile) return height.mobile || 200;
    if (isTablet) return height.tablet || 250;
    return height.desktop || 300;
  };

  if (loading) {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <Skeleton 
          className="w-full rounded-lg"
          style={{ height: `${getChartHeight()}px` }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div ref={ref} className={cn('w-full flex items-center justify-center py-8 bg-red-50 rounded-lg', className)} {...props}>
        <p className="text-red-600 text-sm">Failed to load chart data</p>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className={cn('w-full', className)} 
      style={{ height: `${getChartHeight()}px` }}
      {...props}
    >
      {children}
    </div>
  );
});

ResponsiveChartContainer.displayName = 'ResponsiveChartContainer';

// Hook for responsive chart configuration
export const useResponsiveChart = () => {
  const { isMobile, isTablet } = useResponsive();

  const getChartConfig = (config: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
  }) => {
    if (isMobile) return config.mobile || config.tablet || config.desktop;
    if (isTablet) return config.tablet || config.desktop;
    return config.desktop;
  };

  const getChartHeight = (heights: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  }) => {
    if (isMobile) return heights.mobile || 200;
    if (isTablet) return heights.tablet || 250;
    return heights.desktop || 300;
  };

  const getChartMargin = (margins: {
    mobile?: { top: number; right: number; left: number; bottom: number };
    tablet?: { top: number; right: number; left: number; bottom: number };
    desktop?: { top: number; right: number; left: number; bottom: number };
  }) => {
    if (isMobile) return margins.mobile || { top: 5, right: 10, left: 0, bottom: 0 };
    if (isTablet) return margins.tablet || { top: 8, right: 20, left: 0, bottom: 0 };
    return margins.desktop || { top: 10, right: 30, left: 0, bottom: 0 };
  };

  const getChartFontSize = (sizes: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  }) => {
    if (isMobile) return sizes.mobile || 10;
    if (isTablet) return sizes.tablet || 11;
    return sizes.desktop || 12;
  };

  const getChartStrokeWidth = (widths: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  }) => {
    if (isMobile) return widths.mobile || 1.5;
    if (isTablet) return widths.tablet || 2;
    return widths.desktop || 2.5;
  };

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    getChartConfig,
    getChartHeight,
    getChartMargin,
    getChartFontSize,
    getChartStrokeWidth,
  };
};
