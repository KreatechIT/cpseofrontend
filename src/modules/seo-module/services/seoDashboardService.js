import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import {
  setOverview,
  setCpUpdates,
  setCpNews,
  setMilestones,
  setLoading,
  setError,
} from "../store/seoDashboardSlice";

export const fetchDashboardData = (dispatch, params = {}) => {
  dispatch(setLoading(true));

  const overviewPromise = axiosInstance.get("/seo/performance/overview/", { params });
  const updatesPromise = axiosInstance.get("/seo/cp-updates/", { params: { ordering: "-created_at", page_size: 5 } });
  const newsPromise = axiosInstance.get("/seo/cp-news/", { params: { ordering: "-published_at", page_size: 5 } });
  const milestonesPromise = axiosInstance.get("/seo/cp/milestones/", { params });

  Promise.all([overviewPromise, updatesPromise, newsPromise, milestonesPromise])
    .then(([overviewRes, updatesRes, newsRes, milestonesRes]) => {
      dispatch(setOverview(overviewRes.data));
      dispatch(setCpUpdates(updatesRes.data));
      dispatch(setCpNews(newsRes.data));
      dispatch(setMilestones(milestonesRes.data));
      dispatch(setLoading(false));
    })
    .catch((err) => {
      dispatch(setError(err.message));
      toast.error("Failed to load dashboard data");
      dispatch(setLoading(false));
    });
};