import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const fetchTestScenarios = async () => {
  try {
    const res = await axiosInstance.get("/seo/test-scenarios/");
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.detail || "Failed to fetch test scenarios";
    toast.error(msg);
    throw error;
  }
};
