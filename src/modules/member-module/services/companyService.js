import {
  addCompany,
  editCompany,
  removeCompany,
  storeAllCompanies,
} from "../store/companySlice";
import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";

// Fetch all companies for a given organisation and store them in Redux
const getAllCompanies = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/companies/`,
    });

    dispatch(storeAllCompanies(res.data));
  } catch {
    // Error is silently ignored — toast shown by Axios Interceptor
  }
};

// Add a new company for the given organisation
const addNewCompany = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/companies/`,
    data,
  });

  dispatch(addCompany(res.data));
  toast.success("Company has been successfully added.");
};

// Update existing company data
const updateCompany = async (organisation_id, company_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/companies/${company_id}/`,
    data,
  });

  dispatch(editCompany(res.data));
  toast.success("Company details have been updated successfully.");
};

// Archives a company
const archiveCompany = async (organisation_id, company_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/companies/${company_id}/archive/`,
  });

  dispatch(removeCompany(res.data));
  toast.success("Company has been archived successfully.");
};

export { getAllCompanies, addNewCompany, updateCompany, archiveCompany };
