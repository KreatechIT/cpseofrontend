import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Building2, Edit, TrashIcon } from "lucide-react";
import { ThreeDotsIcon } from "@/components/icons/Icons";

import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardKeyIcon } from "@/components/icons/Icons";

import { useDispatch } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";
import usePermission from "@/hooks/usePermission";

export const OrgNameAndMember = function ({ organisation, view = "card" }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar
        className={cn(
          "h-10 w-10 rounded-full border border-black/10",
          view === "card" && "h-11 w-11"
        )}
      >
        <AvatarImage
          src={organisation.logo}
          alt={organisation.name}
          className="h-full w-full rounded-full object-cover border"
        />
        <AvatarFallback className="dark:bg-white/10">
          <Building2 size={22} className="opacity-60" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h2
          className={cn("font-medium", view === "card" && "text-lg leading-5")}
        >
          {organisation.name}
        </h2>
        <p className="text-muted-foreground text-sm">
          {organisation?.member_count > 1
            ? `${organisation.member_count} Members`
            : `${organisation.member_count} Member`}
        </p>
      </div>
    </div>
  );
};

export const OrgActionButtons = function ({ organisation, view = "card" }) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-2 gap-4 text-sm",
        view === "table" && "-ml-2 max-w-xs scale-95"
      )}
    >
      <Link to={`/user-access/organisation/${organisation.id}/members`}>
        <Button
          className="border-primary/75 dark:border-primary/75 w-full gap-3"
          variant="outline"
        >
          <Users aria-hidden="true" />
          Members
        </Button>
      </Link>
      <Link to={`/user-access/organisation/${organisation.id}/roles`}>
        <Button className="w-full gap-3">
          <CardKeyIcon
            className="scale-[130%] stroke-white"
            aria-hidden="true"
          />
          Roles
        </Button>
      </Link>
    </div>
  );
};

export function OrgThreeDotsDropdown({ organisation }) {
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
        {hasPermission("organisation.edit") && (
          <DropdownMenuItem
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "editOrganisation",
                  props: organisation,
                  styels: "md:min-w-[750px] xl:min-w-[850px]",
                })
              );
            }}
          >
            <Edit size={16} aria-hidden="true" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {hasPermission("organisation.archive") && (
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "archiveOrganisation",
                  props: organisation,
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

export function OrgProducts({ organisation }) {
  return (
    <p className="mt-0.5 text-black/70 capitalize dark:text-white/70">
      {Object.entries(organisation.products)
        // eslint-disable-next-line no-unused-vars
        .map(([key, value]) => value.name)
        .slice(0, 6)
        .join(", ") || "N/A"}
    </p>
  );
}
