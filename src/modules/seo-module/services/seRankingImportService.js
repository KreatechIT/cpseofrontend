import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importSeRankingData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/se-ranking/", payload);
    toast.success("SE Ranking data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data ? Object.values(error.response.data).flat().join("; ") : "Failed to import SE Ranking data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};

export const importSeStatusData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/purchased/", payload);
    toast.success("SE Status data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data ? Object.values(error.response.data).flat().join("; ") : "Failed to import SE Status data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};