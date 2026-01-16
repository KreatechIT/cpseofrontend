import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testScenarios: [], // main data array
  loading: false,
  error: null,
  lastFetched: null, // timestamp to prevent unnecessary refetch
};

const testScenarioSlice = createSlice({
  name: "testScenario",
  initialState,
  reducers: {
    setTestScenarios: (state, action) => {
      state.testScenarios = action.payload;
      state.lastFetched = Date.now();
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearTestScenarios: (state) => {
      state.testScenarios = [];
      state.lastFetched = null;
    },
  },
});

export const { setTestScenarios, setLoading, setError, clearTestScenarios } =
  testScenarioSlice.actions;

export default testScenarioSlice.reducer;
