import { createSlice } from "@reduxjs/toolkit";

const redirectSlice = createSlice({
  name: "redirect",
  initialState: {},
  reducers: {
    setRedirect: (state, action) => {
      return action.payload;
    },
    clearRedirect: () => {
      return {};
    },
  },
});

export const { setRedirect, clearRedirect } = redirectSlice.actions;
export default redirectSlice.reducer;
