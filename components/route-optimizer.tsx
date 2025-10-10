"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Route, Clock, DollarSign, Navigation, Plus, Trash2, RotateCcw, TrendingUp, Zap } from "lucide-react"

// Mock route data
const optimizedRoutes = [
  {
    id: "ROUTE-001",
    name: "Downtown Circuit",
    stops: 5,
    distance: "45.2 km",
    estimatedTime: "3h 15m",
    fuelCost: "$28.50",
    efficiency: 92,
    vehicle: "TRK-001",
    driver: "John Smith",
    status: "active",
    savings: "$12.30",
  },
  {
    id: "ROUTE-002",
    name: "Highway Express",
    stops: 3,
    distance: "78.5 km",
    estimatedTime: "2h 45m",
    fuelCost: "$42.30",
    efficiency: 88,
    vehicle: "TRK-003",
    driver: "Mike Johnson",
    status: "planned",
    savings: "$8.75",
  },
  {
    id: "ROUTE-003",
    name: "Suburban Loop",
    stops: 7,
    distance: "62.8 km",
    estimatedTime: "4h 20m",
    fuelCost: "$35.75",
    efficiency: 85,
    vehicle: "TRK-005",
    driver: "Lisa Garcia",
    status: "completed",
    savings: "$15.20",
  },
]

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 90) return "text-emerald-600"
  if (efficiency >= 80) return "text-amber-600"
  return "text-red-600"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "planned":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function RouteOptimizer() {
  const [stops, setStops] = useState([
    { id: 1, address: "", priority: "medium" },
    { id: 2, address: "", priority: "medium" },
  ])

  const addStop = () => {
    setStops([...stops, { id: Date.now(), address: "", priority: "medium" }])
  }

  const removeStop = (id: number) => {
    setStops(stops.filter((stop) => stop.id !== id))
  }

  const updateStop = (id: number, field: string, value: string) => {
    setStops(stops.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop)))
  }

  return (
    <div className="space-y-6">
      {/* Route Planning */}
      <Card className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300">
        <div className="absolute inset-0" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <Route className="h-5 w-5 text-blue-600" />
            <span>Route Planning</span>
          </CardTitle>
          <CardDescription>Plan and optimize delivery routes for maximum efficiency</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle" className="text-sm font-medium text-slate-700">
                  Select Vehicle
                </Label>
                <Select>
                  <SelectTrigger className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Choose vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trk-001">TRK-001 - John Smith</SelectItem>
                    <SelectItem value="trk-002">TRK-002 - Sarah Wilson</SelectItem>
                    <SelectItem value="trk-003">TRK-003 - Mike Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start-location" className="text-sm font-medium text-slate-700">
                  Starting Location
                </Label>
                <Input
                  id="start-location"
                  placeholder="Enter depot or starting point"
                  className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="optimization" className="text-sm font-medium text-slate-700">
                  Optimization Priority
                </Label>
                <Select>
                  <SelectTrigger className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time">Minimize Time</SelectItem>
                    <SelectItem value="distance">Minimize Distance</SelectItem>
                    <SelectItem value="fuel">Minimize Fuel Cost</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="max-time" className="text-sm font-medium text-slate-700">
                  Maximum Route Time
                </Label>
                <Input
                  id="max-time"
                  placeholder="e.g., 8 hours"
                  className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-slate-700">Delivery Stops</Label>
              <Button onClick={addStop} variant="outline" size="sm" className="bg-white/50 hover:bg-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Stop
              </Button>
            </div>

            <div className="space-y-3">
              {stops.map((stop, index) => (
                <div key={stop.id} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`stop-${stop.id}`} className="text-sm font-medium text-slate-700">
                      Stop {index + 1}
                    </Label>
                    <Input
                      id={`stop-${stop.id}`}
                      placeholder="Enter delivery address"
                      value={stop.address}
                      onChange={(e) => updateStop(stop.id, "address", e.target.value)}
                      className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`priority-${stop.id}`} className="text-sm font-medium text-slate-700">
                      Priority
                    </Label>
                    <Select value={stop.priority} onValueChange={(value) => updateStop(stop.id, "priority", value)}>
                      <SelectTrigger className="bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {stops.length > 2 && (
                    <Button
                      onClick={() => removeStop(stop.id)}
                      variant="outline"
                      size="icon"
                      className="bg-white/50 hover:bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
            <Button variant="outline" className="bg-white/50 hover:bg-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Routes */}
      <Card className="relative overflow-hidden bg-white border-gray-200">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-blue-500/5" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <span>Current Routes</span>
          </CardTitle>
          <CardDescription>View and manage existing optimized routes</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            {optimizedRoutes.map((route) => (
              <Card
                key={route.id}
                className="relative overflow-hidden bg-white border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="absolute inset-0 " />
                <CardContent className="relative p-4 sm:p-6">
                  <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                        <h3 className="font-semibold text-slate-900 text-lg">{route.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getStatusColor(route.status)} text-xs font-medium border`}>
                            {route.status}
                          </Badge>
                          <Badge
                            className={`text-xs font-medium border ${getEfficiencyColor(route.efficiency)} bg-white/50`}
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {route.efficiency}% efficient
                          </Badge>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs font-medium border">
                            Saved {route.savings}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{route.stops} stops</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Navigation className="h-4 w-4 text-slate-400" />
                          <span>{route.distance}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{route.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span>{route.fuelCost}</span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Vehicle:</span> {route.vehicle} - {route.driver}
                      </div>
                    </div>

                    <div className="flex flex-row space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 lg:ml-4">
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none bg-white/50 hover:bg-white">
                        View Map
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none bg-white/50 hover:bg-white">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 lg:flex-none bg-white/50 hover:bg-white">
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
