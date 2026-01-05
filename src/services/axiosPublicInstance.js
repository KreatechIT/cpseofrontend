import axios from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "./axiosInstance";

const axiosPublicInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

axiosPublicInstance.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  (error) => {
    // Global error handling
    if (error.response) {
      const statusCode = error.response.status;
      let errorMessage = `An unexpected API error occurred: Status ${statusCode}`;

      if (typeof error?.response?.data?.details === "string") {
        errorMessage = error.response.data.details;
      } else if (typeof error?.response?.data?.message === "string") {
        errorMessage = error.response.data.message;
      } else if (typeof error?.response?.data?.error === "string") {
        errorMessage = error.response.data.error;
      } else if (typeof error?.message === "string") {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } else if (error.request) {
      toast.error("Network Error", {
        description: "Could not connect to the server.",
      });
    } else {
      toast.error("Application Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    }

    return Promise.reject(error); // Re-throw the error for calling component to handle
  }
);

export default axiosPublicInstance;
