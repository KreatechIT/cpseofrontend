import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

export const importTestScenarioData = async (payload) => {
  try {
    const res = await axiosInstance.post("/seo/test-scenarios/", payload);
    return res.data;
  } catch (error) {
    toast.error("Failed to import test scenario: " + error.message);
    throw error;
  }
};