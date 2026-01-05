/* eslint-disable no-unused-vars */
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/cn";
import { hasFinanceProduct, hasHrProduct } from "@/utils/hasPermission";
import { CheckIcon } from "lucide-react";
import { useSelector } from "react-redux";

const MemberRoleDetailsByAdmin = () => {
  const memberRoleInfo = useSelector((state) => state.dialog.props);

  const modules = Object.entries(memberRoleInfo.memberRole.permissions || {})
    .filter(([_, value]) => typeof value === "boolean")
    .map(([name, enabled]) => ({ name, enabled }));

  const actions = Object.entries(memberRoleInfo.memberRole.permissions || {})
    .filter(([_, value]) => typeof value === "object" && value !== null)
    .map(([name, actions]) => ({ name, actions }));

  const renderModules = (type) =>
    modules
      .filter(({ name }) =>
        type === "general"
          ? !name.includes("finance") && !name.includes("hr")
          : name.includes(type)
      )
      .map(({ name, enabled }) => (
        <div
          key={name}
          className={cn(
            "bg-muted text-muted-foreground rounded-lg border px-2 py-1 text-sm",
            enabled && "bg-primary text-primary-foreground"
          )}
        >
          {name.replace(/_/g, " ")}
        </div>
      ));

  const renderActions = (type) =>
    actions
      .filter(({ name }) =>
        type === "general"
          ? !name.includes("finance") && !name.includes("hr")
          : name.includes(type)
      )
      .map(({ name, actions }) => (
        <div key={name}>
          <h4 className="font-medium text-gray-800 dark:text-white">
            {name.replace("Actions", "").replace(/_/g, " ").trim()}
          </h4>
          <ul className="mt-1 flex flex-wrap gap-2">
            {Object.entries(actions).map(([action, allowed]) => (
              <PermissionBadge key={action} action={action} allowed={allowed} />
            ))}
          </ul>
        </div>
      ));

  return (
    <div className="-mt-4 pb-4">
      <h2 className="text-lg font-medium">Permission Details</h2>
      <Separator className="mt-2 mb-4" />

      <div className="relative min-h-[350px] overflow-scroll mt-2.5">
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-1 h-24 md:h-auto md:grid-cols-3 border">
            <TabsTrigger value="general">User Access Permissions</TabsTrigger>
            {hasFinanceProduct(memberRoleInfo?.organisation?.products) && (
              <TabsTrigger value="finance">Finance Permissions</TabsTrigger>
            )}
            {hasHrProduct(memberRoleInfo?.organisation?.products) && (
              <TabsTrigger value="hr">HR Permissions</TabsTrigger>
            )}
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6 pt-4">
            <div>
              <h3 className="mb-2 font-semibold">Modules</h3>
              <div className="grid grid-cols-1 gap-2 capitalize md:grid-cols-2 lg:grid-cols-4">
                {renderModules("general")}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Actions</h3>
              <div className="space-y-4 capitalize">
                {renderActions("general")}
              </div>
            </div>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-6 pt-4">
            <div>
              <h3 className="mb-2 font-semibold">Modules</h3>
              <div className="grid grid-cols-1 gap-2 capitalize md:grid-cols-2 lg:grid-cols-4">
                {renderModules("finance")}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Actions</h3>
              <div className="space-y-4 capitalize">
                {renderActions("finance")}
              </div>
            </div>
          </TabsContent>

          {/* HR Tab */}
          <TabsContent value="hr" className="space-y-6 pt-4">
            <div>
              <h3 className="mb-2 font-semibold">Modules</h3>
              <div className="grid grid-cols-1 gap-2 capitalize md:grid-cols-2 lg:grid-cols-4">
                {renderModules("hr")}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Actions</h3>
              <div className="space-y-4 capitalize">{renderActions("hr")}</div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberRoleDetailsByAdmin;

const PermissionBadge = ({ action, allowed }) => {
  const label = action.replace(/_/g, " ");
  return allowed ? (
    <Badge className="gap-1 rounded-full pr-3.5 pl-2 text-xs">
      <CheckIcon
        className="text-primary-foreground !size-4"
        aria-hidden="true"
      />
      {label}
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="gap-1 border pr-4 pl-3 text-xs dark:border-white/25 rounded-full"
    >
      <span className="text-muted-foreground">{label}</span>
    </Badge>
  );
};
