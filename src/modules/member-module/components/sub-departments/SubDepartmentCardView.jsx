import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  SubDepartmentActionButtons,
  SubDepartmentThreeDotsDropdown,
} from "./SubDepartmentBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Grid2x2Check } from "lucide-react";

const SubDepartmentCardView = ({ filteredSubDepartments }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredSubDepartments.map((subDept) => (
        <SubDepartmentCard key={subDept.id} subDepartment={subDept} />
      ))}

      {filteredSubDepartments.length === 0 && <p>No sub department found</p>}
    </div>
  );
};

export default SubDepartmentCardView;

const SubDepartmentCard = function ({ subDepartment }) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10 rounded-full border border-black/10">
            <AvatarFallback className="dark:bg-white/10">
              <Grid2x2Check
                size={20}
                className="opacity-60"
                aria-hidden="true"
              />
            </AvatarFallback>
          </Avatar>
          {subDepartment?.name}
        </div>

        <SubDepartmentThreeDotsDropdown subDepartment={subDepartment} />
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        <div>
          <p className="text-muted-foreground mt-0">
            <span className="text-foreground font-medium">Members:</span>{" "}
            <span>{subDepartment?.members_pax}</span>
          </p>
        </div>

        <div className="mt-2 mb-2">
          <p className="text-muted-foreground mt-0">
            <span className="text-foreground font-medium">Strategy:</span>{" "}
            <span>{subDepartment?.strategy}</span>
          </p>
        </div>

        <SubDepartmentActionButtons subDepartment={subDepartment} />
      </CardContent>
    </Card>
  );
};
