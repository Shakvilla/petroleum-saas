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
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{`${label} (${data.day})`}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                {entry.value.toLocaleString()}L
              </span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total</span>
              <span className="font-bold text-gray-900">
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
    <Card className="border-gray-100 hover:shadow-lg  hover:cursor-pointer bg-white">
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Fuel className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Inventory Trends
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                Fuel inventory levels and distribution over time
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Select defaultValue="7days">
              <SelectTrigger className="w-32 h-9 bg-white text-gray-500 border-gray-300">
                <Calendar className="w-4 h-4 mr-2" />
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
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Fuel Types</DropdownMenuItem>
                <DropdownMenuItem>Premium Only</DropdownMenuItem>
                <DropdownMenuItem>Regular Only</DropdownMenuItem>
                <DropdownMenuItem>Diesel Only</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {totalInventory.toLocaleString()}L
            </div>
            <div className="text-xs text-gray-600">Total Inventory</div>
          </div>
          <div className="text-center">
            <div
              className={`text-lg font-bold flex items-center justify-center ${
                isIncrease ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 mr-1 ${isIncrease ? '' : 'rotate-180'}`}
              />
              {changePercent}%
            </div>
            <div className="text-xs text-gray-600">Daily Change</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {fuelTypes
                .find(f => f.name === 'Premium Gasoline')
                ?.value.toLocaleString()}
              L
            </div>
            <div className="text-xs text-gray-600">Premium Gas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {fuelTypes
                .find(f => f.name === 'Regular Gasoline')
                ?.value.toLocaleString()}
              L
            </div>
            <div className="text-xs text-gray-600">Regular Gas</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px] sm:h-[350px] lg:h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                tickMargin={8}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={value => `${(value / 1000).toFixed(0)}K`}
              />

              <ChartTooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="kerosene"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#keroseneGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="diesel"
                stackId="1"
                stroke="#8B5CF6"
                fill="url(#dieselGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="premium"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#premiumGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="regular"
                stackId="1"
                stroke="#10B981"
                fill="url(#regularGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Enhanced Legend with Statistics */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {fuelTypes.map(fuel => (
              <div
                key={fuel.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: fuel.color }}
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {fuel.name.replace(' Gasoline', '')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {fuel.percentage}%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {(fuel.value / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-500">Liters</div>
                </div>
              </div>
            ))}
          </div>

          {/* Insights */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Inventory Insights
                </h4>
                <p className="text-xs text-blue-700">
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
