import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  importedData: null,
  loading: false,
};

const purchaseImportSlice = createSlice({
  name: "purchaseImport",
  initialState,
  reducers: {
    storeImportedData: (state, action) => {
      state.importedData = action.payload;
    },
    setImportLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearImportedData: (state) => {
      state.importedData = null;
    },
  },
});

export const {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} = purchaseImportSlice.actions;

export default purchaseImportSlice.reducer;
