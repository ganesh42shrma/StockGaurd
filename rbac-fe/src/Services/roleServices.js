import axiosInstance from "../Helpers/axios";

import { GET_ROLES } from "../Routes/ServiceRoutes";

export const getRoles = async () => {
  try {
    const response = await axiosInstance.get(GET_ROLES);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching roles:",
      error.response?.data || error.message
    );
    throw error;
  }
};
