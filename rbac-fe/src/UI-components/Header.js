import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Popover,
  Button,
  Box,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { logout } from "../Redux/slices/authSlice";
import { toggleDarkMode } from "../Redux/slices/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logoTextWhite from "../Assets/StockGaurdwhitelogo.png";
import logoTextBlack from "../Assets/StockGaurdfigma.png";

const Header = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handlePopoverClose();
    dispatch(logout());
    navigate("/login");
  };

  const isPopoverOpen = Boolean(anchorEl);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <img
            src={darkMode ? logoTextWhite : logoTextBlack}
            alt="StockGuard Logo"
            style={{ maxHeight: 20 }}
          />
        </Box>

        {!isSmallScreen && user && (
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Tooltip title="Role of the user" arrow>
              <Typography
                variant="body1"
                sx={{ marginRight: 1, fontWeight: "bold" }}
              >
                {user.role.name}
              </Typography>
            </Tooltip>
            <Tooltip title="Name of the user" arrow>
              <Typography variant="body1">{user.name}</Typography>
            </Tooltip>
          </Box>
        )}
        <Tooltip
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          arrow
        >
          <IconButton color="inherit" onClick={handleToggleDarkMode}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Tooltip>

        <IconButton color="inherit" onClick={handlePopoverOpen}>
          <SettingsIcon />
        </IconButton>

        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Button onClick={handleLogout} sx={{ padding: 2 }}>
            Logout
          </Button>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
