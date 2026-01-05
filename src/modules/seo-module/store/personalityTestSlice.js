import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  discQuestions: null,
};

const personalityTestSlice = createSlice({
  name: "personalityTest",
  initialState,

  reducers: {
    storeAllDiscQuestions: (state, { payload }) => {
      state.discQuestions = payload;
    },

    addDiscQuestionData: (state, { payload }) => {
      state.discQuestions?.unshift(payload);
    },

    editDiscQuestionData: (state, { payload }) => {
      const index = state.discQuestions.findIndex((q) => q.id === payload.id);
      if (index !== -1) state.discQuestions[index] = payload;
    },

    removeDiscQuestionData: (state, { payload }) => {
      state.discQuestions = state.discQuestions.filter(
        (q) => q.id !== payload.id
      );
    },
  },
});

export const {
  storeAllDiscQuestions,
  addDiscQuestionData,
  editDiscQuestionData,
  removeDiscQuestionData,
} = personalityTestSlice.actions;

export default personalityTestSlice.reducer;
