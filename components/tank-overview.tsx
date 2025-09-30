"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Fuel,
  Thermometer,
  Gauge,
  MapPin,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
} from "lucide-react"

interface TankData {
  id: string
  name: string
  fuelType: string
  currentLevel: number
  capacity: number
  percentage: number
  location: string
  lastUpdated: string
  status: string
  temperature: number
  pressure: number
  supplier: string
  costPerLiter: number
  reorderPoint: number
  maxLevel: number
  minLevel: number
}

interface TankOverviewProps {
  data: TankData[]
}

export function TankOverview({ data }: TankOverviewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "low":
        return "border-orange-500 bg-orange-50"
      case "medium":
        return "border-yellow-500 bg-yellow-50"
      case "optimal":
        return "border-green-500 bg-green-50"
      case "high":
        return "border-blue-500 bg-blue-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "low":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "optimal":
        return "bg-green-100 text-green-800 border-green-200"
      case "high":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 30) return "bg-red-500"
    if (percentage < 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((tank) => (
        <Card
          key={tank.id}
          className={`border-2 ${getStatusColor(tank.status)} hover:shadow-lg transition-all duration-200`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Fuel className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{tank.name}</CardTitle>
                  <CardDescription className="text-sm">{tank.id}</CardDescription>
                </div>
              </div>
              <Badge className={getStatusBadgeColor(tank.status)}>
                {tank.status === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                {tank.status === "low" && <TrendingDown className="w-3 h-3 mr-1" />}
                {tank.status === "high" && <TrendingUp className="w-3 h-3 mr-1" />}
                <span className="capitalize">{tank.status}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Fuel Level */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Fuel Level</span>
                <span className="text-sm text-gray-500">{tank.percentage}%</span>
              </div>
              <div className="relative">
                <Progress value={tank.percentage} className="h-3" />
                <div
                  className={`absolute top-0 left-0 h-3 rounded-full ${getProgressColor(tank.percentage)} transition-all duration-500`}
                  style={{ width: `${tank.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{tank.currentLevel.toLocaleString()}L</span>
                <span>{tank.capacity.toLocaleString()}L</span>
              </div>
            </div>

            {/* Fuel Type */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Fuel className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{tank.fuelType}</span>
              </div>
              <span className="text-sm text-gray-600">${tank.costPerLiter}/L</span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{tank.location}</span>
            </div>

            {/* Environmental Data */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <Thermometer className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-xs text-blue-600">Temperature</div>
                  <div className="text-sm font-medium">{tank.temperature}°C</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg">
                <Gauge className="h-4 w-4 text-purple-600" />
                <div>
                  <div className="text-xs text-purple-600">Pressure</div>
                  <div className="text-sm font-medium">{tank.pressure} bar</div>
                </div>
              </div>
            </div>

            {/* Reorder Information */}
            {tank.currentLevel <= tank.reorderPoint && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Reorder Required</span>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  Current level is below reorder point of {tank.reorderPoint.toLocaleString()}L
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t">Last updated: {tank.lastUpdated}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
