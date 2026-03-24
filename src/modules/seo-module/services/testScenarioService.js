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

export const updateTestScenario = async (id, data) => {
  try {
    const res = await axiosInstance.patch(`/seo/test-scenarios/${id}/`, data);
    toast.success("Test scenario updated successfully");
    return res.data;
  } catch (error) {
    // Extract detailed error messages
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        toast.error(`Validation errors:\n${errorMessages}`);
      } else {
        toast.error(errors);
      }
    } else {
      const msg = error.response?.data?.detail || "Failed to update test scenario";
      toast.error(msg);
    }
    throw error;
  }
};

export const deleteTestScenario = async (id) => {
  try {
    await axiosInstance.delete(`/seo/test-scenarios/${id}/`);
    toast.success("Test scenario deleted successfully");
  } catch (error) {
    // Extract detailed error messages
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        toast.error(`Validation errors:\n${errorMessages}`);
      } else {
        toast.error(errors);
      }
    } else {
      const msg = error.response?.data?.detail || "Failed to delete test scenario";
      toast.error(msg);
    }
    throw error;
  }
};
