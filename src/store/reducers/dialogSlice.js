/**
 * dialogSlice
 *
 * This slice manages global dialog state.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // Tracks if dialog is open
  type: null, // Type of dialog to show (e.g., "addMember", "archiveAdmin", etc.). Should match a key in dialogRegistry for dynamic rendering.
  props: null, // Props to pass to the dialog component
  styles: "", // Optional custom styles for the dialog

  // Global Search
  isSearchDialogOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    // Open or close the dialog
    toggleDialogOpen: (state, { payload }) => {
      state.isOpen = payload;
    },

    // Fully reset and close the dialog
    closeDialog: (state) => {
      state.isOpen = false;
      state.type = null;
      state.props = null;
      state.styles = "";
    },

    // Set multiple dialog fields at once (type, props, styles)
    setDialogData: (state, { payload }) => {
      const { type, props, styles } = payload;

      state.type = type || null;
      state.props = props || null;
      state.styles = styles || "";

      state.isOpen = true;
    },

    // Global Search
    toggleSeachDialogOpen: (state, { payload }) => {
      state.isSearchDialogOpen = payload;
    },
  },
});

export const {
  toggleDialogOpen,
  closeDialog,
  setDialogData,
  toggleSeachDialogOpen,
} = dialogSlice.actions;

export default dialogSlice.reducer;
