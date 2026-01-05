import usePermission from "@/hooks/usePermission";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBudgets } from "../../../../modules/finance-module/services/budgetService";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import BudgetDetailsFilters from "../../components/budgets/budget-details/BudgetDetailsFilters";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const BudgetDetailsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { user } = useSelector((state) => state.auth);
  const { budgets } = useSelector((state) => state.budgets);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);

  // Fetch Wallet Activities Data.
  useEffect(() => {
    if (!budgets) getAllBudgets(user.organisation_id, dispatch);

    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  const getBudgetFilteredData = (
    fromDate,
    toDate,
    company,
    department,
    status
  ) => {
    getAllBudgets(
      user.organisation_id,
      dispatch,
      fromDate,
      toDate,
      company,
      department,
      status
    );
  };

  return (
    <>
      <title>Budget Details - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading pageTitle="Budget Details" withCardTableView={false} />

          <div className="flex gap-2.5 items-center">
            {hasPermission("finance_budget.add") && (
              <>
                <Button
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "addBudget",
                        styles: "md:min-w-[750px] lg:min-w-[850px]",
                      })
                    );
                  }}
                >
                  Add Budget
                </Button>
              </>
            )}
          </div>
        </div>

        {budgets && companies && departments ? (
          <BudgetDetailsFilters
            budgets={budgets}
            companies={companies}
            departments={departments}
            onFilter={getBudgetFilteredData}
          />
        ) : (
          <TableSkeleton />
        )}
      </main>
    </>
  );
};

export default BudgetDetailsPage;
