import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

export default function BudgetSummaryPieChart({ data }) {
  const totalAmount = React.useMemo(() => {
    return data
      .slice(0, data.length - 1)
      .reduce((acc, curr) => acc + curr.total_expense, 0);
  }, [data]);

  const chartData = React.useMemo(() => {
    // Exclude the 'Total' entry
    const filtered = data.filter((item) => item.sub_category !== "Total");

    // Sort by total_expense descending
    const sorted = [...filtered].sort(
      (a, b) => b.total_expense - a.total_expense
    );

    // Get top 5
    const topFive = sorted.slice(0, 5);

    // Sum the rest
    const others = sorted.slice(5);
    const othersTotal = others.reduce(
      (acc, curr) => acc + curr.total_expense,
      0
    );

    const formattedTopFive = topFive.map((item, index) => ({
      category: item.sub_category,
      percentage: 0, // We'll calculate later if needed
      amount: item.total_expense,
      fill: `var(--chart-${5 - index})`,
    }));

    if (othersTotal > 0) {
      formattedTopFive.push({
        category: "Others",
        percentage: 0,
        amount: othersTotal,
        fill: `var(--chart-6)`,
      });
    }

    // Calculate percentages
    const total = formattedTopFive.reduce((acc, curr) => acc + curr.amount, 0);
    formattedTopFive.forEach((item) => {
      item.percentage = total > 0 ? Math.round((item.amount / total) * 100) : 0;
    });

    return formattedTopFive;
  }, [data]);

  return (
    <Card className="flex flex-col shadow-none border-0">
      <CardContent className="flex-1 pb-0 p-0 -mt-8 flex flex-col lg:flex-row h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full lg:w-1/2  h-full"
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
              innerRadius={70}
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

        <div className="space-y-2.5 w-full lg:w-1/2">
          <div className="flex flex-col justify-center h-full gap-y-4 mr-10">
            {" "}
            {chartData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                {/* Rectangle bar representing the percentage */}
                <div
                  className="h-8 w-10 rounded-lg text-sm text-white flex items-center justify-center"
                  style={{
                    backgroundColor: `var(--chart-${5 - index})`,
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
                  <span className="text-sm">
                    ${data.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
