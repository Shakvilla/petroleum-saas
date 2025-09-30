"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, Target, Zap, Brain, BarChart3 } from "lucide-react"

interface ModernPredictiveAnalyticsProps {
  tenant: string
}

export function ModernPredictiveAnalytics({ tenant }: ModernPredictiveAnalyticsProps) {
  const predictions = [
    {
      tank: "Premium Gasoline Tank 1",
      tankId: "T001",
      currentLevel: 85,
      predictedEmpty: "12 days",
      confidence: 94,
      trend: "stable",
      recommendation: "Schedule refill in 8 days",
      priority: "medium",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      tank: "Regular Gasoline Tank 2",
      tankId: "T002",
      currentLevel: 21,
      predictedEmpty: "3 days",
      confidence: 97,
      trend: "declining",
      recommendation: "Urgent refill required",
      priority: "critical",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
    },
    {
      tank: "Diesel Tank 1",
      tankId: "T003",
      currentLevel: 80,
      predictedEmpty: "15 days",
      confidence: 91,
      trend: "stable",
      recommendation: "Normal monitoring",
      priority: "low",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      tank: "Kerosene Tank 1",
      tankId: "T004",
      currentLevel: 20,
      predictedEmpty: "2 days",
      confidence: 98,
      trend: "critical",
      recommendation: "Immediate refill needed",
      priority: "critical",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
    },
  ]

  const insights = [
    {
      title: "Consumption Pattern",
      value: "Peak: 7-9 AM, 5-7 PM",
      icon: BarChart3,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      description: "Daily usage patterns identified",
    },
    {
      title: "Efficiency Trend",
      value: "+2.3% improvement",
      icon: Zap,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      description: "This month vs last month",
    },
    {
      title: "Cost Optimization",
      value: "$12,450 savings",
      icon: Target,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      description: "Potential monthly savings",
    },
    {
      title: "AI Accuracy",
      value: "94.2% precision",
      icon: Brain,
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
      description: "Prediction accuracy rate",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "declining":
      case "critical":
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
      case "stable":
        return <div className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500" />
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* AI Insights Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${insight.bgGradient} opacity-50`}></div>
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-8 translate-x-8 sm:-translate-y-12 sm:translate-x-12"></div>

            <CardContent className="relative p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`p-2 sm:p-3 bg-gradient-to-br ${insight.gradient} rounded-xl sm:rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <insight.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-xs sm:text-sm font-medium text-gray-600">{insight.title}</h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{insight.value}</p>
                <p className="text-xs text-gray-500">{insight.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Predictions Dashboard - Mobile Optimized */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI-Powered Predictions
              </CardTitle>
              <CardDescription className="text-sm sm:text-lg text-gray-600">
                Machine learning insights for optimal inventory management
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6">
          {predictions.map((prediction, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${prediction.bgGradient} opacity-30`}></div>

              <CardContent className="relative p-4 sm:p-6">
                <div className="flex flex-col space-y-4">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div
                        className={`p-1.5 sm:p-2 bg-gradient-to-br ${prediction.gradient} rounded-lg sm:rounded-xl shadow-lg flex-shrink-0`}
                      >
                        <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">{prediction.tank}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{prediction.tankId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={`${getPriorityColor(prediction.priority)} text-xs`}>
                        {prediction.priority.toUpperCase()}
                      </Badge>
                      {getTrendIcon(prediction.trend)}
                      <span className="text-xs sm:text-sm text-gray-600">{prediction.confidence}% confidence</span>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Current Level</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">{prediction.currentLevel}%</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${prediction.gradient} transition-all duration-1000 ease-out`}
                            style={{ width: `${prediction.currentLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Predicted Empty</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold text-gray-900">{prediction.predictedEmpty}</p>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">AI Recommendation</span>
                      <p className="text-xs sm:text-sm text-gray-900 font-medium leading-relaxed">
                        {prediction.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Action Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg h-10 sm:h-11 text-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Generate Refill Schedule
            </Button>
            <Button variant="outline" className="bg-white/50 border-gray-200 hover:bg-white h-10 sm:h-11 text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Export Predictions
            </Button>
            <Button variant="outline" className="bg-white/50 border-gray-200 hover:bg-white h-10 sm:h-11 text-sm">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Configure AI Models
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
