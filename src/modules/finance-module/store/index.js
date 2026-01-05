import bankReducer from "./bankSlice";
import budgetReducer from "./budgetSlice";
import claimReducer from "./claimSlice";
import profitLossReducer from "./profitLossSlice";
import transactionReducer from "./transactionSlice";
import expenseCategoryReducer from "./expensesCategorySlice";

const financeReducers = {
  banks: bankReducer,
  budgets: budgetReducer,
  claims: claimReducer,
  profitLoss: profitLossReducer,
  transaction: transactionReducer,
  expenseCategory: expenseCategoryReducer,
};

export default financeReducers;
