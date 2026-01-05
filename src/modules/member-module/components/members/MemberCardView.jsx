import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MemberNameAndEmail,
  MemberPermissions,
  MemberThreeDotsDropdown,
} from "./MemberBlocks";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "lucide-react";
import usePermission from "@/hooks/usePermission";
import {
  areAllFinanceApprovedTrue,
  areAllHodApprovedTrue,
} from "@/utils/hasPermission";

export default function MembersCardView({ filteredMembers }) {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredMembers.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}

      {filteredMembers.length === 0 && <p>No members found</p>}
    </div>
  );
}

const MemberCard = function ({ member }) {
  const { hasAnyPermission } = usePermission();
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <MemberNameAndEmail member={member} />

        {hasAnyPermission(["member.edit", "member.archive"]) && (
          <MemberThreeDotsDropdown member={member} />
        )}
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        {/* Department, Join Date and Role */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 uppercase dark:border-white/10"
          >
            <ShieldCheckIcon className="!size-3.5" />
            {member.role}
          </Badge>
          <div className="space-x-2">
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
        </div>

        {/* Permissions */}
        <div className="bg-primary/5 relative mt-4 flex h-24 flex-col rounded-lg border border-black/5 p-2 dark:border-white/10">
          <p className="font-medium">Permissions</p>
          <MemberPermissions member={member} />
        </div>
      </CardContent>
    </Card>
  );
};
