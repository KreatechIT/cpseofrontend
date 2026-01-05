import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { setDashboardLoading, setDashboardError, storeCpUpdates, storeCpNews } from "@/modules/seo-module/store/seoDashboardSlice";

export const getCpUpdates = async (dispatch) => {
  dispatch(setDashboardLoading(true));
  try {
    const res = await axiosInstance.get("/seo/cp-updates/");
    dispatch(storeCpUpdates(res.data));
    return res.data;
  } catch (error) {
    dispatch(setDashboardError(error.message));
    toast.error("Failed to load CP Updates");
    console.error(error);
    return [];
  } finally {
    dispatch(setDashboardLoading(false));
  }
};

export const getCpNews = async (dispatch) => {
  dispatch(setDashboardLoading(true));
  try {
    const res = await axiosInstance.get("/seo/cp-news/");
    dispatch(storeCpNews(res.data));
    return res.data;
  } catch (error) {
    dispatch(setDashboardError(error.message));
    toast.error("Failed to load CP News");
    console.error(error);
    return [];
  } finally {
    dispatch(setDashboardLoading(false));
  }
};