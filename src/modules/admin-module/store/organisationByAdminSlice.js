import { createSlice } from "@reduxjs/toolkit";

// Initial state for managing organisations by admin
const initialState = {
  organisations: null, // List of organisations visible to the admin
  organisationProducts: null, // List of available products/modules offered (e.g., HR, Finance)

  // Initial state where `members` is an object,
  // with organisation IDs as keys and arrays of member objects as values.
  // e.g., { "org1": [member1, member2], "org2": [member3] }
  members: {},

  // Initial state where `memberRoles` is an object,
  // with organisation IDs as keys and arrays of memberRole objects as values.
  // e.g., { "org1": [memberRole1, memberRole2], "org2": [memberRole3] }
  memberRoles: {},

  // - memberRoleFormat: stores the format/template for member roles
  memberRoleFormat: null,
};

// Create a Redux slice for handling organisation-related data
const organisationByAdminSlice = createSlice({
  name: "organisationsByAdmin",
  initialState,
  reducers: {
    // Replaces the entire `organisations` with new data
    storeAllOrganisationData: (state, { payload }) => {
      state.organisations = payload;
    },

    // Adds a new organisation to the beginning of the `organisations` array
    addOrganisationData: (state, { payload }) => {
      state.organisations?.unshift(payload);
    },

    // Updates an existing organisation in the `organisations` array based on ID
    editOrganisationData: (state, { payload }) => {
      const index = state.organisations.findIndex(
        (organisation) => organisation.id === payload.id
      );
      if (index !== -1) {
        state.organisations[index] = payload;
      }
    },

    // Removes an organisation from the `organisations` array based on ID
    removeOrganisationData: (state, { payload }) => {
      state.organisations = state.organisations.filter(
        (organisation) => organisation.id !== payload.id
      );
    },

    // Store all products/modules like Finance, HR, etc. Used when adding/editing organisation.
    storeOrganisationProductsData: (state, { payload }) => {
      state.organisationProducts = payload;
    },

    // Stores all member data for a specific organisation
    // Payload shape: { organisation_id, data: [membersArray] }
    storeAllMemberData: (state, { payload }) => {
      state.members[payload.organisation_id] = payload.data;
    },

    // Adds a new member to the beginning of the member list for a specific organisation
    // Payload shape: { organisation_id, data: newMember }
    addMemberData: (state, { payload }) => {
      state.members[payload.organisation_id]?.unshift(payload.data);
    },

    // Updates a specific member in a specific organisation by matching member ID
    // Payload shape: { organisation_id, data: updatedMember }
    editMemberData: (state, { payload }) => {
      const index = state.members[payload.organisation_id].findIndex(
        (member) => member.id === payload.data.id
      );
      if (index !== -1) {
        state.members[payload.organisation_id][index] = payload.data;
      }
    },

    // Removes a member from the correct organisation's member list
    // Payload shape: { organisation_id, data: memberToRemove }
    removeMemberData: (state, { payload }) => {
      state.members[payload.organisation_id] = state.members[
        payload.organisation_id
      ].filter((member) => member.id !== payload.data.id);
    },

    // Stores all memberRole data for a specific organisation
    // Payload shape: { organisation_id, data: [memberRolesArray] }
    storeAllMemberRoleData: (state, { payload }) => {
      state.memberRoles[payload.organisation_id] = payload.data;
    },

    // Adds a new memberRole to the beginning of the memberRole list for a specific organisation
    // Payload shape: { organisation_id, data: newMemberRole }
    addMemberRoleData: (state, { payload }) => {
      state.memberRoles[payload.organisation_id]?.unshift(payload.data);
    },

    // Updates a specific memberRole in a specific organisation by matching memberRole ID
    // Payload shape: { organisation_id, data: updatedMemberRole }
    editMemberRoleData: (state, { payload }) => {
      const index = state.memberRoles[payload.organisation_id].findIndex(
        (memberRole) => memberRole.id === payload.data.id
      );
      if (index !== -1) {
        state.memberRoles[payload.organisation_id][index] = payload.data;
      }
    },

    // Removes a memberRole from the correct organisation's memberRole list
    // Payload shape: { organisation_id, data: memberRoleToRemove }
    removeMemberRoleData: (state, { payload }) => {
      state.memberRoles[payload.organisation_id] = state.memberRoles[
        payload.organisation_id
      ].filter((memberRole) => memberRole.id !== payload.data.id);
    },

    // Stores the format/template for member roles
    storeMemberRoleFormat: (state, { payload }) => {
      state.memberRoleFormat = payload;
    },
  },
});

export const {
  // organisations
  storeAllOrganisationData,
  addOrganisationData,
  editOrganisationData,
  removeOrganisationData,
  storeOrganisationProductsData,

  // organisation members
  storeAllMemberData,
  addMemberData,
  editMemberData,
  removeMemberData,

  // organisation roles
  storeAllMemberRoleData,
  addMemberRoleData,
  editMemberRoleData,
  removeMemberRoleData,
  storeMemberRoleFormat,
} = organisationByAdminSlice.actions;

export default organisationByAdminSlice.reducer;
