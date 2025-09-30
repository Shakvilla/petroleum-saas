"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Fuel, Truck, Clock, X } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "Low Fuel Level",
    message: "Kerosene tank is at 23% capacity. Immediate refill required.",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "warning",
    icon: Truck,
    title: "Delivery Delay",
    message: "Truck #TK-045 is 2 hours behind schedule for Shell Station #42.",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "info",
    icon: Fuel,
    title: "Inventory Update",
    message: "Premium gasoline delivery completed. Tank level updated to 78%.",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "warning",
    icon: Clock,
    title: "Maintenance Due",
    message: "Truck #TK-023 is due for scheduled maintenance in 2 days.",
    time: "6 hours ago",
  },
]

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
        <CardDescription>Important notifications and system updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg border">
              <div
                className={`p-1 rounded-full ${
                  alert.type === "critical" ? "bg-red-100" : alert.type === "warning" ? "bg-yellow-100" : "bg-blue-100"
                }`}
              >
                <alert.icon
                  className={`h-4 w-4 ${
                    alert.type === "critical"
                      ? "text-red-600"
                      : alert.type === "warning"
                        ? "text-yellow-600"
                        : "text-blue-600"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <Badge
                    variant={
                      alert.type === "critical" ? "destructive" : alert.type === "warning" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {alert.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
