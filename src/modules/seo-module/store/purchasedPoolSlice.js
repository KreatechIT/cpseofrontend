import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchased: null,
  pagination: {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  },
  loading: false,
  error: null,
};

const purchasedPoolSlice = createSlice({
  name: "purchasedPool",
  initialState,
  reducers: {
    storeAllPurchased: (state, action) => {
      state.purchased = action.payload.results;
      state.pagination = {
        total: action.payload.total,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        totalPages: action.payload.totalPages,
      };
      state.loading = false;
      state.error = null;
    },
    setPurchasedLoading: (state, action) => {
      state.loading = action.payload;
    },
    setPurchasedError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { storeAllPurchased, setPurchasedLoading, setPurchasedError } =
  purchasedPoolSlice.actions;

export default purchasedPoolSlice.reducer;
