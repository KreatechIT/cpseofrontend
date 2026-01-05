import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  getAllSubCategories,
  getAllSubSubCategories,
} from "../../services/expensesCategoryService";
import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { ArrowDownNarrowWide, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/usePermission";
import ExpenseCategoryFilters from "../../components/expenses/categories/ExpenseCategoryFilters";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenseCategories, expenseSubCategories, expenseSubSubCategories } =
    useSelector((state) => state.expenseCategory);
  const { hasPermission } = usePermission();

  // Fetch Expense Categories, Sub Categories, Sub Sub Categories.
  useEffect(() => {
    !expenseCategories && getAllCategories(user.organisation_id, dispatch);
    !expenseSubCategories &&
      getAllSubCategories(user.organisation_id, dispatch);
    !expenseSubSubCategories &&
      getAllSubSubCategories(user.organisation_id, dispatch);
  }, []);
  return (
    <>
      <title>Expense Categories - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Expense Categories"
            withCardTableView={false}
          />

          <div className="flex gap-2">
            {expenseCategories &&
              expenseCategories.length > 1 &&
              hasPermission("finance_category.edit") && (
                <Button
                  className="rounded-lg"
                  variant="outline"
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "sortExpenseCategory",
                        props: expenseCategories,
                        styles: "md:min-w-[650px]",
                      })
                    );
                  }}
                >
                  Sort Categories <ArrowDownNarrowWide />
                </Button>
              )}

            {hasPermission("finance_category.add") && (
              <Button
                className="rounded-lg"
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addExpenseCategory",
                      styles: "md:min-w-[500px]",
                    })
                  );
                }}
              >
                Add Category <Plus />
              </Button>
            )}
          </div>
        </div>

        {expenseCategories && expenseSubCategories && (
          <ExpenseCategoryFilters
            expenseCategories={expenseCategories}
            expenseSubCategories={expenseSubCategories}
          />
        )}
      </main>
    </>
  );
};

export default CategoryPage;
