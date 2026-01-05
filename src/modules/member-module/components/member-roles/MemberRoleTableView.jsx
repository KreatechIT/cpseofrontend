import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  MemberRoleNameAndCount,
  MemberRolePermissions,
  MemberRoleThreeDotsDropdown,
} from "./MemberRoleBlocks";

const MemberRoleTableView = ({ filteredMemberRoles, memberCounts }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Member Role</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredMemberRoles.map((memberRole) => {
            const memberCount = memberCounts[memberRole.name] || 0;

            return (
              <TableRow key={memberRole.id}>
                <TableCell>
                  <MemberRoleNameAndCount
                    memberRole={memberRole}
                    roleCount={memberCount}
                    view="table"
                  />
                </TableCell>

                <TableCell>
                  {memberCount} member
                  {memberCount > 1 ? "s have" : " has"} this role.
                </TableCell>

                <TableCell>
                  <MemberRolePermissions memberRole={memberRole} view="table" />
                </TableCell>
                <TableCell>
                  <MemberRoleThreeDotsDropdown
                    memberRole={memberRole}
                    memberCount={memberCount}
                    view="table"
                  />
                </TableCell>
              </TableRow>
            );
          })}

          {filteredMemberRoles.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No member roles found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MemberRoleTableView;
