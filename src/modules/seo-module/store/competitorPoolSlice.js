import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  competitors: [], // ← Always start with empty array (NEVER null/undefined)
  loading: false,
  error: null,
};

const competitorPoolSlice = createSlice({
  name: "competitorPool",
  initialState,
  reducers: {
    // Safe reducer – always store as array
    storeAllCompetitors: (state, action) => {
      // If API sends { results: [...] }, extract results
      const payload = action.payload;
      state.competitors = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
        ? payload.results
        : []; // fallback to empty array if anything goes wrong

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

    // Optional: Clear action (if you need to reset)
    clearCompetitors: (state) => {
      state.competitors = [];
      state.error = null;
    },
  },
});

export const {
  storeAllCompetitors,
  setCompetitorsLoading,
  setCompetitorsError,
  clearCompetitors,
} = competitorPoolSlice.actions;

export default competitorPoolSlice.reducer;
