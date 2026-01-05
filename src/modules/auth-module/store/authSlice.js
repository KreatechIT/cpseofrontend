import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // stores user related info (e.g. name, email, role, permissions etc.)
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // Sets user data after loggin in.
    setAuthData: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
    },

    // This action will be caught by the root reducer to clear all state.
    removeAuthData: () => initialState, // Reset to initial state when logging out.
  },
});

export const { setAuthData, removeAuthData } = authSlice.actions;

export default authSlice.reducer;
