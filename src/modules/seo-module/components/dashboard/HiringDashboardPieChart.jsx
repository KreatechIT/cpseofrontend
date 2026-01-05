import { PieChart, Pie, Cell } from "recharts";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployeesIcon } from "@/components/icons/HrIcons";

// Utility: Reusable donut chart
const renderDonutChart = (value, total, color) => {
  const data = [
    { name: "Value", value, color },
    {
      name: "Remaining",
      value: total - value,
      color: "var(--color-secondary)",
    }, // Tailwind gray-200
  ];

  return (
    <PieChart width={150} height={150}>
      <Pie
        data={data}
        dataKey="value"
        innerRadius={30}
        outerRadius={70}
        stroke="currentColor"
        paddingAngle={2}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default function DashboardSummaryCards() {
  return (
    <div className="@container w-full flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-none">
          <CardTitle className="flex justify-between px-4">
            <p className="text-primary text-xl">Total Applicants</p>
            <EmployeesIcon className="fill-primary" />
          </CardTitle>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-foreground text-5xl font-bold">500</p>
              <Badge className="rounded-full bg-emerald-200 text-emerald-800 mt-4">
                <TrendingUpIcon /> +1.78%
              </Badge>
            </div>
            <div>{renderDonutChart(450, 500, "#3b82f6")}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardTitle className="flex justify-between px-4">
            <p className="text-destructive text-xl">Rejected Candidates</p>
            <EmployeesIcon className="fill-destructive" />
          </CardTitle>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-foreground text-5xl font-bold">370</p>
              <Badge className="rounded-full bg-red-200 text-red-800 mt-4">
                <TrendingDownIcon /> -5.78%
              </Badge>
            </div>
            <div>{renderDonutChart(370, 500, "#ef4444")}</div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardTitle className="flex justify-between px-4">
            <p className="text-emerald-500 text-xl">Hired Candidates</p>
            <EmployeesIcon className="fill-emerald-500" />
          </CardTitle>
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-foreground text-5xl font-bold">130</p>
              <Badge className="rounded-full bg-emerald-200 text-emerald-800 mt-4">
                <TrendingUpIcon /> +1.78%
              </Badge>
            </div>
            <div>{renderDonutChart(130, 500, "#10b981")}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
