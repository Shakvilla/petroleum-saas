"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Clock, Fuel, DollarSign, Truck, Target, Zap } from "lucide-react"
import { useResponsive } from '@/components/responsive-provider'
import { cn } from '@/lib/utils'

// Mock analytics data
const deliveryPerformance = [
  { month: "Jan", deliveries: 245, onTime: 92, fuelCost: 1850 },
  { month: "Feb", deliveries: 268, onTime: 89, fuelCost: 2100 },
  { month: "Mar", deliveries: 290, onTime: 94, fuelCost: 2250 },
  { month: "Apr", deliveries: 312, onTime: 91, fuelCost: 2400 },
  { month: "May", deliveries: 298, onTime: 96, fuelCost: 2180 },
  { month: "Jun", deliveries: 325, onTime: 93, fuelCost: 2500 },
]

const fuelEfficiency = [
  { week: "Week 1", efficiency: 7.2, cost: 580 },
  { week: "Week 2", efficiency: 6.8, cost: 620 },
  { week: "Week 3", efficiency: 7.5, cost: 540 },
  { week: "Week 4", efficiency: 7.1, cost: 590 },
]

const routeDistribution = [
  { name: "Downtown", value: 35, color: "#3B82F6" },
  { name: "Suburban", value: 28, color: "#10B981" },
  { name: "Highway", value: 22, color: "#F59E0B" },
  { name: "Industrial", value: 15, color: "#EF4444" },
]

const kpis = [
  {
    title: "Average Delivery Time",
    value: "2.4 hours",
    change: -8,
    trend: "down",
    icon: Clock,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Fuel Efficiency",
    value: "7.2 L/100km",
    change: 5,
    trend: "up",
    icon: Fuel,
    color: "text-emerald-600",
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Cost per Delivery",
    value: "$24.50",
    change: -12,
    trend: "down",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Fleet Utilization",
    value: "85%",
    change: 3,
    trend: "up",
    icon: Truck,
    color: "text-emerald-600",
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
]

export function DistributionAnalytics() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className={cn(
      'space-y-6',
      isMobile ? 'space-y-4' : 'space-y-6'
    )}>
      {/* Responsive KPI Cards */}
      <div className={cn(
        'grid gap-4',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}>
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className="relative overflow-hidden bg-white border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0" />
            <CardContent className={cn(
              'relative',
              isMobile ? 'p-3' : 'p-4 sm:p-6'
            )}>
              <div className="flex items-center justify-between">
                <div className={cn(
                  'space-y-1',
                  isMobile ? 'space-y-0.5' : 'space-y-1'
                )}>
                  <p className={cn(
                    'font-medium text-slate-600',
                    isMobile ? 'text-xs' : 'text-xs sm:text-sm'
                  )}>
                    {kpi.title}
                  </p>
                  <p className={cn(
                    'font-bold text-slate-900',
                    isMobile ? 'text-lg' : 'text-xl sm:text-2xl'
                  )}>
                    {kpi.value}
                  </p>
                  <div className={cn(
                    'flex items-center',
                    isMobile ? 'space-x-1' : 'space-x-1'
                  )}>
                    {kpi.trend === "up" ? (
                      <TrendingUp className={cn(
                        'text-emerald-600',
                        isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'
                      )} />
                    ) : (
                      <TrendingDown className={cn(
                        'text-emerald-600',
                        isMobile ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'
                      )} />
                    )}
                    <span className={cn(
                      'font-medium',
                      isMobile ? 'text-xs' : 'text-xs sm:text-sm',
                      kpi.color
                    )}>
                      {Math.abs(kpi.change)}%
                    </span>
                    <span className={cn(
                      'text-slate-500',
                      isMobile ? 'text-xs' : 'text-xs'
                    )}>
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'rounded-full',
                  isMobile ? 'p-2' : 'p-2 sm:p-3',
                  kpi.bgColor
                )}>
                  <kpi.icon className={cn(
                    isMobile ? 'h-4 w-4' : 'h-4 w-4 sm:h-6 sm:w-6',
                    kpi.iconColor
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Responsive Charts Row */}
      <div className={cn(
        'grid gap-6',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'
      )}>
        {/* Delivery Performance */}
        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className={cn(
              'flex items-center',
              isMobile ? 'space-x-1.5' : 'space-x-2'
            )}>
              <Target className={cn(
                'text-blue-600',
                isMobile ? 'h-4 w-4' : 'h-5 w-5'
              )} />
              <span className={cn(
                isMobile ? 'text-base' : 'text-lg'
              )}>
                Delivery Performance
              </span>
            </CardTitle>
            <CardDescription className={cn(
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Monthly deliveries and on-time performance
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={isMobile ? 200 : isTablet ? 250 : 300}>
              <BarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    fontSize: isMobile ? 12 : 14,
                  }}
                />
                <Bar dataKey="deliveries" fill="#3B82F6" name="Deliveries" radius={[4, 4, 0, 0]} />
                <Bar dataKey="onTime" fill="#10B981" name="On-Time %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Route Distribution */}
        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className={cn(
              'flex items-center',
              isMobile ? 'space-x-1.5' : 'space-x-2'
            )}>
              <Zap className={cn(
                'text-blue-600',
                isMobile ? 'h-4 w-4' : 'h-5 w-5'
              )} />
              <span className={cn(
                isMobile ? 'text-base' : 'text-lg'
              )}>
                Route Distribution
              </span>
            </CardTitle>
            <CardDescription className={cn(
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Delivery distribution by route type
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={isMobile ? 200 : isTablet ? 250 : 300}>
                <PieChart>
                  <Pie
                    data={routeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={isMobile ? 40 : isTablet ? 50 : 60}
                    outerRadius={isMobile ? 80 : isTablet ? 100 : 120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {routeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontSize: isMobile ? 12 : 14,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className={cn(
              'grid gap-4 mt-4',
              isMobile ? 'grid-cols-1' : 'grid-cols-2'
            )}>
              {routeDistribution.map((route) => (
                <div key={route.name} className={cn(
                  'flex items-center',
                  isMobile ? 'space-x-2' : 'space-x-2'
                )}>
                  <div className={cn(
                    'rounded-full',
                    isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
                  )} style={{ backgroundColor: route.color }} />
                  <span className={cn(
                    'text-slate-600',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {route.name}
                  </span>
                  <span className={cn(
                    'font-medium text-slate-900',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {route.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Fuel Efficiency Trend */}
      <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0" />
        <CardHeader className="relative">
          <CardTitle className={cn(
            'flex items-center',
            isMobile ? 'space-x-1.5' : 'space-x-2'
          )}>
            <Fuel className={cn(
              'text-amber-600',
              isMobile ? 'h-4 w-4' : 'h-5 w-5'
            )} />
            <span className={cn(
              isMobile ? 'text-base' : 'text-lg'
            )}>
              Fuel Efficiency Trend
            </span>
          </CardTitle>
          <CardDescription className={cn(
            isMobile ? 'text-xs' : 'text-sm'
          )}>
            Weekly fuel consumption and cost analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={isMobile ? 200 : isTablet ? 250 : 300}>
            <LineChart data={fuelEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="week" 
                stroke="#64748b"
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: isMobile ? 12 : 14,
                }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3B82F6"
                strokeWidth={isMobile ? 2 : 3}
                name="L/100km"
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: isMobile ? 4 : 6 }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#10B981"
                strokeWidth={isMobile ? 2 : 3}
                name="Cost ($)"
                dot={{ fill: "#10B981", strokeWidth: 2, r: isMobile ? 4 : 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Responsive Performance Metrics */}
      <div className={cn(
        'grid gap-6',
        isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'
      )}>
        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className={cn(
              'flex items-center',
              isMobile ? 'space-x-1.5' : 'space-x-2'
            )}>
              <Target className={cn(
                'text-emerald-600',
                isMobile ? 'h-4 w-4' : 'h-5 w-5'
              )} />
              <span className={cn(
                isMobile ? 'text-base' : 'text-lg'
              )}>
                Route Efficiency
              </span>
            </CardTitle>
            <CardDescription className={cn(
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Performance by route type
            </CardDescription>
          </CardHeader>
          <CardContent className={cn(
            'relative',
            isMobile ? 'space-y-3' : 'space-y-4'
          )}>
            {[
              { route: "Downtown Circuit", efficiency: 92, deliveries: 45 },
              { route: "Highway Express", efficiency: 88, deliveries: 32 },
              { route: "Suburban Loop", efficiency: 85, deliveries: 28 },
              { route: "Industrial Zone", efficiency: 78, deliveries: 18 },
            ].map((route) => (
              <div key={route.route} className={cn(
                isMobile ? 'space-y-1.5' : 'space-y-2'
              )}>
                <div className="flex justify-between items-center">
                  <span className={cn(
                    'font-medium text-slate-900',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {route.route}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={cn(
                      'bg-white/50',
                      isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs'
                    )}>
                      {route.deliveries} deliveries
                    </Badge>
                    <span className={cn(
                      'font-medium text-slate-900',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      {route.efficiency}%
                    </span>
                  </div>
                </div>
                <div className={cn(
                  'w-full bg-slate-200 rounded-full',
                  isMobile ? 'h-1.5' : 'h-2'
                )}>
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${route.efficiency}%`,
                      height: isMobile ? '6px' : '8px'
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className={cn(
              'flex items-center',
              isMobile ? 'space-x-1.5' : 'space-x-2'
            )}>
              <Truck className={cn(
                'text-blue-600',
                isMobile ? 'h-4 w-4' : 'h-5 w-5'
              )} />
              <span className={cn(
                isMobile ? 'text-base' : 'text-lg'
              )}>
                Driver Performance
              </span>
            </CardTitle>
            <CardDescription className={cn(
              isMobile ? 'text-xs' : 'text-sm'
            )}>
              Top performing drivers this month
            </CardDescription>
          </CardHeader>
          <CardContent className={cn(
            'relative',
            isMobile ? 'space-y-3' : 'space-y-4'
          )}>
            {[
              { driver: "Sarah Wilson", score: 96, deliveries: 78 },
              { driver: "John Smith", score: 94, deliveries: 82 },
              { driver: "Mike Johnson", score: 91, deliveries: 75 },
              { driver: "Lisa Garcia", score: 89, deliveries: 68 },
            ].map((driver, index) => (
              <div key={driver.driver} className="flex items-center justify-between">
                <div className={cn(
                  'flex items-center',
                  isMobile ? 'space-x-2' : 'space-x-3'
                )}>
                  <div className={cn(
                    'bg-blue-100 rounded-full flex items-center justify-center',
                    isMobile ? 'w-6 h-6' : 'w-8 h-8'
                  )}>
                    <span className={cn(
                      'font-medium text-blue-600',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className={cn(
                      'font-medium text-slate-900',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      {driver.driver}
                    </p>
                    <p className={cn(
                      'text-slate-600',
                      isMobile ? 'text-xs' : 'text-sm'
                    )}>
                      {driver.deliveries} deliveries
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-medium text-slate-900',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    {driver.score}%
                  </p>
                  <p className={cn(
                    'text-slate-600',
                    isMobile ? 'text-xs' : 'text-sm'
                  )}>
                    Score
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
