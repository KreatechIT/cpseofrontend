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
import { approveBankTransaction } from "@/modules/finance-module/services/bankService";

import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon, Trash2Icon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const BankTransactionTable = ({ filteredTransactions }) => {
  const { hasPermission } = usePermission();
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="pl-3 py-4">Date</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>
              Transaction <br /> Type
            </TableHead>

            <TableHead>
              Initial <br /> Amount
            </TableHead>
            <TableHead>
              Exchange <br /> Rate
            </TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Approver</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>

            {hasPermission("finance_bank.approve") && (
              <TableHead>Action</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />{" "}
                {format(transaction?.transaction_date, "yyyy/MM/dd")}
              </TableCell>

              <TableCell>{transaction?.bank || "-"}</TableCell>
              <TableCell>{transaction?.transaction_type || "-"}</TableCell>
              <TableCell>
                {transaction?.initial_amount
                  ? formatCurrency(transaction?.initial_amount)
                  : "-"}
              </TableCell>
              <TableCell>{transaction?.exchange_rate}</TableCell>
              <TableCell>
                {transaction?.amount
                  ? formatCurrency(transaction?.amount)
                  : "-"}
              </TableCell>
              <TableCell>{transaction?.approver || "-"}</TableCell>

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
                <div className="max-w-60 lg:max-w-48 break-words whitespace-normal line-clamp-2">
                  {transaction?.description || "-"}
                </div>
              </TableCell>

              {/* Actions */}
              {hasPermission("finance_bank.approve") && (
                <TableCell>
                  <ActionButtons transaction={transaction} />
                </TableCell>
              )}
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

export default BankTransactionTable;

const ActionButtons = ({ transaction }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handleApprove = () => {
    approveBankTransaction(user.organisation_id, transaction.id, dispatch);
  };

  return (
    <div className="flex gap-2 max-w-34">
      {/* Approve: Only show when any one is true.
            1. Status is Submitted and User has "Approve" permission.
        */}
      {hasPermission("finance_bank.approve") &&
        transaction.status === "Submitted" && (
          <>
            <Button
              size="xs"
              className="bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800"
              onClick={handleApprove}
            >
              <CheckIcon /> Approve
            </Button>

            <Button
              size="xs"
              variant="destructive"
              onClick={() =>
                dispatch(
                  setDialogData({
                    type: "rejectBankTransaction",
                    props: transaction,
                  })
                )
              }
            >
              <XIcon /> Reject
            </Button>
          </>
        )}

      {/* Archive: Only show when user has archive permission and status is Approved */}
      {hasPermission("finance_bank.archive") &&
        transaction.status === "Approved" && (
          <Button
            size="xs"
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveBankTransaction",
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
