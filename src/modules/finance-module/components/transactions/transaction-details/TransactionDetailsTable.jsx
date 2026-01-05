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
  approveTransactionByFinance,
  approveTransactionByHOD,
} from "@/modules/finance-module/services/transactionService";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  EditIcon,
  ReceiptTextIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const TransactionDetailsTable = ({ filteredTransactions }) => {
  const dispatch = useDispatch();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="pl-3 py-3">Date</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Department</TableHead>

            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Category</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />{" "}
                {format(transaction?.transaction_date, "yyyy/MM/dd")}
              </TableCell>

              <TableCell>{transaction?.company || "-"}</TableCell>
              <TableCell>{transaction?.department || "-"}</TableCell>
              <TableCell>{formatCurrency(transaction?.amount)}</TableCell>
              <TableCell>{transaction?.category || "-"}</TableCell>
              <TableCell>{transaction?.bank || "-"}</TableCell>
              <TableCell>{transaction?.expenses_category || "-"}</TableCell>

              <TableCell>
                {
                  <Badge
                    className={`px-3 text-black ${getStatusColor(
                      transaction?.status
                    )}`}
                  >
                    {transaction?.status}
                  </Badge>
                }
              </TableCell>

              <TableCell>
                <div className="flex max-w-30">
                  <Button
                    size="xs"
                    variant="outline"
                    className="border-primary/75 dark:border-primary/75 font-normal"
                    onClick={() =>
                      dispatch(
                        setDialogData({
                          type: "transactionDetails",
                          props: transaction,
                        })
                      )
                    }
                  >
                    <ReceiptTextIcon className="opacity-75" /> View Details
                  </Button>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                {" "}
                <ActionButtons transaction={transaction} />
              </TableCell>
            </TableRow>
          ))}

          {filteredTransactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No transaction found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionDetailsTable;

const ActionButtons = ({ transaction }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission, hasAnyPermission } = usePermission();

  const handleApprove = () => {
    if (transaction.status === "Submitted") {
      approveTransactionByHOD(user.organisation_id, transaction.id, dispatch);
    } else if (transaction.status === "Processing") {
      approveTransactionByFinance(
        user.organisation_id,
        transaction.id,
        dispatch
      );
    }
  };

  return (
    <div className="flex gap-2 max-w-50">
      {/* Approve: Only show when any one is true.
            1. Status is Submitted and User has "HOD Approve" permission.
            2. Status is Processing and User has  or "Finance Approve" permission
        */}
      {((hasPermission("finance_transaction.hod_approve") &&
        transaction.status === "Submitted") ||
        (hasPermission("finance_transaction.finance_approve") &&
          transaction.status === "Processing")) && (
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
      {((hasPermission("finance_transaction.hod_approve") &&
        transaction.status === "Submitted") ||
        (hasPermission("finance_transaction.finance_approve") &&
          transaction.status === "Processing")) && (
        <Button
          size="xs"
          variant="destructive"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "rejectTransaction",
                props: transaction,
              })
            )
          }
        >
          <XIcon /> Reject
        </Button>
      )}

      {/* Edit: Show when user has transaction edit permission and 
          1. Status is Submitted. or
          2. Status is Processing and user has "HOD Approve" or "Finance Approve" permission
    */}
      {hasPermission("finance_transaction.edit") &&
        (transaction.status === "Submitted" ||
          (transaction.status === "Processing" &&
            hasAnyPermission([
              "finance_transaction.hod_approve",
              "finance_transaction.finance_approve",
            ]))) && (
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editTransaction",
                  props: transaction,
                  styles: "md:min-w-[750px] lg:min-w-[850px]",
                })
              )
            }
          >
            <EditIcon /> Edit
          </Button>
        )}

      {/* Edit Approved: Show when user has transaction edit permission and Status is Approved
       */}
      {hasPermission("finance_transaction.edit") &&
        transaction.status === "Approved" && (
          <Button
            size="xs"
            variant="outline"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editApprovedTransaction",
                  props: transaction,
                  styles: "md:min-w-[750px] lg:min-w-[850px]",
                })
              )
            }
          >
            <EditIcon /> Edit
          </Button>
        )}

      {/* Archive: Only show when user has archive permission and status is Approved */}
      {hasPermission("finance_transaction.archive") &&
        transaction.status === "Approved" && (
          <Button
            size="xs"
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveTransaction",
                  props: transaction,
                })
              )
            }
          >
            <Trash2Icon /> Archive
          </Button>
        )}
    </div>
  );
};
