import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpensesPieChart from "./ExpensesPieChart";

export default function StatisticsCard() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  return (
    <div className="w-full  min-h-40 mb-6 border rounded-xl p-4 bg-card">
      <div className="flex justify-between items-center">
        <p>Statistics</p>

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
      </div>

      <Tabs defaultValue="expense" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border-b rounded-none">
          <TabsTrigger
            value="income"
            className="bg-transparent rounded-none border-b-2 data-[state=active]:border-b-primary-accent data-[state=active]:bg-primary/20 dark:data-[state=active]:bg-primary/20 border-none"
          >
            Income ($4,800)
          </TabsTrigger>
          <TabsTrigger
            value="expense"
            className="bg-transparent rounded-none border-b-2 data-[state=active]:border-b-primary-accent data-[state=active]:bg-primary/20 dark:data-[state=active]:bg-primary/20"
          >
            Expense ($3,500)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <ExpensesPieChart />
        </TabsContent>
        <TabsContent value="expense">
          <ExpensesPieChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
