import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";
import AdminRoleFilters from "../components/admin-roles/AdminRoleFilters";
import {
  getAdminRoleFormat,
  getAllAdminRoles,
  getAllAdmins,
} from "../services/adminService";

const AdminRolesPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { admins, adminRoles, adminRoleFormat } = useSelector(
    (state) => state.admins
  );

  // Fetch Organisations, admins and roles
  useEffect(() => {
    if (!admins) getAllAdmins(dispatch);
    if (!adminRoles) getAllAdminRoles(dispatch);
    if (!adminRoleFormat) getAdminRoleFormat(dispatch);
  }, []);

  return (
    <>
      <title>Admin Roles - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading
            pageTitle="Admin Roles"
            withCardTableView={true}
          ></PageHeading>

          <div className="flex gap-2.5 items-center">
            {hasPermission("role.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addAdminRole",
                      styles: "md:min-w-[800px]",
                    })
                  );
                }}
              >
                Add Role <Plus />
              </Button>
            )}
          </div>
        </div>

        {admins && adminRoles ? (
          <AdminRoleFilters admins={admins} adminRoles={adminRoles} />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default AdminRolesPage;
