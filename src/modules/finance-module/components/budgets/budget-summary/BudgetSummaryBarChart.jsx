import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Chart color config
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-5)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-3)",
  },
};

// Custom tick component for multiline category labels
const CustomXAxisTick = ({ x, y, payload }) => {
  const words = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y + 10})`}>
      <text textAnchor="middle" fill="#666" fontSize={12}>
        {words.map((word, index) => (
          <tspan x="0" dy={index === 0 ? 0 : 14} key={index}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export function BudgetSummaryBarChart({ data }) {
  const barWidth = 80; // width per category (adjust as needed)
  const chartWidth = data.length * barWidth;

  return (
    <Card>
      <CardHeader />
      <CardContent className="flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="min-h-[500px] max-h-[550px] w-full overflow-x-auto"
        >
          <div className="min-w-full overflow-x-auto">
            <div style={{ width: chartWidth }}>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart
                  data={data.slice(0, data.length - 1)}
                  margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="sub_category"
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    axisLine={false}
                    interval={0}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="forecast_cost"
                    name="Forecast"
                    stackId="a"
                    fill="var(--color-desktop)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="total_expense"
                    name="Expense"
                    stackId="a"
                    fill="var(--color-mobile)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
