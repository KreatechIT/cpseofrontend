import { useDispatch, useSelector } from "react-redux";
import { getBudgetSummary } from "../../../../modules/finance-module/services/budgetService";
import { useEffect, useState } from "react";
import { TableSkeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";

import BudgetSummaryPieChart from "../../components/budgets/budget-summary/BudgetSummaryPieChart";
import { BudgetSummaryBarChart } from "../../components/budgets/budget-summary/BudgetSummaryBarChart";
import BudgetSummaryTable from "../../components/budgets/budget-summary/BudgetSummaryTable";
import { format } from "date-fns";

const BudgetSummaryPage = () => {
  const dispatch = useDispatch();
  const [date, setDate] = useState(format(new Date(), "yyyy-MM"));
  const { user } = useSelector((state) => state.auth);
  const { budgetSummary } = useSelector((state) => state.budgets);
  const [isPieChartView, setIsPieChartView] = useState(true);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    getBudgetSummary(user.organisation_id, dispatch, `${date}-01`);
  }, [date]);

  return (
    <>
      <title>Budget Summary - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading pageTitle="Budget Summary" withCardTableView={false} />

          <div className="flex gap-2.5 items-center">
            <Button onClick={() => setIsPieChartView(!isPieChartView)}>
              {isPieChartView ? "Bar Chart View" : "Pie Chart View"}
            </Button>
          </div>
        </div>

        {budgetSummary ? (
          <section className="@container mt-5 h-full">
            {isPieChartView ? (
              <BudgetSummaryPieChart data={budgetSummary} />
            ) : (
              <BudgetSummaryBarChart data={budgetSummary} />
            )}

            <BudgetSummaryTable
              data={budgetSummary}
              month={date}
              setMonth={setDate}
            />
          </section>
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default BudgetSummaryPage;
