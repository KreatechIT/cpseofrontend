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
import ExpenseSubCategoryFilters from "../../components/expenses/sub-categories/ExpenseSubCategoryFilters";

const SubCategoryPage = () => {
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
      <title>Expense Sub Categories - Core360</title>

      <main className="mt-1 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <PageHeading
            pageTitle="Expense Sub Categories"
            withCardTableView={false}
          />

          <div className="flex gap-2">
            {expenseSubCategories &&
              expenseSubCategories.length > 1 &&
              hasPermission("finance_category.edit") && (
                <Button
                  className="rounded-lg"
                  variant="outline"
                  onClick={() => {
                    dispatch(
                      setDialogData({
                        type: "sortExpenseSubCategory",
                        props: expenseSubCategories,
                        styles: "md:min-w-[650px]",
                      })
                    );
                  }}
                >
                  Sort Sub Categories <ArrowDownNarrowWide />
                </Button>
              )}

            {hasPermission("finance_category.add") && (
              <Button
                className="rounded-lg"
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addExpenseSubCategory",
                      styles: "md:min-w-[500px]",
                    })
                  );
                }}
              >
                Add Sub Category <Plus />
              </Button>
            )}
          </div>
        </div>

        {expenseCategories &&
          expenseSubCategories &&
          expenseSubSubCategories && (
            <ExpenseSubCategoryFilters
              expenseCategories={expenseCategories}
              expenseSubCategories={expenseSubCategories}
              expenseSubSubCategories={expenseSubSubCategories}
            />
          )}
      </main>
    </>
  );
};

export default SubCategoryPage;
