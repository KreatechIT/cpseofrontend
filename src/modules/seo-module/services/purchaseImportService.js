import axiosInstance from "@/services/axiosInstance";

export const importPurchaseData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/purchased/", payload);
    return res.data;
  } catch (error) {
    // Don't show toast here - let the calling component handle it
    // This prevents duplicate error messages
    throw error;
  }
};
