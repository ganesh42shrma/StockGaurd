import React, { useState } from "react";
import { Box, TextField, Button, Typography, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import BackgroundImage from "../../Assets/bulkstorage.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Services/userServices";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import * as Yup from "yup";
import Lottie from "lottie-react";
import loaderAnimation from "../../Assets/loadinglottie.json";
import "../../App.css";
import logoBlack from "../../Assets/sglogo.png";
import logoWhite from "../../Assets/sglogowhite.png";
import logoTextWhite from "../../Assets/StockGaurdwhitelogo.png";
import logoTextBlack from "../../Assets/StockGaurdfigma.png";

const Login = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await dispatch(
          loginUser(values.email, values.password)
        );

        if (response?.message) {
          navigate("/layout");
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
        formik.setErrors({ password: error.message });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      className="preloaded-login-bg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          width: 360,
          backgroundColor: theme.palette.card.background,
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          textAlign: "center",
        }}
      >
        <img
          src={darkMode ? logoWhite : logoBlack}
          alt="Logo"
          style={{ width: "10%", height: "auto", marginBottom: "16px" }}
        />

        <img
          src={darkMode ? logoTextWhite : logoTextBlack}
          alt="Logo Text"
          style={{ width: "100%", marginBottom: "16px" }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, color: theme.palette.card.text }}
        >
          Inventory Access Made Easy
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          ></Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: theme.palette.button.background,
              color: theme.palette.button.text,
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textTransform: "none",
            }}
            type="submit"
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        {loading && (
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
        )}
      </Box>
    </Box>
  );
};

export default Login;
