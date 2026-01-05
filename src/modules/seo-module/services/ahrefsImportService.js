import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importProjectData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/purchased/", payload);
    toast.success("Project data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to import project data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};

export const importCompetitorData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/competitor-pool/", payload);
    toast.success("Competitors’ data imported successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to import competitors’ data";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};
