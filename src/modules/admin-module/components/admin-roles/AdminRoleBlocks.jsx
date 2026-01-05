import { ThreeDotsIcon } from "@/components/icons/Icons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePermission from "@/hooks/usePermission";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { cn } from "@/utils/cn";
import {
  EditIcon,
  ShieldCheckIcon,
  SquareChartGanttIcon,
  TrashIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";

export const AdminRoleNameAndCount = ({
  adminRole,
  adminCount,
  view = "card",
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        className={cn(
          "h-10 w-10 rounded-full border border-black/10",
          view === "card" && "h-11 w-11"
        )}
      >
        <AvatarFallback className="dark:bg-white/10">
          <ShieldCheckIcon
            size={22}
            className="opacity-60"
            aria-hidden="true"
          />
        </AvatarFallback>
      </Avatar>

      <div>
        <h2
          className={cn("font-medium", view === "card" && "text-lg leading-5")}
        >
          {adminRole.name}
        </h2>
        {view === "card" && (
          <p className="text-muted-foreground text-sm">
            {adminCount} admin{adminCount > 1 ? "s have" : " has"} this role.
          </p>
        )}
      </div>
    </div>
  );
};

export const AdminRoleThreeDotsDropdown = ({
  adminRole,
  adminCount,
  view = "card",
}) => {
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
                setDialogData({ type: "adminRoleDetails", props: adminRole })
              )
            }
          >
            <SquareChartGanttIcon size={16} aria-hidden="true" />
            <span>View Details</span>
          </DropdownMenuItem>
        )}

        {hasPermission("role.edit") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editAdminRole",
                  props: adminRole,
                  styles: "md:min-w-[750px]",
                })
              )
            }
          >
            <EditIcon size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("role.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveAdminRole",
                  props: { ...adminRole, roleCount: adminCount },
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
};
