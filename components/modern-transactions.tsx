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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Receipt, ArrowUpRight, Clock, CheckCircle, Truck } from 'lucide-react';

const transactions = [
  {
    id: 'TXN-001',
    customer: 'Shell Station #42',
    type: 'Fuel Delivery',
    amount: '$12,450',
    fuel: 'Premium Gasoline',
    quantity: '8,300L',
    status: 'completed',
    time: '2 hours ago',
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'TXN-002',
    customer: 'BP Express',
    type: 'Fuel Delivery',
    amount: '$8,750',
    fuel: 'Diesel',
    quantity: '5,000L',
    status: 'in-transit',
    time: '4 hours ago',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'TXN-003',
    customer: 'Exxon Mobile',
    type: 'Fuel Delivery',
    amount: '$15,200',
    fuel: 'Regular Gasoline',
    quantity: '10,000L',
    status: 'completed',
    time: '6 hours ago',
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'TXN-004',
    customer: 'Chevron Station',
    type: 'Fuel Delivery',
    amount: '$6,890',
    fuel: 'Kerosene',
    quantity: '3,500L',
    status: 'pending',
    time: '8 hours ago',
    gradient: 'from-orange-500 to-orange-600',
  },
];

export function ModernTransactions() {
  return (
    <Card className="border-gray-100 hover:shadow-lg hover:cursor-pointer bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3">
                <Receipt className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm">
              Latest fuel deliveries and transactions
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-gray-50 text-xs lg:text-sm"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowUpRight className="ml-1 lg:ml-2 h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 lg:space-y-4">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="group p-3 lg:p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div
                  className={`p-2 lg:p-3 rounded-2xl bg-gradient-to-br ${transaction.gradient} shadow-lg flex-shrink-0`}
                >
                  <Avatar className="h-4 w-4 lg:h-6 lg:w-6 bg-white/20">
                    <AvatarFallback className="text-white text-xs font-bold">
                      {transaction.customer
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 truncate pr-2">
                      {transaction.customer}
                    </p>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {transaction.amount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs lg:text-sm text-gray-600 truncate pr-2">
                      {transaction.fuel} • {transaction.quantity}
                    </p>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge
                        variant={
                          transaction.status === 'completed'
                            ? 'default'
                            : transaction.status === 'in-transit'
                              ? 'secondary'
                              : 'outline'
                        }
                        className={`text-xs ${
                          transaction.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : transaction.status === 'in-transit'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}
                      >
                        {transaction.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        )}
                        {transaction.status === 'in-transit' && (
                          <Truck className="w-3 h-3 mr-1" />
                        )}
                        {transaction.status === 'pending' && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        <span className="hidden sm:inline">
                          {transaction.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {transaction.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
