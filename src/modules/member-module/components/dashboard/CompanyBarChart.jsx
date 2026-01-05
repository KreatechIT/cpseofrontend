import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSelector } from "react-redux";

export const description = "Company-wise Member Distribution";

export function CompanyMemberBarChart() {
  const { companies } = useSelector((state) => state.company);
  const { members } = useSelector((state) => state.organisation);

  // Count members per company ID
  const memberCountMap = members.reduce((acc, member) => {
    member.company_ids?.forEach((companyId) => {
      acc[companyId] = (acc[companyId] || 0) + 1;
    });
    return acc;
  }, {});

  // Prepare chart data
  const chartData = companies.map((company) => ({
    name: company.name,
    members: memberCountMap[company.id] || 0,
  }));

  const chartConfig = {
    members: {
      label: "Members",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--background)",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company-wise Member Count</CardTitle>
        <CardDescription>Total Members per Company</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-130 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              hide
            />
            <XAxis type="number" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="members"
              layout="vertical"
              fill="var(--chart-2)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-primary-foreground"
                fontSize={12}
              />
              <LabelList
                dataKey="members"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
