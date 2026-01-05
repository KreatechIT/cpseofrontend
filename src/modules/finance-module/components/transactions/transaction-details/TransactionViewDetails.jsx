import { format } from "date-fns";
import { CalendarDays, Building2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useSelector } from "react-redux";
import { AddBankIcon } from "@/components/icons/FinanceIcons";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { Button } from "@/components/ui/button";
import { addBaseURL } from "@/utils/addBaseUrl";

const TransactionViewDetails = () => {
  const transaction = useSelector((state) => state.dialog.props);

  return (
    <div className="-mt-6">
      <AddBankIcon className="drop-shadow-md mx-auto size-14" />
      <h2 className="text-xl font-medium text-center">Transaction Details</h2>

      <div className="space-y-4 px-2 md:px-4 py-2 text-sm text-muted-foreground">
        {/* Transaction Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span>Transaction Info</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs mb-1">Transaction Date</p>
              <p className="text-foreground font-medium">
                {format(new Date(transaction.transaction_date), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Amount</p>
              <p className="text-foreground font-medium">
                {formatCurrency(transaction.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Category</p>
              <p className="text-foreground font-medium">
                {transaction.category}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Bank</p>
              <p className="text-foreground font-medium">{transaction.bank}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Department Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span>Organisational Info</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1">Company</p>
              <p className="text-foreground font-medium">
                {transaction.company}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Department</p>
              <p className="text-foreground font-medium">
                {transaction.department}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub-Department</p>
              <p className="text-foreground font-medium">
                {transaction.sub_department}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Expense Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            <span>Transaction Categories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1">Category</p>
              <p className="text-foreground font-medium">
                {transaction.expenses_category}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub Category</p>
              <p className="text-foreground font-medium">
                {transaction.expenses_sub_category}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub Sub Category</p>
              <p className="text-foreground font-medium">
                {transaction.expenses_sub_sub_category}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Description & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1">Description</p>
            <p className="text-foreground font-medium whitespace-pre-wrap">
              {transaction.description || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs mb-1">Receipt</p>
            <p className="text-foreground font-medium whitespace-pre-wrap">
              {transaction.receipt ? (
                <a
                  href={addBaseURL(transaction.receipt)}
                  download={`receipt-${transaction.id}.pdf`}
                  target="_blank"
                >
                  <Button size="xs" className="py-3.5">
                    View
                  </Button>
                </a>
              ) : (
                "No recipt available."
              )}
            </p>
          </div>
        </div>

        {/* Description & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs mb-1">Status</p>
            <Badge
              className={`px-3 py-1 text-black ${getStatusColor(
                transaction.status
              )}`}
            >
              {transaction.status}
            </Badge>
          </div>

          {transaction.hod_approver && (
            <div>
              <p className="text-xs mb-1">HOD Approver</p>
              <p className="text-foreground font-medium whitespace-pre-wrap">
                {transaction.hod_approver}
              </p>
            </div>
          )}
          {transaction.finance_approver && (
            <div>
              <p className="text-xs mb-1">Finance Approver</p>
              <p className="text-foreground font-medium whitespace-pre-wrap">
                {transaction.hod_approver}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionViewDetails;
