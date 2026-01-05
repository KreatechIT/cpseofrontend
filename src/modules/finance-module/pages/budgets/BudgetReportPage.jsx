import { useDispatch, useSelector } from "react-redux";
import { getBudgetReport } from "../../../../modules/finance-module/services/budgetService";
import { useEffect } from "react";
import { TableSkeleton } from "@/components/ui/skeleton";
import { PageHeading } from "@/components/shared/PageHeading";
import BudgetReportFilters from "../../components/budgets/budget-report/BudgetReportFilters";

const BudgetReportPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { budgetReport } = useSelector((state) => state.budgets);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!budgetReport) getBudgetReport(user.organisation_id, dispatch);
  }, []);

  const getBudgetReportFilteredData = (date) => {
    getBudgetReport(user.organisation_id, dispatch, date);
  };

  return (
    <>
      <title>Budget Report - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading pageTitle="Budget Report" withCardTableView={false} />

          <div className="flex gap-2.5 items-center"></div>
        </div>

        {budgetReport ? (
          <BudgetReportFilters
            budgetReport={budgetReport}
            onFilter={getBudgetReportFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default BudgetReportPage;
