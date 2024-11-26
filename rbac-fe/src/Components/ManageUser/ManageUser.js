import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../Services/userServices";
import { getRoles } from "../../Services/roleServices";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { openSnackbar, closeSnackbar } from "../../Redux/slices/snackbarSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const ManageUserPage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (user?.role.name === "Admin") {
      const fetchData = async () => {
        try {
          const usersData = await getUsers();
          const rolesData = await getRoles();
          setUsers(usersData);
          setRoles(rolesData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const { name, email, password, roleId } = formData;
    try {
      const userData = { name, email, password, roleId };
      const response = await createUser(userData);
      setUsers([...users, response.user]);
      setFormData({
        name: "",
        email: "",
        password: "",
        roleId: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const { name, email, password, roleId } = formData;
      const updatedData = { name, email, password, roleId };
      const response = await updateUser(editingUser._id, updatedData);

      const updatedUsers = users.map((user) =>
        user._id === editingUser._id ? response.user : user
      );
      setUsers(updatedUsers);
      setOpenDialog(false);
      setEditingUser(null);

      dispatch(
        openSnackbar({
          message: "User updated successfully",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error updating user:", error);
      dispatch(
        openSnackbar({ message: "Error updating user", severity: "error" })
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      const updatedUsers = users.filter((user) => user._id !== userId);
      setUsers(updatedUsers);
      dispatch(
        openSnackbar({
          message: "User deleted successfully",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      dispatch(
        openSnackbar({ message: "Error deleting user", severity: "error" })
      );
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      roleId: user.roleId || "",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  if (user?.role.name !== "Admin") {
    return (
      <Box p={3}>
        <Typography variant="h4" mb={2} align="left">
          Users Management
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="70vh"
        >
          <Typography variant="h6" color="error">
            This page is only accessible by Admins.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>

      <form onSubmit={handleCreateUser} style={{ width: "100%" }}>
        {/* First row: Name and Email fields */}
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              type="email"
            />
          </Grid>
        </Grid>

        {/* Second row: Password and Role fields */}
        <Grid container spacing={2} marginBottom={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
              type={passwordVisible ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {passwordVisible ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                name="roleId"
                value={formData.roleId}
                onChange={handleInputChange}
              >
                {roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button type="submit" variant="contained" color="primary">
          Create User
        </Button>
      </form>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role.name}</TableCell>

                <TableCell>
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            type={passwordVisible ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {passwordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
            >
              {roles.map((role) => (
                <MenuItem key={role._id} value={role._id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdateUser} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ManageUserPage;
