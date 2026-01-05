import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    month: "January",
    applications: 300,
    hired: 60,
    pending: 150,
    rejected: 90,
  },
  {
    month: "February",
    applications: 280,
    hired: 90,
    pending: 100,
    rejected: 90,
  },
  { month: "March", applications: 260, hired: 120, pending: 80, rejected: 60 },
  { month: "April", applications: 350, hired: 70, pending: 140, rejected: 140 },
  { month: "May", applications: 220, hired: 60, pending: 90, rejected: 70 },
  { month: "June", applications: 390, hired: 110, pending: 100, rejected: 180 },
  { month: "July", applications: 310, hired: 140, pending: 50, rejected: 120 },
  { month: "August", applications: 250, hired: 100, pending: 70, rejected: 80 },
  {
    month: "September",
    applications: 330,
    hired: 90,
    pending: 120,
    rejected: 100,
  },
  {
    month: "October",
    applications: 290,
    hired: 60,
    pending: 130,
    rejected: 100,
  },
  {
    month: "November",
    applications: 270,
    hired: 110,
    pending: 60,
    rejected: 100,
  },
  {
    month: "December",
    applications: 350,
    hired: 130,
    pending: 70,
    rejected: 120,
  },
];

// Chart line configuration
const chartConfig = {
  applications: { label: "Applications", color: "var(--chart-3)" },
  hired: { label: "Hired", color: "var(--chart-7)" },
  pending: { label: "Pending", color: "var(--chart-9)" },
  rejected: { label: "Rejected", color: "var(--chart-6)" },
};

export default function ApplicantChart() {
  return (
    <Card className="shadow-none bg-primary/5">
      <CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center gap-x-24">
          <div>
            <CardTitle>Applicant Trends</CardTitle>
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(chartConfig).map(([key, { label, color }]) => (
              <div
                key={key}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span
                  className="h-2.5 w-2.5 rounded-xs"
                  style={{ backgroundColor: color }}
                />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="max-h-60 w-full overflow-x-auto"
        >
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
              dataKey="applications"
              type="monotone"
              stroke="var(--color-applications)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="hired"
              type="monotone"
              stroke="var(--color-hired)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="pending"
              type="monotone"
              stroke="var(--color-pending)"
              strokeWidth={1}
              dot={false}
            />
            <Line
              dataKey="rejected"
              type="monotone"
              stroke="var(--color-rejected)"
              strokeWidth={1}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
