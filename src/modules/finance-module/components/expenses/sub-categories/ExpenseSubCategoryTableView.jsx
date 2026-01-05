import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useDispatch } from "react-redux";

const ExpenseSubCategoryTableView = ({
  filteredExpenseSubCategories,
  expenseSubSubCategoryCounts,
}) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Sub Category</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub Sub Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredExpenseSubCategories.map((subCategory) => (
            <TableRow key={subCategory.id}>
              <TableCell className="p-3">{subCategory?.name}</TableCell>
              <TableCell>{subCategory?.expenses_category}</TableCell>

              <TableCell>
                {expenseSubSubCategoryCounts[subCategory.id] > 1
                  ? `${
                      expenseSubSubCategoryCounts[subCategory.id]
                    } Sub Sub Categories`
                  : `${
                      expenseSubSubCategoryCounts[subCategory.id] || 0
                    } Sub Sub Categories`}
              </TableCell>

              <TableCell className="flex max-w-[8rem] gap-2.5">
                {hasPermission("finance_category.edit") && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      dispatch(
                        setDialogData({
                          type: "editExpenseSubCategory",
                          props: subCategory,
                          styles: "md:min-w-[400px]",
                        })
                      )
                    }
                  >
                    <EditIcon /> Edit
                  </Button>
                )}

                {hasPermission("finance_category.archive") && (
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() =>
                      dispatch(
                        setDialogData({
                          type: "archiveExpenseSubCategory",
                          props: subCategory,
                        })
                      )
                    }
                  >
                    <Trash2Icon /> Archive
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}

          {filteredExpenseSubCategories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No sub categories found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseSubCategoryTableView;
