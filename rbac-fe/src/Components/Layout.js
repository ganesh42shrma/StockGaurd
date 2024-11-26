import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

// Import Pages
import Header from "../UI-components/Header";
import Sidebar from "../UI-components/Sidebar";

// Only render the layout and its structure, no need to rerun routes here.
const drawerWidth = 240;

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar
        drawerWidth={drawerWidth}
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        isSmallScreen={isSmallScreen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: { xs: 2, sm: 3 }, // Adjust padding for mobile and desktop
          minHeight: "100vh",
          marginTop: "64px",
          transition: "margin-left 0.3s",
          // Adjust margin based on sidebar visibility
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
