"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Target, Zap } from "lucide-react"

interface PredictiveAnalyticsProps {
  tenant: string
}

export function PredictiveAnalytics({ tenant }: PredictiveAnalyticsProps) {
  const predictions = [
    {
      tank: "Premium Gasoline Tank 1",
      currentLevel: 85,
      predictedEmpty: "12 days",
      confidence: 94,
      trend: "stable",
      recommendation: "Schedule refill in 8 days",
      priority: "medium",
    },
    {
      tank: "Regular Gasoline Tank 2",
      currentLevel: 21,
      predictedEmpty: "3 days",
      confidence: 97,
      trend: "declining",
      recommendation: "Urgent refill required",
      priority: "high",
    },
    {
      tank: "Diesel Tank 1",
      currentLevel: 80,
      predictedEmpty: "15 days",
      confidence: 91,
      trend: "stable",
      recommendation: "Normal monitoring",
      priority: "low",
    },
    {
      tank: "Kerosene Tank 1",
      currentLevel: 20,
      predictedEmpty: "2 days",
      confidence: 98,
      trend: "critical",
      recommendation: "Immediate refill needed",
      priority: "critical",
    },
  ]

  const insights = [
    {
      title: "Consumption Pattern",
      value: "Peak hours: 7-9 AM, 5-7 PM",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Efficiency Trend",
      value: "+2.3% improvement this month",
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Cost Optimization",
      value: "$12,450 potential savings",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Maintenance Alert",
      value: "Tank T002 needs inspection",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "declining":
      case "critical":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case "stable":
        return <div className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{insight.title}</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">{insight.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predictions Table */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Predictive Analytics Dashboard</CardTitle>
          <CardDescription>AI-powered predictions for inventory management and optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-medium text-gray-900">{prediction.tank}</h3>
                    <Badge variant="secondary" className={getPriorityColor(prediction.priority)}>
                      {prediction.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(prediction.trend)}
                    <span className="text-sm text-gray-600">{prediction.confidence}% confidence</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Current Level</span>
                      <span className="text-sm font-semibold text-gray-900">{prediction.currentLevel}%</span>
                    </div>
                    <Progress value={prediction.currentLevel} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Predicted Empty</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{prediction.predictedEmpty}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Recommendation</span>
                    <p className="text-sm text-gray-900">{prediction.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button className="w-full sm:w-auto">Generate Refill Schedule</Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Export Predictions
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Configure Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
