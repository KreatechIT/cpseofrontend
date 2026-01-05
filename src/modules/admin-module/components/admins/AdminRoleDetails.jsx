/* eslint-disable no-unused-vars */

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { CheckIcon } from "lucide-react";
import { useSelector } from "react-redux";

const AdminRoleDetails = () => {
  const adminRoleInfo = useSelector((state) => state.dialog.props);

  const modules = Object.entries(adminRoleInfo.permissions || {})
    .filter(([key, value]) => typeof value === "boolean")
    .map(([key, value]) => ({
      name: key,
      enabled: value,
    }));

  const actions = Object.entries(adminRoleInfo.permissions || {})
    .filter(([key, value]) => typeof value === "object" && value !== null)
    .map(([key, value]) => ({
      name: key,
      actions: value,
    }));

  return (
    <div className="-mt-4 space-y-4 pb-4">
      Permission Details
      <Separator className="mt-2" />
      {/* Module Permissions */}
      <div>
        <h3 className="mb-2 font-semibold">MODULES</h3>

        <div className="grid grid-cols-1 gap-2 capitalize md:grid-cols-2 lg:grid-cols-4">
          {modules.map(({ name, enabled }, idx) => (
            <div
              key={idx}
              className={cn(
                "bg-muted text-muted-foreground rounded-lg border px-2 py-1 text-sm",
                enabled && "bg-primary text-primary-foreground"
              )}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
      <Separator />
      {/* Action Permissions */}
      <div className="capitalize">
        <h3 className="mb-2 font-semibold">ACTIONS</h3>

        <div className="space-y-4">
          {actions.map(({ name, actions }) => (
            <div key={name}>
              <h4 className="font-medium text-gray-800 dark:text-white">
                {name.replace("Actions", "").charAt(0).toUpperCase() +
                  name.replace("Actions", "").slice(1)}
              </h4>
              <ul className="mt-1 flex flex-wrap gap-2">
                {Object.entries(actions).map(([action, allowed]) =>
                  allowed ? (
                    <Badge
                      className="gap-1 rounded-md pr-3.5 pl-2 text-xs"
                      key={action}
                    >
                      <CheckIcon
                        className="text-primary-foreground !size-4"
                        aria-hidden="true"
                      />
                      {action}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 rounded-md border pr-4 pl-3 text-xs dark:border-white/25"
                      key={action}
                    >
                      <span className="text-muted-foreground">{action}</span>
                    </Badge>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminRoleDetails;
