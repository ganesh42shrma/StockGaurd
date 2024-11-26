import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";
import snackbarReducer from "./slices/snackbarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
