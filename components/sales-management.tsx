'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTenant } from '@/components/tenant-provider';
import { useTenantQuery } from '@/hooks/use-tenant-query';
import { TransactionsDataTable } from '@/components/transactions-data-table';
import {
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Search,
  Filter,
} from 'lucide-react';

interface SalesManagementProps {
  tenant?: string;
}

export function SalesManagement({ tenant: propTenant }: SalesManagementProps) {
  const { tenant } = useTenant();
  const currentTenant = propTenant || tenant?.id;

  // Load sales data from API
  const { data: salesData, isLoading } = useTenantQuery(
    ['sales', 'overview'],
    async () => {
      const response = await fetch(`/api/tenants/${currentTenant}/sales`);
      if (!response.ok) throw new Error('Failed to load sales data');
      return response.json();
    },
    {
      enabled: !!currentTenant,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const overview = salesData?.data?.overview || {};
  const recentTransactions = salesData?.data?.recentTransactions || [];
  const topCustomers = salesData?.data?.topCustomers || [];
  const fuelTypeBreakdown = salesData?.data?.fuelTypeBreakdown || [];

  // Transform transactions data for the data table
  const transformedTransactions = recentTransactions.map((transaction: any) => ({
    id: transaction.id,
    customer: {
      id: transaction.customer?.id || '',
      name: transaction.customer?.name || 'Unknown Customer',
      type: transaction.customer?.type || 'Unknown',
    },
    fuelType: transaction.fuelType,
    volume: transaction.volume,
    amount: transaction.amount,
    status: transaction.status,
    timestamp: transaction.timestamp,
    deliveryMethod: transaction.deliveryMethod,
    paymentMethod: transaction.paymentMethod,
  }));

  const handleViewTransaction = (transaction: any) => {
    console.log('View transaction:', transaction);
    // TODO: Implement transaction details modal/page
  };

  const handleExportTransactions = () => {
    console.log('Export transactions');
    // TODO: Implement CSV/Excel export
  };

  return (
    <div className="space-y-6">
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(overview.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Today's Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(overview.todayRevenue || 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Volume
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(overview.totalVolume || 0).toLocaleString()} L
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {overview.totalTransactions || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Data Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <p className="text-sm text-gray-600">
                Latest sales and deliveries with advanced filtering
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransactionsDataTable
            data={transformedTransactions}
            onView={handleViewTransaction}
            onExport={handleExportTransactions}
          />
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <p className="text-sm text-gray-600">By total purchase volume</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer: any, index: number) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${customer.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {customer.transactionCount} transactions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fuel Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Fuel Type Breakdown</CardTitle>
          <p className="text-sm text-gray-600">Sales by fuel type</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {fuelTypeBreakdown.map((breakdown: any) => (
              <div
                key={breakdown.fuelType}
                className="p-4 border rounded-lg text-center"
              >
                <p className="text-sm font-medium text-gray-600">
                  {breakdown.fuelType}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${breakdown.totalAmount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {breakdown.totalVolume.toLocaleString()}L
                </p>
                <p className="text-xs text-gray-400">
                  {breakdown.transactionCount} transactions
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
