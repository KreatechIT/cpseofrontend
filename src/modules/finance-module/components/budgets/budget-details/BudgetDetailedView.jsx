import {
  CalendarDays,
  Clock,
  User,
  BadgeDollarSign,
  Target,
  ClipboardList,
} from "lucide-react";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { getStatusColor } from "@/utils/getStatusColor";
import { formatCurrency } from "@/utils/formatCurrency";
import { AddBudgetIcon } from "@/components/icons/FinanceIcons";

const BudgetDetailedView = () => {
  const budgetInfo = useSelector((state) => state.dialog.props);

  if (!budgetInfo) {
    return <p>Not budget found</p>;
  }

  return (
    <div>
      <div>
        <AddBudgetIcon className="drop-shadow-md mx-auto size-14 -mt-2" />
      </div>
      <h2 className="text-xl font-medium text-center mt-2">Budget Details</h2>

      <div className="space-y-4 px-2 md:px-4 py-2 text-sm text-muted-foreground">
        {/* Timing */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Timing</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Forecast Month
              </p>
              <p className="text-foreground font-medium">
                {format(new Date(budgetInfo?.forecast_month), "MMMM yyyy")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Execution Period
              </p>
              <p className="text-foreground font-medium">
                {format(
                  new Date(budgetInfo.execution_period_start),
                  "MMMM dd, yyyy"
                )}{" "}
                –{" "}
                {format(
                  new Date(budgetInfo.execution_period_end),
                  "MMMM dd, yyyy"
                )}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Submission */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span>Submission</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Submitted Date
              </p>
              <p className="text-foreground font-medium">
                {format(new Date(budgetInfo.submitted_date), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Status</p>
              <Badge
                className={`px-3 py-1 text-black ${getStatusColor(
                  budgetInfo.status
                )}`}
              >
                {budgetInfo.status}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Basic Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>Basic Information</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Company</p>
              <p className="text-foreground font-medium">
                {budgetInfo.company}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Department</p>
              <p className="text-foreground font-medium">
                {budgetInfo.department}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Sub-Department
              </p>
              <p className="text-foreground font-medium">
                {budgetInfo.sub_department}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Project Handler
              </p>
              <p className="text-foreground font-medium">
                {budgetInfo.submitted_by}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Sub Sub Category
              </p>
              <p className="text-foreground font-medium">
                {budgetInfo.expenses_sub_sub_category}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-1">Quantity</p>
              <p className="text-foreground font-medium">
                {budgetInfo.quantity}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Financial Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
            <span>Financial Summary</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-muted-foreground text-xs mb-1">
                Forecast Cost
              </p>
              <p className="text-foreground font-medium">
                {formatCurrency(budgetInfo.forecast_cost)}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-black/10 dark:bg-white/10" />

        {/* Target */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>Goal</span>
          </div>
          <div className="bg-white/50 dark:bg-black/30 rounded-md p-3 text-foreground whitespace-pre-wrap">
            {budgetInfo.goal || "-"}
          </div>
        </div>

        {/* Costing Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <ClipboardList className="w-4 h-4 text-muted-foreground" />
            <span>Description</span>
          </div>
          <div className="bg-white/50 dark:bg-black/30 rounded-md p-3 text-foreground whitespace-pre-wrap">
            {budgetInfo.description || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailedView;
