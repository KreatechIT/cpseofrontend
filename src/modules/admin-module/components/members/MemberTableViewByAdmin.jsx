import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MemberNameAndEmail,
  MemberPermissions,
  MemberThreeDotsDropdown,
} from "./MemberBlocksByAdmin";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "lucide-react";
import {
  areAllFinanceApprovedTrue,
  areAllHodApprovedTrue,
} from "@/utils/hasPermission";

const MembersTableViewByAdmin = ({ filteredMembers, organisation }) => {
  return (
    <div className="overflow-hidden rounded-lg">
      <Table>
        <TableHeader className="border">
          <TableRow>
            <TableHead className="p-3">Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <MemberNameAndEmail member={member} view="table" />
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 uppercase dark:border-white/10"
                  >
                    <ShieldCheckIcon className="!size-3.5" />
                    {member.role}
                  </Badge>

                  {areAllHodApprovedTrue(member.permissions) && (
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className="size-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      ></span>
                      HOD
                    </Badge>
                  )}
                  {areAllFinanceApprovedTrue(member.permissions) && (
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className="size-1.5 rounded-full bg-emerald-500"
                        aria-hidden="true"
                      ></span>
                      FINANCE
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <MemberPermissions
                  member={member}
                  view="table"
                  organisation={organisation}
                />
              </TableCell>
              <TableCell>
                <MemberThreeDotsDropdown
                  member={member}
                  view="table"
                  organisation={organisation}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredMembers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>No members found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTableViewByAdmin;
