import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  overview: null,
  cpUpdates: [],
  cpNews: [],
  milestones: [],
  loading: false,
  error: null,
};

const seoDashboardSlice = createSlice({
  name: "seoDashboard",
  initialState,
  reducers: {
    setOverview: (state, action) => {
      state.overview = action.payload;
    },
    setCpUpdates: (state, action) => {
      state.cpUpdates = Array.isArray(action.payload.results) ? action.payload.results : [];
    },
    setCpNews: (state, action) => {
      state.cpNews = Array.isArray(action.payload.results) ? action.payload.results : [];
    },
    setMilestones: (state, action) => {
      state.milestones = Array.isArray(action.payload.milestones) ? action.payload.milestones : [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setOverview,
  setCpUpdates,
  setCpNews,
  setMilestones,
  setLoading,
  setError,
} = seoDashboardSlice.actions;

export default seoDashboardSlice.reducer;