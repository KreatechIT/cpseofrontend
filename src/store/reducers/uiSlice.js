/**
 * uiSlice
 *
 * This slice manages global UI-related state such as:
 * - viewMode: toggles between 'card' and 'table' views
 *
 * Useful for managing UI preferences and layout state across the application.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  viewMode: "card", // 'card' or 'table'
};

const uiSlice = createSlice({
  name: "ui",
  initialState,

  reducers: {
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setViewMode } = uiSlice.actions;
export default uiSlice.reducer;
