import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cpUpdates: [],
  cpNews: [],
  loading: false,
  error: null,
};

const seoDashboardSlice = createSlice({
  name: "seoDashboard",
  initialState,
  reducers: {
    storeCpUpdates: (state, action) => {
      state.cpUpdates = action.payload;
    },
    storeCpNews: (state, action) => {
      state.cpNews = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
    setDashboardError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  storeCpUpdates,
  storeCpNews,
  setDashboardLoading,
  setDashboardError,
} = seoDashboardSlice.actions;

export default seoDashboardSlice.reducer;