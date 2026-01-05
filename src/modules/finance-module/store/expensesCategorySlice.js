import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenseCategories: null,
  expenseSubCategories: null,
  expenseSubSubCategories: null,
};

const expenseCategorySlice = createSlice({
  name: "expenseCategory",
  initialState,
  reducers: {
    // Categories
    storeAllExpenseCategoriesData: (state, { payload }) => {
      state.expenseCategories = payload;
    },

    addExpenseCategoryData: (state, { payload }) => {
      state.expenseCategories?.unshift(payload);
    },

    editExpenseCategoryData: (state, { payload }) => {
      const index = state.expenseCategories.findIndex(
        (cat) => cat.id === payload.id
      );
      if (index !== -1) state.expenseCategories[index] = payload;
    },

    removeExpenseCategoryData: (state, { payload }) => {
      state.expenseCategories = state.expenseCategories.filter(
        (cat) => cat.id !== payload.id
      );
    },

    // SubCategories
    storeAllExpenseSubCategoriesData: (state, { payload }) => {
      state.expenseSubCategories = payload;
    },

    addExpenseSubCategoryData: (state, { payload }) => {
      state.expenseSubCategories?.unshift(payload);
    },

    editExpenseSubCategoryData: (state, { payload }) => {
      const index = state.expenseSubCategories.findIndex(
        (subCat) => subCat.id === payload.id
      );
      if (index !== -1) state.expenseSubCategories[index] = payload;
    },

    removeExpenseSubCategoryData: (state, { payload }) => {
      state.expenseSubCategories = state.expenseSubCategories.filter(
        (subCat) => subCat.id !== payload.id
      );
    },

    // SubSubCategories
    storeAllExpenseSubSubCategoriesData: (state, { payload }) => {
      state.expenseSubSubCategories = payload;
    },

    addExpenseSubSubCategoryData: (state, { payload }) => {
      state.expenseSubSubCategories?.unshift(payload);
    },

    editExpenseSubSubCategoryData: (state, { payload }) => {
      const index = state.expenseSubSubCategories.findIndex(
        (subSubCat) => subSubCat.id === payload.id
      );
      if (index !== -1) state.expenseSubSubCategories[index] = payload;
    },

    removeExpenseSubSubCategoryData: (state, { payload }) => {
      state.expenseSubSubCategories = state.expenseSubSubCategories.filter(
        (subSubCat) => subSubCat.id !== payload.id
      );
    },
  },
});

export const {
  storeAllExpenseCategoriesData,
  addExpenseCategoryData,
  editExpenseCategoryData,
  removeExpenseCategoryData,

  storeAllExpenseSubCategoriesData,
  addExpenseSubCategoryData,
  editExpenseSubCategoryData,
  removeExpenseSubCategoryData,

  storeAllExpenseSubSubCategoriesData,
  addExpenseSubSubCategoryData,
  editExpenseSubSubCategoryData,
  removeExpenseSubSubCategoryData,
} = expenseCategorySlice.actions;

export default expenseCategorySlice.reducer;
