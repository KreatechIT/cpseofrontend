import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importConversionData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/daily/", payload);
    toast.success("Conversion data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data ? Object.values(error.response.data).flat().join("; ") : "Failed to import conversion data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};