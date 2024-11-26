import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

// Import Pages
import Login from "../Components/Login/Login";
import HomePage from "../Components/Home/Home";
import AddInventoryPage from "../Components/AddInventory/AddInventoryPage";
import ViewInventoryPage from "../Components/InventoryOverview/InventoryOverview";
import ForbiddenPage from "../Components/Forbidden/Forbidden";
import CategoryManagement from "../Components/ManageCategory/ManageCategory";
import ManageUserPage from "../Components/ManageUser/ManageUser";

// Import ProtectedRoute and Layout
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../Components/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Redirect root path to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login page */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Nested routes inside Layout */}
        <Route path="/layout" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* Default route */}
          <Route path="add-inventory" element={<AddInventoryPage />} />
          <Route path="view-inventory" element={<ViewInventoryPage />} />
          <Route path="manage-category" element={<CategoryManagement />} />
          <Route path="manage-user" element={<ManageUserPage />} />
        </Route>
        <Route path="/forbidden" element={<ForbiddenPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
