import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  approveBudgetByFinance,
  approveBudgetByHOD,
} from "@/modules/finance-module/services/budgetService";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ReceiptTextIcon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const BudgetDetailsTable = ({ filteredBudgets }) => {
  const dispatch = useDispatch();
  const { hasPermission, hasAnyPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="pl-3 py-3">Forecast Month</TableHead>
            {/* <TableHead>Submitted Date</TableHead> */}
            <TableHead>Project Handler</TableHead>

            <TableHead>Company</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Sub Sub Category</TableHead>
            <TableHead>Forecast Cost</TableHead>

            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>

            {hasAnyPermission([
              "finance_budget.hod_approve",
              "finane_budget.finance_approve",
            ]) && <TableHead>Action</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredBudgets.map((budget) => (
            <TableRow key={budget.id}>
              <TableCell>
                <div className="pl-1 py-3 flex items-center gap-2">
                  <CalendarIcon className="size-4" />{" "}
                  {format(budget.forecast_month, "MMM yyyy")}
                </div>
              </TableCell>

              <TableCell>{budget?.submitted_by || "-"}</TableCell>
              <TableCell>{budget?.company || "-"}</TableCell>
              <TableCell>{budget?.department || "-"}</TableCell>
              <TableCell>{budget?.expenses_sub_sub_category || "-"}</TableCell>
              <TableCell>{formatCurrency(budget?.forecast_cost)}</TableCell>
              <TableCell>{budget?.quantity || "-"}</TableCell>

              <TableCell>
                {
                  <Badge
                    className={`px-3 text-black ${getStatusColor(
                      budget?.status
                    )}`}
                  >
                    {budget?.status}
                  </Badge>
                }
              </TableCell>

              <TableCell>
                <div className="flex max-w-30">
                  {hasPermission("finance_revenue.archive") && (
                    <Button
                      size="xs"
                      variant="outline"
                      className="border-primary/75 dark:border-primary/75 font-normal"
                      onClick={() =>
                        dispatch(
                          setDialogData({
                            type: "budgetDetails",
                            props: budget,
                            styles: "md:min-w-[750px] xl:min-w-[800px]",
                          })
                        )
                      }
                    >
                      <ReceiptTextIcon className="opacity-75" /> View Details
                    </Button>
                  )}
                </div>
              </TableCell>

              {/* Actions */}
              {hasAnyPermission([
                "finance_budget.hod_approve",
                "finane_budget.finance_approve",
              ]) && (
                <TableCell>
                  <ActionButtons budget={budget} />
                </TableCell>
              )}
            </TableRow>
          ))}

          {filteredBudgets.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No budget found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BudgetDetailsTable;

const ActionButtons = ({ budget }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handleApprove = () => {
    if (budget.status === "Submitted") {
      approveBudgetByHOD(user.organisation_id, budget.id, dispatch);
    } else if (budget.status === "Processing") {
      approveBudgetByFinance(user.organisation_id, budget.id, dispatch);
    }
  };

  return (
    <div className="flex gap-2 max-w-50">
      {/* Approve: Only show when any one is true.
            1. Status is Submitted and User has "HOD Approve" permission.
            2. Status is Processing and User has  or "Finance Approve" permission
        */}
      {((hasPermission("finance_budget.hod_approve") &&
        budget.status === "Submitted") ||
        (hasPermission("finance_budget.finance_approve") &&
          budget.status === "Processing")) && (
        <Button
          size="xs"
          className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
          onClick={handleApprove}
        >
          <CheckIcon /> Approve
        </Button>
      )}

      {/* Reject: Only show when any one is true.
            1. Status is Submitted and User has "HOD Approve" permission.
            2. Status is Processing and User has  or "Finance Approve" permission
        */}
      {((hasPermission("finance_budget.hod_approve") &&
        budget.status === "Submitted") ||
        (hasPermission("finance_budget.finance_approve") &&
          budget.status === "Processing")) && (
        <Button
          size="xs"
          variant="destructive"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "rejectBudget",
                props: budget,
              })
            )
          }
        >
          <XIcon /> Reject
        </Button>
      )}
    </div>
  );
};
