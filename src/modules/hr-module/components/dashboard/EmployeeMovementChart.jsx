import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Updated dummy data for 12 months
const chartData = [
  {
    month: "January",
    joined: 30,
    involuntary_leave: 10,
    voluntary_leave: 20,
    net_change: 0,
  },
  {
    month: "February",
    joined: 50,
    involuntary_leave: 5,
    voluntary_leave: 10,
    net_change: 35,
  },
  {
    month: "March",
    joined: 20,
    involuntary_leave: 15,
    voluntary_leave: 25,
    net_change: -20,
  },
  {
    month: "April",
    joined: 60,
    involuntary_leave: 8,
    voluntary_leave: 7,
    net_change: 45,
  },
  {
    month: "May",
    joined: 25,
    involuntary_leave: 15,
    voluntary_leave: 20,
    net_change: -10,
  },
  {
    month: "June",
    joined: 45,
    involuntary_leave: 12,
    voluntary_leave: 10,
    net_change: 23,
  },
  {
    month: "July",
    joined: 40,
    involuntary_leave: 20,
    voluntary_leave: 25,
    net_change: -5,
  },
  {
    month: "August",
    joined: 65,
    involuntary_leave: 5,
    voluntary_leave: 10,
    net_change: 50,
  },
  {
    month: "September",
    joined: 35,
    involuntary_leave: 18,
    voluntary_leave: 22,
    net_change: -5,
  },
  {
    month: "October",
    joined: 55,
    involuntary_leave: 10,
    voluntary_leave: 15,
    net_change: 30,
  },
  {
    month: "November",
    joined: 28,
    involuntary_leave: 18,
    voluntary_leave: 17,
    net_change: -7,
  },
  {
    month: "December",
    joined: 70,
    involuntary_leave: 5,
    voluntary_leave: 6,
    net_change: 59,
  },
];

// Updated chart config
const chartConfig = {
  joined: {
    label: "Joined",
    color: "var(--chart-7)",
  },
  involuntary_leave: {
    label: "Involuntary Leave",
    color: "var(--chart-3)",
  },
  voluntary_leave: {
    label: "Voluntary Leave",
    color: "var(--chart-6)",
  },
  net_change: {
    label: "Net Change",
    color: "var(--chart-9)",
  },
};

export default function EmployeeMovementChart() {
  return (
    <Card className="shadow-none bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-16">
          <CardTitle>Employee Movement</CardTitle>
          <div className="mt-1.5 flex flex-wrap gap-4">
            {Object.entries(chartConfig).map(([key, { label, color }]) => (
              <div
                key={key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span
                  className="h-2.5 w-2.5 rounded-xs"
                  style={{ backgroundColor: color }}
                ></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div></div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-60 w-full">
          <LineChart data={chartData} margin={{ left: -20, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="joined"
              type="monotone"
              stroke="var(--color-joined)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="involuntary_leave"
              type="monotone"
              stroke="var(--color-involuntary_leave)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="voluntary_leave"
              type="monotone"
              stroke="var(--color-voluntary_leave)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="net_change"
              type="monotone"
              stroke="var(--color-net_change)"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
