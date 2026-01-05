import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AdminNameAndEmail,
  AdminPermissions,
  AdminThreeDotsDropdown,
} from "./AdminBlocks";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "lucide-react";
import { format } from "date-fns";

const AdminsTableView = ({ filteredAdmins }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Admin</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAdmins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>
                <AdminNameAndEmail admin={admin} view="table" />
              </TableCell>

              <TableCell>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 uppercase dark:border-white/10"
                >
                  <ShieldCheckIcon className="!size-3.5" />
                  {admin.role}
                </Badge>
              </TableCell>
              <TableCell>{admin.department}</TableCell>
              <TableCell>
                {format(new Date(admin.joined), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <AdminPermissions admin={admin} view="table" />
              </TableCell>
              <TableCell>
                <AdminThreeDotsDropdown admin={admin} view="table" />
              </TableCell>
            </TableRow>
          ))}

          {filteredAdmins.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No admins found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminsTableView;
