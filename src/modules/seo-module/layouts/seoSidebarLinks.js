import { CreditCardIcon } from "@/components/icons/FinanceIcons";
import { HrManagementIcon } from "@/components/icons/HrIcons";
import {
  DashboardIcon,
  SettingsIcon,
  DocumentManagementIcon,
  NotificationBellIcon,
  ConnectionLinkIcon,
  MenuListIcon,
  WriteEditIcon,
  UploadIcon,
  DownloadIcon,
  UsersNetworkIcon,
  UsersGroupIcon,
  ServerDatabaseIcon,
} from "@/components/icons/Icons";
import {
  CompanyIcon,
  DepartmentIcon,
  UserAccessManagementIcon,
} from "@/components/icons/Icons";

const seoSidebarLinks = [
  {
    groupTitle: null, // No group title for this section
    hasPermission: () => true, // Group is always shown if any child is visible
    children: [
      {
        title: "Dashboard",
        path: "/seo/dashboard",
        icon: DashboardIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Project Summary",
        path: "/seo/project-summary",
        icon: DocumentManagementIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Insight",
        path: "/seo/insight",
        icon: NotificationBellIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Project Configuration",
        path: "/seo/project-configuration",
        icon: SettingsIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Purchased Pool",
        path: "/seo/purchased-pool",
        icon: ConnectionLinkIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Sample Pool",
        path: "/seo/sample-pool",
        icon: MenuListIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Order Management",
        path: "/seo/order-management",
        icon: WriteEditIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Report",
        path: "/seo/report",
        icon: UploadIcon,
        hasPermission: () => true, // Always visible
        children: [
          {
            title: "Backlink Analysis Report",
            path: "/seo/report/backlink-analysis-report",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Performance Analysis Report",
            path: "/seo/report/performance-analysis-report",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Project Cost Report",
            path: "/seo/report/project-cost-report",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "SE Ranking Report",
            path: "/seo/report/se-ranking-report",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Ahrefs Report",
            path: "/seo/report/ahrefs-report",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
      {
        title: "Import",
        path: "/seo/import",
        icon: DownloadIcon,
        hasPermission: () => true, // Always visible
        children: [
          {
            title: "Order Import",
            path: "/seo/import/order-import",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Analytics Import",
            path: "/seo/import/analytics-import",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Search Console Import",
            path: "/seo/import/search-console-import",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Conversion Import",
            path: "/seo/import/conversion-import",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Ahrefs Import",
            path: "/seo/import/ahrefs-import",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "SE Ranking Import",
            path: "/seo/import/se-ranking-import",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
      {
        title: "Vendor",
        path: "/seo/vendor",
        icon: UsersNetworkIcon,
        hasPermission: () => true, // Always visible
        children: [
          {
            title: "Vendor Details",
            path: "/seo/vendor/vendor-details",
            hasPermission: () => true, // Always visible
            children: null,
          },
          {
            title: "Link Similarity",
            path: "/seo/vendor/link-similarity",
            hasPermission: () => true, // Always visible
            children: null,
          },
        ],
      },
      {
        title: "Competitor",
        path: "/seo/competitor",
        icon: UsersGroupIcon,
        hasPermission: () => true, // Always visible
        children: [
          {
            title: "Competitor Details",
            path: "/seo/competitor/competitor-details",
            hasPermission: () => true, // Always visible
            children: null,
          },
          {
            title: "Competitor Pool",
            path: "/seo/competitor/competitor-pool",
            hasPermission: () => true, // Always visible
            children: null,
          },
        ],
      },
      {
        title: "Library",
        path: "/seo/library",
        icon: ServerDatabaseIcon,
        hasPermission: () => true, // Always visible
        children: [
          {
            title: "Issues Overview",
            path: "/seo/library/issues-overview",
            hasPermission: () => true, // Always visible
            children: null,
          },
          // {
          //   title: "Glossary",
          //   path: "/seo/library/glossary",
          //   hasPermission: () => true, // Always visible
          //   children: null,
          // },
          {
            title: "Test Scenario",
            path: "/seo/library/test-scenario",
            hasPermission: () => true, // Always visible
            children: null,
          },
          {
            title: "Daily Record",
            path: "/seo/library/daily-record",
            hasPermission: () => true, // Always visible
            children: null,
          },
        ],
      },

      {
        title: "User Access Management",
        path: "/seo/members",
        icon: UserAccessManagementIcon,
        hasPermission: ({ hasAnyPermission }) =>
          hasAnyPermission(["member.read", "role.read"]),
        children: [
          {
            title: "Members",
            path: "/seo/members",
            hasPermission: ({ hasPermission }) => hasPermission("member.read"), // Visible if user has 'member' permission
            children: null,
          },
          {
            title: "Roles",
            path: "/seo/members/roles",
            hasPermission: ({ hasPermission }) => hasPermission("role.read"), // Visible if user has 'role' permission
            children: null,
          },
        ],
      },
    ],
  },
  {
    groupTitle: "Companies & Departments", // Section title for the group
    hasPermission: ({ hasAnyPermission }) =>
      hasAnyPermission(["company.read", "department.read"]), // Visible if user has either 'company' or 'department' permission
    children: [
      {
        title: "Company Info",
        path: "/seo/company",
        icon: CompanyIcon,
        hasPermission: ({ hasPermission }) => hasPermission("company.read"), // Visible if user has 'company' permission
        children: null,
      },
      {
        title: "Department Info",
        path: "/seo/department",
        icon: DepartmentIcon,
        hasPermission: ({ hasPermission }) => hasPermission("department.read"), // Visible if user has 'department' permission
        children: [
          {
            title: "Departments",
            path: "/seo/department",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Sub Departments",
            path: "/seo/department/sub-department",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
    ],
  },
  {
    groupTitle: "Other Links", // Section title for additional links
    hasPermission: () => true, // Always true, so this section is always visible
    children: [
      {
        title: "Finance Management",
        path: "/finance/dashboard?from=uam",
        icon: CreditCardIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "HR Management",
        path: "/hr/hr-management/dashboard?from=uam",
        icon: HrManagementIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Settings",
        path: "/settings",
        icon: SettingsIcon,
        hasPermission: () => true,
        children: null,
      },
    ],
  },
];

export default seoSidebarLinks;
