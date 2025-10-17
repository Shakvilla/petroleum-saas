'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';

const data = [
  { date: 'Jan 1', sales: 125000, revenue: 187500 },
  { date: 'Jan 2', sales: 132000, revenue: 198000 },
  { date: 'Jan 3', sales: 128000, revenue: 192000 },
  { date: 'Jan 4', sales: 145000, revenue: 217500 },
  { date: 'Jan 5', sales: 139000, revenue: 208500 },
  { date: 'Jan 6', sales: 151000, revenue: 226500 },
  { date: 'Jan 7', sales: 156847, revenue: 235270 },
  { date: 'Jan 8', sales: 156847, revenue: 235280 },
  { date: 'Jan 9', sales: 156847, revenue: 235210 },
  { date: 'Jan 10', sales: 156847, revenue: 235670 },
  { date: 'Jan 11', sales: 156847, revenue: 2352270 },
  { date: 'Jan 12', sales: 156847, revenue: 235230 },
];

const chartConfig = {
  sales: {
    label: 'Sales Volume (L)',
    color: 'hsl(var(--chart-1))',
  },
  revenue: {
    label: 'Revenue ($)',
    color: 'hsl(var(--chart-2))',
  },
};

export function ModernSalesChart() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <Card className="border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white">
      <CardHeader className={cn(
        isMobile ? 'pb-3' : 'pb-4'
      )}>
        <div className={cn(
          'flex flex-col space-y-2',
          isMobile ? 'space-y-2' : isTablet ? 'space-y-2' : 'sm:flex-row sm:items-center sm:justify-between sm:space-y-0'
        )}>
          <div>
            <CardTitle className={cn(
              'font-bold text-gray-900 flex items-center',
              isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-lg lg:text-xl'
            )}>
              <div className={cn(
                'bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mr-3',
                isMobile ? 'p-1.5' : 'p-2'
              )}>
                <DollarSign className={cn(
                  'text-white',
                  isMobile ? 'h-3 w-3' : isTablet ? 'h-4 w-4' : 'h-4 w-4 lg:h-5 lg:w-5'
                )} />
              </div>
              Sales Performance
            </CardTitle>
            <CardDescription className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Daily sales volume and revenue trends
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={cn(
                'bg-emerald-100 text-emerald-800',
                isMobile ? 'text-xs px-2 py-1' : 'text-xs'
              )}
            >
              <TrendingUp className={cn(
                'mr-1',
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              )} />
              +8.1%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={cn(
            'w-full',
            isMobile ? 'h-[180px]' : isTablet ? 'h-[250px]' : 'h-[250px] sm:h-[300px] lg:h-[350px]'
          )}
        >
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={isMobile ? 4 : 8}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={isMobile ? 4 : 8}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="sales" 
              fill="var(--color-sales)" 
              radius={isMobile ? 4 : 8} 
            />
          </BarChart>
        </ChartContainer>

        {/* Responsive Stats */}
        <div className={cn(
          'grid gap-4 mt-6 pt-4 border-t border-gray-200',
          isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'
        )}>
          <div className="text-center">
            <div className={cn(
              'font-bold text-gray-900',
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl lg:text-2xl'
            )}>
              156.8K
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs lg:text-sm'
            )}>
              Today's Volume (L)
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-bold text-emerald-600',
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl lg:text-2xl'
            )}>
              $235.3K
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs lg:text-sm'
            )}>
              Today's Revenue
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-bold text-blue-600',
              isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl lg:text-2xl'
            )}>
              $1.50
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs lg:text-sm'
            )}>
              Avg Price/L
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
