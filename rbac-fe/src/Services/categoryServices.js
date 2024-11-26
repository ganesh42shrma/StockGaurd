import axiosInstance from "../Helpers/axios";
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_ALL_CATEGORIES,
  GET_CATEGORIES_FOR_USER,
} from "../Routes/ServiceRoutes";

// Add a new category
export const addCategory = async (categoryData) => {
  try {
    console.log(categoryData);
    const response = await axiosInstance.post(ADD_CATEGORY, categoryData);

    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Update an existing category
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_CATEGORY}/${id}`,
      categoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Delete a category
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${DELETE_CATEGORY}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

// Get all categories
export const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get(`${GET_ALL_CATEGORIES}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get categories for a specific role
export const getCategoriesForUser = async () => {
  try {
    const response = await axiosInstance.get(`${GET_CATEGORIES_FOR_USER}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories for user:", error);
    throw error;
  }
};
