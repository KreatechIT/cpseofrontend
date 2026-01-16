import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  competitors: [], // ← Always start with empty array (NEVER null/undefined)
  loading: false,
  error: null,
};

const competitorDetailsSlice = createSlice({
  name: "competitorDetails",
  initialState,
  reducers: {
    // Store all competitors (handles both flat array and paginated { results: [...] })
    storeAllCompetitors: (state, action) => {
      const payload = action.payload;
      state.competitors = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.results)
        ? payload.results
        : []; // Safe fallback

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

    // Add new competitor (safe even if state.competitors is somehow not array)
    addCompetitor: (state, action) => {
      if (!Array.isArray(state.competitors)) {
        state.competitors = [];
      }
      state.competitors.unshift(action.payload);
    },

    // Update existing competitor
    updateCompetitor: (state, action) => {
      if (!Array.isArray(state.competitors)) {
        state.competitors = [];
        return;
      }
      const index = state.competitors.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.competitors[index] = action.payload;
      }
    },

    // Remove competitor by id
    removeCompetitor: (state, action) => {
      if (!Array.isArray(state.competitors)) {
        state.competitors = [];
        return;
      }
      state.competitors = state.competitors.filter(
        (c) => c.id !== action.payload
      );
    },

    // Optional: Clear all competitors
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
  addCompetitor,
  updateCompetitor,
  removeCompetitor,
  clearCompetitors,
} = competitorDetailsSlice.actions;

export default competitorDetailsSlice.reducer;
