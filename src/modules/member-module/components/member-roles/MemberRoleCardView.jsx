import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  MemberRoleNameAndCount,
  MemberRolePermissions,
  MemberRoleThreeDotsDropdown,
} from "./MemberRoleBlocks";
import usePermission from "@/hooks/usePermission";

const MemberRoleCardView = ({ filteredMemberRoles, memberCounts }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredMemberRoles.map((memberRole) => (
        <MemberRoleCard
          key={memberRole.id}
          memberRole={memberRole}
          memberCount={memberCounts[memberRole.name] || 0}
        />
      ))}

      {filteredMemberRoles.length === 0 && <p>No member roles found</p>}
    </div>
  );
};

export default MemberRoleCardView;

const MemberRoleCard = ({ memberRole, memberCount }) => {
  const { hasAnyPermission } = usePermission();

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <MemberRoleNameAndCount
          memberRole={memberRole}
          memberCount={memberCount}
        />

        {hasAnyPermission(["member.edit", "member.archive"]) && (
          <MemberRoleThreeDotsDropdown
            memberRole={memberRole}
            memberCount={memberCount}
          />
        )}
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        {/* Permissions */}
        <div className="bg-primary/5 relative mt-4 flex h-24 flex-col rounded-lg border border-black/5 p-2 dark:border-white/10">
          <p className="font-medium">Permissions</p>
          <MemberRolePermissions memberRole={memberRole} />
        </div>
      </CardContent>
    </Card>
  );
};
