import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { setInsightLoading, setInsightError, setPurchased, setSamples, setCompetitorPool } from "@/modules/seo-module/store/insightSlice";

export const fetchInsightData = async (dispatch) => {
  dispatch(setInsightLoading(true));
  try {
    const [purchasedRes, samplesRes, competitorRes] = await Promise.all([
      axiosInstance.get("/seo/purchased/"),
      axiosInstance.get("/seo/samples/"),
      axiosInstance.get("/seo/competitor-pool/"),
    ]);

    dispatch(setPurchased(purchasedRes.data));
    dispatch(setSamples(samplesRes.data));
    dispatch(setCompetitorPool(competitorRes.data));
  } catch (error) {
    dispatch(setInsightError(error.message));
    toast.error("Failed to load insight data");
    console.error(error);
  } finally {
    dispatch(setInsightLoading(false));
  }
};