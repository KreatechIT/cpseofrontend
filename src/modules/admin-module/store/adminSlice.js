import { createSlice } from "@reduxjs/toolkit";

// Initial state with three properties:
// - admins: stores the list of admins
// - adminRoles: stores the list of admin roles
// - adminRoleFormat: stores the format/template for roles
const initialState = {
  admins: null,
  adminRoles: null,
  adminRoleFormat: null,
};

const adminSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    // Replaces the entire `admins` with new data
    storeAllAdminData: (state, { payload }) => {
      state.admins = payload;
    },

    // Adds a new admin to the beginning of the `admins` array
    addAdminData: (state, { payload }) => {
      state.admins?.unshift(payload);
    },

    // Updates an existing admin in the `admins` array based on ID
    editAdminData: (state, { payload }) => {
      const index = state.admins.findIndex((admin) => admin.id === payload.id);
      if (index !== -1) {
        state.admins[index] = payload;
      }
    },

    // Removes an admin from the `admins` array based on ID
    removeAdminData: (state, { payload }) => {
      state.admins = state.admins.filter((admin) => admin.id !== payload.id);
    },

    // Replaces the entire `adminRoles` with new data
    storeAllAdminRolesData: (state, { payload }) => {
      state.adminRoles = payload;
    },

    // Adds a new admin role to the beginning of the `adminRoles` array
    addAdminRoleData: (state, { payload }) => {
      state.adminRoles?.unshift(payload);
    },

    // Updates an existing adminRole in the `adminRoles` array based on ID
    editAdminRoleData: (state, { payload }) => {
      const index = state.adminRoles.findIndex(
        (role) => role.id === payload.id
      );
      if (index !== -1) {
        state.adminRoles[index] = payload;
      }
    },

    // Removes an admin role from the adminRoles array based on its ID
    removeAdminRoleData: (state, { payload }) => {
      state.adminRoles = state.adminRoles.filter(
        (role) => role.id !== payload.id
      );
    },

    // Stores the format/template for admin roles
    storeAdminRoleFormat: (state, { payload }) => {
      state.adminRoleFormat = payload;
    },
  },
});

export const {
  // admins
  storeAllAdminData,
  addAdminData,
  editAdminData,
  removeAdminData,

  // admin roles
  storeAllAdminRolesData,
  addAdminRoleData,
  editAdminRoleData,
  removeAdminRoleData,
  storeAdminRoleFormat,
} = adminSlice.actions;

export default adminSlice.reducer;
