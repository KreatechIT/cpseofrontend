import { CreditCardIcon } from "@/components/icons/FinanceIcons";
import {
  AttendaceTrackingIcon,
  EmployeeDatabaseIcon,
  HiringApplicantProcessIcon,
  LeaveManagementIcon,
  TaskChecklistIcon,
} from "@/components/icons/HrIcons";
import { DashboardIcon, SettingsIcon } from "@/components/icons/Icons";
import { UserAccessManagementIcon } from "@/components/icons/Icons";

const hrSidebarLinks = [
  {
    groupTitle: null, // No group title for this section
    hasPermission: () => true, // Group is always shown if any child is visible
    children: [
      {
        title: "Dashboard",
        path: "/hr/hr-management/dashboard",
        icon: DashboardIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Task Checklist",
        path: "/hr/hr-management/task-checklist",
        icon: TaskChecklistIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Employee Database",
        path: "/hr/hr-management/employee-database",
        icon: EmployeeDatabaseIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Attendance Tracking",
        path: "/hr/hr-management/attendance-tracking",
        icon: AttendaceTrackingIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Leave Management",
        path: "/hr/hr-management/leave-management",
        icon: LeaveManagementIcon,
        hasPermission: () => true,
        children: null,
      },
    ],
  },
  {
    groupTitle: null,
    hasPermission: () => true,
    children: [
      {
        title: "Hiring Management",
        path: "/hr/hiring-management/dashboard?from=hr",
        icon: HiringApplicantProcessIcon,
        hasPermission: () => true,
      },
    ],
  },
  {
    groupTitle: "Other Links",
    hasPermission: () => true,
    children: [
      {
        title: "User Access Management",
        path: "/organisation/dashboard",
        icon: UserAccessManagementIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "Finance Management",
        path: "/finance/dashboard?from=hr",
        icon: CreditCardIcon,
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

export default hrSidebarLinks;
