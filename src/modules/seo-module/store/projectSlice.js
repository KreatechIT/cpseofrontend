import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: null, // or [] if you prefer array
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    storeAllProjects: (state, action) => {
      state.projects = action.payload;
    },
    addProjectData: (state, action) => {
      if (Array.isArray(state.projects)) {
        state.projects.unshift(action.payload);
      } else {
        state.projects = [action.payload];
      }
    },
    editProjectData: (state, action) => {
      if (Array.isArray(state.projects)) {
        const index = state.projects.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) state.projects[index] = action.payload;
      }
    },
    removeProjectData: (state, action) => {
      if (Array.isArray(state.projects)) {
        state.projects = state.projects.filter(
          (p) => p.id !== action.payload.id
        );
      }
    },
    clearProjects: (state) => {
      state.projects = null;
    },
  },
});

export const {
  storeAllProjects,
  addProjectData,
  editProjectData,
  removeProjectData,
  clearProjects,
} = projectSlice.actions;

export default projectSlice.reducer;
