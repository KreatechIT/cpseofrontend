import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leaveTypes: null,
  leavePolicies: null,
};

const leaveManagementSlice = createSlice({
  name: "leaveManagement",
  initialState,

  reducers: {
    storeAllLeaveTypesData: (state, { payload }) => {
      state.leaveTypes = payload;
    },

    addLeaveTypeData: (state, { payload }) => {
      state.leaveTypes?.unshift(payload);
    },

    editLeaveTypeData: (state, { payload }) => {
      const index = state.leaveTypes.findIndex(
        (leaveType) => leaveType.id === payload.id
      );
      if (index !== -1) state.leaveTypes[index] = payload;
    },

    removeLeaveTypeData: (state, { payload }) => {
      state.leaveTypes = state.leaveTypes.filter(
        (leaveType) => leaveType.id !== payload.id
      );
    },

    storeAllLeavePoliciesData: (state, { payload }) => {
      state.leavePolicies = payload;
    },

    addLeavePolicyData: (state, { payload }) => {
      state.leavePolicies?.unshift(payload);
    },

    editLeavePolicyData: (state, { payload }) => {
      const index = state.leavePolicies.findIndex(
        (leavePolicy) => leavePolicy.id === payload.id
      );
      if (index !== -1) state.leavePolicies[index] = payload;
    },

    removeLeavePolicyData: (state, { payload }) => {
      state.leavePolicies = state.leavePolicies.filter(
        (leavePolicy) => leavePolicy.id !== payload.id
      );
    },
  },
});

export const {
  storeAllLeaveTypesData,
  addLeaveTypeData,
  editLeaveTypeData,
  removeLeaveTypeData,

  storeAllLeavePoliciesData,
  addLeavePolicyData,
  editLeavePolicyData,
  removeLeavePolicyData,
} = leaveManagementSlice.actions;

export default leaveManagementSlice.reducer;
