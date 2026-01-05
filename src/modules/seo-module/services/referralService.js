import { toast } from "sonner";
import {
  addReferralData,
  editReferralData,
  removeReferralData,
  storeAllReferralsData,
} from "../store/referralSlice";
import { format } from "date-fns";

import axiosInstance from "@/services/axiosInstance";

export const getAllReferrals = async (
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
      url: `/hr/${organisation_id}/referrers/?${queryParams.toString()}`,
    });

    dispatch(storeAllReferralsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

export const addNewReferral = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/hr/${organisation_id}/referrers/`,
    data,
  });

  dispatch(addReferralData(res.data)); // Update Redux store with new claim data
  toast.success("Referral has been added successfully.");
};

export const updateReferral = async (
  organisation_id,
  referral_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "PUT",
    url: `/hr/${organisation_id}/referrers/${referral_id}/`,
    data,
  });

  dispatch(editReferralData(res.data)); // Update Redux store with new claim data
  toast.success("Referral has been updated successfully.");
};

export const archiveReferral = async (
  organisation_id,
  referral_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/referrers/${referral_id}/archive/`,
  });

  dispatch(removeReferralData(res.data)); // Update Redux store with new claim data
  toast.success("Referral has been archived successfully.");
};
