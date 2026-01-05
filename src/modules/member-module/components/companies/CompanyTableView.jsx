import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { BriefcaseBusiness } from "lucide-react";
import {
  CompanyActionButtons,
  CompanyThreeDotsDropdown,
} from "./CompanyBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/utils/cn";
import usePermission from "@/hooks/usePermission";

const CompanyTableView = ({ filteredCompanies, departmentCounts }) => {
  const { hasAnyPermission } = usePermission();

  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Company</TableHead>
            <TableHead>Departments</TableHead>
            <TableHead>HQ</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCompanies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded-full border border-black/10">
                  <AvatarFallback className="dark:bg-white/10">
                    <BriefcaseBusiness
                      size={20}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                  </AvatarFallback>
                </Avatar>
                {company?.name}
              </TableCell>

              <TableCell>
                {departmentCounts[company.id] > 1
                  ? `${departmentCounts[company.id]} Departments`
                  : `${departmentCounts[company.id] || 0} Department`}
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("gap-1.5", !company.is_hq && "opacity-50")}
                >
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      company.is_hq ? "bg-emerald-500" : "bg-destructive"
                    )}
                    aria-hidden="true"
                  ></span>
                  HQ
                </Badge>
              </TableCell>

              <TableCell className="max-w-40">
                <CompanyActionButtons company={company} view="table" />
              </TableCell>

              <TableCell>
                {hasAnyPermission(["company.edit", "company.archive"]) && (
                  <CompanyThreeDotsDropdown company={company} view="table" />
                )}
              </TableCell>
            </TableRow>
          ))}

          {filteredCompanies.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No companies found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyTableView;
