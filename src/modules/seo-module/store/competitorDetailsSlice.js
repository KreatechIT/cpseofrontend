import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  competitors: null,
  loading: false,
  error: null,
};

const competitorDetailsSlice = createSlice({
  name: "competitorDetails",
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
    addCompetitor: (state, action) => {
      if (Array.isArray(state.competitors)) {
        state.competitors.unshift(action.payload);
      } else {
        state.competitors = [action.payload];
      }
    },
    updateCompetitor: (state, action) => {
      if (Array.isArray(state.competitors)) {
        const index = state.competitors.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competitors[index] = action.payload;
        }
      }
    },
    removeCompetitor: (state, action) => {
      if (Array.isArray(state.competitors)) {
        state.competitors = state.competitors.filter(
          (c) => c.id !== action.payload
        );
      }
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
} = competitorDetailsSlice.actions;

export default competitorDetailsSlice.reducer;
