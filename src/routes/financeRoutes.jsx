import NotFoundPage from "@/pages/NotFoundPage";
import { Outlet } from "react-router-dom";
import PermissionRoute from "./elements/PermissionRoute";
import FinanceSidebarLayout from "@/modules/finance-module/layouts/FinanceSidebarLayout";
import FinanceDashboard from "@/modules/finance-module/pages/dashboard/FinanceDashboard";
import CategoryPage from "@/modules/finance-module/pages/expenses/CategoryPage";
import SubCategoryPage from "@/modules/finance-module/pages/expenses/SubCategoryPage";
import SubSubCategoryPage from "@/modules/finance-module/pages/expenses/SubSubCategoryPage";
import ProfitLossStatementPage from "@/modules/finance-module/pages/profit-loss/ProfitLossStatementPage";
import WalletActivityPage from "@/modules/finance-module/pages/transactions/WalletActivityPage";
import TransactionDetailsPage from "@/modules/finance-module/pages/transactions/TransactionDetailsPage";
import ClaimsPage from "@/modules/finance-module/pages/transactions/ClaimsPage";

import BankSettingsPage from "@/modules/finance-module/pages/banks/BankSettingsPage";
import BankTransactionPage from "@/modules/finance-module/pages/banks/BankTransactionsPage";
import BankDetailsPage from "@/modules/finance-module/pages/banks/BankDetailsPage";

import BudgetDetailsPage from "@/modules/finance-module/pages/budgets/BudgetDetailsPage";
import BudgetReportPage from "@/modules/finance-module/pages/budgets/BudgetReportPage";
import BudgetSummaryPage from "@/modules/finance-module/pages/budgets/BudgetSummaryPage";

const financeRoutes = {
  path: "finance",
  element: <FinanceSidebarLayout />,
  children: [
    {
      path: "dashboard",
      element: (
        <PermissionRoute userType="member">
          <FinanceDashboard />
        </PermissionRoute>
      ),
    },
    {
      path: "profit-loss",
      element: <Outlet />,
      children: [
        {
          path: "pl-statement",
          element: (
            <PermissionRoute userType="member" permission="finance_report.read">
              <ProfitLossStatementPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "transaction",
      element: <Outlet />,
      children: [
        {
          path: "claims",
          element: (
            <PermissionRoute userType="member" permission="finance_claim.read">
              <ClaimsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "details",
          element: (
            <PermissionRoute
              userType="member"
              permission="finance_transaction.read"
            >
              <TransactionDetailsPage />
            </PermissionRoute>
          ),
        },
        {
          path: "wallet-activity",
          element: (
            <PermissionRoute
              userType="member"
              permission="finance_revenue.read"
            >
              <WalletActivityPage />
            </PermissionRoute>
          ),
        },
      ],
    },
    {
      path: "bank",
      element: (
        <PermissionRoute userType="member" permission="finance_bank.read">
          <Outlet />
        </PermissionRoute>
      ),
      children: [
        {
          path: "details",
          element: <BankDetailsPage />,
        },
        {
          path: "transactions",
          element: <BankTransactionPage />,
        },
        {
          path: "settings",
          element: <BankSettingsPage />,
        },
      ],
    },
    {
      path: "budget",
      element: (
        <PermissionRoute userType="member" permission="finance_budget.read">
          <Outlet />
        </PermissionRoute>
      ),
      children: [
        {
          path: "summary",
          element: <BudgetSummaryPage />,
        },
        {
          path: "details",
          element: <BudgetDetailsPage />,
        },
        {
          path: "report",
          element: <BudgetReportPage />,
        },
      ],
    },
    {
      path: "expenses",
      element: (
        <PermissionRoute userType="member" permission="finance_category.read">
          <Outlet />
        </PermissionRoute>
      ),
      children: [
        {
          path: "category",
          element: <CategoryPage />,
        },
        {
          path: "sub-category",
          element: <SubCategoryPage />,
        },
        {
          path: "sub-sub-category",
          element: <SubSubCategoryPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
};

export default financeRoutes;
