import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { storeAllCompetitors } from "../store/competitorPoolSlice";

export const getAllCompetitors = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/seo/competitor-pool/");
    dispatch(storeAllCompetitors(res.data));
    return res.data;
  } catch (error) {
    toast.error("Failed to load competitors");
    console.error(error);
    return [];
  }
};
