import axiosInstance from "../Helpers/axios";
import { login } from "../Redux/slices/authSlice";
import {
  USER_LOGIN,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_ALL_USER,
} from "../Routes/ServiceRoutes";

export const loginUser = (email, password) => async (dispatch) => {
  console.log("login api fe");
  try {
    console.log("inside fe login api", email, password);
    const response = await axiosInstance.post(USER_LOGIN, { email, password });

    if (response.data && response.data.token) {
      dispatch(
        login({
          token: response.data.token,
          user: response.data.user,
        })
      );
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(CREATE_USER, userData);
    console.log("User created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(GET_ALL_USER);
    console.log("Fetched users:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `${UPDATE_USER}/${userId}`,
      updatedData
    );
    console.log("User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`${DELETE_USER}/${userId}`);
    console.log("User deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting user:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
