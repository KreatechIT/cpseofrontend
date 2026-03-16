import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  importedData: [],
  importLoading: false,
};

const testScenarioImportSlice = createSlice({
  name: "testScenarioImport",
  initialState,
  reducers: {
    storeImportedData: (state, action) => {
      state.importedData = action.payload;
    },
    setImportLoading: (state, action) => {
      state.importLoading = action.payload;
    },
    clearImportedData: (state) => {
      state.importedData = [];
    },
  },
});

export const {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} = testScenarioImportSlice.actions;

export default testScenarioImportSlice.reducer;