import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orderManagement",
  initialState,
  reducers: {
    storeAllOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    setOrdersLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOrdersError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearOrders: (state) => {
      state.orders = null;
      state.loading = false;
      state.error = null;
    },
    addOrder: (state, action) => {
      if (Array.isArray(state.orders)) {
        state.orders.unshift(action.payload);
      } else {
        state.orders = [action.payload];
      }
    },
    updateOrder: (state, action) => {
      if (Array.isArray(state.orders)) {
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      }
    },
    removeOrder: (state, action) => {
      if (Array.isArray(state.orders)) {
        state.orders = state.orders.filter((o) => o.id !== action.payload);
      }
    },
  },
});

export const {
  storeAllOrders,
  setOrdersLoading,
  setOrdersError,
  clearOrders,
  addOrder,
  updateOrder,
  removeOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
