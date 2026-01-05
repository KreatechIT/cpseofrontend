import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  competitors: null,
  loading: false,
  error: null,
};

const competitorPoolSlice = createSlice({
  name: "competitorPool",
  initialState,
  reducers: {
    storeAllCompetitors: (state, action) => {
      state.competitors = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCompetitorsLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCompetitorsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  storeAllCompetitors,
  setCompetitorsLoading,
  setCompetitorsError,
} = competitorPoolSlice.actions;

export default competitorPoolSlice.reducer;
