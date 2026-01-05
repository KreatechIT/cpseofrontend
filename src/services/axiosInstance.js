import axios from "axios";
import { store } from "@/store/index";
import { removeAuthData } from "@/modules/auth-module/store/authSlice";
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpired,
  setAccessToken,
  setRefreshToken,
} from "@/utils/tokenHelper";
import { toast } from "sonner";

export const API_BASE_URL = "https://staging-api.corepath360.com/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// A flag to prevent multiple refresh token requests at once
let isRefreshing = false;

// A queue to hold requests that failed due to an expired access token
let failedQueue = [];

// Helper to process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token to Outgoing Requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken && config.headers && !isTokenExpired()) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized and Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response, // If response is successful, just return it
  async (error) => {
    const originalRequest = error.config;

    // Condition for token refresh:
    // 1. Error status is 401 (Unauthorized)
    // 2. The request is not already being retried (_retry flag)
    // 3. The request is not itself the refresh token endpoint (to prevent infinite loops)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true; // Mark this request as being retried

      if (isRefreshing) {
        // If a refresh is already in progress, queue the original request
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Once refresh is complete, update the original request's header with the new token
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest); // Retry the original request
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // If no refresh is in progress, start one
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        // No refresh token available, user needs to log in again
        store.dispatch(removeAuthData()); // Clear all Redux state
        processQueue(error, null); // Reject all queued requests

        toast.error("Session Expired", { description: "Please log in again." });

        return Promise.reject(error); // Reject the original failed request
      }

      try {
        // Make the refresh token request
        const refreshResponse = await axios.post(
          `${API_BASE_URL}login/refresh-token`,
          { refreshToken }
        );

        const { access: newAccessToken, refresh: newRefreshToken } =
          refreshResponse.data;

        // Update tokens
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }

        // Retry the original failed request with the new access token
        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
        processQueue(null, newAccessToken); // Resolve all queued requests with the new token
        return axiosInstance(originalRequest); // Return the retried request
      } catch (refreshError) {
        // Refresh token failed (e.g., refresh token expired, invalid)
        store.dispatch(removeAuthData()); // Clear all Redux state
        processQueue(refreshError, null); // Reject all queued requests

        toast.error("Session Expired", { description: "Please log in again." });
        return Promise.reject(refreshError); // Reject the original failed request
      } finally {
        isRefreshing = false; // Reset the refreshing flag
      }
    }

    // Global Error Handling for other types of errors
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

      // Avoid showing toast for 401 as it's handled by refresh logic.
      if (statusCode !== 401) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error (no response received)
      toast.error("Network Error", {
        description:
          "Could not connect to the server. Please check your internet connection.",
      });
    } else {
      // Other unknown errors
      toast.error("Application Error", {
        description: "An unexpected error occurred. Please try again.",
      });
    }

    return Promise.reject(error); // Re-throw the original error for calling component to handle
  }
);

export default axiosInstance;
