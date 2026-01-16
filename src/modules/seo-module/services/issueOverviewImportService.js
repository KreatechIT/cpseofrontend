import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importIssueOverviewData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/issues/", payload);
    toast.success("Issue Overview data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to import issue overview data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};
