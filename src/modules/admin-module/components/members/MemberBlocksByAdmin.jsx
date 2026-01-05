import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, SquareChartGantt, TrashIcon, UserRound } from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch } from "react-redux";
import usePermission from "@/hooks/usePermission";

export const MemberNameAndEmail = function ({ member, view = "card" }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        className={cn(
          "h-10 w-10 rounded-full border border-black/10",
          view === "card" && "h-11 w-11"
        )}
      >
        <AvatarFallback className="dark:bg-white/10">
          <UserRound size={22} className="opacity-60" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className={cn("", view === "card" && "text-lg leading-5")}>
          {`${member.first_name} ${member.last_name}`}
        </h2>
        <p className="text-muted-foreground text-sm">{member.email}</p>
      </div>
    </div>
  );
};

export function MemberThreeDotsDropdown({
  member,
  organisation,
  view = "card",
}) {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center px-2 pt-1">
          <ThreeDotsIcon className="scale-75" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="end">
        {view === "table" && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "memberRoleDetailsByAdmin",
                  props: { memberRole: member, organisation: organisation },
                  styles: "md:min-w-[750px]",
                })
              )
            }
          >
            <SquareChartGantt size={16} aria-hidden="true" />
            <span>View Details</span>
          </DropdownMenuItem>
        )}

        {hasPermission("member.edit") && (
          <DropdownMenuItem
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "editMemberByAdmin",
                  props: {
                    organisation_id: organisation.id,
                    memberInfo: member,
                    styles: "md:min-w-[750px]",
                  },
                })
              );
            }}
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("member.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "archiveMemberByAdmin",
                  props: {
                    organisation_id: organisation.organisation_id,
                    memberInfo: member,
                  },
                  styles: "md:min-w-[550px]",
                })
              );
            }}
          >
            <TrashIcon size={16} aria-hidden="true" />
            <span>Archive</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MemberPermissions({ member, view = "card", organisation }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-grow flex-col justify-between">
      <p className="mt-0.5 text-sm text-black/70 capitalize dark:text-white/70">
        {Object.entries(member.permissions)
          // eslint-disable-next-line no-unused-vars
          .filter(([key, value]) => typeof value === "boolean" && value) // only top-level booleans
          .map(([key]) => key.replace(/_/g, " "))
          .slice(0, 5)
          .join(", ") || "N/A"}
      </p>
      {view === "card" && (
        <p
          className="cursor-pointer text-end text-sm underline"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "memberRoleDetailsByAdmin",
                props: { memberRole: member, organisation: organisation },
                styles: "md:min-w-[700px]",
              })
            )
          }
        >
          View Details
        </p>
      )}
    </div>
  );
}
