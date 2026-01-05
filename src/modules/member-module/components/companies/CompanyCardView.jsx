import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  CompanyActionButtons,
  CompanyThreeDotsDropdown,
} from "./CompanyBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BriefcaseBusiness } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/badge";
import usePermission from "@/hooks/usePermission";

const CompanyCardView = ({ filteredCompanies, departmentCounts }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredCompanies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          departmentCount={departmentCounts[company.id] || 0}
        />
      ))}

      {filteredCompanies.length === 0 && <p>No company found</p>}
    </div>
  );
};

export default CompanyCardView;

const CompanyCard = function ({ company, departmentCount }) {
  const { hasAnyPermission } = usePermission();

  return (
    <Card className="flex flex-col justify-between shadow-none overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
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
        </div>

        {hasAnyPermission(["company.edit", "company.archive"]) && (
          <CompanyThreeDotsDropdown company={company} view="table" />
        )}
      </CardHeader>

      <CardContent className="-mt-2 flex justify-between text-sm">
        <div>
          {departmentCount > 1
            ? `${departmentCount} Departments`
            : `${departmentCount} Department`}
        </div>

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
      </CardContent>

      <CardFooter className="-mt-1.5">
        <CompanyActionButtons company={company} />
      </CardFooter>
    </Card>
  );
};
