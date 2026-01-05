import { createSlice } from "@reduxjs/toolkit";

// Initial state for departments and subDepartments
const initialState = {
  departments: null, // Holds the list of departments
  subDepartments: null, // Holds the list of sub-departments
};

// Create a slice for departments-related state and actions
const departmentSlice = createSlice({
  name: "department",
  initialState,

  reducers: {
    // Store all departments data
    storeAllDepartments: (state, { payload }) => {
      state.departments = payload; // Replace current departments with payload (array of departments)
    },

    // Add a new department
    addDepartment: (state, { payload }) => {
      state.departments.unshift(payload); // Add new department at the beginning of the departments array
    },

    // Edit/update an existing department
    editDepartment: (state, { payload }) => {
      const index = state.departments.findIndex(
        (dept) => dept.id === payload.id
      );
      if (index !== -1) state.departments[index] = payload; // If found, update the department data
    },

    // Remove a department by ID
    removeDepartment: (state, { payload }) => {
      state.departments = state.departments.filter(
        (dept) => dept.id !== payload.id
      );
    },

    // Store all sub-departments data
    storeAllSubDepartments: (state, { payload }) => {
      state.subDepartments = payload; // Replace current subDepartments with payload (array of sub-departments)
    },

    // Add a new sub-department
    addSubDepartment: (state, { payload }) => {
      state.subDepartments.unshift(payload); // Add new sub-department at the beginning of subDepartments array
    },

    // Edit/update an existing sub-department
    editSubDepartment: (state, { payload }) => {
      const index = state.subDepartments.findIndex(
        (sub) => sub.id === payload.id
      );
      if (index !== -1) state.subDepartments[index] = payload; // If found, update sub-department data
    },

    // Remove a sub-department by ID
    removeSubDepartment: (state, { payload }) => {
      state.subDepartments = state.subDepartments.filter(
        (sub) => sub.id !== payload.id
      );
    },
  },
});

export const {
  // Departments
  storeAllDepartments,
  addDepartment,
  editDepartment,
  removeDepartment,

  // Sub departments
  storeAllSubDepartments,
  addSubDepartment,
  editSubDepartment,
  removeSubDepartment,
} = departmentSlice.actions;

export default departmentSlice.reducer;
