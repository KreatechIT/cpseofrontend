import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  referrals: null,
};

const referralSlice = createSlice({
  name: "referrals",
  initialState,

  reducers: {
    storeAllReferralsData: (state, { payload }) => {
      state.referrals = payload;
    },

    addReferralData: (state, { payload }) => {
      state.referrals?.unshift(payload);
    },

    editReferralData: (state, { payload }) => {
      const index = state.referrals.findIndex(
        (referrals) => referrals.id === payload.id
      );
      if (index !== -1) state.referrals[index] = payload;
    },

    removeReferralData: (state, { payload }) => {
      state.referrals = state.referrals.filter(
        (referral) => referral.id !== payload.id
      );
    },
  },
});

export const {
  storeAllReferralsData,
  addReferralData,
  editReferralData,
  removeReferralData,
} = referralSlice.actions;
export default referralSlice.reducer;
