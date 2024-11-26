import axiosInstance from "../Helpers/axios";
import {
  FETCH_INVENTORY,
  ADD_INVENTORY,
  UPDATE_INVENTORY,
  DELETE_INVENTORY,
} from "../Routes/ServiceRoutes";

// Fetch inventory with pagination
export const fetchInventory = async (page = 1, limit = 10, searchQuery = "", sortBy = "") => {
  try {
    const response = await axiosInstance.get(FETCH_INVENTORY, {
      params: { page, limit, search: searchQuery, sort: sortBy },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

// Add a new inventory item
export const addInventoryItem = async (itemData) => {
  try {
    const response = await axiosInstance.post(ADD_INVENTORY, itemData);
    return response.data;
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
};

// Update an existing inventory item
export const updateInventoryItem = async (id, itemData) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_INVENTORY}/${id}`,
      itemData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating inventory item:", error);
    throw error;
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (id) => {
  try {
    const response = await axiosInstance.delete(`${DELETE_INVENTORY}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    throw error;
  }
};
