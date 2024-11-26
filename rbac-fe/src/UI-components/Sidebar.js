import React from "react";
import { Drawer, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import FactoryIcon from "@mui/icons-material/Factory";
import InventoryIcon from "@mui/icons-material/Inventory";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CategoryIcon from "@mui/icons-material/Category";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useTheme } from "@mui/material/styles";

const Sidebar = ({ drawerWidth, open, handleDrawerToggle, isSmallScreen }) => {
  // Get the current location from react-router
  const location = useLocation();

  // Helper function to check if the link is active
  const isActive = (path) => location.pathname.includes(path);

  // Special case for Home - check if the path is exactly "/layout"
  const isHomeActive = location.pathname === "/layout";
  const theme = useTheme();

  // Define the highlight color based on theme mode
  const highlightColor =
    theme.palette.mode === "dark"
      ? theme.palette.secondary.main
      : theme.palette.primary.main;

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : 60,
          boxSizing: "border-box",
          transition: "width 0.3s",
          mt: 8,
          backgroundColor: theme.palette.background.paper,
        },
      }}
      anchor="left"
      open={open || !isSmallScreen}
      onClose={handleDrawerToggle}
      variant={isSmallScreen ? "temporary" : "persistent"}
    >
      <List>
        <ListItem
          button
          component={Link}
          to="/layout"
          sx={{
            backgroundColor: isHomeActive ? highlightColor : "transparent", // Highlight active Home
          }}
        >
          <Tooltip title="Home" arrow>
            <FactoryIcon
              sx={{ mr: open ? 2 : 0, backgroundColor: theme.palette.icon }}
            />
          </Tooltip>
          {open && <ListItemText primary="Home" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/layout/add-inventory"
          sx={{
            backgroundColor: isActive("add-inventory")
              ? highlightColor
              : "transparent", // Highlight active Manage Inventory
          }}
        >
          <Tooltip title="Manage Inventory" arrow>
            <InventoryIcon
              sx={{ mr: open ? 2 : 0, backgroundColor: theme.palette.icon }}
            />
          </Tooltip>
          {open && <ListItemText primary="Manage Inventory" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/layout/view-inventory"
          sx={{
            backgroundColor: isActive("view-inventory")
              ? highlightColor
              : "transparent", // Highlight active View Inventory
          }}
        >
          <Tooltip title="Inventory Overview" arrow>
            <EqualizerIcon
              sx={{ mr: open ? 2 : 0, backgroundColor: theme.palette.icon }}
            />
          </Tooltip>
          {open && <ListItemText primary="Inventory Overview" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/layout/manage-category"
          sx={{
            backgroundColor: isActive("manage-category")
              ? highlightColor
              : "transparent", // Highlight active Manage Category
          }}
        >
          <Tooltip title="Manage Category" arrow>
            <CategoryIcon
              sx={{ mr: open ? 2 : 0, backgroundColor: theme.palette.icon }}
            />
          </Tooltip>
          {open && <ListItemText primary="Manage Category" />}
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/layout/manage-user"
          sx={{
            backgroundColor: isActive("manage-user")
              ? highlightColor
              : "transparent", // Highlight active Manage Category
          }}
        >
          <Tooltip title="Manage User" arrow>
            <SupervisorAccountIcon
              sx={{ mr: open ? 2 : 0, backgroundColor: theme.palette.icon }}
            />
          </Tooltip>
          {open && <ListItemText primary="Manage User" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
