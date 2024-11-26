import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false, // Tracks if the user is logged in
    token: null, // Stores the JWT token
    user: null, // Stores user details
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token; // Save the token
      state.user = action.payload.user; // Save the user details
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null; // Clear the token
      state.user = null; // Clear the user details
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
