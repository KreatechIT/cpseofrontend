import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobCadidatesByPost: {},
  allCandidates: null,
};

const candidatesSlice = createSlice({
  name: "candidates",
  initialState,

  reducers: {
    storeAllJobCandidatesData: (state, { payload }) => {
      state.allCandidates = payload;
    },

    addCandidateDataToAllCandidates: (state, { payload }) => {
      state.allCandidates?.unshift(payload);
    },

    // Stores all candidates data for a specific job post
    // Payload shape: { job_post_id, data: [cadidates array] }
    storeJobCandidatesData: (state, { payload }) => {
      state.jobCadidatesByPost[payload.job_post_id] = payload.data;
    },

    editCandidateData: (state, { payload }) => {
      // Search through each job post's candidate list
      Object.keys(state.jobCadidatesByPost).forEach((postId) => {
        const candidates = state.jobCadidatesByPost[postId];
        if (Array.isArray(candidates)) {
          const index = candidates.findIndex(
            (candidate) => candidate.id === payload.id
          );
          if (index !== -1) {
            candidates[index] = payload;
          }
        }
      });

      // Update in allCandidates (if available)
      if (Array.isArray(state.allCandidates)) {
        const index = state.allCandidates.findIndex(
          (candidate) => candidate.id === payload.id
        );
        if (index !== -1) {
          state.allCandidates[index] = payload;
        }
      }
    },

    storeDiscLinkData: (state, { payload }) => {
      const index = state.allCandidates.findIndex(
        (candidate) => candidate.id === payload.candidate_id
      );

      if (index !== -1) state.allCandidates[index].disc_link = payload.data;
    },
  },
});

export const {
  storeAllJobCandidatesData,
  addCandidateDataToAllCandidates,
  storeJobCandidatesData,
  editCandidateData,
  storeDiscLinkData,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;
