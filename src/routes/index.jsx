import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import publicRoutes from "./publicRoutes.jsx";
import adminRoutes from "./adminRoutes.jsx";
import memebrRoutes from "./memberRoutes.jsx";
import financeRoutes from "./financeRoutes.jsx";
import hrRoutes from "./hrRoutes.jsx";
import seoRoutes from "./seoRoutes.jsx";

import PrivateRoute from "./elements/PrivateRoute.jsx";
import RedirectToDefaultPage from "./elements/RedirectToDefaultPage.jsx";
import CreateOnboardingTaskChecklist from "@/modules/hr-module/pages/onboarding-task-checklist/CreateOnboardingTaskChecklist.jsx";

const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ErrorPage = lazy(() => import("@/pages/ErrorPage"));

const routes = createBrowserRouter([
  // Public routes e.g. Login Pages, Job Apply, DISC Test etc.
  ...publicRoutes,

  // Private routes e.g. Admin, Member, Finance and HR Pages.
  {
    path: "/",
    element: <PrivateRoute />,
    errorElement: (
      <Suspense fallback={null}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: <RedirectToDefaultPage />,
      },
      adminRoutes,
      {
        path: "",
        element: <CreateOnboardingTaskChecklist />,
        children: [memebrRoutes, financeRoutes, hrRoutes, seoRoutes],
      },
    ],
  },

  // Not found route
  {
    path: "*",
    element: (
      <Suspense fallback={null}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

export default routes;
