import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addTransactionData,
  addWalletActivityData,
  editTransactionData,
  removeWalletActivityData,
  storeAllTransactionsData,
  storeAllWalletActivityData,
} from "../store/transactionSlice";
import { format } from "date-fns";

/**
 * Fetch all transactions with optional filters
 */
const getAllTransactions = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  company,
  department,
  bankCode,
  type,
  category,
  status,
  approver
) => {
  const queryParams = new URLSearchParams({});

  // If fromDate and toDate are not provided, default to last 30 days
  if (!fromDate || !toDate) {
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
  }

  // Adding filters as query parameters if provided
  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));

  if (company) queryParams.append("company", company);
  if (department) queryParams.append("department", department);
  if (bankCode) queryParams.append("bankCode", bankCode);
  if (type) queryParams.append("type", type);
  if (category) queryParams.append("category", category);
  if (status) queryParams.append("status", status);
  // if (description) queryParams.append(description);
  if (approver) queryParams.append("approver", approver);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/transactions/?${queryParams.toString()}`,
    });

    dispatch(storeAllTransactionsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new credit transaction to the organisation
 */
const addNewCreditTransaction = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/finance/${organisation_id}/transactions/credit/`,
    data,
  });

  dispatch(addTransactionData(res.data)); // Update Redux store with new transaction data
  toast.success("Transaction has been successfully added.");
};

/**
 * Add new debit transaction to the organisation
 */
const addNewDebitTransaction = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/finance/${organisation_id}/transactions/debit/`,
    data,
  });

  dispatch(addTransactionData(res.data)); // Update Redux store with new transaction data
  toast.success("Transaction has been successfully added.");
};

/**
 * Approve a pending transaction by HOD
 */
const approveTransactionByHOD = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/hod-approve/`,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been approved by HOD.");
};

/**
 * Approve a pending transaction by HOD
 */
const approveTransactionByFinance = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/finance-approve/`,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been approved by Finance.");
};

/**
 * Reject a pending transaction transaction
 */
const rejectTransaction = async (organisation_id, transaction_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/reject/`,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been rejected.");
};

/**
 * Update a pending transaction
 */
const updateTransaction = async (
  organisation_id,
  transaction_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    // headers: { "Content-Type": "multipart/form-data" },
    method: "PUT",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/`,
    data,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been updated successfully.");
};

/**
 * Edit an approved transaction
 */
const updateApprovedTransaction = async (
  organisation_id,
  transaction_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "PUT",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/edit-approved/`,
    data,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been updated successfully.");
};

const archiveTransaction = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/transactions/${transaction_id}/archive/`,
  });

  dispatch(editTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction has been archived.");
};

/**
 * Fetch all wallet activites with optional filters
 */
const getAllWalletActivity = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  company,
  description
) => {
  const queryParams = new URLSearchParams({});

  // If fromDate and toDate are not provided, default to last 30 days
  if (!fromDate || !toDate) {
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
  }

  // Adding filters as query parameters if provided
  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));

  if (company) queryParams.append("company", company);
  if (description) queryParams.append("description", description);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/wallet-activities/?${queryParams.toString()}`,
    });

    dispatch(storeAllWalletActivityData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

const addNewWalletActivity = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/wallet-activities/`,
    data,
  });

  dispatch(addWalletActivityData(res.data)); // Update Redux store with new transaction data
  toast.success("New wallet activity has been successfully added.");
};

const archiveWalletActivity = async (
  organisation_id,
  activity_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/wallet-activities/${activity_id}/archive/`,
  });

  dispatch(removeWalletActivityData(res.data));
  toast.success("Wallet activity has been archived.");
};

export {
  getAllTransactions,
  addNewCreditTransaction,
  addNewDebitTransaction,
  updateTransaction,
  updateApprovedTransaction,
  approveTransactionByHOD,
  approveTransactionByFinance,
  rejectTransaction,
  archiveTransaction,
  getAllWalletActivity,
  addNewWalletActivity,
  archiveWalletActivity,
};
