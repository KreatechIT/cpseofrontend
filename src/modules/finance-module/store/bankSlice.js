import { createSlice } from "@reduxjs/toolkit";

// Initial state for the banks slice
const initialState = {
  banks: null, //stores all bank data
  bankTransactions: null, // stores all transactions related to banks
  transactionDescriptions: null, // stores all transaction descriptions

  bankTypes: null, // stores all the bank names. used when adding a new bank.
  currencyTypes: null,
};

const bankSlice = createSlice({
  name: "banks",
  initialState,

  reducers: {
    // Action to store all banks data
    storeAllBanksData: (state, { payload }) => {
      state.banks = payload; // Replacing entire banks array with new data
    },

    // Action to add a new bank entry to the list (at the beginning)
    addBankData: (state, { payload }) => {
      state.banks?.unshift(payload);
    },

    // Action to edit/update an existing bank's data based on ID
    editBankData: (state, { payload }) => {
      const index = state.banks.findIndex((bank) => bank.id === payload.id);
      if (index !== -1) state.banks[index] = payload; // If found, replace old bank data with new payload
    },

    // Action to remove a bank from list based on ID
    removeBankData: (state, { payload }) => {
      state.banks = state.banks.filter((bank) => bank.id !== payload.id);
      // Filter out the bank whose ID matches payload.id
    },

    // Action to store all bank transactions
    storeAllBankTransactionsData: (state, { payload }) => {
      state.bankTransactions = payload; // Replace entire transactions array
    },

    // Action to add one or multiple new transactions
    addBankTransactionData: (state, { payload }) => {
      if (Array.isArray(payload)) {
        state.bankTransactions?.unshift(...payload); // If payload is an array, add all at beginning
      } else {
        state.bankTransactions?.unshift(payload); // If payload is a single object, add it directly
      }
    },

    // Action to update/edit a transaction based on ID
    editBankTransactionData: (state, { payload }) => {
      const index = state.bankTransactions.findIndex(
        (txn) => txn.id === payload.id
      );
      if (index !== -1) state.bankTransactions[index] = payload;
      // If found, update the transaction data
    },

    // Action to remove a transaction based on ID
    removeBankTransactionData: (state, { payload }) => {
      state.bankTransactions = state.bankTransactions.filter(
        (txn) => txn.id !== payload.id
      );
    },

    // Action to store all transaction descriptions
    storeAllTransactionDescriptionsData: (state, { payload }) => {
      state.transactionDescriptions = payload;
    },

    // Action to add a new transaction description
    addTransactionDescriptionData: (state, { payload }) => {
      state.transactionDescriptions?.unshift(payload);
    },

    // Action to remove a transaction description by ID
    removeTransactionDescriptionData: (state, { payload }) => {
      state.transactionDescriptions = state.transactionDescriptions.filter(
        (desc) => desc.id !== payload.id
      );
    },

    storeBankTypes: (state, { payload }) => {
      state.bankTypes = payload;
    },

    storeCurrencyTypes: (state, { payload }) => {
      state.currencyTypes = payload;
    },
  },
});

export const {
  storeAllBanksData,
  addBankData,
  editBankData,
  removeBankData,

  storeAllBankTransactionsData,
  addBankTransactionData,
  editBankTransactionData,
  removeBankTransactionData,

  storeAllTransactionDescriptionsData,
  addTransactionDescriptionData,
  removeTransactionDescriptionData,

  storeBankTypes,
  storeCurrencyTypes,
} = bankSlice.actions;

export default bankSlice.reducer;
