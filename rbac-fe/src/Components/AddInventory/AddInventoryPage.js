import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import { Carousel } from "react-responsive-carousel";
import { useDispatch } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles
import {
  fetchInventory,
  deleteInventoryItem,
  updateInventoryItem,
  addInventoryItem,
} from "../../Services/inventoryServices";
import { getCategoriesForUser } from "../../Services/categoryServices";
import { openSnackbar, closeSnackbar } from "../../Redux/slices/snackbarSlice";
import Lottie from "lottie-react";
import loaderAnimation from "../../Assets/loadinglottie.json";
import { showConfirmation } from "../../Redux/slices/confirmationSlice";
import ConfirmationPopup from "../../UI-components/ConfirmationPopup";

const AddInventoryPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [formData, setFormData] = React.useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "",
    images: [],
  });
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [selectedItemId, setSelectedItemId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoriesForUser();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorMessage("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      try {
        const response = await fetchInventory(page, 10);
        setInventory(response.inventory || []);
        console.log(response.inventory);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error loading inventory:", error);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [page]);

  const { open, message, severity } = useSelector((state) => state.snackbar);
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(
      (file) => allowedTypes.includes(file.type) && file.size <= maxFileSize
    );

    if (validFiles.length + formData.images.length > 3) {
      alert("You can upload up to 3 images only.");
      return;
    }

    const newImages = [...formData.images, ...validFiles];

    setFormData((prevFormData) => ({
      ...prevFormData,
      images: newImages,
    }));

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreview((prevPreview) => [...prevPreview, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData(); // Create FormData object to send files
      // Append regular fields to formData
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("price", formData.price);
      form.append("stock", formData.stock);
      form.append("status", formData.status);

      // Append images as files
      formData.images.forEach((image) => {
        form.append("images", image); // Append each file as "images"
      });

      await addInventoryItem(form);
      dispatch(
        openSnackbar({
          message: "Inventory item added successfully!",
          severity: "success",
        })
      );
      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        status: "",
        images: [],
      });
      setImagePreview([]);
    } catch (error) {
      dispatch(
        openSnackbar({
          message: "Failed to add inventory item. Please try again.",
          severity: "error",
        })
      );
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const data = await fetchInventory();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setErrorMessage("Failed to fetch inventory.");
    }
  };

  const handleDelete = (id) => {
    dispatch(
      showConfirmation({
        message: "Are you sure you want to delete this item?",
        onConfirm: async () => {
          try {
            await deleteInventoryItem(id);
            dispatch(
              openSnackbar({
                message: "Item deleted successfully!",
                severity: "success",
              })
            );
            fetchInventoryItems();
          } catch (error) {
            if (error.response && error.response.status === 403) {
              dispatch(
                openSnackbar({
                  message:
                    error.response.data.message ||
                    "You don't have permission to delete this item.",
                  severity: "warning",
                })
              );
            } else if (error.response && error.response.status === 404) {
              dispatch(
                openSnackbar({
                  message:
                    "Item not found. It might have already been deleted.",
                  severity: "info",
                })
              );
            } else {
              dispatch(
                openSnackbar({
                  message:
                    error.response?.data?.message || "Failed to delete item.",
                  severity: "error",
                })
              );
            }
          }
        },
        onCancel: () => {
          dispatch(
            openSnackbar({
              message: "Delete action canceled.",
              severity: "info",
            })
          );
        },
      })
    );
  };

  const handleEditOpen = (item) => {
    setSelectedItemId(item._id);
    setEditFormData(item);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async () => {
    try {
      await updateInventoryItem(selectedItemId, editFormData);
      dispatch(
        openSnackbar({
          message: "Item updated successfully!",
          severity: "success",
        })
      );
      fetchInventoryItems();
      handleEditClose();
    } catch (error) {
      if (error.response?.status === 403) {
        // Show a specific message if the user doesn't have permission
        dispatch(
          openSnackbar({
            message:
              error.response.data.message ||
              "You do not have permission to edit this item.",
            severity: "error",
          })
        );
      } else {
        // General error message
        dispatch(
          openSnackbar({
            message: "Failed to update item. Please try again.",
            severity: "error",
          })
        );
      }
    }
  };

  if (loading) {
    return (
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
    );
  }

  if (user?.role.name !== "Admin") {
    return (
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
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Add New Inventory
      </Typography>

      {/* Preview Card */}
      <Card sx={{ mt: 3, mb: 3 }}>
        {imagePreview.length > 0 && (
          <Carousel
            showThumbs={false}
            infiniteLoop
            autoPlay
            interval={3000}
            stopOnHover
            swipeable
            emulateTouch
          >
            {imagePreview.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                }}
              />
            ))}
          </Carousel>
        )}
        <CardContent>
          <Typography variant="h6">Preview</Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {formData.name || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Category:</strong>{" "}
            {categories.find((c) => c._id === formData.category)?.name || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Price:</strong> {formData.price || "N/A"}
          </Typography>
          <Typography variant="body1">
            <strong>Stock:</strong> {formData.stock || "N/A"}
          </Typography>
          <Typography
            variant="body1"
            style={{
              color:
                {
                  Available: "green",
                  Unavailable: "red",
                  "Selling Quickly": "orange",
                  "Only Few Left": "#FFBF00",
                  "Pre-Order": "lightblue",
                  "Coming Soon": "purple",
                  Discontinued: "gray",
                  Reserved: "teal",
                  Backordered: "navy",
                  Damaged: "darkred",
                }[formData.status] || "black", // Fallback to black for unlisted statuses
            }}
          >
            <strong>Status:</strong> {formData.status || "N/A"}
          </Typography>
        </CardContent>
      </Card>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                label="Status"
              >
                <MenuItem value="Available" style={{ color: "green" }}>
                  Available
                </MenuItem>
                <MenuItem value="Unavailable" style={{ color: "red" }}>
                  Unavailable
                </MenuItem>
                <MenuItem value="Selling Quickly" style={{ color: "orange" }}>
                  Selling Quickly
                </MenuItem>
                <MenuItem value="Only Few Left" style={{ color: "#FFBF00" }}>
                  Only Few Left
                </MenuItem>
                <MenuItem value="Pre-Order" style={{ color: "lightblue" }}>
                  Pre-Order
                </MenuItem>
                <MenuItem value="Coming Soon" style={{ color: "purple" }}>
                  Coming Soon
                </MenuItem>
                <MenuItem value="Discontinued" style={{ color: "gray" }}>
                  Discontinued
                </MenuItem>
                <MenuItem value="Reserved" style={{ color: "teal" }}>
                  Reserved
                </MenuItem>
                <MenuItem value="Backordered" style={{ color: "navy" }}>
                  Backordered
                </MenuItem>
                <MenuItem value="Damaged" style={{ color: "darkred" }}>
                  Damaged
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button variant="contained" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Inventory
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <Box mt={5}>
        <Typography variant="h5" gutterBottom>
          Manage Inventory
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(item._id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Inventory Item</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editFormData.name || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={editFormData.price || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={editFormData.stock || ""}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmationPopup />
    </Box>
  );
};

export default AddInventoryPage;
