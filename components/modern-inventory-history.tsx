'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  RefreshCw,
  Search,
  BarChart3,
} from 'lucide-react';

interface ModernInventoryHistoryProps {
  tenant: string;
}

export function ModernInventoryHistory({
  tenant,
}: ModernInventoryHistoryProps) {
  const transactions = [
    {
      id: 'TXN001',
      type: 'Delivery',
      tank: 'Premium Gasoline Tank 1',
      tankId: 'T001',
      amount: 15000,
      unit: 'L',
      timestamp: '2024-01-15 09:30:00',
      operator: 'John Smith',
      supplier: 'PetroSupply Co.',
      reference: 'DEL-2024-001',
      status: 'Completed',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      id: 'TXN002',
      type: 'Sale',
      tank: 'Regular Gasoline Tank 2',
      tankId: 'T002',
      amount: -2500,
      unit: 'L',
      timestamp: '2024-01-15 08:45:00',
      operator: 'System Auto',
      supplier: 'N/A',
      reference: 'SALE-2024-045',
      status: 'Completed',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      id: 'TXN003',
      type: 'Transfer',
      tank: 'Diesel Tank 1',
      tankId: 'T003',
      amount: -5000,
      unit: 'L',
      timestamp: '2024-01-14 16:20:00',
      operator: 'Mike Johnson',
      supplier: 'Internal Transfer',
      reference: 'TRF-2024-012',
      status: 'Completed',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      id: 'TXN004',
      type: 'Adjustment',
      tank: 'Kerosene Tank 1',
      tankId: 'T004',
      amount: -200,
      unit: 'L',
      timestamp: '2024-01-14 14:15:00',
      operator: 'Sarah Wilson',
      supplier: 'Inventory Adjustment',
      reference: 'ADJ-2024-003',
      status: 'Completed',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      id: 'TXN005',
      type: 'Delivery',
      tank: 'Premium Diesel Tank 2',
      tankId: 'T005',
      amount: 12000,
      unit: 'L',
      timestamp: '2024-01-14 11:00:00',
      operator: 'David Brown',
      supplier: 'FuelMax Ltd.',
      reference: 'DEL-2024-002',
      status: 'Completed',
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      id: 'TXN006',
      type: 'Sale',
      tank: 'Heating Oil Tank 1',
      tankId: 'T006',
      amount: -1800,
      unit: 'L',
      timestamp: '2024-01-13 15:30:00',
      operator: 'System Auto',
      supplier: 'N/A',
      reference: 'SALE-2024-044',
      status: 'Completed',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-white to-gray-50',
    },
  ];

  const summaryStats = [
    {
      title: 'Total Deliveries',
      value: '27,000',
      unit: 'L',
      change: '+12.5%',
      trend: 'up',
      period: 'This Week',
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      title: 'Total Sales',
      value: '18,300',
      unit: 'L',
      change: '+8.2%',
      trend: 'up',
      period: 'This Week',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      title: 'Net Change',
      value: '+8,700',
      unit: 'L',
      change: '+15.3%',
      trend: 'up',
      period: 'This Week',
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-white to-gray-50',
    },
    {
      title: 'Transactions',
      value: '156',
      unit: 'count',
      change: '+5.1%',
      trend: 'up',
      period: 'This Week',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-white to-gray-50',
    },
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Delivery':
        return <Plus className="h-5 w-5 text-white" />;
      case 'Sale':
        return <Minus className="h-5 w-5 text-white" />;
      case 'Transfer':
        return <RefreshCw className="h-5 w-5 text-white" />;
      case 'Adjustment':
        return <RefreshCw className="h-5 w-5 text-white" />;
      default:
        return <RefreshCw className="h-5 w-5 text-white" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'Delivery':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Sale':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Transfer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Adjustment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    const absAmount = Math.abs(amount);
    return {
      value: absAmount.toLocaleString(),
      sign: isPositive ? '+' : '-',
      color: isPositive ? 'text-emerald-600' : 'text-red-600',
    };
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
            ></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>

            <CardContent className="relative p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                  <span className="text-sm text-gray-500">{stat.unit}</span>
                </div>
                <p className="text-xs text-gray-500">{stat.period}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction History */}
      <Card className="border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardHeader>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Transaction History
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Complete audit trail of all inventory movements and changes
              </CardDescription>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                className="pl-12 h-12 bg-white/50 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="h-12 bg-white/50 border-gray-200 rounded-xl lg:w-48">
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
              <SelectTrigger className="h-12 bg-white/50 border-gray-200 rounded-xl lg:w-48">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="h-12 px-6 bg-white/50 border-gray-200 hover:bg-white rounded-xl"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transactions List */}
          <div className="space-y-4">
            {transactions.map(transaction => {
              const amountInfo = formatAmount(transaction.amount);

              return (
                <Card
                  key={transaction.id}
                  className="group relative overflow-hidden border-gray-200 bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${transaction.bgGradient} opacity-30`}
                  ></div>

                  <CardContent className="relative p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`p-3 bg-gradient-to-br ${transaction.gradient} rounded-2xl shadow-lg flex-shrink-0`}
                        >
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {transaction.tank}
                            </h3>
                            <Badge
                              className={getTransactionColor(transaction.type)}
                            >
                              {transaction.type}
                            </Badge>
                          </div>
                          <p className="text-gray-600">
                            {transaction.supplier} • Ref:{' '}
                            {transaction.reference}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">
                                Tank ID:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {transaction.tankId}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Operator:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {transaction.operator}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">
                                Status:
                              </span>
                              <Badge className="ml-2 bg-emerald-100 text-emerald-800 border-emerald-200">
                                {transaction.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          className={`text-2xl font-bold ${amountInfo.color} mb-1`}
                        >
                          {amountInfo.sign}
                          {amountInfo.value} {transaction.unit}
                        </div>
                        <p className="text-sm text-gray-500">
                          {transaction.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
            <Button
              variant="outline"
              className="bg-white/50 border-gray-200 hover:bg-white"
            >
              Load More Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
