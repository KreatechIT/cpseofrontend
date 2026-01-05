import LoginPage from "@/modules/auth-module/pages/LoginPage";
import JobApplyPage from "@/modules/hr-module/pages/job-apply/JobApplyPage";
import DiscTestPage from "@/modules/hr-module/pages/personality-test/DiscTestPage";
import { Suspense } from "react";

const publicRoutes = [
  {
    path: "/login",
    element: <LoginPage userType="member" />,
  },
  {
    path: "/admin-login",
    element: <LoginPage userType="admin" />,
  },
  {
    path: "/jobs/:job_id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <JobApplyPage />
      </Suspense>
    ),
  },
  {
    path: "/disc-test/:organisation_id/:disc_link_id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DiscTestPage />
      </Suspense>
    ),
  },
];
export default publicRoutes;
