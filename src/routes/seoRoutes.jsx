import { Outlet } from "react-router-dom";
import PermissionRoute from "./elements/PermissionRoute";
import NotFoundPage from "@/pages/NotFoundPage";
import ProjectSummaryPage from "@/modules/seo-module/pages/project-summary/ProjectSummaryPage";
import ProjectConfigurationPage from "@/modules/seo-module/pages/project-configuration/ProjectConfigurationPage";
import VendorDetails from "@/modules/seo-module/pages/vendor/VendorDetails";
import VendorFormPage from "@/modules/seo-module/pages/vendor/VendotFormPage";
import SamplePoolPage from "@/modules/seo-module/pages/sample-pool/SamplePoolPage";
import SeoDashboardPage from "@/modules/seo-module/pages/dashboards/SeoDashboardPage";
import SeoSidebarLayout from "@/modules/seo-module/layouts/SeoSidebarLayout";
import OrderManagementPage from "@/modules/seo-module/pages/order-management/OrderManagementPage";
import PurchasedPoolPage from "@/modules/seo-module/pages/purchased-pool/PurchasedPoolPage";
import CompetitorPoolPage from "@/modules/seo-module/pages/competitor-pool/CompetitorPoolPage";
import CompetitorForm from "@/modules/seo-module/components/competitor-details/CompetitorForm";
import CompetitorDetailsPage from "@/modules/seo-module/pages/competitor-details/CompetitorDetailsPage";
import AhrefsImportPage from "@/modules/seo-module/pages/ahrefs-import/AhrefsImportPage";
import OrderImportPage from "@/modules/seo-module/pages/order-import/OrderImportPage";
// New unified form page
import ProjectFormPage from "@/modules/seo-module/pages/project-configuration/ProjectFormPage"; // Adjust path as needed
import AnalyticsImportPage from "@/modules/seo-module/pages/analytics-import/AnalyticsImportPage";
import SearchConsoleImportPage from "@/modules/seo-module/pages/search-console-import/SearchConsoleImportPage";
import ConversionImportPage from "@/modules/seo-module/pages/conversion-import/ConversionImportPage";
import SeRankingImportPage from "@/modules/seo-module/pages/se-ranking-import/SeRankingImportPage";
import InsightPage from "@/modules/seo-module/pages/insight/InsightPage";
import BacklinkAnalysisReportPage from "@/modules/seo-module/pages/backlink-analysis-report/BacklinkAnalysisReportPage";
import PerformanceAnalysisReportPage from "@/modules/seo-module/pages/performance-analysis-report/PerformanceAnalysisReportPage";
import ProjectCostReportPage from "@/modules/seo-module/pages/project-cost-report/ProjectCostReportPage";
import SeRankingReportPage from "@/modules/seo-module/pages/se-ranking-report/SeRankingReportPage";
import AhrefsReportPage from "@/modules/seo-module/pages/ahrefs-report/AhrefsReportPage";
import IssueOverviewImportPage from "@/modules/seo-module/pages/issue-overview-import/IssueOverviewImportPage";
import DailyRecordPage from "@/modules/seo-module/pages/daily-record-import/DailyRecordImportPage";
import LinkSimilarityPage from "@/modules/seo-module/pages/link-similarity/LinkSimilarityPage";
import TestScenarioPage from "@/modules/seo-module/pages/test-scenario/TestScenarioPage";

const seoRoutes = {
  path: "seo",
  element: <Outlet />,
  children: [
    {
      path: "project-summary",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <ProjectSummaryPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "dashboard",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <SeoDashboardPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "insight",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <InsightPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "project-configuration",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <ProjectConfigurationPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    // NEW: Add & Edit Project Form Pages (full page, same layout)
    {
      path: "project-configuration",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "add",
          element: (
            <PermissionRoute userType="member">
              <ProjectFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "edit/:id",
          element: (
            <PermissionRoute userType="member">
              <ProjectFormPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "vendor/vendor-details",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <VendorDetails />
            </PermissionRoute>
          ),
        },
        {
          path: "add",
          element: (
            <PermissionRoute userType="member">
              <VendorFormPage />
            </PermissionRoute>
          ),
        },
        {
          path: "edit/:id",
          element: (
            <PermissionRoute userType="member">
              <VendorFormPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "order-management",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <OrderManagementPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "vendor",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "link-similarity",
          element: (
            <PermissionRoute userType="member">
              <LinkSimilarityPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "sample-pool",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <SamplePoolPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "purchased-pool",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "",
          element: (
            <PermissionRoute userType="member">
              <PurchasedPoolPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "competitor",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "competitor-pool",
          element: (
            <PermissionRoute userType="member">
              <CompetitorPoolPage />
            </PermissionRoute>
          ),
        },
        {
          path: "competitor-details",
          element: (
            <PermissionRoute userType="member">
              <CompetitorDetailsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "competitor-details/add",
          element: <CompetitorForm />,
        },
        {
          path: "competitor-details/edit/:id",
          element: <CompetitorForm />,
        },
      ],
    },
    {
      path: "import",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "order-import",
          element: (
            <PermissionRoute userType="member">
              <OrderImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "analytics-import",
          element: (
            <PermissionRoute userType="member">
              <AnalyticsImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "ahrefs-import",
          element: (
            <PermissionRoute userType="member">
              <AhrefsImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "search-console-import",
          element: (
            <PermissionRoute userType="member">
              <SearchConsoleImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "conversion-import",
          element: (
            <PermissionRoute userType="member">
              <ConversionImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "se-ranking-import",
          element: (
            <PermissionRoute userType="member">
              <SeRankingImportPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "report",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "backlink-analysis-report",
          element: (
            <PermissionRoute userType="member">
              <BacklinkAnalysisReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "performance-analysis-report",
          element: (
            <PermissionRoute userType="member">
              <PerformanceAnalysisReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "project-cost-report",
          element: (
            <PermissionRoute userType="member">
              <ProjectCostReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "se-ranking-report",
          element: (
            <PermissionRoute userType="member">
              <SeRankingReportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "ahrefs-report",
          element: (
            <PermissionRoute userType="member">
              <AhrefsReportPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "library",
      element: <SeoSidebarLayout />,
      children: [
        {
          path: "issues-overview",
          element: (
            <PermissionRoute userType="member">
              <IssueOverviewImportPage />
            </PermissionRoute>
          ),
        },
        {
          path: "daily-record",
          element: (
            <PermissionRoute userType="member">
              <DailyRecordPage />
            </PermissionRoute>
          ),
        },
        {
          path: "test-scenario",
          element: (
            <PermissionRoute userType="member">
              <TestScenarioPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ],
};

export default seoRoutes;
