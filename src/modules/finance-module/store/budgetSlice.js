import { createSlice } from "@reduxjs/toolkit";

// Initial state for the budget slice
const initialState = {
  budgets: null,
  budgetReport: null,
  budgetSummary: null,
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,

  reducers: {
    // Action to store all budgets data
    storeAllBudgetsData: (state, { payload }) => {
      state.budgets = payload; // Replacing entire budgets array with new data
    },

    // Action to add a new budget entry to the list (at the beginning)
    addBudgetData: (state, { payload }) => {
      state.budgets?.unshift(payload);
    },

    // Action to edit/update an existing budget's data based on ID
    editBudgetData: (state, { payload }) => {
      const index = state.budgets.findIndex(
        (budget) => budget.id === payload.id
      );
      if (index !== -1) state.budgets[index] = payload; // If found, replace old budget data with new payload
    },

    // Action to remove a budget from list based on ID
    removeBudgetData: (state, { payload }) => {
      state.budgets = state.budgets.filter(
        (budget) => budget.id !== payload.id
      );
      // Filter out the budget whose ID matches payload.id
    },

    // Action to store all budget transactions (usually fetched from API)
    storeBudgetReportData: (state, { payload }) => {
      state.budgetReport = payload; // Replace entire budget report array
    },

    // Action to store all transaction descriptions (from API)
    storeBudgetSummaryData: (state, { payload }) => {
      state.budgetSummary = payload;
    },
  },
});

export const {
  storeAllBudgetsData,
  addBudgetData,
  editBudgetData,
  removeBudgetData,

  storeBudgetReportData,
  storeBudgetSummaryData,
} = budgetSlice.actions;

export default budgetSlice.reducer;
