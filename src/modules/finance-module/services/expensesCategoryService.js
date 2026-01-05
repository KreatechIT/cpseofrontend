import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
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
} from "../store/expensesCategorySlice";

/**
 * Fetch all expense categories data
 */
const getAllCategories = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/expenses-categories/`,
    });

    dispatch(storeAllExpenseCategoriesData(res.data));
  } catch {
    // Error handled globally by axiosInstance
  }
};

/**
 * Add new expense category
 */
const addNewExpenseCategory = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/expenses-categories/`,
    data,
  });

  dispatch(addExpenseCategoryData(res.data));
  toast.success("Expense category successfully added.");
};

/**
 * Update existing expense category
 */
const updateCategory = async (organisation_id, category_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/finance/${organisation_id}/expenses-categories/${category_id}/`,
    data,
  });

  dispatch(editExpenseCategoryData(res.data));
  toast.success("Expense category has been updated successfully.");
};

/**
 * Archive expense category
 */
const archiveCategory = async (organisation_id, category_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-categories/${category_id}/archive/`,
  });

  dispatch(removeExpenseCategoryData(res.data));
  toast.success("Expense category has been archived.");
};

/**
 * Fetch all expense sub-categories
 */
const getAllSubCategories = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/expenses-sub-categories/`,
    });

    dispatch(storeAllExpenseSubCategoriesData(res.data));
  } catch {
    // Error handled globally
  }
};

/**
 * Add new expense sub-category
 */
const addNewExpenseSubCategory = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/expenses-sub-categories/`,
    data,
  });

  dispatch(addExpenseSubCategoryData(res.data));
  toast.success("Expense sub-category successfully added.");
};

/**
 * Update expense sub-category
 */
const updateSubCategory = async (
  organisation_id,
  sub_category_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/finance/${organisation_id}/expenses-sub-categories/${sub_category_id}/`,
    data,
  });

  dispatch(editExpenseSubCategoryData(res.data));
  toast.success("Expense sub-category has been updated successfully.");
};

/**
 * Archive expense sub-category
 */
const archiveSubCategory = async (
  organisation_id,
  sub_category_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-sub-categories/${sub_category_id}/archive/`,
  });

  dispatch(removeExpenseSubCategoryData(res.data));
  toast.success("Expense sub-category has been archived.");
};

/**
 * Fetch all expense sub-sub-categories
 */
const getAllSubSubCategories = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/expenses-sub-sub-categories/`,
    });

    dispatch(storeAllExpenseSubSubCategoriesData(res.data));
  } catch {
    // Error handled globally
  }
};

/**
 * Add new expense sub-sub-category
 */
const addNewExpenseSubSubCategory = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/expenses-sub-sub-categories/`,
    data,
  });

  dispatch(addExpenseSubSubCategoryData(res.data));
  toast.success("Expense sub-sub-category successfully added.");
};

/**
 * Update expense sub-sub-category
 */
const updateSubSubCategory = async (
  organisation_id,
  sub_sub_category_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/finance/${organisation_id}/expenses-sub-sub-categories/${sub_sub_category_id}/`,
    data,
  });

  dispatch(editExpenseSubSubCategoryData(res.data));
  toast.success("Expense sub-sub-category has been updated successfully.");
};

/**
 * Archive expense sub-sub-category
 */
const archiveSubSubCategory = async (
  organisation_id,
  sub_sub_category_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-sub-sub-categories/${sub_sub_category_id}/archive/`,
  });

  dispatch(removeExpenseSubSubCategoryData(res.data));
  toast.success("Expense sub-sub-category has been archived.");
};

/* --------------------------------------------------------- */
/* SORT */
/* --------------------------------------------------------- */
const sortAllExpenseCategories = async (
  organisation_id,
  data,
  setIsSaving,
  dispatch
) => {
  await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-categories/sort/`,
    data,
  });

  toast.success("Expense categories have been sorted successfully");
  setIsSaving(false);
  getAllCategories(organisation_id, dispatch);
};

const sortAllExpenseSubCategories = async (
  organisation_id,
  data,
  setIsSaving,
  dispatch
) => {
  await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-sub-categories/sort/`,
    data,
  });

  toast.success("Expense sub categories have been sorted successfully");
  setIsSaving(false);
  getAllSubCategories(organisation_id, dispatch);
};

const sortAllExpenseSubSubCategories = async (
  organisation_id,
  data,
  setIsSaving,
  dispatch
) => {
  await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/expenses-sub-sub-categories/sort/`,
    data,
  });

  toast.success("Expense sub sub categories have been sorted successfully");
  setIsSaving(false);
  getAllSubSubCategories(organisation_id, dispatch);
};

export {
  // categories
  getAllCategories,
  addNewExpenseCategory,
  updateCategory,
  archiveCategory,

  // sub categories
  getAllSubCategories,
  addNewExpenseSubCategory,
  updateSubCategory,
  archiveSubCategory,

  // sub sub categories
  getAllSubSubCategories,
  addNewExpenseSubSubCategory,
  updateSubSubCategory,
  archiveSubSubCategory,

  // Sort
  sortAllExpenseCategories,
  sortAllExpenseSubCategories,
  sortAllExpenseSubSubCategories,
};
