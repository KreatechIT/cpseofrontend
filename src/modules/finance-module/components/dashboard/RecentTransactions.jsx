import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SlidersVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

const transactions = [
  {
    transactionName: "Electricity Bill",
    date: "2028-03-01",
    amount: "$295.81",
    note: "Payment for monthly electricity bill",
    status: "Failed",
  },
  {
    transactionName: "Weekly Groceries",
    date: "2028-03-04",
    amount: "$204.07",
    note: "Groceries shopping at local supermarket",
    status: "Completed",
  },
  {
    transactionName: "Movie Night",
    date: "2028-02-27",
    amount: "$97.84",
    note: "Tickets for movies and snacks",
    status: "Pending",
  },
  {
    transactionName: "Medical Check-up",
    date: "2028-02-07",
    amount: "$323.33",
    note: "Routine health check-up and medications",
    status: "Pending",
  },
  {
    transactionName: "Dinner at Italian Restaurant",
    date: "2028-02-11",
    amount: "$226.25",
    note: "Dining out with family at a local Italian restaurant",
    status: "Pending",
  },
];

export default function RecentTransactions() {
  const [selectedMonth, setSelectedMonth] = useState("January");

  return (
    <Card className="shadow-none mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <div className="flex gap-3">
            <Select
              defaultValue={selectedMonth}
              value={selectedMonth}
              onValueChange={(value) => setSelectedMonth(value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="font-primary">
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Button variant="outline" size="icon">
                <SlidersVertical />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="text-[13px]">
          <TableHeader className="bg-blue-50 dark:bg-blue-50/10">
            <TableRow>
              <TableHead className="w-40"> Transaction Name</TableHead>
              <TableHead className="w-28">Date & Time</TableHead>
              <TableHead className="w-24">Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="w-28 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionName}>
                <TableCell className="py-3">
                  {transaction.transactionName}
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.note}</TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "min-w-18",
                        transaction.status === "Failed"
                          ? "text-red-500"
                          : transaction.status === "Completed"
                          ? "text-green-800"
                          : "text-yellow-500"
                      )}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
