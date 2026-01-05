import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checklist: null,
};

const onboradingTaskChecklistSlice = createSlice({
  name: "onboardingTaskChecklist",
  initialState,

  reducers: {
    storeTaskChecklistData: (state, { payload }) => {
      state.checklist = payload;
    },
  },
});

export const { storeTaskChecklistData } = onboradingTaskChecklistSlice.actions;
export default onboradingTaskChecklistSlice.reducer;
