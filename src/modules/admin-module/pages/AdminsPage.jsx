import { PageHeading } from "@/components/shared/PageHeading";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { CardSkeletons } from "@/components/ui/skeleton";
import usePermission from "@/hooks/usePermission";
import { getAllAdminRoles, getAllAdmins } from "../services/adminService";
import AdminFilters from "../components/admins/AdminFilters";

const AdminsPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();
  const { admins, adminRoles } = useSelector((state) => state.admins);

  // Fetch Organisations, admins and roles
  useEffect(() => {
    if (!admins) getAllAdmins(dispatch);
    if (!adminRoles) getAllAdminRoles(dispatch);
  }, []);

  return (
    <>
      <title>Admins - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading
            pageTitle="Admins"
            withCardTableView={true}
          ></PageHeading>

          <div className="flex gap-2.5 items-center">
            {hasPermission("admin.add") && (
              <Button
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "addAdmin",
                      styles: "md:min-w-[750px]",
                    })
                  );
                }}
              >
                Add Admin <Plus />
              </Button>
            )}
          </div>
        </div>

        {admins && adminRoles ? (
          <AdminFilters admins={admins} adminRoles={adminRoles} />
        ) : (
          <CardSkeletons />
        )}
      </main>
    </>
  );
};

export default AdminsPage;
