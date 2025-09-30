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

const data = [
  { date: 'Jan 1', sales: 125000, revenue: 187500 },
  { date: 'Jan 2', sales: 132000, revenue: 198000 },
  { date: 'Jan 3', sales: 128000, revenue: 192000 },
  { date: 'Jan 4', sales: 145000, revenue: 217500 },
  { date: 'Jan 5', sales: 139000, revenue: 208500 },
  { date: 'Jan 6', sales: 151000, revenue: 226500 },
  { date: 'Jan 7', sales: 156847, revenue: 235270 },
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
  return (
    <Card className="border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mr-3">
                <DollarSign className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              Sales Performance
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Daily sales volume and revenue trends
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-800 text-xs"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.1%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[250px] sm:h-[300px] lg:h-[350px] w-full"
        >
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
          </BarChart>
        </ChartContainer>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl lg:text-2xl font-bold text-gray-900">
              156.8K
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              Today's Volume (L)
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl lg:text-2xl font-bold text-emerald-600">
              $235.3K
            </div>
            <div className="text-xs lg:text-sm text-gray-600">
              Today's Revenue
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl lg:text-2xl font-bold text-blue-600">
              $1.50
            </div>
            <div className="text-xs lg:text-sm text-gray-600">Avg Price/L</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
