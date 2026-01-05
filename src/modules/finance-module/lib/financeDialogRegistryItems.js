import AddEditBankForm from "../components/banks/bank-details/AddEditBankForm";
import AssignMemberToBankForm from "../components/banks/bank-details/AssignMemberToBankForm";
import BankDetailedView from "../components/banks/bank-details/BankDetailedView";
import BankTransferForm from "../components/banks/bank-details/BankTransferForm";
import DepositWithdrawForm from "../components/banks/bank-details/DepositWithdrawForm";

import AddTransactionDescriptionForm from "../components/banks/bank-settings/AddTransactionDescriptionForm";
import ArchiveTransactionDescriptionAlert from "../components/banks/bank-settings/ArchiveTransactionDescriptionAlert";
import RejectArchiveBankTransactionAlert from "../components/banks/bank-transactions/RejectArchiveBankTransactionAlert";

import AddBudgetForm from "../components/budgets/budget-details/AddBudgetForm";
import BudgetDetailedView from "../components/budgets/budget-details/BudgetDetailedView";
import RejectBudgetAlert from "../components/budgets/budget-details/RejectBudgetAlert";

import AddEditExpenseCategoryForm from "../components/expenses/categories/AddEditExpenseCategoryForm";
import ArchiveExpenseCategoryAlert from "../components/expenses/categories/ArchiveExpenseCategoryAlert";
import ExpensesSort from "../components/expenses/ExpenseSort";
import AddEditExpenseSubCategoryForm from "../components/expenses/sub-categories/AddEditExpenseSubCategoryForm";
import ArchiveExpenseSubCategoryAlert from "../components/expenses/sub-categories/ArchiveExpenseSubCategoryAlert";
import AddEditExpenseSubSubCategoryForm from "../components/expenses/sub-sub-categories/AddEditExpenseSubSubCategoryForm";
import ArchiveExpenseSubSubCategoryAlert from "../components/expenses/sub-sub-categories/ArchiveExpenseSubSubCategoryAlert";

import AddEmployeeClaimForm from "../components/transactions/claims/AddEmployeeClaimForm";
import ApproveEmployeeClaimByFinanceForm from "../components/transactions/claims/ApproveClaimByFinanceForm";
import ClaimViewDetails from "../components/transactions/claims/ClaimViewDetails";
import RejectClaimAlert from "../components/transactions/claims/RejectClaimAlert";

import AddDebitCreditForm from "../components/transactions/transaction-details/AddDebitCreditForm";
import EditApprovedTransactionForm from "../components/transactions/transaction-details/EditApprovedTransactionForm";
import EditTransactionForm from "../components/transactions/transaction-details/EditTransactionForm";
import TransactionRejectArchiveAlert from "../components/transactions/transaction-details/TransactionRejectArchiveAlert";
import TransactionViewDetails from "../components/transactions/transaction-details/TransactionViewDetails";

import AddWalletActivityForm from "../components/transactions/wallet-activities/AddWalletActivityForm";
import ArchiveWalletActivityAlert from "../components/transactions/wallet-activities/ArchiveWalletActivityAlert";

const financeDialogRegistryItems = {
  // Expense Categories
  addExpenseCategory: AddEditExpenseCategoryForm,
  editExpenseCategory: AddEditExpenseCategoryForm,
  archiveExpenseCategory: ArchiveExpenseCategoryAlert,

  // Expense Sub Categories
  addExpenseSubCategory: AddEditExpenseSubCategoryForm,
  editExpenseSubCategory: AddEditExpenseSubCategoryForm,
  archiveExpenseSubCategory: ArchiveExpenseSubCategoryAlert,

  // Expense Sub Sub Categories
  addExpenseSubSubCategory: AddEditExpenseSubSubCategoryForm,
  editExpenseSubSubCategory: AddEditExpenseSubSubCategoryForm,
  archiveExpenseSubSubCategory: ArchiveExpenseSubSubCategoryAlert,

  // Expenses Sorting
  sortExpenseCategory: ExpensesSort,
  sortExpenseSubCategory: ExpensesSort,
  sortExpenseSubSubCategory: ExpensesSort,

  // Claims
  addEmployeeClaim: AddEmployeeClaimForm,
  rejectClaim: RejectClaimAlert,
  claimDetails: ClaimViewDetails,
  approveClaimByFinance: ApproveEmployeeClaimByFinanceForm,

  // Transactions
  addCreditTransaction: AddDebitCreditForm,
  addDebitTransaction: AddDebitCreditForm,
  editTransaction: EditTransactionForm,
  editApprovedTransaction: EditApprovedTransactionForm,
  transactionDetails: TransactionViewDetails,
  rejectTransaction: TransactionRejectArchiveAlert,
  archiveTransaction: TransactionRejectArchiveAlert,

  // Wallet Activity
  addWalletActivity: AddWalletActivityForm,
  archiveWalletActivity: ArchiveWalletActivityAlert,

  // Banks
  addNewBank: AddEditBankForm,
  editBank: AddEditBankForm,
  assignMemberToBank: AssignMemberToBankForm,
  bankDetailedView: BankDetailedView,
  bankWithdrawDeposit: DepositWithdrawForm,
  bankTransfer: BankTransferForm,

  // Bank Transactions
  rejectBankTransaction: RejectArchiveBankTransactionAlert,
  archiveBankTransaction: RejectArchiveBankTransactionAlert,
  addTransactionDescription: AddTransactionDescriptionForm,
  archiveTransactionDescription: ArchiveTransactionDescriptionAlert,

  // Budgets
  addBudget: AddBudgetForm,
  budgetDetails: BudgetDetailedView,
  rejectBudget: RejectBudgetAlert,
};

export default financeDialogRegistryItems;
