import { createSlice } from "@reduxjs/toolkit";

const confirmationSlice = createSlice({
  name: "confirmation",
  initialState: {
    isOpen: false,
    message: "",
    onConfirm: null,
    onCancel: null,
  },
  reducers: {
    showConfirmation: (state, action) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    hideConfirmation: (state) => {
      state.isOpen = false;
      state.message = "";
      state.onConfirm = null;
      state.onCancel = null;
    },
  },
});

export const { showConfirmation, hideConfirmation } = confirmationSlice.actions;

export default confirmationSlice.reducer;
