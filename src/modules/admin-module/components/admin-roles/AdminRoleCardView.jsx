import { useDispatch } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import usePermission from "@/hooks/usePermission";
import {
  AdminRoleNameAndCount,
  AdminRoleThreeDotsDropdown,
} from "./AdminRoleBlocks";

const AdminRoleCardView = ({ filteredAdminRoles, adminCounts }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredAdminRoles.map((adminRole) => (
        <AdminRoleCard
          key={adminRole.id}
          adminRole={adminRole}
          adminCount={adminCounts[adminRole.name] || 0}
        />
      ))}

      {filteredAdminRoles.length === 0 && <p>No admin roles found</p>}
    </div>
  );
};

export default AdminRoleCardView;

const AdminRoleCard = function ({ adminRole, adminCount }) {
  const dispatch = useDispatch();
  const { hasAnyPermission } = usePermission();

  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl bg-[#dcdcdc]/10 shadow-xs">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <AdminRoleNameAndCount adminRole={adminRole} adminCount={adminCount} />

        {hasAnyPermission(["role.edit", "role.archive"]) && (
          <AdminRoleThreeDotsDropdown
            adminRole={adminRole}
            adminCount={adminCount}
          />
        )}
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        {/* Permissions */}
        <div className="bg-primary/5 relative mt-4 h-24 rounded-lg border border-black/5 p-2 dark:border-white/10">
          <p className="font-medium">Permissions</p>

          <p className="mt-0.5 text-sm text-black/70 capitalize dark:text-white/70">
            {Object.entries(adminRole.permissions)
              // eslint-disable-next-line no-unused-vars
              .filter(([key, value]) => typeof value === "boolean" && value) // only top-level booleans
              .map(([key]) => key)
              .slice(0, 6)
              .join(", ") || "N/A"}
          </p>

          <p
            className="mt-2 cursor-pointer text-end text-sm underline"
            onClick={() =>
              dispatch(
                setDialogData({ type: "adminRoleDetails", props: adminRole })
              )
            }
          >
            View Details
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
