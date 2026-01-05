import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, ShieldCheck, SquareChartGantt, TrashIcon } from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { useDispatch } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";
import usePermission from "@/hooks/usePermission";

export const MemberRoleNameAndCount = function ({
  memberRole,
  memberCount,
  view = "card",
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        className={cn(
          "h-10 w-10 rounded-full border border-black/10",
          view === "card" && "h-11 w-11"
        )}
      >
        <AvatarFallback className="dark:bg-white/10">
          <ShieldCheck size={22} className="opacity-60" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>

      <div>
        <h2
          className={cn("font-medium", view === "card" && "text-lg leading-5")}
        >
          {memberRole.name}
        </h2>
        {view === "card" && (
          <p className="text-muted-foreground text-sm">
            {memberCount} member{memberCount > 1 ? "s have" : " has"} this role.
          </p>
        )}
      </div>
    </div>
  );
};

export function MemberRoleThreeDotsDropdown({
  memberRole,
  memberCount,
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
                  type: "memberRoleDetails",
                  props: memberRole,
                  styles: "md:min-w-[800px] xl:min-w-[900px]",
                })
              )
            }
          >
            <SquareChartGantt size={16} aria-hidden="true" />
            <span>View Details</span>
          </DropdownMenuItem>
        )}

        {hasPermission("role.edit") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editMemberRole",
                  props: memberRole,
                  styles: "md:min-w-[800px] xl:min-w-[900px]",
                })
              )
            }
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("role.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveMemberRole",
                  props: {
                    memberRole: memberRole,
                    roleCount: memberCount,
                  },
                })
              )
            }
          >
            <TrashIcon size={16} aria-hidden="true" />
            <span>Archive</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MemberRolePermissions({ memberRole, view = "card" }) {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-grow flex-col justify-between">
      <p className="mt-0.5 text-sm text-black/70 capitalize dark:text-white/70">
        {Object.entries(memberRole.permissions)
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
                type: "memberRoleDetails",
                props: memberRole,
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
