import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthField } from "@/components/form-fields/MonthField";
import { formatCurrency } from "@/utils/formatCurrency";

export default function BudgetSummaryTable({ data, month, setMonth }) {
  return (
    <Card className="shadow-none mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Summary</CardTitle>
          <div>
            <MonthField date={month} setDate={setMonth} view="filter" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="-mt-6">
        <Table>
          <TableHeader className="bg-blue-50 dark:bg-blue-50/10">
            <TableRow>
              <TableHead className="py-4 px-2">Cost Items</TableHead>
              <TableHead className=" px-2">Forecast Cost</TableHead>

              <TableHead className="px-2">
                LCLR Actual <br /> Expense Amount
              </TableHead>
              <TableHead className="">Forecast Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .filter((row) => row?.sub_category != "Total")
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="py-3 ">{row?.sub_category}</TableCell>
                  <TableCell>{formatCurrency(row?.forecast_cost)}</TableCell>
                  <TableCell>{formatCurrency(row?.total_expense)}</TableCell>
                  <TableCell>{row?.forecast_ratio}%</TableCell>
                </TableRow>
              ))}
            {data
              .filter((row) => row?.sub_category == "Total")
              .map((row, index) => (
                <TableRow
                  className="bg-primary-accent/5 dark:bg-blue-50/5"
                  key={index}
                >
                  <TableCell className="py-3 ">{row?.sub_category}</TableCell>
                  <TableCell>{formatCurrency(row?.forecast_cost)}</TableCell>
                  <TableCell>{formatCurrency(row?.total_expense)}</TableCell>
                  <TableCell>{row?.forecast_ratio}%</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
