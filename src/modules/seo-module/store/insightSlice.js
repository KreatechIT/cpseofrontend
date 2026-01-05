import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchased: [],
  samples: [],
  competitorPool: [],
  loading: false,
  error: null,
};

const insightSlice = createSlice({
  name: "insight",
  initialState,
  reducers: {
    setPurchased: (state, action) => {
      state.purchased = action.payload;
    },
    setSamples: (state, action) => {
      state.samples = action.payload;
    },
    setCompetitorPool: (state, action) => {
      state.competitorPool = action.payload;
    },
    setInsightLoading: (state, action) => {
      state.loading = action.payload;
    },
    setInsightError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPurchased,
  setSamples,
  setCompetitorPool,
  setInsightLoading,
  setInsightError,
} = insightSlice.actions;

export default insightSlice.reducer;