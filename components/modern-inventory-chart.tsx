'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Fuel,
  Calendar,
  Filter,
  Download,
  Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResponsive } from '@/components/responsive-provider';
import { cn } from '@/lib/utils';

const data = [
  {
    date: 'Jan 1',
    premium: 45000,
    regular: 67000,
    diesel: 34000,
    kerosene: 12000,
    total: 158000,
    day: 'Monday',
  },
  {
    date: 'Jan 2',
    premium: 43000,
    regular: 65000,
    diesel: 35000,
    kerosene: 11500,
    total: 154500,
    day: 'Tuesday',
  },
  {
    date: 'Jan 3',
    premium: 41000,
    regular: 63000,
    diesel: 36000,
    kerosene: 11000,
    total: 151000,
    day: 'Wednesday',
  },
  {
    date: 'Jan 4',
    premium: 39000,
    regular: 61000,
    diesel: 37000,
    kerosene: 10500,
    total: 147500,
    day: 'Thursday',
  },
  {
    date: 'Jan 5',
    premium: 42000,
    regular: 64000,
    diesel: 35000,
    kerosene: 11200,
    total: 152200,
    day: 'Friday',
  },
  {
    date: 'Jan 6',
    premium: 44000,
    regular: 66000,
    diesel: 36000,
    kerosene: 11800,
    total: 157800,
    day: 'Saturday',
  },
  {
    date: 'Jan 7',
    premium: 39000,
    regular: 33750,
    diesel: 36800,
    kerosene: 10200,
    total: 119750,
    day: 'Sunday',
  },
];

const chartConfig = {
  premium: {
    label: 'Premium Gasoline',
    color: '#3B82F6',
  },
  regular: {
    label: 'Regular Gasoline',
    color: '#10B981',
  },
  diesel: {
    label: 'Diesel',
    color: '#8B5CF6',
  },
  kerosene: {
    label: 'Kerosene',
    color: '#F59E0B',
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  const { isMobile } = useResponsive();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={cn(
        'bg-white rounded-xl shadow-lg border border-gray-200',
        isMobile ? 'p-3' : 'p-4'
      )}>
        <p className={cn(
          'font-semibold text-gray-900 mb-2',
          isMobile ? 'text-sm' : 'text-base'
        )}>
          {`${label} (${data.day})`}
        </p>
        <div className={cn(
          isMobile ? 'space-y-1.5' : 'space-y-2'
        )}>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between',
                isMobile ? 'space-x-2' : 'space-x-4'
              )}
            >
              <div className={cn(
                'flex items-center',
                isMobile ? 'space-x-1.5' : 'space-x-2'
              )}>
                <div
                  className={cn(
                    'rounded-full',
                    isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
                  )}
                  style={{ backgroundColor: entry.color }}
                />
                <span className={cn(
                  'text-gray-600',
                  isMobile ? 'text-xs' : 'text-sm'
                )}>
                  {entry.name}
                </span>
              </div>
              <span className={cn(
                'font-medium text-gray-900',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                {entry.value.toLocaleString()}L
              </span>
            </div>
          ))}
          <div className={cn(
            'border-t pt-2 mt-2',
            isMobile ? 'pt-1.5 mt-1.5' : 'pt-2 mt-2'
          )}>
            <div className="flex items-center justify-between">
              <span className={cn(
                'font-medium text-gray-700',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                Total
              </span>
              <span className={cn(
                'font-bold text-gray-900',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                {data.total.toLocaleString()}L
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ModernInventoryChart() {
  const { isMobile, isTablet } = useResponsive();
  const totalInventory = data[data.length - 1].total;
  const previousTotal = data[data.length - 2].total;
  const changePercent = (
    ((totalInventory - previousTotal) / previousTotal) *
    100
  ).toFixed(1);
  const isIncrease = totalInventory > previousTotal;

  const fuelTypes = [
    {
      name: 'Premium Gasoline',
      value: data[data.length - 1].premium,
      color: '#3B82F6',
      percentage: (
        (data[data.length - 1].premium / totalInventory) *
        100
      ).toFixed(1),
    },
    {
      name: 'Regular Gasoline',
      value: data[data.length - 1].regular,
      color: '#10B981',
      percentage: (
        (data[data.length - 1].regular / totalInventory) *
        100
      ).toFixed(1),
    },
    {
      name: 'Diesel',
      value: data[data.length - 1].diesel,
      color: '#8B5CF6',
      percentage: (
        (data[data.length - 1].diesel / totalInventory) *
        100
      ).toFixed(1),
    },
    {
      name: 'Kerosene',
      value: data[data.length - 1].kerosene,
      color: '#F59E0B',
      percentage: (
        (data[data.length - 1].kerosene / totalInventory) *
        100
      ).toFixed(1),
    },
  ];

  return (
    <Card className="border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white">
      <CardHeader className={cn(
        isMobile ? 'pb-3' : 'pb-4'
      )}>
        <div className={cn(
          'flex flex-col space-y-4',
          isMobile ? 'space-y-3' : isTablet ? 'space-y-4' : 'lg:flex-row lg:items-center lg:justify-between lg:space-y-0'
        )}>
          <div className={cn(
            'flex items-center',
            isMobile ? 'space-x-2' : 'space-x-3'
          )}>
            <div className={cn(
              'bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg',
              isMobile ? 'p-1.5' : 'p-2'
            )}>
              <Fuel className={cn(
                'text-white',
                isMobile ? 'h-4 w-4' : 'h-5 w-5'
              )} />
            </div>
            <div>
              <CardTitle className={cn(
                'font-bold text-gray-900',
                isMobile ? 'text-lg' : 'text-xl'
              )}>
                Inventory Trends
              </CardTitle>
              <CardDescription className={cn(
                'text-gray-600',
                isMobile ? 'text-xs' : 'text-sm'
              )}>
                Fuel inventory levels and distribution over time
              </CardDescription>
            </div>
          </div>

          <div className={cn(
            'flex items-center',
            isMobile ? 'flex-wrap gap-2' : isTablet ? 'space-x-2' : 'space-x-2'
          )}>
            <Select defaultValue="7days">
              <SelectTrigger className={cn(
                'bg-white text-gray-500 border-gray-300',
                isMobile ? 'w-28 h-8' : isTablet ? 'w-32 h-9' : 'w-32 h-9'
              )}>
                <Calendar className={cn(
                  'mr-2',
                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                )} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size={isMobile ? 'sm' : 'sm'}>
                  <Filter className={cn(
                    'mr-2',
                    isMobile ? 'w-3 h-3' : 'w-4 h-4'
                  )} />
                  {isMobile ? 'Filter' : 'Filter'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Fuel Types</DropdownMenuItem>
                <DropdownMenuItem>Premium Only</DropdownMenuItem>
                <DropdownMenuItem>Regular Only</DropdownMenuItem>
                <DropdownMenuItem>Diesel Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size={isMobile ? 'sm' : 'sm'}>
              <Download className={cn(
                'mr-2',
                isMobile ? 'w-3 h-3' : 'w-4 h-4'
              )} />
              {isMobile ? 'Export' : 'Export'}
            </Button>

            <Button variant="outline" size={isMobile ? 'sm' : 'sm'}>
              <Maximize2 className={cn(
                isMobile ? 'w-3 h-3' : 'w-4 h-4'
              )} />
            </Button>
          </div>
        </div>

        {/* Responsive Summary Stats */}
        <div className={cn(
          'grid gap-4 mt-4 p-4 bg-gray-50 rounded-xl',
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          <div className="text-center">
            <div className={cn(
              'font-bold text-gray-900',
              isMobile ? 'text-base' : 'text-lg'
            )}>
              {totalInventory.toLocaleString()}L
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs'
            )}>
              Total Inventory
            </div>
          </div>
          <div className="text-center">
            <div
              className={cn(
                'font-bold flex items-center justify-center',
                isMobile ? 'text-base' : 'text-lg',
                isIncrease ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              <TrendingUp
                className={cn(
                  'mr-1',
                  isMobile ? 'w-3 h-3' : 'w-4 h-4',
                  isIncrease ? '' : 'rotate-180'
                )}
              />
              {changePercent}%
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs'
            )}>
              Daily Change
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-bold text-blue-600',
              isMobile ? 'text-base' : 'text-lg'
            )}>
              {fuelTypes
                .find(f => f.name === 'Premium Gasoline')
                ?.value.toLocaleString()}
              L
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs'
            )}>
              Premium Gas
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              'font-bold text-green-600',
              isMobile ? 'text-base' : 'text-lg'
            )}>
              {fuelTypes
                .find(f => f.name === 'Regular Gasoline')
                ?.value.toLocaleString()}
              L
            </div>
            <div className={cn(
              'text-gray-600',
              isMobile ? 'text-xs' : 'text-xs'
            )}>
              Regular Gas
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={cn(
            'w-full',
            isMobile ? 'h-[200px]' : isTablet ? 'h-[300px]' : 'h-[300px] sm:h-[350px] lg:h-[400px]'
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={
                isMobile ? { top: 5, right: 10, left: 0, bottom: 0 } : 
                isTablet ? { top: 8, right: 20, left: 0, bottom: 0 } : 
                { top: 10, right: 30, left: 0, bottom: 0 }
              }
            >
              <defs>
                <linearGradient
                  id="premiumGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="regularGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="dieselGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient
                  id="keroseneGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={isMobile ? 4 : 8}
                tick={{ 
                  fill: '#6B7280', 
                  fontSize: isMobile ? 10 : 12 
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={isMobile ? 4 : 8}
                tick={{ 
                  fill: '#6B7280', 
                  fontSize: isMobile ? 10 : 12 
                }}
                tickFormatter={value => `${(value / 1000).toFixed(0)}K`}
              />

              <ChartTooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="kerosene"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#keroseneGradient)"
                strokeWidth={isMobile ? 1.5 : 2}
              />
              <Area
                type="monotone"
                dataKey="diesel"
                stackId="1"
                stroke="#8B5CF6"
                fill="url(#dieselGradient)"
                strokeWidth={isMobile ? 1.5 : 2}
              />
              <Area
                type="monotone"
                dataKey="premium"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#premiumGradient)"
                strokeWidth={isMobile ? 1.5 : 2}
              />
              <Area
                type="monotone"
                dataKey="regular"
                stackId="1"
                stroke="#10B981"
                fill="url(#regularGradient)"
                strokeWidth={isMobile ? 1.5 : 2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Responsive Legend with Statistics */}
        <div className={cn(
          'space-y-4',
          isMobile ? 'mt-4' : 'mt-6'
        )}>
          <div className={cn(
            'grid gap-4',
            isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'
          )}>
            {fuelTypes.map(fuel => (
              <div
                key={fuel.name}
                className={cn(
                  'flex items-center justify-between bg-gray-50 rounded-lg',
                  isMobile ? 'p-2.5' : 'p-3'
                )}
              >
                <div className={cn(
                  'flex items-center',
                  isMobile ? 'space-x-1.5' : 'space-x-2'
                )}>
                  <div
                    className={cn(
                      'rounded-full',
                      isMobile ? 'w-3 h-3' : 'w-4 h-4'
                    )}
                    style={{ backgroundColor: fuel.color }}
                  />
                  <div>
                    <div className={cn(
                      'font-medium text-gray-900 truncate',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      {fuel.name.replace(' Gasoline', '')}
                    </div>
                    <div className={cn(
                      'text-gray-500',
                      isMobile ? 'text-xs' : 'text-xs'
                    )}>
                      {fuel.percentage}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    'font-bold text-gray-900',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {(fuel.value / 1000).toFixed(0)}K
                  </div>
                  <div className={cn(
                    'text-gray-500',
                    isMobile ? 'text-xs' : 'text-xs'
                  )}>
                    Liters
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Responsive Insights */}
          <div className={cn(
            'bg-blue-50 rounded-xl border border-blue-200',
            isMobile ? 'p-3' : 'p-4'
          )}>
            <div className={cn(
              'flex items-start',
              isMobile ? 'space-x-2' : 'space-x-3'
            )}>
              <div className={cn(
                'bg-blue-100 rounded-lg',
                isMobile ? 'p-1' : 'p-1'
              )}>
                <TrendingUp className={cn(
                  'text-blue-600',
                  isMobile ? 'w-3 h-3' : 'w-4 h-4'
                )} />
              </div>
              <div>
                <h4 className={cn(
                  'font-semibold text-blue-900',
                  isMobile ? 'text-xs mb-1' : 'text-sm mb-1'
                )}>
                  Inventory Insights
                </h4>
                <p className={cn(
                  'text-blue-700',
                  isMobile ? 'text-xs' : 'text-xs'
                )}>
                  Regular gasoline shows significant decrease on Jan 7. Consider
                  scheduling refill. Premium gasoline levels are stable. Diesel
                  inventory is performing well above average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
