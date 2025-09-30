"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Filter, TrendingUp, TrendingDown, Plus, Minus, RefreshCw } from "lucide-react"

interface InventoryHistoryProps {
  tenant: string
}

export function InventoryHistory({ tenant }: InventoryHistoryProps) {
  const transactions = [
    {
      id: "TXN001",
      type: "Delivery",
      tank: "Premium Gasoline Tank 1",
      tankId: "T001",
      amount: 15000,
      unit: "L",
      timestamp: "2024-01-15 09:30:00",
      operator: "John Smith",
      supplier: "PetroSupply Co.",
      reference: "DEL-2024-001",
      status: "Completed",
    },
    {
      id: "TXN002",
      type: "Sale",
      tank: "Regular Gasoline Tank 2",
      tankId: "T002",
      amount: -2500,
      unit: "L",
      timestamp: "2024-01-15 08:45:00",
      operator: "System Auto",
      supplier: "N/A",
      reference: "SALE-2024-045",
      status: "Completed",
    },
    {
      id: "TXN003",
      type: "Transfer",
      tank: "Diesel Tank 1",
      tankId: "T003",
      amount: -5000,
      unit: "L",
      timestamp: "2024-01-14 16:20:00",
      operator: "Mike Johnson",
      supplier: "Internal Transfer",
      reference: "TRF-2024-012",
      status: "Completed",
    },
    {
      id: "TXN004",
      type: "Adjustment",
      tank: "Kerosene Tank 1",
      tankId: "T004",
      amount: -200,
      unit: "L",
      timestamp: "2024-01-14 14:15:00",
      operator: "Sarah Wilson",
      supplier: "Inventory Adjustment",
      reference: "ADJ-2024-003",
      status: "Completed",
    },
    {
      id: "TXN005",
      type: "Delivery",
      tank: "Premium Diesel Tank 2",
      tankId: "T005",
      amount: 12000,
      unit: "L",
      timestamp: "2024-01-14 11:00:00",
      operator: "David Brown",
      supplier: "FuelMax Ltd.",
      reference: "DEL-2024-002",
      status: "Completed",
    },
    {
      id: "TXN006",
      type: "Sale",
      tank: "Heating Oil Tank 1",
      tankId: "T006",
      amount: -1800,
      unit: "L",
      timestamp: "2024-01-13 15:30:00",
      operator: "System Auto",
      supplier: "N/A",
      reference: "SALE-2024-044",
      status: "Completed",
    },
  ]

  const summaryStats = [
    {
      title: "Total Deliveries",
      value: "27,000",
      unit: "L",
      change: "+12.5%",
      trend: "up",
      period: "This Week",
    },
    {
      title: "Total Sales",
      value: "18,300",
      unit: "L",
      change: "+8.2%",
      trend: "up",
      period: "This Week",
    },
    {
      title: "Net Change",
      value: "+8,700",
      unit: "L",
      change: "+15.3%",
      trend: "up",
      period: "This Week",
    },
    {
      title: "Transactions",
      value: "156",
      unit: "count",
      change: "+5.1%",
      trend: "up",
      period: "This Week",
    },
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Delivery":
        return <Plus className="h-4 w-4 text-green-500" />
      case "Sale":
        return <Minus className="h-4 w-4 text-blue-500" />
      case "Transfer":
        return <RefreshCw className="h-4 w-4 text-purple-500" />
      case "Adjustment":
        return <RefreshCw className="h-4 w-4 text-orange-500" />
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "Delivery":
        return "bg-green-100 text-green-800"
      case "Sale":
        return "bg-blue-100 text-blue-800"
      case "Transfer":
        return "bg-purple-100 text-purple-800"
      case "Adjustment":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0
    const absAmount = Math.abs(amount)
    return {
      value: absAmount.toLocaleString(),
      sign: isPositive ? "+" : "-",
      color: isPositive ? "text-green-600" : "text-red-600",
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {summaryStats.map((stat, index) => (
          <Card key={index} className="bg-white border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center space-x-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Transaction History</CardTitle>
          <CardDescription>View and filter all inventory transactions and movements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input placeholder="Search transactions..." className="w-full" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="week">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const amountInfo = formatAmount(transaction.amount)

              return (
                <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{transaction.tank}</h3>
                          <Badge variant="secondary" className={getTransactionColor(transaction.type)}>
                            {transaction.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {transaction.supplier} • Ref: {transaction.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${amountInfo.color}`}>
                        {amountInfo.sign}
                        {amountInfo.value} {transaction.unit}
                      </div>
                      <p className="text-sm text-gray-500">{transaction.timestamp}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tank ID:</span>
                      <span className="ml-2 text-gray-600">{transaction.tankId}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Operator:</span>
                      <span className="ml-2 text-gray-600">{transaction.operator}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Load More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
