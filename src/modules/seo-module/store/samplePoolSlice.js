import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  samples: null,
  loading: false,
  error: null,
};

const samplePoolSlice = createSlice({
  name: "samplePool",
  initialState,
  reducers: {
    storeAllSamples: (state, action) => {
      state.samples = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSamplesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSamplesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSamples: (state) => {
      state.samples = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  storeAllSamples,
  setSamplesLoading,
  setSamplesError,
  clearSamples,
} = samplePoolSlice.actions;

export default samplePoolSlice.reducer;