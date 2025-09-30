"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis } from "recharts"

const data = [
  { date: "2024-01-01", premium: 45000, regular: 67000, diesel: 34000 },
  { date: "2024-01-02", premium: 43000, regular: 65000, diesel: 35000 },
  { date: "2024-01-03", premium: 41000, regular: 63000, diesel: 36000 },
  { date: "2024-01-04", premium: 39000, regular: 61000, diesel: 37000 },
  { date: "2024-01-05", premium: 42000, regular: 64000, diesel: 35000 },
  { date: "2024-01-06", premium: 44000, regular: 66000, diesel: 36000 },
  { date: "2024-01-07", premium: 39000, regular: 33750, diesel: 36800 },
]

export function InventoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Levels</CardTitle>
        <CardDescription>Fuel inventory levels over the past 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            premium: {
              label: "Premium Gasoline",
              color: "hsl(var(--chart-1))",
            },
            regular: {
              label: "Regular Gasoline",
              color: "hsl(var(--chart-2))",
            },
            diesel: {
              label: "Diesel",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={data}>
            <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="premium"
              stackId="1"
              stroke="var(--color-premium)"
              fill="var(--color-premium)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="regular"
              stackId="1"
              stroke="var(--color-regular)"
              fill="var(--color-regular)"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="diesel"
              stackId="1"
              stroke="var(--color-diesel)"
              fill="var(--color-diesel)"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
