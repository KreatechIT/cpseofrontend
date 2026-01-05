import { Outlet } from "react-router-dom";
import PermissionRoute from "./elements/PermissionRoute";

import NotFoundPage from "@/pages/NotFoundPage";

import OrganisationDashboard from "@/modules/member-module/pages/OrganisationDashboard";
import MemberRolesPage from "@/modules/member-module/pages/MemberRolesPage";
import MemberPage from "@/modules/member-module/pages/MembersPage";
import CompanyPage from "@/modules/member-module/pages/CompaniesPage";
import DepartmentPage from "@/modules/member-module/pages/DepartmentsPage";
import SubDepartmentPage from "@/modules/member-module/pages/SubDepartmentsPage";
import MemberSidebarLayout from "@/modules/member-module/layouts/MemberSidebarLayout";

const memebrRoutes = {
  path: "organisation",
  element: <MemberSidebarLayout />,
  children: [
    {
      path: "dashboard",
      element: (
        <PermissionRoute userType="member">
          <OrganisationDashboard />
        </PermissionRoute>
      ),
    },
    {
      path: "members",
      element: (
        <PermissionRoute userType="member" permission="member.read">
          <MemberPage />
        </PermissionRoute>
      ),
    },
    {
      path: "members/roles",
      element: (
        <PermissionRoute userType="member" permission="role.read">
          <MemberRolesPage />
        </PermissionRoute>
      ),
    },
    {
      path: "company",
      element: (
        <PermissionRoute userType="member" permission="company.read">
          <CompanyPage />
        </PermissionRoute>
      ),
    },
    {
      path: "department",
      element: <Outlet />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member" permission="department.read">
              <DepartmentPage />
            </PermissionRoute>
          ),
        },
        {
          path: "sub-department",
          element: (
            <PermissionRoute userType="member" permission="department.read">
              <SubDepartmentPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
};

export default memebrRoutes;
