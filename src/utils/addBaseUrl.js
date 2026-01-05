import { API_BASE_URL } from "@/services/axiosInstance";

// Checks if given link has base url, if link already includes base url then returns it else adds base url.
export const addBaseURL = function (link) {
  if (!link.startsWith("http")) {
    return API_BASE_URL + link;
  }
  return link; // Return the original if base already included
};
