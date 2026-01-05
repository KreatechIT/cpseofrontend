import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addCandidateDataToAllCandidates,
  editCandidateData,
  storeAllJobCandidatesData,
  storeJobCandidatesData,
} from "../store/candidatesSlice";
import { format } from "date-fns";
import { setSheetData } from "@/store/reducers/sheetSlice";
import axiosPublicInstance from "@/services/axiosPublicInstance";

/**
 * Fetch all candidates with optional filters
 */
export const getAllCandidates = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  jobPostingId,
  status
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

  if (jobPostingId) queryParams.append("jobPostingId", jobPostingId);

  if (status === "whitelisted") {
    queryParams.append("whitelisted", true);
  } else if (status === "blacklisted") {
    queryParams.append("blacklisted", true);
  }

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/hr/${organisation_id}/job-candidates/?${queryParams.toString()}`,
    });

    dispatch(storeAllJobCandidatesData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Fetch all candidates for a single job post
 */
export const getCandidatesByJobPost = async (
  organisation_id,
  dispatch,
  job_post_id,
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
      url: `/hr/${organisation_id}/job-postings/${job_post_id}/candidates/?${queryParams.toString()}`,
    });

    dispatch(
      storeJobCandidatesData({ job_post_id: job_post_id, data: res.data })
    );
  } catch {
    // Error shown on toast by Axios Instance
  }
};

export const changeCandidateStatus = async (
  organisation_id,
  candidate_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/change-status/`,
    data,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data
  dispatch(
    setSheetData({
      type: "candidateDetails",
      props: res.data,
    })
  );

  if (res.data.status === "New") {
    toast.success("Candidate has been moved backed to stage new.");
  } else if (res.data.status === "Rejected") {
    toast.success("Candidate has been rejected.");
  } else {
    toast.success("Candidate has been moved to next stage.");
  }
};

export const addCandidateToTalentPool = async (
  organisation_id,
  candidate_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/whitelist/`,
    data,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data
  dispatch(
    setSheetData({
      type: "candidateDetails",
      props: res.data,
    })
  );

  toast.success("Candidate has been added to talent pool.");
};
export const removeCandidateFromTalentPool = async (
  organisation_id,
  candidate_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/remove-from-list/`,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data
  dispatch(
    setSheetData({
      type: "candidateDetails",
      props: res.data,
    })
  );

  toast.success("Candidate has been removed from talent pool.");
};

export const addCandidateToBlacklistPool = async (
  organisation_id,
  candidate_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/blacklist/`,
    data,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data
  dispatch(
    setSheetData({
      type: "candidateDetails",
      props: res.data,
    })
  );

  toast.success("Candidate has been added to blacklist pool.");
};

export const removeCandidateFromList = async (
  organisation_id,
  candidate_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/blacklist/`,
    data,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data

  toast.success("Candidate has been removed from list.");
};

export const addCandidateReferrer = async (
  organisation_id,
  candidate_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/add-referrer/`,
    data,
  });

  dispatch(editCandidateData(res.data)); // Update Redux store with new claim data
  dispatch(
    setSheetData({
      type: "candidateDetails",
      props: res.data,
    })
  );

  toast.success("Referrer added");
};

export const getCandidateAuditLog = async (organisation_id, candidate_id) => {
  const res = await axiosInstance({
    method: "GET",
    url: `/hr/${organisation_id}/job-candidates/${candidate_id}/audit-log/`,
  });

  return res.data;
};

export const postCandidate = async (jobLink_id, data) => {
  await axiosPublicInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/external-job-apply/${jobLink_id}/`,
    data,
  });
};

export const postCandidateToWhitelistPool = async (
  organisation_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/${organisation_id}/add-whitelisted-talent/`,
    data,
  });

  dispatch(addCandidateDataToAllCandidates(res.data));
  toast.success("Candidate added to whitelist pool.");
};

export const postCandidateToBlasklistPool = async (
  organisation_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/${organisation_id}/add-blacklisted-talent/`,
    data,
  });

  dispatch(addCandidateDataToAllCandidates(res.data));
  toast.success("Candidate added to blacklist pool.");
};
