import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";

// Action creators (adjust to your Redux slice names)
import {
  storeAllVendors,
} from "../store/vendorSlice"; // You need to create this slice

// Fetch all vendors
export const getAllVendors = async (
  organisation_id,
  dispatch,
  vendor_type_id = null,
  department_id = null
) => {
  const queryParams = new URLSearchParams();

  if (vendor_type_id) queryParams.append("vendor_type", vendor_type_id);
  if (department_id) queryParams.append("department", department_id);

  try {
    const res = await axiosInstance({
      method: "GET",
      // url: `/seo/${organisation_id}/vendors/?${queryParams.toString()}`,
      url: `/seo/vendors`,
    });

    dispatch(storeAllVendors(res.data));
    return res.data;
  } catch (error) {
    toast.error("Failed to load vendors");
    console.error(error);
  }
};

// Optional: Fetch vendor types (if separate endpoint)
export const getAllVendorTypes = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance.get(`/vendor/${organisation_id}/types/`);
    // Dispatch to organisation slice or separate
    // dispatch(storeVendorTypes(res.data));
    return res.data;
  } catch (error) {
    console.error("Failed to load vendor types:", error);
  }
};