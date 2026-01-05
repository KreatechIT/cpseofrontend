import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addDiscQuestionData,
  editDiscQuestionData,
  removeDiscQuestionData,
  storeAllDiscQuestions,
} from "../store/personalityTestSlice";
import { storeDiscLinkData } from "../store/candidatesSlice";

/**
 * Fetch all disc questions with optional filters
 */
export const getAllDiscQuestions = async (
  organisation_id,
  dispatch,
  is_active
) => {
  const queryParams = new URLSearchParams({});

  if (is_active) queryParams.append("is_active", is_active);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/hr/${organisation_id}/disc-questions/?${queryParams.toString()}`,
    });

    dispatch(storeAllDiscQuestions(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new disc question to the organisation
 */
export const addNewDiscQuestion = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/hr/${organisation_id}/disc-questions/`,
    data,
  });

  dispatch(addDiscQuestionData(res.data)); // Update Redux store with new claim data
  toast.success("DISC question has been added successfully.");
};

/**
 * Updates a disc question
 */
export const updateDiscQuestion = async (
  organisation_id,
  id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/hr/${organisation_id}/disc-questions/${id}/`,
    data,
  });

  dispatch(editDiscQuestionData(res.data)); // Update transaction status in Redux store
  toast.success("DISC question has been updated successfully.");
};

export const toggleDiscQuestionStatus = async (
  organisation_id,
  id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/disc-questions/${id}/change-status/`,
    data,
  });

  dispatch(editDiscQuestionData(res.data)); // Update transaction status in Redux store
  toast.success("DISC question status has been updated successfully.");
};

export const archiveDiscQuestion = async (organisation_id, id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/disc-questions/${id}/archive/`,
  });

  dispatch(removeDiscQuestionData(res.data)); // Update Redux store with new claim data
  toast.success("Disc question has been archived.");
};

export const generateDiscLink = async (
  organisation_id,
  candidate_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/generate-disc-link/`,
  });

  dispatch(storeDiscLinkData({ candidate_id: candidate_id, data: res.data })); // Update Redux store with new claim data
  toast.success("Link generated");
  return res.data;
};

export const getPublicDiscQuestions = async (organisation_id) => {
  const res = await axiosInstance({
    method: "GET",
    url: `/hr/${organisation_id}/get-disc-questions/`,
  });

  return res.data;
};
