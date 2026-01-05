import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Updated chartData with the new categories and amounts, and using custom color variables
const chartData = [
  {
    category: "Rent & Living",
    percentage: 60,
    amount: 2100,
    fill: "var(--chart-1)",
  },
  {
    category: "Investment",
    percentage: 15,
    amount: 525,
    fill: "var(--chart-2)",
  },
  {
    category: "Education",
    percentage: 12,
    amount: 420,
    fill: "var(--chart-3)",
  },
  {
    category: "Food & Drink",
    percentage: 8,
    amount: 280,
    fill: "var(--chart-4)",
  },
  {
    category: "Entertainment",
    percentage: 5,
    amount: 175,
    fill: "var(--chart-5)",
  },
];

// chartConfig with colors using hsl(var(--chart-X))
const chartConfig = {
  rentLiving: {
    label: "Rent & Living",
    color: "var(--chart-1)",
  },
  investment: {
    label: "Investment",
    color: "var(--chart-2)",
  },
  education: {
    label: "Education",
    color: "var(--chart-3)",
  },
  foodDrink: {
    label: "Food & Drink",
    color: "var(--chart-4)",
  },
  entertainment: {
    label: "Entertainment",
    color: "var(--chart-5)",
  },
};

export default function ExpensesPieChart() {
  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  return (
    <Card className="flex flex-col shadow-none border-0 bg-transparent">
      <CardContent className="flex-1 pb-0 p-0 -mt-8">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[225px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              innerRadius={55}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ${totalAmount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Expense
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="space-y-2.5">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Rectangle bar representing the percentage */}
              <div
                className="h-8 w-10 rounded-lg  text-xs text-white flex items-center justify-center"
                style={{
                  backgroundColor: `var(--chart-${index + 1})`,
                }}
              >
                {data.percentage}%
              </div>

              {/* Category Title */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{data.category}</span>
              </div>

              {/* Amount */}
              <div className="flex flex-col ml-auto">
                <span className="text-sm font-sans font-medium">
                  ${data.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
