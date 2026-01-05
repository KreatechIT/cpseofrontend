import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/utils/cn";

// Updated chartData for monthly income and expenses (Jan to Dec)
const chartData = [
  { month: "Jan", income: 5000, expense: 3000 },
  { month: "Feb", income: 4500, expense: 3200 },
  { month: "Mar", income: 6000, expense: 3500 },
  { month: "Apr", income: 7000, expense: 3800 },
  { month: "May", income: 5500, expense: 2900 },
  { month: "Jun", income: 6500, expense: 4000 },
  { month: "Jul", income: 7500, expense: 4200 },
  { month: "Aug", income: 8000, expense: 4500 },
  { month: "Sep", income: 7800, expense: 4600 },
  { month: "Oct", income: 6900, expense: 3800 },
  { month: "Nov", income: 7200, expense: 3700 },
  { month: "Dec", income: 8500, expense: 5000 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--primary)",
  },
};

export default function CashflowChart() {
  const [setlectedYear, setSelectedYear] = useState("2025");
  return (
    <Card className={cn("shadow-none bg-white/50 dark:bg-black/50")}>
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <div className="flex items-center justify-between">
          <div className="mt-4">
            <p className="font-light">Total Balance</p>
            <p className="text-3xl font-bold">$562,000</p>
          </div>
          <div>
            <Select
              defaultValue={setlectedYear}
              value={setlectedYear}
              onValueChange={(value) => setSelectedYear(value)}
            >
              <SelectTrigger className="w-[120px] ml-auto">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="font-primary">
                <SelectItem value="2025">This Year</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-3 mt-4">
              <div className="text-sm flex items-center gap-1">
                <div className="size-3 rounded-xs bg-chart-1"></div> Income
              </div>
              <div className="text-sm flex items-center gap-1">
                <div className="size-3 rounded-xs bg-primary"></div> Expense
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className={cn("w-full max-h-60")}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} // Directly using the month names
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              label={{
                angle: -90,
                position: "insideLeft",
              }} // Y-axis label
            />
            <Bar
              dataKey="income"
              stackId="a"
              fill="var(--color-income)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="expense"
              stackId="a"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Month: ${value}`} // Tooltip formatting for month
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
