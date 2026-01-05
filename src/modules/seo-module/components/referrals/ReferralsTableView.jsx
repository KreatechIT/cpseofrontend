import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import usePermission from "@/hooks/usePermission";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { CalendarIcon, EditIcon, Trash2Icon, UserIcon } from "lucide-react";
import { setDialogData } from "@/store/reducers/dialogSlice";

import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReferralTableView = ({ filteredReferrals }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Date</TableHead>
            <TableHead>Referrals ID</TableHead>
            <TableHead>Referrer</TableHead>
            <TableHead>Job Referred</TableHead>
            <TableHead>Referee</TableHead>
            <TableHead>Referrals Bonus</TableHead>

            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredReferrals.map((referral) => (
            <TableRow key={referral.id}>
              <TableCell>
                <div className="pl-3 py-2.5 flex items-center gap-2">
                  <CalendarIcon size="16" />

                  {format(referral.created, "PP")}
                </div>
              </TableCell>
              <TableCell>{referral?.refferals_id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 rounded-full border border-black/10">
                    <AvatarImage
                      src={referral.referrer_image}
                      alt={referral?.referrer_name}
                      className="h-full w-full rounded-full object-cover border"
                    />
                    <AvatarFallback className="dark:bg-white/10">
                      <UserIcon
                        size={22}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  </Avatar>

                  {referral?.referrer_name}
                </div>
              </TableCell>
              <TableCell>{referral?.job_reffered}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 rounded-full border border-black/10">
                    <AvatarImage
                      src={referral.referee_image}
                      alt={referral?.referee_name}
                      className="h-full w-full rounded-full object-cover border"
                    />
                    <AvatarFallback className="dark:bg-white/10">
                      <UserIcon
                        size={22}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  </Avatar>

                  {referral?.referee_name}
                </div>
              </TableCell>

              <TableCell>{referral?.refferals_bonus}</TableCell>

              <TableCell>
                <ActionButtons referral={referral} />
              </TableCell>
            </TableRow>
          ))}

          {filteredReferrals.length === 0 && (
            <TableRow>
              <TableCell colSpan={7}>No referrals found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReferralTableView;

const ActionButtons = ({ referral }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div className="flex max-w-[8rem] gap-2.5">
      {hasPermission("hr_referral.edit") && (
        <Button
          size="xs"
          variant="outline"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "editReferral",
                props: referral,
                styles: "md:min-w-[750px] xl:min-w-[850px]",
              })
            )
          }
        >
          <EditIcon /> Edit
        </Button>
      )}

      {hasPermission("hr_referral.archive") && (
        <Button
          size="xs"
          variant="destructive"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "archiveReferral",
                props: referral,
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
