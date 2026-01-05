/**
 * sheetSlice
 *
 * This slice manages global sheet state.
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false, // Tracks if sheet is open
  type: null, // Type of sheet to show. Should match a key in sheetRegistry for dynamic rendering.
  props: null, // Props to pass to the sheet component
  styles: "", // Optional custom styles for the sheet
};

const sheetSlice = createSlice({
  name: "sheet",
  initialState,
  reducers: {
    // Open or close the sheet
    toggleSheetOpen: (state, { payload }) => {
      state.isOpen = payload;
    },

    // Fully reset and close the sheet
    closeSheet: (state) => {
      state.isOpen = false;
      state.type = null;
      state.props = null;
      state.styles = "";
    },

    // Set multiple sheet fields at once (type, props, styles)
    setSheetData: (state, { payload }) => {
      const { type, props, styles } = payload;

      state.type = type || null;
      state.props = props || null;
      state.styles = styles || "";

      state.isOpen = true;
    },
  },
});

export const { toggleSheetOpen, closeSheet, setSheetData } = sheetSlice.actions;

export default sheetSlice.reducer;
