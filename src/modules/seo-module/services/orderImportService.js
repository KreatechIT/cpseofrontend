import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importOrderData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/orders/import/", payload);
    return res.data; // Return the response data
  } catch (error) {
    const msg = error.response?.data ? Object.values(error.response.data).flat().join("; ") : "Failed to import order data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};
