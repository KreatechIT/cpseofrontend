import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addJobPostData,
  editJobPostData,
  removeJobPostData,
  storeAllJobPostsData,
  storeJobLink,
} from "../store/jobsSlice";
import { format } from "date-fns";
import axiosPublicInstance from "@/services/axiosPublicInstance";

/**
 * Fetch all job posts with optional filters
 */
export const getAllJobPosts = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate
) => {
  const queryParams = new URLSearchParams({});

  // If fromDate and toDate are not provided, default to last 30 days
  if (!fromDate || !toDate) {
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
  }

  // Adding filters as query parameters if provided
  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/hr/${organisation_id}/job-postings/?${queryParams.toString()}`,
    });

    dispatch(storeAllJobPostsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new job post
 */
export const addNewJobPost = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/hr/${organisation_id}/job-postings/`,
    data,
  });

  dispatch(addJobPostData(res.data)); // Update Redux store with new claim data
  if (data?.status === 1) {
    toast.success("Job post has been published successfully.");
  } else {
    toast.success("Job post has been saved as a draft.");
  }
};

export const updateJobPost = async (
  organisation_id,
  job_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/hr/${organisation_id}/job-postings/${job_id}/`,
    data,
  });

  dispatch(editJobPostData(res.data)); // Update Redux store with new claim data
  toast.success("Job post has been updated successfully.");
};

export const archiveJobPost = async (organisation_id, job_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-postings/${job_id}/archive/`,
  });

  dispatch(removeJobPostData(res.data)); // Update Redux store with new claim data
  toast.success("Job post has been archived.");
};

export const changeJobPostStatus = async (
  organisation_id,
  job_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-postings/${job_id}/change-status/`,
    data,
  });

  dispatch(editJobPostData(res.data)); // Update Redux store with new claim data

  if (res.data.status === "Active") {
    toast.success("Job post has been published successfully.");
  } else if (res.data.status === "Cancelled") {
    toast.success("Job post has been cancelled.");
  } else if (res.data.status === "Completed") {
    toast.success("Job post has been marked as completed.");
  } else if (res.data.status === "Draft") {
    toast.success("Job post has been savedd as draft.");
  }
};

export const generateJobLink = async (organisation_id, job_id, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/hr/${organisation_id}/job-postings/${job_id}/generate-link/`,
  });

  dispatch(storeJobLink({ job_id: job_id, data: res.data })); // Update Redux store with new claim data
  toast.success("Link generated");
  return res.data;
};

export const getJobDetail = async (organisation_id, link_id) => {
  await axiosInstance({
    method: "GET",
    url: `/hr/${organisation_id}/external-job-posting/${link_id}/`,
  });

  // dispatch(editJobPostData(res.data)); // Update Redux store with new claim data
  // toast.success("Link generated");
};

export const getPublicJobPost = async (job_id) => {
  const res = await axiosPublicInstance({
    method: "GET",
    url: `/hr/external-job-posting/${job_id}/`,
  });

  return res.data;
};

export const uploadJobImage = async (organisation_id, data) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/${organisation_id}/job-posting-images/`,
    data,
  });
  return res.data;
};

export const removeJobImage = async (organisation_id, image_id) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "DELETE",
    url: `/hr/${organisation_id}/job-posting-images/${image_id}/`,
  });
  return res.data;
};
