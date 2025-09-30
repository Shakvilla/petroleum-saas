"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

const data = [
  { date: "2024-01-01", sales: 125000, revenue: 187500 },
  { date: "2024-01-02", sales: 132000, revenue: 198000 },
  { date: "2024-01-03", sales: 128000, revenue: 192000 },
  { date: "2024-01-04", sales: 145000, revenue: 217500 },
  { date: "2024-01-05", sales: 139000, revenue: 208500 },
  { date: "2024-01-06", sales: 151000, revenue: 226500 },
  { date: "2024-01-07", sales: 156847, revenue: 235270 },
]

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sales</CardTitle>
        <CardDescription>Sales volume and revenue for the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: "Sales Volume (L)",
              color: "hsl(var(--chart-1))",
            },
            revenue: {
              label: "Revenue ($)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={data}>
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
