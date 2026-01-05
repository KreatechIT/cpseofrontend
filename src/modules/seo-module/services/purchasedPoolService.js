import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { storeAllPurchased } from "../store/purchasedPoolSlice";

export const getAllPurchased = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/seo/purchased");
    dispatch(storeAllPurchased(res.data));
    return res.data;
  } catch (error) {
    toast.error("Failed to load purchased pool");
    console.error(error);
    return [];
  }
};
