import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";
import {
  addVacancyData,
  editVacancyData,
  storeAllVacanciesData,
} from "../store/hiringVacancySlice";
import { format } from "date-fns";

/**
 * Fetch all vacancies with optional filters
 */
export const getAllVacancies = async (
  organisation_id,
  dispatch,
  fromDate,
  toDate,
  departmentId,
  position
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

  if (departmentId) queryParams.append("departmentId", departmentId);
  if (position) queryParams.append("position", position);

  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/hr/${organisation_id}/hiring-vacancies/?${queryParams.toString()}`,
    });

    dispatch(storeAllVacanciesData(res.data)); // Store transactions in Redux store
  } catch {
    // Error shown on toast by Axios Instance
  }
};

/**
 * Add new vacancy to the organisation
 */
export const addNewVacancy = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/hr/${organisation_id}/hiring-vacancies/`,
    data,
  });

  dispatch(addVacancyData(res.data)); // Update Redux store with new claim data
  toast.success("Vacancy request submitted successfully.", {
    description:
      "Your request has been sent to HR. They will review the details and create a job post shortly.",
  });
};

/**
 * Approve a vacancy request
 */
export const approveVacancy = async (organisation_id, vacancy_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/hiring-vacancies/${vacancy_id}/approve/`,
  });

  dispatch(editVacancyData(res.data)); // Update transaction status in Redux store
  toast.success("Vacancy request has been approved successfully.");
};

/**
 * Reject a vacany request
 */
export const rejectVacancy = async (
  organisation_id,
  vacancy_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/hr/${organisation_id}/hiring-vacancies/${vacancy_id}/reject/`,
    data,
  });

  dispatch(editVacancyData(res.data)); // Update transaction status in Redux store
  toast.success("Vacancy request has been rejected successfully.");
};
