import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { storeAllSamples } from "../store/samplePoolSlice";

export const getAllSamples = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/seo/samples");
    dispatch(storeAllSamples(res.data));
    return res.data;
  } catch (error) {
    toast.error("Failed to load samples");
    console.error(error);
    return [];
  }
};