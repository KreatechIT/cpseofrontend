import {
  BankingIcon,
  BudgetManagementIcon,
  CreditCardIcon,
  ExpensesIcon,
  ProfitLossIcon,
} from "@/components/icons/FinanceIcons";
import { HrManagementIcon } from "@/components/icons/HrIcons";
import { DashboardIcon, SettingsIcon } from "@/components/icons/Icons";
import { UserAccessManagementIcon } from "@/components/icons/Icons";

const financeSidebarLinks = [
  {
    groupTitle: null, // No group title for this section
    hasPermission: () => true, // Group is always shown if any child is visible
    children: [
      {
        title: "Dashboard",
        path: "/finance/dashboard",
        icon: DashboardIcon,
        hasPermission: () => true, // Always visible
        children: null,
      },
      {
        title: "Profit & Loss",
        path: "/finance/profit-loss",
        icon: ProfitLossIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("finance_report.read"),
        children: [
          {
            title: "Profit & Loss Statement",
            path: "/finance/profit-loss/pl-statement",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
      {
        title: "Transaction",
        path: "/finance/transaction",
        icon: CreditCardIcon,
        hasPermission: ({ hasAnyPermission }) =>
          hasAnyPermission([
            "finance_transaction.read",
            "finance_claim.read",
            "finance_revenue.read",
          ]), // Visible if user has any of the following permissions: 'finance_transaction', 'finance_claim', 'finance_revenue'
        children: [
          {
            title: "Claims",
            path: "/finance/transaction/claims",
            hasPermission: ({ hasPermission }) =>
              hasPermission("finance_claim.read"), // Visible if user has 'finance_claim' permission
            children: null,
          },
          {
            title: "Transaction Details",
            path: "/finance/transaction/details",
            hasPermission: ({ hasPermission }) =>
              hasPermission("finance_transaction.read"), // Visible if user has 'finance_transaction' permission
            children: null,
          },
          {
            title: "Wallet Activity",
            path: "/finance/transaction/wallet-activity",
            hasPermission: ({ hasPermission }) =>
              hasPermission("finance_revenue.read"), // Visible if user has 'finance_revenue' permission
            children: null,
          },
        ],
      },
      {
        title: "Bank",
        path: "/finance/bank",
        icon: BankingIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("finance_bank.read"), // Visible if user has 'finance_bank' permission
        children: [
          {
            title: "Bank Details",
            path: "/finance/bank/details",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Bank Transactions",
            path: "/finance/bank/transactions",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Bank Settings",
            path: "/finance/bank/settings",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
      {
        title: "Budget Management",
        path: "/finance/budget",
        icon: BudgetManagementIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("finance_budget.read"), // Visible if user has 'finance_budget' permission
        children: [
          {
            title: "Budget Summary",
            path: "/finance/budget/summary",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Budget Details",
            path: "/finance/budget/details",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Budget Report",
            path: "/finance/budget/report",
            hasPermission: () => true,
            children: null,
          },
        ],
      },
    ],
  },
  {
    groupTitle: "Finance Settings",
    hasPermission: ({ hasPermission }) =>
      hasPermission("finance_category.read"), // Visible if user has 'finance_category' permission
    children: [
      {
        title: "Expense Categorisation",
        path: "/finance/expense",
        icon: ExpensesIcon,
        hasPermission: ({ hasPermission }) =>
          hasPermission("finance_category.read"), // Visible if user has 'finance_category' permission
        children: [
          {
            title: "Categories",
            path: "/finance/expenses/category",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Sub Categories",
            path: "/finance/expenses/sub-category",
            hasPermission: () => true,
            children: null,
          },
          {
            title: "Sub Sub Categories",
            path: "/finance/expenses/sub-sub-category",
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
        title: "User Access Management",
        path: "/organisation/dashboard",
        icon: UserAccessManagementIcon,
        hasPermission: () => true,
        children: null,
      },
      {
        title: "HR Management",
        path: "/hr/hr-management/dashboard?from=finance",
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

export default financeSidebarLinks;
