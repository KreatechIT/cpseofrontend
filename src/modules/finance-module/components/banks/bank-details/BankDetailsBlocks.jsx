import { cn } from "@/utils/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreditCard, Edit, TrashIcon, User2Icon } from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { setDialogData } from "@/store/reducers/dialogSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/usePermission";

export const BankThreeDotsDropdown = ({ bank }) => {
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
        <DropdownMenuItem
          onClick={() =>
            dispatch(
              setDialogData({
                type: "bankDetailedView",
                props: bank,
                styles: "md:min-w-[750px] xl:min-w-[800px]",
              })
            )
          }
        >
          <CreditCard size={16} aria-hidden="true" />
          <span>Details</span>
        </DropdownMenuItem>

        {hasPermission("finance_bank.assign") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "assignMemberToBank",
                  props: bank,
                  styles: "md:min-w-[750px] xl:min-w-[800px]",
                })
              )
            }
          >
            <User2Icon size={16} aria-hidden="true" />
            <span>Assign</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {hasPermission("finance_bank.edit") && (
          <DropdownMenuItem
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "editBank",
                  props: bank,
                  styles: "md:min-w-[750px] xl:min-w-[800px]",
                })
              )
            }
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("finance_bank.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() =>
              dispatch(
                setDialogData({
                  type: "archiveBank",
                  props: bank,
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

export const BankActionButtons = ({ bank, view = "card" }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={cn(
        "grid w-full grid-cols-[60%_40%] gap-2 text-sm",
        view === "table" && "-ml-2 max-w-60"
      )}
    >
      <Button
        className="border-primary/75 dark:border-primary/75 w-full gap-3 rounded-lg px-4 text-xs"
        variant="outline"
        size={view === "table" ? "sm" : "default"}
        onClick={() =>
          dispatch(
            setDialogData({
              type: "bankWithdrawDeposit",
              props: bank,
              styles: "md:min-w-[750px] xl:min-w-[800px]",
            })
          )
        }
        disabled={bank.status === "Inactive"}
      >
        Deposit/Withdraw
      </Button>

      <Button
        className="w-full gap-3 rounded-lg px-0 text-xs"
        size={view === "table" ? "sm" : "default"}
        onClick={() =>
          dispatch(
            setDialogData({
              type: "bankTransfer",
              props: bank,
              styles: "md:min-w-[750px] xl:min-w-[800px]",
            })
          )
        }
        disabled={bank.status === "Inactive"}
      >
        Transfer
      </Button>
    </div>
  );
};
