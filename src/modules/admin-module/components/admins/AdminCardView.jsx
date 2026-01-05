import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AdminNameAndEmail,
  AdminPermissions,
  AdminThreeDotsDropdown,
} from "./AdminBlocks";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ShieldCheckIcon } from "lucide-react";

const AdminsCardView = ({ filteredAdmins }) => {
  return (
    <div className="@8xl:grid-cols-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
      {filteredAdmins.map((admin) => (
        <AdminCard key={admin.id} admin={admin} />
      ))}

      {filteredAdmins.length === 0 && <p>No admins found</p>}
    </div>
  );
};

export default AdminsCardView;

const AdminCard = function ({ admin }) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden rounded-xl">
      <CardHeader className="relative flex items-center justify-between gap-4">
        <AdminNameAndEmail admin={admin} />

        <AdminThreeDotsDropdown admin={admin} />
      </CardHeader>

      <CardContent className="-mt-2 text-sm">
        {/* Department, Join Date and Role */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mt-0 flex items-center gap-1.5">
              <span className="text-foreground">Department:</span>{" "}
              <span>{admin?.department}</span>
            </p>
            <p className="text-muted-foreground mt-0 flex items-center gap-1.5">
              <span className="text-foreground">Joined:</span>{" "}
              <span>{format(new Date(admin.joined), "MMM dd, yyyy")}</span>
            </p>
          </div>

          <Badge
            variant="outline"
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 uppercase dark:border-white/10"
          >
            <ShieldCheckIcon className="!size-3.5" />
            {admin.role}
          </Badge>
        </div>

        {/* Permissions */}
        <div className="bg-primary/5 relative mt-4 h-24 rounded-lg border border-black/5 p-2 dark:border-white/10">
          <p className="font-medium">Permissions</p>
          <AdminPermissions admin={admin} />
        </div>
      </CardContent>
    </Card>
  );
};
