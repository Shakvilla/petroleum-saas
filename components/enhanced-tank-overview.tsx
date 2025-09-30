"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Droplets, Thermometer, Gauge, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EnhancedTankOverviewProps {
  tenant: string
}

export function EnhancedTankOverview({ tenant }: EnhancedTankOverviewProps) {
  const tanks = [
    {
      id: "T001",
      name: "Premium Gasoline Tank 1",
      type: "Premium Gasoline",
      capacity: 50000,
      current: 42500,
      temperature: 18.5,
      pressure: 1.2,
      status: "Normal",
      lastUpdated: "2 mins ago",
      trend: "stable",
      efficiency: 94.2,
      alerts: 0,
    },
    {
      id: "T002",
      name: "Regular Gasoline Tank 2",
      type: "Regular Gasoline",
      capacity: 75000,
      current: 15750,
      temperature: 19.2,
      pressure: 1.1,
      status: "Low",
      lastUpdated: "1 min ago",
      trend: "down",
      efficiency: 89.1,
      alerts: 2,
    },
    {
      id: "T003",
      name: "Diesel Tank 1",
      type: "Diesel",
      capacity: 60000,
      current: 48000,
      temperature: 17.8,
      pressure: 1.3,
      status: "Normal",
      lastUpdated: "3 mins ago",
      trend: "up",
      efficiency: 96.7,
      alerts: 0,
    },
    {
      id: "T004",
      name: "Kerosene Tank 1",
      type: "Kerosene",
      capacity: 40000,
      current: 8000,
      temperature: 18.9,
      pressure: 1.0,
      status: "Critical",
      lastUpdated: "30 secs ago",
      trend: "down",
      efficiency: 78.3,
      alerts: 3,
    },
    {
      id: "T005",
      name: "Premium Diesel Tank 2",
      type: "Premium Diesel",
      capacity: 55000,
      current: 44000,
      temperature: 18.1,
      pressure: 1.2,
      status: "Normal",
      lastUpdated: "4 mins ago",
      trend: "stable",
      efficiency: 92.8,
      alerts: 0,
    },
    {
      id: "T006",
      name: "Heating Oil Tank 1",
      type: "Heating Oil",
      capacity: 45000,
      current: 13500,
      temperature: 19.5,
      pressure: 1.1,
      status: "Low",
      lastUpdated: "2 mins ago",
      trend: "down",
      efficiency: 85.4,
      alerts: 1,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800"
      case "Low":
        return "bg-yellow-100 text-yellow-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {tanks.map((tank) => {
          const fillPercentage = (tank.current / tank.capacity) * 100

          return (
            <Card key={tank.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{tank.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {tank.type} • ID: {tank.id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className={getStatusColor(tank.status)}>
                      {tank.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Tank</DropdownMenuItem>
                        <DropdownMenuItem>Download Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Maintenance Mode</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Fuel Level */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(tank.trend)}
                      <span className="text-sm font-semibold text-gray-900">{fillPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <Progress value={fillPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{tank.current.toLocaleString()}L</span>
                    <span>{tank.capacity.toLocaleString()}L</span>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-gray-600">Temperature</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{tank.temperature}°C</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Gauge className="h-4 w-4 text-green-500" />
                      <span className="text-xs font-medium text-gray-600">Pressure</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{tank.pressure} bar</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Droplets className="h-4 w-4 text-purple-500" />
                      <span className="text-xs font-medium text-gray-600">Efficiency</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{tank.efficiency}%</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-xs font-medium text-gray-600">Alerts</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{tank.alerts}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">Last updated: {tank.lastUpdated}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
