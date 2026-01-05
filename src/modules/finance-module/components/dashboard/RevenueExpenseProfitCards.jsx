import { Badge } from "@/components/ui/badge";
import {
  BalanceRequestIcon,
  BalanceTransferIcon,
  NetProfitIcon,
} from "@/components/icons/FinanceIcons";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function RevenueExpenseProfitCards() {
  return (
    <div className="flex gap-4 w-full flex-grow">
      <div className="h-full min-h-48 w-full  border rounded-xl p-4 bg-card">
        <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center ">
          <BalanceRequestIcon />
        </div>

        <div className="mt-6">
          <Badge className="rounded-2xl bg-green-200 text-green-800">
            <TrendingUp /> +1.78%
          </Badge>
          <h3 className="my-2 text-2xl font-bold">$ 78,000</h3>
          <p className="font-light text-sm">Total Revenue</p>
        </div>
      </div>
      <div className="h-full min-h-48 w-full  border rounded-xl p-4 bg-card">
        <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center">
          <BalanceTransferIcon />
        </div>

        <div className="mt-6">
          <Badge className="rounded-2xl bg-red-100 text-red-800">
            <TrendingDown /> -1.78%
          </Badge>
          <h3 className="my-2 text-2xl font-bold">$ 43,000</h3>
          <p className="font-light text-sm">Total Expense</p>
        </div>
      </div>

      <div className="h-full min-h-48 w-full  border rounded-xl p-4 bg-card">
        <div className="size-10 bg-primary/20 rounded-lg flex justify-center items-center">
          <NetProfitIcon />
        </div>

        <div className="mt-6">
          <Badge className="rounded-2xl bg-green-200 text-green-800">
            <TrendingUp /> +1.24%
          </Badge>
          <h3 className="my-2 text-2xl font-bold">$ 56,000</h3>
          <p className="font-light text-sm">Net Profit</p>
        </div>
      </div>
    </div>
  );
}
