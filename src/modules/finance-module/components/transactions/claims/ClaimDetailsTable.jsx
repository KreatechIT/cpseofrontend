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
import { approveClaimByHOD } from "@/modules/finance-module/services/claimService";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { getStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ReceiptTextIcon, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ClaimDetailsTable = ({ filteredClaims }) => {
  const dispatch = useDispatch();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="pl-3 py-3">Date</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Department</TableHead>

            <TableHead>Claim Amount</TableHead>
            <TableHead>Claim By</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Category</TableHead>

            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredClaims.map((claim) => (
            <TableRow key={claim.id}>
              <TableCell className="pl-3 py-3.5 flex items-center gap-2">
                <CalendarIcon className="size-4" />{" "}
                {format(claim?.claim_date, "yyyy/MM/dd")}
              </TableCell>

              <TableCell>{claim?.company || "-"}</TableCell>
              <TableCell>{claim?.department || "-"}</TableCell>
              <TableCell>{formatCurrency(claim?.claim_amount)}</TableCell>
              <TableCell>{claim?.claimed_by || "-"}</TableCell>
              <TableCell>{claim?.type || "-"}</TableCell>
              <TableCell>{claim?.from_bank_account || "-"}</TableCell>
              <TableCell>{claim?.expenses_category || "-"}</TableCell>

              <TableCell>
                {
                  <Badge
                    className={`px-3 text-black ${getStatusColor(
                      claim?.status
                    )}`}
                  >
                    {claim?.status}
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
                          type: "claimDetails",
                          props: claim,
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
                <ActionButtons claim={claim} />
              </TableCell>
            </TableRow>
          ))}

          {filteredClaims.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No claim found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClaimDetailsTable;

const ActionButtons = ({ claim }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const handleApprove = () => {
    if (claim.status === "Submitted") {
      approveClaimByHOD(user.organisation_id, claim.id, dispatch);
    } else if (claim.status === "Processing") {
      dispatch(
        setDialogData({
          type: "approveClaimByFinance",
          props: claim,
          styles: "md:min-w-[750px] lg:min-w-[850px]",
        })
      );
    }
  };

  return (
    <div className="flex gap-2 max-w-36">
      {/* Approve: Only show when any one is true.
            1. Status is Submitted and User has "HOD Approve" permission.
            2. Status is Processing and User has  or "Finance Approve" permission
        */}
      {((hasPermission("finance_claim.hod_approve") &&
        claim.status === "Submitted") ||
        (hasPermission("finance_claim.finance_approve") &&
          claim.status === "Processing")) && (
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
      {((hasPermission("finance_claim.hod_approve") &&
        claim.status === "Submitted") ||
        (hasPermission("finance_claim.finance_approve") &&
          claim.status === "Processing")) && (
        <Button
          size="xs"
          variant="destructive"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "rejectClaim",
                props: claim,
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
