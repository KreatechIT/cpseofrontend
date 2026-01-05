import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
  YAxis,
  LabelList,
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

const ProductsBarChart = () => {
  const { organisations, organisationProducts } = useSelector(
    (state) => state.organisationsByAdmin
  );

  if (!organisations || !organisationProducts) return null;

  // Generate chart data from Redux state
  const chartData = organisationProducts.map((product, idx) => {
    const orgCount = organisations.filter((org) =>
      org.products.some((p) => p.id === product.id)
    ).length;

    return {
      product: product.name,
      organisations: orgCount,
      fill: `var(--chart-${idx + 3})`,
    };
  });

  // Generate chart config dynamically
  const chartConfig = {
    organisations: {
      label: "Organisations",
    },
    ...organisationProducts.reduce((acc, product, index) => {
      acc[product.name] = {
        label: product.name,
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {}),
  };

  return (
    <Card className="h-full justify-between">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          How many organisations use each product
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            barCategoryGap={20}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="product"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="organisations"
              barSize={75} // thinner bars
              strokeWidth={2}
              radius={8}
              activeIndex={0}
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            >
              <LabelList
                dataKey="organisations"
                position="top"
                fill="var(--foreground)"
                fontSize={12}
                offset={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ProductsBarChart;
