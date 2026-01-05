import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AdminRoleNameAndCount,
  AdminRoleThreeDotsDropdown,
} from "./AdminRoleBlocks";

const AdminRoleTableView = ({ filteredAdminRoles, adminCounts }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Admin Role</TableHead>
            <TableHead>Admins</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAdminRoles.map((adminRole) => {
            const adminCount = adminCounts[adminRole.name] || 0;

            return (
              <TableRow key={adminRole.id}>
                <TableCell>
                  <AdminRoleNameAndCount
                    adminRole={adminRole}
                    adminCount={adminCount}
                    view="table"
                  />
                </TableCell>

                <TableCell>
                  {adminCount} admin
                  {adminCount > 1 ? "s have" : " has"} this role.
                </TableCell>

                <TableCell>
                  <p className="mt-0.5 text-sm text-black/70 capitalize dark:text-white/70">
                    {Object.entries(adminRole.permissions)
                      .filter(
                        // eslint-disable-next-line no-unused-vars
                        ([key, value]) => typeof value === "boolean" && value
                      ) // only top-level booleans
                      .map(([key]) => key)
                      .slice(0, 6)
                      .join(", ") || "N/A"}
                  </p>
                </TableCell>

                <TableCell>
                  <AdminRoleThreeDotsDropdown
                    adminRole={adminRole}
                    adminCount={adminCount}
                    view="table"
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredAdminRoles.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No admin roles found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default AdminRoleTableView;
