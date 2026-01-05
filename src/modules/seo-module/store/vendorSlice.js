import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vendors: null, // will be array of vendors from API
  loading: false,
  error: null,
};

const vendorSlice = createSlice({
  name: "vendorDatabase",
  initialState,
  reducers: {
    // Store all vendors from API
    storeAllVendors: (state, action) => {
      state.vendors = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Optional: Set loading state
    setVendorsLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Optional: Set error
    setVendorsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Optional: Clear vendors (e.g., on logout)
    clearVendors: (state) => {
      state.vendors = null;
      state.loading = false;
      state.error = null;
    },

    // Optional: Add a single vendor after create
    addVendor: (state, action) => {
      if (Array.isArray(state.vendors)) {
        state.vendors.unshift(action.payload);
      } else {
        state.vendors = [action.payload];
      }
    },

    // Optional: Update a vendor after edit
    updateVendor: (state, action) => {
      if (Array.isArray(state.vendors)) {
        const index = state.vendors.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
      }
    },

    // Optional: Remove a vendor after delete
    removeVendor: (state, action) => {
      if (Array.isArray(state.vendors)) {
        state.vendors = state.vendors.filter((v) => v.id !== action.payload.id);
      }
    },
  },
});

export const {
  storeAllVendors,
  setVendorsLoading,
  setVendorsError,
  clearVendors,
  addVendor,
  updateVendor,
  removeVendor,
} = vendorSlice.actions;

export default vendorSlice.reducer;