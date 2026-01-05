import { format } from "date-fns";
import { CalendarDays, Building2, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useSelector } from "react-redux";
import { AddExpenseIcon } from "@/components/icons/FinanceIcons";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { Button } from "@/components/ui/button";

const ClaimViewDetails = () => {
  const claim = useSelector((state) => state.dialog.props);
  return (
    <div className="-mt-6">
      <AddExpenseIcon className="drop-shadow-md mx-auto size-14" />
      <h2 className="text-xl font-medium text-center">Claim Details</h2>

      <div className="space-y-4 px-2 md:px-4 py-2 text-sm text-muted-foreground">
        {/* Claim Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span>Claim Info</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1">Claim Date</p>
              <p className="text-foreground font-medium">
                {format(new Date(claim.claim_date), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Submitted Date</p>
              <p className="text-foreground font-medium">
                {format(new Date(claim.submitted_date), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Claim By</p>
              <p className="text-foreground font-medium">{claim.claimed_by}</p>
            </div>
            <div>
              <p className="text-xs mb-1">Claim Amount</p>
              <p className="text-foreground font-medium">
                {formatCurrency(claim.claim_amount)}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Type</p>
              <p className="text-foreground font-medium">{claim.type}</p>
            </div>
            <div>
              <p className="text-xs mb-1">Bank</p>
              <p className="text-foreground font-medium">{claim.bank}</p>
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
              <p className="text-foreground font-medium">{claim.company}</p>
            </div>
            <div>
              <p className="text-xs mb-1">Department</p>
              <p className="text-foreground font-medium">{claim.department}</p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub-Department</p>
              <p className="text-foreground font-medium">
                {claim.sub_department}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Expense Category */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            <span>Claim Categories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs mb-1">Category</p>
              <p className="text-foreground font-medium">
                {claim.expenses_category}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub Category</p>
              <p className="text-foreground font-medium">
                {claim.expenses_sub_category}
              </p>
            </div>
            <div>
              <p className="text-xs mb-1">Sub Sub Category</p>
              <p className="text-foreground font-medium">
                {claim.expenses_sub_sub_category}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Description & Status */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-xs mb-1">Details</p>
            <p className="text-foreground font-medium whitespace-pre-wrap">
              {claim.details || "-"}
            </p>
          </div>
        </div>

        {/* Description & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs mb-1">Status</p>
            <Badge
              className={`px-3 py-1 text-black ${getStatusColor(claim.status)}`}
            >
              {claim.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs mb-1">Receipt</p>
            <p className="text-foreground font-medium whitespace-pre-wrap">
              {claim.attached_receipt ? (
                <a href={claim.attached_receipt} target="_blank">
                  <Button size="xs" className="py-3.5">
                    Download
                  </Button>
                </a>
              ) : (
                "No recipt available."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimViewDetails;
