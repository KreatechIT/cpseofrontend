import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: null,
  walletActivities: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,

  reducers: {
    storeAllTransactionsData: (state, { payload }) => {
      state.transactions = payload; // Replacing entire transactions array with new data
    },

    // Action to add a new transaction entry to the list (at the beginning)
    addTransactionData: (state, { payload }) => {
      state.transactions?.unshift(payload); // Adds new transaction object to beginning of array
    },

    // Action to edit/update an existing transaction's data based on ID
    editTransactionData: (state, { payload }) => {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === payload.id
      );
      if (index !== -1) state.transactions[index] = payload; // If found, replace old transaction data with new payload
    },

    // Action to remove a transaction from list based on ID
    removeTransactionData: (state, { payload }) => {
      state.transactions = state.transactions.filter(
        (transaction) => transaction.id !== payload.id
      );
      // Filter out the transaction whose ID matches payload.id
    },

    storeAllWalletActivityData: (state, { payload }) => {
      state.walletActivities = payload; // Replacing entire walletActivitys array with new data
    },

    // Action to add a new walletActivity entry to the list (at the beginning)
    addWalletActivityData: (state, { payload }) => {
      state.walletActivities?.unshift(payload); // Adds new walletActivity object to beginning of array
    },

    // Action to edit/update an existing walletActivity's data based on ID
    editWalletActivityData: (state, { payload }) => {
      const index = state.cliams.findIndex(
        (walletActivity) => walletActivity.id === payload.id
      );
      if (index !== -1) state.walletActivity[index] = payload; // If found, replace old walletActivity data with new payload
    },

    // Action to remove a walletActivity from list based on ID
    removeWalletActivityData: (state, { payload }) => {
      state.walletActivities = state.walletActivities.filter(
        (walletActivity) => walletActivity.id !== payload.id
      );
      // Filter out the walletActivity whose ID matches payload.id
    },
  },
});

export const {
  storeAllTransactionsData,
  addTransactionData,
  editTransactionData,
  removeTransactionData,

  storeAllWalletActivityData,
  addWalletActivityData,
  editWalletActivityData,
  removeWalletActivityData,
} = transactionSlice.actions;
export default transactionSlice.reducer;
