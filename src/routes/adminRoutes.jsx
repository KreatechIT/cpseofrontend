import { Outlet } from "react-router-dom";

import PermissionRoute from "./elements/PermissionRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminLayout from "@/modules/admin-module/layouts/AdminSidebarLayout";

import AdminDashboardPage from "@/modules/admin-module/pages/AdminDashboardPage";
import OrganisationsPageByAdmin from "@/modules/admin-module/pages/OrganisationsPageByAdmin";
import MembersPageByAdmin from "@/modules/admin-module/pages/MembersPageByAdmin";
import MemberRolesPageByAdmin from "@/modules/admin-module/pages/MemberRolesPageByAdmin";
import AdminRolesPage from "@/modules/admin-module/pages/AdminRolesPage";
import AdminsPage from "@/modules/admin-module/pages/AdminsPage";

const adminRoutes = {
  path: "user-access",
  element: <AdminLayout />,
  children: [
    {
      path: "dashboard",
      element: (
        <PermissionRoute userType="admin">
          <AdminDashboardPage />
        </PermissionRoute>
      ),
    },
    {
      path: "organisation",
      element: <Outlet />,
      children: [
        {
          path: "all-organisations",
          element: (
            <PermissionRoute userType="admin" permission="organisation.read">
              <OrganisationsPageByAdmin />
            </PermissionRoute>
          ),
        },
        {
          path: ":organisation_id/members",
          element: (
            <PermissionRoute userType="admin" permission="member.read">
              <MembersPageByAdmin />
            </PermissionRoute>
          ),
        },
        {
          path: ":organisation_id/roles",
          element: (
            <PermissionRoute userType="admin" permission="role.read">
              <MemberRolesPageByAdmin />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "admin",
      element: <Outlet />,
      children: [
        {
          path: "all-admins",
          element: (
            <PermissionRoute userType="admin" permission="admin.read">
              <AdminsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "roles",
          element: (
            <PermissionRoute userType="admin" permission="role.read">
              <AdminRolesPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    { path: "settings", element: <div>Admin Settings</div> },
    { path: "*", element: <NotFoundPage /> },
  ],
};

export default adminRoutes;
