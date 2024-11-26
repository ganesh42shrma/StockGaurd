import React from "react";
import { Typography, Box } from "@mui/material";

const ForbiddenPage = () => {
  return (
    <Box p={3} textAlign="center">
      <Typography variant="h3" color="error" gutterBottom>
        403 Forbidden
      </Typography>
      <Typography variant="body1">
        You do not have permission to access this page.
      </Typography>
    </Box>
  );
};

export default ForbiddenPage;
