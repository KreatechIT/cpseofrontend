import { PageHeading } from "@/components/shared/PageHeading";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import RevenueExpenseProfitCards from "../../components/dashboard/RevenueExpenseProfitCards";
import BankCard from "../../components/dashboard/BankCard";
import TopupTransferRequestCard from "../../components/dashboard/TopupTransferRequestCard";
import DailyLimitCard from "../../components/dashboard/DailyLimitCard";
import SavingsPlan from "../../components/dashboard/SavingsPlan";
import CashflowChart from "../../components/dashboard/CashFlowChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import StatisticsCard from "../../components/dashboard/StatisticsCard";
import RecentActivity from "@/modules/member-module/components/dashboard/RecentActivity";
import { ScrollArea } from "@/components/ui/scroll-area";

const FinanceDashboard = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const from = queryParams.get("from");
  useEffect(() => {
    if (from === "uam" || from === "hr") {
      toast("Welcome to Finance Management.");
    }
  }, [from]);

  return (
    <>
      <title>Finance Dashboard - Core360</title>

      <main className="mt-1 flex h-full flex-col @container">
        <div className="flex items-center justify-between">
          <PageHeading withCardTableView={false}>
            <span className="font-semibold opacity-90">Finance Dashbaord</span>
          </PageHeading>
        </div>

        <div className="mt-6 flex flex-col @5xl:flex-row gap-6">
          <div className="w-full">
            <div className="w-full flex flex-col @4xl:flex-row gap-6">
              <BankCard />
              <RevenueExpenseProfitCards />
            </div>

            <div className="flex gap-6 w-full mt-4">
              <div className="w-full max-w-100">
                <TopupTransferRequestCard />
                <DailyLimitCard />
                <SavingsPlan />
              </div>
              <div className="w-full">
                <CashflowChart />
                <RecentTransactions />
              </div>
            </div>
          </div>

          <div className="max-w-85 w-1/4 shrink-0">
            <StatisticsCard />
            <ScrollArea className="h-110 border rounded-xl">
              <RecentActivity />
            </ScrollArea>
          </div>
        </div>
      </main>
    </>
  );
};

export default FinanceDashboard;
