// Importing Redux actions from bankSlice
import {
  addBankData,
  addBankTransactionData,
  addTransactionDescriptionData,
  editBankData,
  editBankTransactionData,
  removeBankData,
  removeTransactionDescriptionData,
  storeAllBanksData,
  storeAllBankTransactionsData,
  storeAllTransactionDescriptionsData,
  storeBankTypes,
  storeCurrencyTypes,
} from "../store/bankSlice";

import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import { format } from "date-fns";

/**
 * Fetch all banks data for a specific organisation
 */
const getAllBanks = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/banks/`,
    });

    dispatch(storeAllBanksData(res.data)); // Store the fetched data in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new bank to the organisation
 */
const addNewBank = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/banks/`,
    data,
  });

  dispatch(addBankData(res.data)); // Update Redux store with new bank data
  toast.success("Bank has been successfully added.");
};

/**
 * Update existing bank details
 */
const updateBank = async (organisation_id, bank_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/finance/${organisation_id}/banks/${bank_id}/`,
    data,
  });

  dispatch(editBankData(res.data)); // Update Redux store with edited bank data
  toast.success("Bank has been updated successfully.");
};

/**
 * Assign member(s) to a bank
 */
const assignMemberToBank = async (organisation_id, bank_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/banks/${bank_id}/assign/`,
    data,
  });

  dispatch(editBankData(res.data));
  toast.success("Bank members have been updated successfully.");
};

/**
 * Archive a bank
 */
const archiveBank = async (organisation_id, bank_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/banks/${bank_id}/archive/`,
  });

  dispatch(removeBankData(res.data)); // Remove bank from Redux store
  toast.success("Bank has been archived successfully.");
};

/**
 * Make a transfer between banks
 */
const bankTransfer = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/bank-transactions/`,
    data,
  });

  dispatch(addBankTransactionData(res.data)); // Add new bank transaction to Redux store
  toast.success("Transfer successful.");

  getAllBanks(organisation_id, dispatch);
};

/**
 * Deposit or Withdraw money from bank
 */
const bankDepositWithdraw = async (
  organisation_id,
  from_bank_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/bank-transactions/${from_bank_id}/bank-transaction/`,
    data,
  });

  dispatch(addBankTransactionData(res.data)); // Add deposit/withdraw transaction
  toast.success("Transaction successful.");
};

/**
 * Fetch all bank transactions with optional filters
 */
const getAllBankTransactions = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  bankCode,
  transactionType,
  statusId,
  description,
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
  if (bankCode) queryParams.append("bankCode", bankCode);
  if (transactionType) queryParams.append("transactionType", transactionType);
  if (statusId) queryParams.append("status", statusId);
  if (description) queryParams.append("description", description);
  if (approver) queryParams.append("approver", approver);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/bank-transactions/?${queryParams.toString()}`,
    });

    dispatch(storeAllBankTransactionsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Approve a pending bank transaction
 */
const approveBankTransaction = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/bank-transactions/${transaction_id}/approve/`,
  });

  dispatch(editBankTransactionData(res.data)); // Update transaction status in Redux

  toast.success("Transaction approved successfully.");
  getAllBanks(organisation_id, dispatch); // Get all the updated banks again.
};

/**
 * Reject a pending bank transaction
 */
const rejectBankTransaction = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/bank-transactions/${transaction_id}/reject/`,
  });

  dispatch(editBankTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction rejected successfully.");
};

/**
 * Archive an approved bank transaction
 */
const archiveBankTransaction = async (
  organisation_id,
  transaction_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/bank-transactions/${transaction_id}/archive/`,
  });

  dispatch(editBankTransactionData(res.data)); // Update transaction status in Redux store
  toast.success("Transaction archived.");
};

/**
 * Fetch all transaction descriptions with optional purpose filter
 */
const getAllTransactionDescriptions = async (
  organisation_id,
  dispatch,
  purpose
) => {
  const queryParams = new URLSearchParams({});

  if (purpose) queryParams.append("purpose", purpose);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/bank-transaction-descriptions/?${queryParams.toString()}`,
    });

    dispatch(storeAllTransactionDescriptionsData(res.data)); // Store descriptions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new transaction description
 */
const addNewTransactionDescription = async (
  organisation_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/finance/${organisation_id}/bank-transaction-descriptions/`,
    data,
  });

  dispatch(addTransactionDescriptionData(res.data)); // Add new description to Redux store
  toast.success("Description has been successfully added.");
};

/**
 * Archive a transaction description
 */
const archiveTransactionDescription = async (
  organisation_id,
  description_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/bank-transaction-descriptions/${description_id}/archive/`,
  });

  dispatch(removeTransactionDescriptionData(res.data)); // Remove description from Redux store
  toast.success("Description has been archived successfully.");
};

/**
 * Fetch all bank types
 */
const getAllBankTypes = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/enums/bank-types/`,
    });

    dispatch(storeBankTypes(res.data)); // Store the fetched data in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Fetch all currency types
 */
const getAllCurrencyTypes = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/enums/currency-types/`,
    });

    dispatch(storeCurrencyTypes(res.data)); // Store the fetched data in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

export {
  getAllBanks,
  addNewBank,
  updateBank,
  archiveBank,
  assignMemberToBank,
  bankTransfer,
  bankDepositWithdraw,

  // Bank Transactions
  getAllBankTransactions,
  approveBankTransaction,
  rejectBankTransaction,
  archiveBankTransaction,

  // Transaction description
  getAllTransactionDescriptions,
  addNewTransactionDescription,
  archiveTransactionDescription,
  getAllBankTypes,
  getAllCurrencyTypes,
};
