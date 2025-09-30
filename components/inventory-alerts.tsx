"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle, X, Bell, BellOff } from "lucide-react"

interface InventoryAlertsProps {
  tenant: string
}

export function InventoryAlerts({ tenant }: InventoryAlertsProps) {
  const alerts = [
    {
      id: "ALT001",
      type: "Critical",
      title: "Kerosene Tank 1 - Critical Low Level",
      description: "Tank level has dropped below 20%. Immediate refill required.",
      tank: "T004",
      timestamp: "2 minutes ago",
      status: "active",
      priority: "critical",
    },
    {
      id: "ALT002",
      type: "Warning",
      title: "Regular Gasoline Tank 2 - Low Level Alert",
      description: "Tank level is at 21%. Schedule refill within 3 days.",
      tank: "T002",
      timestamp: "15 minutes ago",
      status: "active",
      priority: "high",
    },
    {
      id: "ALT003",
      type: "Maintenance",
      title: "Pressure Sensor Offline",
      description: "IoT sensor IOT003 has been offline for 2 hours. Check connection.",
      tank: "T002",
      timestamp: "2 hours ago",
      status: "active",
      priority: "medium",
    },
    {
      id: "ALT004",
      type: "Temperature",
      title: "Temperature Anomaly Detected",
      description: "Tank T001 temperature reading outside normal range.",
      tank: "T001",
      timestamp: "3 hours ago",
      status: "acknowledged",
      priority: "medium",
    },
    {
      id: "ALT005",
      type: "Security",
      title: "Unauthorized Access Attempt",
      description: "Motion detected in restricted area after hours.",
      tank: "N/A",
      timestamp: "5 hours ago",
      status: "resolved",
      priority: "high",
    },
    {
      id: "ALT006",
      type: "System",
      title: "Backup System Activated",
      description: "Primary monitoring system switched to backup due to maintenance.",
      tank: "All",
      timestamp: "1 day ago",
      status: "resolved",
      priority: "low",
    },
  ]

  const alertStats = [
    {
      title: "Active Alerts",
      value: "3",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: AlertTriangle,
    },
    {
      title: "Acknowledged",
      value: "1",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      icon: Clock,
    },
    {
      title: "Resolved Today",
      value: "2",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: CheckCircle,
    },
    {
      title: "Total This Week",
      value: "12",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: Bell,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "acknowledged":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "Warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "Maintenance":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {alertStats.map((stat, index) => (
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

      {/* Alerts List */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Alert Management</CardTitle>
              <CardDescription>Monitor and manage all system alerts and notifications</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                <BellOff className="h-4 w-4 mr-2" />
                Mute All
              </Button>
              <Button className="w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <Badge variant="secondary" className={getPriorityColor(alert.priority)}>
                          {alert.priority.toUpperCase()}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>Tank: {alert.tank}</span>
                        <span>ID: {alert.id}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.status === "active" && (
                      <>
                        <Button size="sm" variant="outline">
                          Acknowledge
                        </Button>
                        <Button size="sm">Resolve</Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Configure Alert Rules
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Export Alert Log
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Notification Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
