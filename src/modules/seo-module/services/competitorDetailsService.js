import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import {
  storeAllCompetitors,
  addCompetitor as addCompetitorAction,
  updateCompetitor as updateCompetitorAction,
  removeCompetitor as removeCompetitorAction,
} from "../store/competitorDetailsSlice";

export const getAllCompetitors = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/seo/competitors/");
    dispatch(storeAllCompetitors(res.data));
    return res.data;
  } catch (error) {
    toast.error("Failed to load competitors");
    console.error(error);
    return [];
  }
};

export const createCompetitor = async (dispatch, payload) => {
  try {
    const res = await axiosInstance.post("/seo/competitors/", payload);
    dispatch(addCompetitorAction(res.data)); // ← Use renamed import
    toast.success("Competitor added successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to add competitor";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};

export const updateCompetitorById = async (dispatch, id, payload) => {
  try {
    const res = await axiosInstance.put(`/seo/competitors/${id}/`, payload);
    dispatch(updateCompetitorAction(res.data));
    toast.success("Competitor updated successfully");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to update competitor";
    toast.error(msg);
    console.error(error);
    throw error;
  }
};

export const deleteCompetitorById = async (dispatch, id) => {
  try {
    await axiosInstance.delete(`/seo/competitors/${id}/`);
    dispatch(removeCompetitorAction(id));
    toast.success("Competitor deleted successfully");
  } catch (error) {
    toast.error("Failed to delete competitor");
    console.error(error);
    throw error;
  }
};
