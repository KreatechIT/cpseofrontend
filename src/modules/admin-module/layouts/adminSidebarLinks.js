import { DashboardIcon, SettingsIcon } from "@/components/icons/Icons";
import {
  AdminManagementIcon,
  UserAccessManagementIcon,
} from "@/components/icons/Icons";

const adminSidebarLinks = [
  {
    groupTitle: null, // No group title for this section
    hasPermission: () => true, // Group is always shown if any child is visible
    children: [
      {
        title: "Dashboard",
        path: "/user-access/dashboard",
        icon: DashboardIcon,
        hasPermission: () => true, // Always visible to admin
        children: null,
      },
      {
        title: "User Access Management",
        path: "/user-access/organisation",
        icon: UserAccessManagementIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("organisation.read"),
        children: [
          {
            title: "Organisations",
            path: "/user-access/organisation/all-organisations",
            hasPermission: ({ hasPermission }) =>
              hasPermission("organisation.read"),
            children: null,
          },
        ],
      },
      {
        title: "Admin Management",
        path: "/user-access/admin",
        icon: AdminManagementIcon,
        hasPermission: ({ hasAnyPermission }) =>
          hasAnyPermission(["admin.read", "role.read"]),
        children: [
          {
            title: "Admins",
            path: "/user-access/admin/all-admins",
            hasPermission: ({ hasPermission }) => hasPermission("admin.read"),
            children: null,
          },
          {
            title: "Admin Roles",
            path: "/user-access/admin/roles",
            hasPermission: ({ hasPermission }) => hasPermission("role.read"),
            children: null,
          },
        ],
      },
      {
        title: "Settings",
        path: "/user-access/settings",
        icon: SettingsIcon,
        hasPermission: () => true, // Always shown
        children: null,
      },
    ],
  },
];
export default adminSidebarLinks;
