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

const ExpenseCategoryTableView = ({
  filteredExpenseCategories,
  expenseSubCategoryCounts,
}) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Category</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredExpenseCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="p-3">{category?.name}</TableCell>

              <TableCell>
                {expenseSubCategoryCounts[category.id] > 1
                  ? `${expenseSubCategoryCounts[category.id]} Sub Categories`
                  : `${
                      expenseSubCategoryCounts[category.id] || 0
                    } Sub Categories`}
              </TableCell>

              <TableCell>
                <div className="flex max-w-[8rem] gap-2.5">
                  {hasPermission("finance_category.edit") && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() =>
                        dispatch(
                          setDialogData({
                            type: "editExpenseCategory",
                            props: category,
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
                            type: "archiveExpenseCategory",
                            props: category,
                          })
                        )
                      }
                    >
                      <Trash2Icon /> Archive
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}

          {filteredExpenseCategories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No categories found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseCategoryTableView;
