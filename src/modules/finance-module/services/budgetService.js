// Importing Redux actions from budgetSlice
import {
  storeAllBudgetsData,
  addBudgetData,
  editBudgetData,
  storeBudgetReportData,
  storeBudgetSummaryData,
} from "../store/budgetSlice";

import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import { format } from "date-fns";

/**
 * Fetch all budgets with optional filters
 */
const getAllBudgets = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  company,
  department,
  status
) => {
  const queryParams = new URLSearchParams({});

  // If fromDate and toDate are not provided, default to this month
  if (!fromDate || !toDate) {
    const today = new Date();

    fromDate = new Date(today.getFullYear(), today.getMonth(), 1); // 1st day of current month
    toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of current month
  }

  // Adding filters as query parameters if provided
  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));

  if (company) queryParams.append("company", company);
  if (department) queryParams.append("department", department);
  if (status) queryParams.append("status", status);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/budgets/?${queryParams.toString()}`,
    });

    dispatch(storeAllBudgetsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new budget
 */
const addNewBudget = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/budgets/`,
    data,
  });

  dispatch(addBudgetData(res.data)); // Update Redux store with new budget data
  toast.success("Budget has been successfully added.");
};

/**
 * Approve a pending budget by HOD
 */
const approveBudgetByHOD = async (organisation_id, budget_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/budgets/${budget_id}/hod-approve/`,
  });

  dispatch(editBudgetData(res.data)); // Update transaction status in Redux store
  toast.success("Budget has been approved by HOD.");
};

/**
 * Approve a pending budget by HOD
 */
const approveBudgetByFinance = async (organisation_id, budget_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/budgets/${budget_id}/finance-approve/`,
  });

  dispatch(editBudgetData(res.data)); // Update transaction status in Redux store
  toast.success("Budget has been approved by Finance.");
};

/**
 * Reject a pending budget transaction
 */
const rejectBudget = async (organisation_id, budget_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/budgets/${budget_id}/reject/`,
  });

  dispatch(editBudgetData(res.data)); // Update transaction status in Redux store
  toast.success("Budget has been rejected.");
};

/**
 * Fetch budget report
 */
const getBudgetReport = async (organisation_id, dispatch, date) => {
  if (!date) {
    date = format(new Date(), "yyyy-MM-dd");
  }
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/budgets/report-new/?date=${date}`,
    });

    dispatch(storeBudgetReportData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Fetch budget report
 */
const getBudgetSummary = async (organisation_id, dispatch, date) => {
  if (!date) {
    date = format(new Date(), "yyyy-MM-dd");
  }
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/budgets/summary/?date=${date}`,
    });

    dispatch(storeBudgetSummaryData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

export {
  getAllBudgets,
  addNewBudget,
  approveBudgetByHOD,
  approveBudgetByFinance,
  rejectBudget,
  getBudgetReport,
  getBudgetSummary,
};
