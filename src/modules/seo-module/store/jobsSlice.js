import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobPosts: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,

  reducers: {
    storeAllJobPostsData: (state, { payload }) => {
      state.jobPosts = payload;
    },

    addJobPostData: (state, { payload }) => {
      state.jobPosts?.unshift(payload);
    },

    editJobPostData: (state, { payload }) => {
      const index = state.jobPosts.findIndex((post) => post.id === payload.id);
      if (index !== -1) state.jobPosts[index] = payload;
    },

    removeJobPostData: (state, { payload }) => {
      state.jobPosts = state.jobPosts.filter((post) => post.id !== payload.id);
    },

    storeJobLink: (state, { payload }) => {
      const index = state.jobPosts.findIndex(
        (post) => post.id === payload.job_id
      );
      if (index !== -1) state.jobPosts[index].link = payload.data;
    },
  },
});

export const {
  storeAllJobPostsData,
  addJobPostData,
  editJobPostData,
  removeJobPostData,
  storeJobLink,
} = jobsSlice.actions;

export default jobsSlice.reducer;
