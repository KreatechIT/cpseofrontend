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
import { formatCurrency } from "@/utils/formatCurrency";
import { format } from "date-fns";
import { CalendarIcon, Trash2Icon } from "lucide-react";
import { useDispatch } from "react-redux";

const WalletActivityTable = ({ filteredWalletActivities }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3 py-3.5">Date</TableHead>
            <TableHead>Company</TableHead>

            <TableHead>Deposit</TableHead>
            <TableHead>Withdraw</TableHead>
            <TableHead>Bonus Given</TableHead>
            <TableHead>Description</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredWalletActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="p-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />{" "}
                {format(activity?.transaction_date, "yyyy/MM/dd")}
              </TableCell>

              <TableCell>{activity?.company}</TableCell>
              <TableCell>{formatCurrency(activity?.deposit_amount)}</TableCell>
              <TableCell>{formatCurrency(activity?.withdraw_amount)}</TableCell>
              <TableCell>
                {formatCurrency(activity?.bonus_given_amount)}
              </TableCell>
              <TableCell>{activity?.description || "-"}</TableCell>

              <TableCell>
                <div className="flex max-w-[4rem] gap-2.5">
                  {hasPermission("finance_revenue.archive") && (
                    <Button
                      size="xs"
                      variant="destructive"
                      onClick={() =>
                        dispatch(
                          setDialogData({
                            type: "archiveWalletActivity",
                            props: activity,
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

          {filteredWalletActivities.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No wallet activity found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WalletActivityTable;
