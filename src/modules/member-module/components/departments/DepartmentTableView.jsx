import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import {
  DepartmentActionButtons,
  DepartmentThreeDotsDropdown,
} from "./DepartmentBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";
import usePermission from "@/hooks/usePermission";

export default function DepartmentTableView({
  filteredDepartments,
  subDepartmentCounts,
}) {
  const { hasAnyPermission } = usePermission();
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Department</TableHead>
            <TableHead>Sub Departments</TableHead>
            <TableHead>HQ</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredDepartments.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded-full border border-black/10">
                  <AvatarFallback className="dark:bg-white/10">
                    <Layers
                      size={20}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                  </AvatarFallback>
                </Avatar>
                {department?.name}
              </TableCell>

              <TableCell>
                {subDepartmentCounts[department.id] > 1
                  ? `${subDepartmentCounts[department.id]} Sub Departments`
                  : `${subDepartmentCounts[department.id] || 0} Sub Department`}
              </TableCell>

              <TableCell>
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
              </TableCell>

              <TableCell className="max-w-48">
                <DepartmentActionButtons department={department} view="table" />
              </TableCell>

              <TableCell>
                {hasAnyPermission([
                  "department.edit",
                  "department.archive",
                ]) && (
                  <DepartmentThreeDotsDropdown
                    department={department}
                    view="table"
                  />
                )}
              </TableCell>
            </TableRow>
          ))}

          {filteredDepartments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No departments found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
