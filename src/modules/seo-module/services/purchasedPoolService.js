import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { storeAllPurchased, setPurchasedLoading } from "../store/purchasedPoolSlice";

export const getAllPurchased = async (dispatch, page = 1) => {
  try {
    dispatch(setPurchasedLoading(true));
    const res = await axiosInstance.get(`/seo/purchased/?page=${page}`);
    
    // API returns paginated response with metadata
    dispatch(storeAllPurchased({
      results: res.data.results || [],
      total: res.data.total || 0,
      page: res.data.page || 1,
      pageSize: res.data.page_size || 10,
      totalPages: res.data.total_pages || 1,
    }));
    
    return res.data;
  } catch (error) {
    dispatch(setPurchasedLoading(false));
    toast.error("Failed to load purchased pool");
    console.error(error);
    return { results: [], total: 0, page: 1, pageSize: 10, totalPages: 1 };
  }
};
