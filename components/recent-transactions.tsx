"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const transactions = [
  {
    id: "TXN-001",
    customer: "Shell Station #42",
    type: "Fuel Delivery",
    amount: "$12,450",
    fuel: "Premium Gasoline",
    quantity: "8,300L",
    status: "completed",
    time: "2 hours ago",
  },
  {
    id: "TXN-002",
    customer: "BP Express",
    type: "Fuel Delivery",
    amount: "$8,750",
    fuel: "Diesel",
    quantity: "5,000L",
    status: "in-transit",
    time: "4 hours ago",
  },
  {
    id: "TXN-003",
    customer: "Exxon Mobile",
    type: "Fuel Delivery",
    amount: "$15,200",
    fuel: "Regular Gasoline",
    quantity: "10,000L",
    status: "completed",
    time: "6 hours ago",
  },
  {
    id: "TXN-004",
    customer: "Chevron Station",
    type: "Fuel Delivery",
    amount: "$6,890",
    fuel: "Kerosene",
    quantity: "3,500L",
    status: "pending",
    time: "8 hours ago",
  },
]

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest fuel deliveries and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {transaction.customer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.customer}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.fuel} • {transaction.quantity}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm font-medium">{transaction.amount}</p>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={
                      transaction.status === "completed"
                        ? "default"
                        : transaction.status === "in-transit"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {transaction.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{transaction.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
