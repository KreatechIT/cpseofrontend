import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import { storeTaskChecklistData } from "../store/onboardingTaskChecklistSlice";

export const getMemberTaskChecklist = async (
  organisation_id,
  member_id,
  dispatch
) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/hr/${organisation_id}/members/${member_id}/onboard/`,
    });

    dispatch(storeTaskChecklistData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

export const postMemberTaskChecklist = async (
  organisation_id,
  member_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/${organisation_id}/members/${member_id}/onboard/`,
    data,
  });

  dispatch(storeTaskChecklistData(res.data));
  toast.success("Task checklist has been submitted successfully.");
};

export const updateMemberTaskChecklist = async (
  organisation_id,
  member_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "PUT",
    url: `/hr/${organisation_id}/members/${member_id}/onboard/update-by-member/`,
    data,
  });

  dispatch(storeTaskChecklistData(res.data));
  toast.success("Task checklist has been updated successfully.");
};
