import { Outlet } from "react-router-dom";
import PermissionRoute from "./elements/PermissionRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import HrSidebarLayout from "@/modules/hr-module/layouts/HRSidebarLayout";
import HiringSidebarLayout from "@/modules/hr-module/layouts/HiringSidebarLayout";
import VacancyPage from "@/modules/hr-module/pages/vacancies/VacancyPage";
import HrDashboard from "@/modules/hr-module/pages/dashboards/HrDashboard";
import JobPostsPage from "@/modules/hr-module/pages/jobs/JobPostsPage";
import ReferralsPage from "@/modules/hr-module/pages/referrals/ReferralsPage";
import HiringManagementDashboard from "@/modules/hr-module/pages/dashboards/HiringManagementDashboard";
import CandidatesPage from "@/modules/hr-module/pages/candidates/CandidatesPage";
import SignleJobPostPage from "@/modules/hr-module/pages/jobs/SingleJobPostPage";
import WhitelistPoolPage from "@/modules/hr-module/pages/candidates/WhitelistPoolPage";
import BlacklistPoolPage from "@/modules/hr-module/pages/candidates/BlacklistPoolPage";
import DISCSettingsPage from "@/modules/hr-module/pages/personality-test/DiscSettingsPage";
import NumbersMethodologyPage from "@/modules/hr-module/pages/number-methodology/NumberMethodologyPage";
import TaskChecklistPage from "@/modules/hr-module/pages/onboarding-task-checklist/TaskChecklistPage";

const hrRoutes = {
  path: "hr",
  element: <Outlet />,
  children: [
    {
      path: "hr-management",
      element: <HrSidebarLayout />,
      children: [
        {
          path: "dashboard",
          element: (
            <PermissionRoute userType="member">
              <HrDashboard />
            </PermissionRoute>
          ),
        },
        {
          path: "task-checklist",
          element: (
            <PermissionRoute userType="member">
              <TaskChecklistPage />
            </PermissionRoute>
          ),
        },
        {
          path: "employee-database",
          element: (
            <PermissionRoute userType="member">
              <div>Employee Database</div>
            </PermissionRoute>
          ),
        },
        {
          path: "attendance-tracking",
          element: (
            <PermissionRoute userType="member">
              <div>Attendances</div>
            </PermissionRoute>
          ),
        },
        {
          path: "leave-management",
          element: (
            <PermissionRoute userType="member">
              <div>Leave Management</div>
            </PermissionRoute>
          ),
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
    {
      path: "hiring-management",
      element: <HiringSidebarLayout />,
      children: [
        {
          path: "dashboard",
          element: (
            <PermissionRoute userType="member">
              <HiringManagementDashboard />
            </PermissionRoute>
          ),
        },
        {
          path: "vacancy",
          element: (
            <PermissionRoute
              userType="member"
              permission="hr_hiring_vacancy.read"
            >
              <VacancyPage />
            </PermissionRoute>
          ),
        },
        {
          path: "recruitment",
          element: <Outlet />,
          children: [
            {
              path: "jobs",
              element: <Outlet />,
              children: [
                {
                  path: "",
                  element: (
                    <PermissionRoute
                      userType="member"
                      permission="hr_job_posting.read"
                    >
                      <JobPostsPage />
                    </PermissionRoute>
                  ),
                },
                {
                  path: ":jobId",
                  element: (
                    <PermissionRoute
                      userType="member"
                      permission="hr_job_posting.read"
                    >
                      <SignleJobPostPage />
                    </PermissionRoute>
                  ),
                },
              ],
            },
            {
              path: "candidates",
              element: (
                <PermissionRoute
                  userType="member"
                  permission="hr_job_candidate.read"
                >
                  <CandidatesPage />
                </PermissionRoute>
              ),
            },
            {
              path: "referrals",
              element: (
                <PermissionRoute
                  userType="member"
                  permission="hr_referral.read"
                >
                  <ReferralsPage />
                </PermissionRoute>
              ),
            },
          ],
        },
        {
          path: "talent-pool",
          element: <Outlet />,
          children: [
            {
              path: "whitelist",
              element: (
                <PermissionRoute
                  userType="member"
                  permission="hr_talent_pool.read_whitelist"
                >
                  <WhitelistPoolPage />
                </PermissionRoute>
              ),
            },
            {
              path: "blacklist",
              element: (
                <PermissionRoute
                  userType="member"
                  permission="hr_talent_pool.read_blacklist"
                >
                  <BlacklistPoolPage />
                </PermissionRoute>
              ),
            },
          ],
        },
        {
          path: "personality-test-settings",
          element: <Outlet />,
          children: [
            {
              path: "disc-settings",
              element: (
                <PermissionRoute userType="member">
                  <DISCSettingsPage />
                </PermissionRoute>
              ),
            },
            {
              path: "mbti-settings",
              element: (
                <PermissionRoute userType="member">
                  <>MBTI Settings</>
                </PermissionRoute>
              ),
            },
          ],
        },
        {
          path: "numbers-methodology",
          element: (
            <PermissionRoute userType="member">
              <NumbersMethodologyPage />
            </PermissionRoute>
          ),
        },
        {
          path: "*",
          element: <NotFoundPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
};

export default hrRoutes;
