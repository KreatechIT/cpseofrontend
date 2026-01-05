import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  DepartmentActionButtons,
  DepartmentThreeDotsDropdown,
} from "./DepartmentBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Layers } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import usePermission from "@/hooks/usePermission";

const DepartmentCardView = ({ filteredDepartments, subDepartmentCounts }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredDepartments.map((department) => (
        <DepartmentCard
          key={department.id}
          department={department}
          subDepartmentCount={subDepartmentCounts[department.id] || 0}
        />
      ))}

      {filteredDepartments.length === 0 && <p>No department found</p>}
    </div>
  );
};

export default DepartmentCardView;

const DepartmentCard = function ({ department, subDepartmentCount }) {
  const { hasAnyPermission } = usePermission();

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 rounded-full border border-black/10">
            <AvatarFallback className="dark:bg-white/10">
              <Layers size={20} className="opacity-60" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          {department?.name}
        </div>

        {hasAnyPermission(["department.edit", "department.archive"]) && (
          <DepartmentThreeDotsDropdown department={department} />
        )}
      </CardHeader>

      <CardContent className="-mt-2 flex justify-between text-sm">
        <div>
          {subDepartmentCount > 1
            ? `${subDepartmentCount} Sub Departments`
            : `${subDepartmentCount} Sub Department`}
        </div>

        <Badge
          variant="outline"
          className={cn("gap-1.5", !department.is_hq && "opacity-50")}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              department.is_hq ? "bg-emerald-500" : "bg-destructive"
            )}
            aria-hidden="true"
          ></span>
          HQ
        </Badge>
      </CardContent>

      <CardFooter className="-mt-1.5">
        <DepartmentActionButtons department={department} />
      </CardFooter>
    </Card>
  );
};
