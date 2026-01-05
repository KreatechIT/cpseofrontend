import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profitLossData: null,
};

const profitLossSlice = createSlice({
  name: "profitLoss",
  initialState,
  reducers: {
    storeProfitLossReportData: (state, { payload }) => {
      state.profitLossData = payload;
    },
  },
});

export const { storeProfitLossReportData } = profitLossSlice.actions;
export default profitLossSlice.reducer;
