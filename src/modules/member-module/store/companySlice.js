import { createSlice } from "@reduxjs/toolkit";

// Initial state for the company slice
const initialState = {
  companies: null,
};

// Create a slice for companies-related state and actions
const companySlice = createSlice({
  name: "company",
  initialState,

  reducers: {
    // Action to store all companies data
    storeAllCompanies: (state, { payload }) => {
      state.companies = payload; // Replace current companies with payload (array of companies)
    },

    // Action to add a new company to the state
    addCompany: (state, { payload }) => {
      state.companies?.unshift(payload); // Add new company to the beginning of the companies array
    },

    // Action to edit/update an existing company's data
    editCompany: (state, { payload }) => {
      // Find the index of the company that needs to be updated
      const index = state.companies.findIndex(
        (company) => company.id === payload.id
      );
      // If found, update the company's data
      if (index !== -1) state.companies[index] = payload;
    },

    // Action to remove a company from the state
    removeCompany: (state, { payload }) => {
      // Filter out the company with the given id
      state.companies = state.companies.filter(
        (company) => company.id !== payload.id
      );
    },
  },
});

export const { storeAllCompanies, addCompany, editCompany, removeCompany } =
  companySlice.actions;

export default companySlice.reducer;
