import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const employeeDatabaseSlice = createSlice({
  name: "employeeDatabase",
  initialState,

  reducers: {},
});

// export const {} = employeeDatabaseSlice.actions;
export default employeeDatabaseSlice.reducer;
