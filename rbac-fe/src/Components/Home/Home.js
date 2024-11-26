import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { fetchInventory } from "../../Services/inventoryServices";
import { useTheme } from "@mui/material/styles";
import placeholderimage from "../../Assets/placeholderimage.jpg";
import LazyLoad from "react-lazyload";
import Lottie from "lottie-react";
import loaderAnimation from "../../Assets/loadinglottie.json";

const HomePage = () => {
  const theme = useTheme();
  const [inventory, setInventory] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting criteria: name, price, etc.

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      try {
        const response = await fetchInventory(page, 10, searchQuery, sortBy);
        setInventory(response.inventory || []);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Error loading inventory:", error);
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, [page, searchQuery, sortBy]);

  const handlePageChange = (event, value) => setPage(value);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const handleSortChange = (event) => setSortBy(event.target.value);

  const statusColorMapping = {
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
  };

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <TextField
          variant="outlined"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          style={{ width: "50%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" style={{ width: "30%" }}>
          <InputLabel id="sort-by-label">Sort by</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy}
            onChange={handleSortChange}
            label="Sort by"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="stock">Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
              width: "20vw",
              height: "20vw",
            }}
          />
        </Box>
      ) : inventory.length === 0 ? (
        <Typography align="center">No inventory items found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {inventory.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Card
                sx={{
                  backgroundColor: theme.palette.card.background,
                  color: theme.palette.card.text,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxHeight: 400,
                }}
              >
                <Carousel
                  showThumbs={false}
                  infiniteLoop
                  autoPlay
                  interval={3000}
                >
                  {item.images?.length > 0 ? (
                    item.images.map((image, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: "100%",
                          height: 200,
                          overflow: "hidden",
                        }}
                      >
                        <LazyLoad height={200} offset={100} once>
                          <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            onError={(e) => (e.target.src = placeholderimage)}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </LazyLoad>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <LazyLoad height={200} offset={100} once>
                        <img
                          src={placeholderimage}
                          alt="Placeholder"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </LazyLoad>
                    </Box>
                  )}
                </Carousel>

                <CardContent
                  sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", fontSize: "1.5rem" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Category: {item.category?.name || "Unknown"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Price: ${item.price}
                  </Typography>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                    sx={{ fontSize: "1.2rem" }}
                  >
                    Stock: {item.stock}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: statusColorMapping[item.status] || "black",
                      fontSize: "1.2rem",
                    }}
                  >
                    Status: {item.status}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box mt={3} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default HomePage;
