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

export const CompanyThreeDotsDropdown = ({ company }) => {
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
        {hasPermission("company.edit") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editCompany",
                  props: company,
                  styles: "md:min-w-[600px]",
                })
              )
            }
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("company.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveCompany",
                  props: company,
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

export const CompanyActionButtons = ({ company, view = "card" }) => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-4 text-sm",
        view === "table" && "-ml-2 max-w-xs scale-95"
      )}
    >
      <Button
        className="border-primary/75 dark:border-primary/75 w-full gap-3 rounded-lg"
        variant="outline"
        onClick={() =>
          dispatch(
            setDialogData({
              type: "companyDetails",
              props: company,
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
                type: "addDepartment",
                props: { company },
                styles: "md:min-w-[650px]",
              })
            )
          }
        >
          Add Department
        </Button>
      )}
    </div>
  );
};
