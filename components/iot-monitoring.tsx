"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Activity, Thermometer, Gauge, Droplets, AlertTriangle, CheckCircle } from "lucide-react"

interface IoTMonitoringProps {
  tenant: string
}

export function IoTMonitoring({ tenant }: IoTMonitoringProps) {
  const sensors = [
    {
      id: "IOT001",
      name: "Tank T001 Level Sensor",
      type: "Level",
      status: "online",
      value: "85.2%",
      unit: "%",
      lastUpdate: "30 secs ago",
      battery: 87,
      signal: 95,
      alerts: 0,
    },
    {
      id: "IOT002",
      name: "Tank T001 Temperature Sensor",
      type: "Temperature",
      status: "online",
      value: "18.5",
      unit: "°C",
      lastUpdate: "45 secs ago",
      battery: 92,
      signal: 88,
      alerts: 0,
    },
    {
      id: "IOT003",
      name: "Tank T002 Pressure Sensor",
      type: "Pressure",
      status: "offline",
      value: "N/A",
      unit: "bar",
      lastUpdate: "2 hours ago",
      battery: 23,
      signal: 0,
      alerts: 2,
    },
    {
      id: "IOT004",
      name: "Tank T003 Flow Sensor",
      type: "Flow",
      status: "online",
      value: "245.8",
      unit: "L/min",
      lastUpdate: "15 secs ago",
      battery: 78,
      signal: 92,
      alerts: 0,
    },
    {
      id: "IOT005",
      name: "Environmental Sensor",
      type: "Environment",
      status: "warning",
      value: "Normal",
      unit: "",
      lastUpdate: "1 min ago",
      battery: 45,
      signal: 76,
      alerts: 1,
    },
    {
      id: "IOT006",
      name: "Security Motion Sensor",
      type: "Security",
      status: "online",
      value: "No Motion",
      unit: "",
      lastUpdate: "10 secs ago",
      battery: 95,
      signal: 98,
      alerts: 0,
    },
  ]

  const networkStats = [
    {
      title: "Total Sensors",
      value: "24",
      status: "online",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Online Sensors",
      value: "22",
      status: "active",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Offline Sensors",
      value: "2",
      status: "offline",
      icon: WifiOff,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Active Alerts",
      value: "3",
      status: "warning",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "offline":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-4 w-4 text-green-500" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "Level":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "Temperature":
        return <Thermometer className="h-4 w-4 text-red-500" />
      case "Pressure":
        return <Gauge className="h-4 w-4 text-green-500" />
      case "Flow":
        return <Activity className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {networkStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {sensors.map((sensor) => (
          <Card key={sensor.id} className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">{sensor.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {sensor.type} Sensor • ID: {sensor.id}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getStatusColor(sensor.status)}>
                    {sensor.status}
                  </Badge>
                  {getStatusIcon(sensor.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Reading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSensorIcon(sensor.type)}
                    <span className="text-sm font-medium text-gray-700">Current Reading</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {sensor.value} {sensor.unit}
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-600">Battery Level</span>
                  <div className="space-y-1">
                    <Progress value={sensor.battery} className="h-2" />
                    <span className="text-xs text-gray-500">{sensor.battery}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-medium text-gray-600">Signal Strength</span>
                  <div className="space-y-1">
                    <Progress value={sensor.signal} className="h-2" />
                    <span className="text-xs text-gray-500">{sensor.signal}%</span>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {sensor.alerts > 0 && (
                <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-700">
                    {sensor.alerts} active alert{sensor.alerts > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">Last updated: {sensor.lastUpdate}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Panel */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">IoT Network Control Panel</CardTitle>
          <CardDescription>Manage and configure your IoT sensor network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto">Refresh All Sensors</Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Configure Alerts
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Network Diagnostics
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
