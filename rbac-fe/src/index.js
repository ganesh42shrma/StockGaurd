import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure this contains your font import
import App from "./App";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Provider, useSelector } from "react-redux";
import store from "./Redux/store";

const AppWithDynamicTheme = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#B4BFA4" : "#B4BFA4",
      },
      secondary: {
        main: darkMode ? "#C5E1A5" : "#C5E1A5",
      },
      background: {
        default: darkMode ? "#000000" : "#FFFFFF",
        paper: darkMode ? "#000000" : "#FFFFFF",
      },
      text: {
        primary: darkMode ? "#FFFFFF" : "#000000",
        secondary: darkMode ? "#C5E1A5" : "#B4BFA4",
      },
      button: {
        background: darkMode ? "#C5E1A5" : "#C5E1A5",
        text: darkMode ? "#000000" : "#000000",
      },
      icon: {
        color: darkMode ? "#FFFFFF" : "#000000",
      },
      card: {
        background: darkMode ? "#B4BFA4" : "#FFFFFF",
        text: darkMode ? "#FFFFFF" : "#000000",
      },
    },
    typography: {
      fontFamily: '"Quattrocento Sans", sans-serif',
      h1: {
        fontFamily: '"Quattrocento Sans", sans-serif',
      },
      body1: {
        fontFamily: '"Quattrocento Sans", sans-serif',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithDynamicTheme />
    </Provider>
  </React.StrictMode>
);
