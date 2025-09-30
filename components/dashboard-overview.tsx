"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Fuel, TrendingUp, TrendingDown, Truck, DollarSign, AlertTriangle, BarChart3 } from "lucide-react"
import { InventoryChart } from "@/components/inventory-chart"
import { SalesChart } from "@/components/sales-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { AlertsPanel } from "@/components/alerts-panel"

interface DashboardOverviewProps {
  tenant: string
}

export function DashboardOverview({ tenant }: DashboardOverviewProps) {
  const stats = [
    {
      name: "Total Revenue",
      value: "$2,847,392",
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
    },
    {
      name: "Fuel Inventory",
      value: "847,293 L",
      change: "-2.3%",
      changeType: "decrease",
      icon: Fuel,
    },
    {
      name: "Active Deliveries",
      value: "23",
      change: "+5.2%",
      changeType: "increase",
      icon: Truck,
    },
    {
      name: "Daily Sales",
      value: "156,847 L",
      change: "+8.1%",
      changeType: "increase",
      icon: BarChart3,
    },
  ]

  const tankLevels = [
    { name: "Premium Gasoline", level: 78, capacity: 50000, current: 39000 },
    { name: "Regular Gasoline", level: 45, capacity: 75000, current: 33750 },
    { name: "Diesel", level: 92, capacity: 40000, current: 36800 },
    { name: "Kerosene", level: 23, capacity: 25000, current: 5750 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">{tenant} Petroleum Dashboard</h1>
          <p className="text-gray-600">Monitor your petroleum distribution operations in real-time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <AlertTriangle className="mr-2 h-4 w-4" />
            View Alerts
          </Button>
          <Button>Generate Report</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.changeType === "increase" ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.changeType === "increase" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tank Levels */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tank Levels</CardTitle>
            <CardDescription>Current fuel inventory levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tankLevels.map((tank) => (
              <div key={tank.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{tank.name}</span>
                  <span className="text-gray-500">
                    {tank.current.toLocaleString()}L / {tank.capacity.toLocaleString()}L
                  </span>
                </div>
                <Progress
                  value={tank.level}
                  className={`h-2 ${
                    tank.level < 30 ? "bg-red-100" : tank.level < 60 ? "bg-yellow-100" : "bg-green-100"
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{tank.level}% Full</span>
                  <Badge
                    variant={tank.level < 30 ? "destructive" : tank.level < 60 ? "secondary" : "default"}
                    className="text-xs"
                  >
                    {tank.level < 30 ? "Low" : tank.level < 60 ? "Medium" : "Good"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <InventoryChart />
          <SalesChart />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentTransactions />
        <AlertsPanel />
      </div>
    </div>
  )
}
