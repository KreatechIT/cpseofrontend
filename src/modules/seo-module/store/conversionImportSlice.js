import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  importedData: null,
  loading: false,
  error: null,
};

const conversionImportSlice = createSlice({
  name: "conversionImport",
  initialState,
  reducers: {
    storeImportedData: (state, action) => {
      state.importedData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setImportLoading: (state, action) => {
      state.loading = action.payload;
    },
    setImportError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearImportedData: (state) => {
      state.importedData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  storeImportedData,
  setImportLoading,
  setImportError,
  clearImportedData,
} = conversionImportSlice.actions;

export default conversionImportSlice.reducer;