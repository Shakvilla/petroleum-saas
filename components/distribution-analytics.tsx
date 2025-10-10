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
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.title}
            className="relative overflow-hidden bg-white  border-gray-200  hover:shadow-lg cursor-pointer transition-all duration-300"
          >
            <div className="absolute inset-0 " />
            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600">{kpi.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{kpi.value}</p>
                  <div className="flex items-center space-x-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${kpi.color}`}>{Math.abs(kpi.change)}%</span>
                    <span className="text-xs text-slate-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 ${kpi.bgColor} rounded-full`}>
                  <kpi.icon className={`h-4 w-4 sm:h-6 sm:w-6 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Delivery Performance */}
        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Delivery Performance</span>
            </CardTitle>
            <CardDescription>Monthly deliveries and on-time performance</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>Route Distribution</span>
            </CardTitle>
            <CardDescription>Delivery distribution by route type</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={routeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
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
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {routeDistribution.map((route) => (
                <div key={route.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                  <span className="text-sm text-slate-600">{route.name}</span>
                  <span className="text-sm font-medium text-slate-900">{route.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fuel Efficiency Trend */}
      <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <Fuel className="h-5 w-5 text-amber-600" />
            <span>Fuel Efficiency Trend</span>
          </CardTitle>
          <CardDescription>Weekly fuel consumption and cost analysis</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={fuelEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#3B82F6"
                strokeWidth={3}
                name="L/100km"
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#10B981"
                strokeWidth={3}
                name="Cost ($)"
                dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <span>Route Efficiency</span>
            </CardTitle>
            <CardDescription>Performance by route type</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {[
              { route: "Downtown Circuit", efficiency: 92, deliveries: 45 },
              { route: "Highway Express", efficiency: 88, deliveries: 32 },
              { route: "Suburban Loop", efficiency: 85, deliveries: 28 },
              { route: "Industrial Zone", efficiency: 78, deliveries: 18 },
            ].map((route) => (
              <div key={route.route} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">{route.route}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-white/50 text-xs">
                      {route.deliveries} deliveries
                    </Badge>
                    <span className="text-sm font-medium text-slate-900">{route.efficiency}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${route.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Driver Performance</span>
            </CardTitle>
            <CardDescription>Top performing drivers this month</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {[
              { driver: "Sarah Wilson", score: 96, deliveries: 78 },
              { driver: "John Smith", score: 94, deliveries: 82 },
              { driver: "Mike Johnson", score: 91, deliveries: 75 },
              { driver: "Lisa Garcia", score: 89, deliveries: 68 },
            ].map((driver, index) => (
              <div key={driver.driver} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{driver.driver}</p>
                    <p className="text-sm text-slate-600">{driver.deliveries} deliveries</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{driver.score}%</p>
                  <p className="text-sm text-slate-600">Score</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
