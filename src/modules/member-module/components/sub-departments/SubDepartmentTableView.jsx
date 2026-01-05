import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Grid2x2Check } from "lucide-react";
import {
  SubDepartmentActionButtons,
  SubDepartmentThreeDotsDropdown,
} from "./SubDepartmentBlocks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const SubDepartmentTableView = ({ filteredSubDepartments }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Sub Department</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Strategy</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredSubDepartments.map((subDept) => (
            <TableRow key={subDept.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-10 w-10 rounded-full border border-black/10">
                  <AvatarFallback className="dark:bg-white/10">
                    <Grid2x2Check
                      size={20}
                      className="opacity-60"
                      aria-hidden="true"
                    />
                  </AvatarFallback>
                </Avatar>
                {subDept?.name}
              </TableCell>

              <TableCell>{subDept.department}</TableCell>
              <TableCell>{subDept.members_pax}</TableCell>
              <TableCell>{subDept.strategy}</TableCell>

              <TableCell className="max-w-16">
                <SubDepartmentActionButtons subDepartment={subDept} />
              </TableCell>
              <TableCell>
                <SubDepartmentThreeDotsDropdown subDepartment={subDept} />
              </TableCell>
            </TableRow>
          ))}

          {filteredSubDepartments.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No sub departments found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubDepartmentTableView;
