import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Snackbar,
  CircularProgress, // Import CircularProgress for loader
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../Services/categoryServices";
import { getRoles } from "../../Services/roleServices";
import { useDispatch } from "react-redux";
import { openSnackbar, closeSnackbar } from "../../Redux/slices/snackbarSlice";
import Lottie from "lottie-react";
import loaderAnimation from "../../Assets/loadinglottie.json";

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const user = useSelector((state) => state.auth.user);

  const [categories, setCategories] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roles: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role.name === "Admin") {
      fetchCategories();
      fetchRoles();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      const filteredRoles = data.map(({ _id, name }) => ({ _id, name }));
      setRoles(filteredRoles);

      const adminRole = filteredRoles.find((role) => role.name === "Admin");
      if (adminRole) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          roles: [adminRole._id],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error.message);
    }
  };

  const handleOpenDialog = (category = null) => {
    setSelectedCategory(category);
    setFormData(
      category
        ? { ...category, roles: category.roles.map((role) => role._id) }
        : { name: "", description: "", roles: [] }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", description: "", roles: [] });
  };

  const handleCheckboxChange = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  const handleSubmit = async () => {
    const { roles, ...restFormData } = formData;

    const requestData = {
      ...restFormData,
      roleIds: formData.roles,
    };

    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, requestData);
      } else {
        await addCategory(requestData);
      }
      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      if (error.response?.data?.message === "Category already exists") {
        dispatch(
          openSnackbar({
            message: "Category already exists",
            severity: "error",
          })
        );
      } else {
        dispatch(
          openSnackbar({
            message: "An error occurred while processing your request.",
            severity: "error",
          })
        );
      }
    }
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    fetchCategories();
  };

  return user?.role.name === "Admin" ? (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Category Management
      </Typography>

      {loading ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Lottie
            animationData={loaderAnimation}
            loop
            style={{
              width: "10vw",
              height: "10vw",
            }}
          />
        </Box>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Add New Category
          </Button>
          <Grid container spacing={2} mt={2}>
            {categories.map((category) => (
              <Grid item xs={12} md={6} lg={4} key={category._id}>
                <Box border={1} borderRadius={2} p={2}>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2">
                    {category.description}
                  </Typography>
                  <Box mt={2}>
                    {category.roles.map((role) => (
                      <Typography
                        key={role._id}
                        variant="caption"
                        display="block"
                      >
                        {role.name}
                      </Typography>
                    ))}
                  </Box>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleOpenDialog(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                margin="normal"
              />
              <Box mt={2}>
                {roles.map((role) => (
                  <FormControlLabel
                    key={role._id}
                    control={
                      <Checkbox
                        checked={formData.roles.includes(role._id)}
                        onChange={() => handleCheckboxChange(role._id)}
                      />
                    }
                    label={role.name}
                  />
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                variant="contained"
              >
                {selectedCategory ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={() => dispatch(closeSnackbar())}
            message={message}
            severity={severity}
          />
        </>
      )}
    </Box>
  ) : (
    <Box p={3}>
      <Typography variant="h4" mb={2} align="left">
        Category Management
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
};

export default CategoryManagement;
