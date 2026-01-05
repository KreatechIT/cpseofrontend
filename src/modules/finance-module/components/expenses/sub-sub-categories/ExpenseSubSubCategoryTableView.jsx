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

const ExpenseSubSubCategoryTableView = ({
  filteredExpenseSubSubCategories,
}) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Sub Sub Category</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Strategy</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredExpenseSubSubCategories.map((subSubCategory) => (
            <TableRow key={subSubCategory.id}>
              <TableCell className="p-3">{subSubCategory?.name}</TableCell>

              <TableCell>{subSubCategory?.expenses_sub_category}</TableCell>
              <TableCell>{subSubCategory?.strategy}</TableCell>
              <TableCell>{subSubCategory?.type}</TableCell>

              <TableCell>
                <div className="flex max-w-[8rem] gap-2.5">
                  {hasPermission("finance_category.edit") && (
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() =>
                        dispatch(
                          setDialogData({
                            type: "editExpenseSubSubCategory",
                            props: subSubCategory,
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
                            type: "archiveExpenseSubSubCategory",
                            props: subSubCategory,
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

          {filteredExpenseSubSubCategories.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No sub sub categories found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseSubSubCategoryTableView;
