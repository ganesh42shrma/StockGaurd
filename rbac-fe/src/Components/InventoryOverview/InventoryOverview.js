import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import ApexCharts from "react-apexcharts";
import { getAllCategories } from "../../Services/categoryServices";
import { fetchInventory } from "../../Services/inventoryServices";
import CountUp from "react-countup";
import Lottie from "lottie-react";
import loaderAnimation from "../../Assets/loadinglottie.json";

const InventoryOverview = () => {
  const [categories, setCategories] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [statusData, setStatusData] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchInventoryData = async () => {
      try {
        const inventoryResponse = await fetchInventory(1, 10);
        setInventoryData(inventoryResponse.inventory);
        setTotalItems(inventoryResponse.totalCount);

        const statusCounts = inventoryResponse.inventory.reduce((acc, item) => {
          acc[item.status] = acc[item.status] ? acc[item.status] + 1 : 1;
          return acc;
        }, {});
        setStatusData(statusCounts);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    // Fetch categories and inventory data
    Promise.all([fetchCategories(), fetchInventoryData()]);
  }, []);

  // Chart configurations
  const categoryChart = {
    series: categories.map((category) => {
      return inventoryData.filter(
        (item) => item.category.name === category.name
      ).length;
    }),
    options: {
      chart: {
        type: "pie",
        width: "100%",
      },
      labels: categories.map((category) => category.name),
      legend: {
        position: "bottom",
      },
    },
  };

  const stockChart = {
    series: [
      {
        name: "Stock",
        data: inventoryData.map((item) => Number(item.stock) || 0),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
      },
      xaxis: {
        categories: inventoryData.map((item) => item.name),
      },
      title: {
        text: "Stock of Different Items",
      },
    },
  };

  const statusChart = {
    series: Object.values(statusData),
    options: {
      chart: {
        type: "pie",
        width: "100%",
      },
      labels: Object.keys(statusData),
      legend: {
        position: "bottom",
      },
      title: {
        text: "Item Status Distribution",
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      {loading ? ( // Show loader while loading
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
        <Grid container spacing={3}>
          {/* First Row: CountUp and Empty Space */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total Inventory Items</Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                    fontSize: "2rem",
                    textAlign: "center",
                    letterSpacing: "1px",
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "10px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CountUp
                    start={0}
                    end={totalItems}
                    duration={2.5}
                    separator=","
                    suffix=" items"
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}></Grid>{" "}
          {/* Empty Grid to balance the layout */}
          {/* Second Row: Pie Charts */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Categories Overview</Typography>
                <ApexCharts
                  options={categoryChart.options}
                  series={categoryChart.series}
                  type="pie"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Inventory Status Overview</Typography>
                <ApexCharts
                  options={statusChart.options}
                  series={statusChart.series}
                  type="pie"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
          {/* Third Row: Bar Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Stock of Different Inventory Items
                </Typography>
                <ApexCharts
                  options={stockChart.options}
                  series={stockChart.series}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default InventoryOverview;
