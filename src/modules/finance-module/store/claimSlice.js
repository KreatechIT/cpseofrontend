import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  claims: null,
};

const claimSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    storeAllClaimsData: (state, { payload }) => {
      state.claims = payload; // Replacing entire claims array with new data
    },

    // Action to add a new claim entry to the list (at the beginning)
    addClaimData: (state, { payload }) => {
      state.claims?.unshift(payload); // Adds new claim object to beginning of array
    },

    // Action to edit/update an existing claim's data based on ID
    editClaimData: (state, { payload }) => {
      const index = state.claims.findIndex((claim) => claim.id === payload.id);
      if (index !== -1) state.claims[index] = payload; // If found, replace old claim data with new payload
    },

    // Action to remove a claim from list based on ID
    removeClaimData: (state, { payload }) => {
      state.claims = state.claims.filter((claim) => claim.id !== payload.id);
      // Filter out the claim whose ID matches payload.id
    },
  },
});

export const {
  storeAllClaimsData,
  addClaimData,
  editClaimData,
  removeClaimData,
} = claimSlice.actions;
export default claimSlice.reducer;
