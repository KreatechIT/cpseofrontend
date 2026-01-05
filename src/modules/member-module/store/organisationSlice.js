import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organisation: null, // store member organisation info
  members: null, // Holds the list of members
  memberRoles: null, // Holds the list of member roles (array of roles)
  memberRoleFormat: null, // Holds the format data for member roles (used for creating roles.)
};

const organisationSlice = createSlice({
  name: "organisation",
  initialState,
  reducers: {
    // Action to store logged in user's organisation data
    storeOrganisationData: (state, { payload }) => {
      state.organisation = payload;
    },

    // Action to store all members data
    storeAllMemberData: (state, { payload }) => {
      state.members = payload; // Replace current members with the payload (array of members)
    },

    // Action to add a new member to the state
    addMemberData: (state, { payload }) => {
      state.members.unshift(payload); // Add new member to the beginning of the members array
    },

    // Action to edit/update an existing member's data
    editMemberData: (state, { payload }) => {
      // Find the index of the member that needs to be updated
      const index = state.members.findIndex(
        (member) => member.id === payload.id
      );
      // Replace the existing member data at the found index with the updated data
      state.members[index] = payload;
    },

    // Action to remove a member from the state
    removeMemberData: (state, { payload }) => {
      // Filter out the member with the given id
      state.members = state.members.filter(
        (member) => member.id !== payload.id
      );
    },

    // Action to store all member roles data
    storeAllMemberRolesData: (state, { payload }) => {
      state.memberRoles = payload; // Replace current memberRoles with payload (array of roles)
    },

    // Action to add a new member role to the state
    addMemberRoleData: (state, { payload }) => {
      state.memberRoles.unshift(payload); // Add new role to the beginning of the memberRoles array
    },

    // Action to edit/update an existing member role data
    editMemberRoleData: (state, { payload }) => {
      // Find the index of the role that needs to be updated
      const index = state.memberRoles.findIndex(
        (role) => role.id === payload.id
      );
      // Replace the existing role data at the found index with the updated data
      state.memberRoles[index] = payload;
    },

    // Action to remove a member role from the state
    removeMemberRoleData: (state, { payload }) => {
      // Filter out the role with the given id
      state.memberRoles = state.memberRoles.filter(
        (role) => role.id !== payload.id
      );
    },

    // Action to store member role format (schema/template data)
    storeMemberRoleFormat: (state, { payload }) => {
      state.memberRoleFormat = payload;
    },
  },
});

export const {
  // organisation
  storeOrganisationData,

  // members
  storeAllMemberData,
  addMemberData,
  editMemberData,
  removeMemberData,

  // roles
  storeAllMemberRolesData,
  addMemberRoleData,
  editMemberRoleData,
  removeMemberRoleData,
  storeMemberRoleFormat,
} = organisationSlice.actions;

export default organisationSlice.reducer;
