import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchased: null,
  loading: false,
  error: null,
};

const purchasedPoolSlice = createSlice({
  name: "purchasedPool",
  initialState,
  reducers: {
    storeAllPurchased: (state, action) => {
      state.purchased = action.payload;
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
