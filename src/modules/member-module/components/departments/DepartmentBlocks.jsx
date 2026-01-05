import { cn } from "@/utils/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Edit, TrashIcon } from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/usePermission";

export function DepartmentThreeDotsDropdown({ department }) {
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
        {hasPermission("department.edit") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editDepartment",
                  props: { department },
                  styles: "md:min-w-[600px]",
                })
              )
            }
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("department.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveDepartment",
                  props: department,
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

export const DepartmentActionButtons = function ({
  department,
  view = "card",
}) {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  return (
    <div
      className={cn(
        "grid w-full gap-4 text-sm",
        view === "table" && "-ml-2 max-w-md scale-95 grid-cols-2"
      )}
    >
      <Button
        className="border-primary/75 dark:border-primary/75 w-full gap-3 rounded-lg"
        variant="outline"
        onClick={() =>
          dispatch(
            setDialogData({
              type: "departmentDetails",
              props: department,
              styles: "md:min-w-[750px] lg:min-w-[850px]",
            })
          )
        }
      >
        View Details
      </Button>

      {hasPermission("department.add") && (
        <Button
          className="w-full gap-3 rounded-lg"
          onClick={() =>
            dispatch(
              setDialogData({
                type: "addSubDepartment",
                props: { department },
                styles: "md:min-w-[650px]",
              })
            )
          }
        >
          Add Sub Department
        </Button>
      )}
    </div>
  );
};
