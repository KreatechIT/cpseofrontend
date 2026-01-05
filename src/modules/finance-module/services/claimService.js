import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addClaimData,
  editClaimData,
  storeAllClaimsData,
} from "../store/claimSlice";
import { format } from "date-fns";

/**
 * Fetch all claims with optional filters
 */
const getAllClaims = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  company,
  department
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

  if (company) queryParams.append("company", company);
  if (department) queryParams.append("department", department);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/finance/${organisation_id}/claims/?${queryParams.toString()}`,
    });

    dispatch(storeAllClaimsData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new claim to the organisation
 */
const addNewClaim = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/finance/${organisation_id}/claims/create-employee-claim/`,
    data,
  });

  dispatch(addClaimData(res.data)); // Update Redux store with new claim data
  toast.success("Claim has been successfully added.");
};

/**
 * Approve a pending claim by HOD
 */
const approveClaimByHOD = async (organisation_id, claim_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/claims/hod-approve-claim/${claim_id}/`,
  });

  dispatch(editClaimData(res.data)); // Update transaction status in Redux store
  toast.success("Claim has been approved by HOD.");
};

/**
 * Approve a pending claim by HOD
 */
const approveClaimByFinance = async (
  organisation_id,
  claim_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/claims/finance-approve-claim/${claim_id}/`,
    data,
  });

  dispatch(editClaimData(res.data)); // Update transaction status in Redux store
  toast.success("Claim has been approved by Finance.");
};

/**
 * Reject a pending claim transaction
 */
const rejectClaim = async (organisation_id, claim_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/finance/${organisation_id}/claims/reject-claim/${claim_id}/`,
    data,
  });

  dispatch(editClaimData(res.data)); // Update transaction status in Redux store
  toast.success("Claim has been rejected.");
};

export {
  getAllClaims,
  addNewClaim,
  approveClaimByHOD,
  approveClaimByFinance,
  rejectClaim,
};
