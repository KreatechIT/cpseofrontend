import axiosInstance from "@/services/axiosInstance";
import {
  addDepartment,
  addSubDepartment,
  editDepartment,
  editSubDepartment,
  removeDepartment,
  removeSubDepartment,
  storeAllDepartments,
  storeAllSubDepartments,
} from "../store/departmentSlice";
import { toast } from "sonner";

// Fetch all departments for a given organisation
const getAllDepartments = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/departments/`,
    });

    dispatch(storeAllDepartments(res.data));
  } catch {
    // Error is silently ignored — toast shown by Axios Interceptor
  }
};

// Add a new department
const addNewDepartment = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/departments/`,
    data,
  });

  dispatch(addDepartment(res.data));
  toast.success("Department has been successfully added.");
};

// Update an existing department
const updateDepartment = async (
  organisation_id,
  department_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/departments/${department_id}/`,
    data,
  });

  dispatch(editDepartment(res.data));
  toast.success("Department has been updated successfully.");
};

// Archive a department
const archiveDepartment = async (organisation_id, department_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/departments/${department_id}/archive/`,
  });

  dispatch(removeDepartment(res.data));
  toast.success("Department has been archived successfully.");
};

// Fetch all sub-departments for a given organisation
const getAllSubDepartments = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/sub-departments/`,
    });
    dispatch(storeAllSubDepartments(res.data));
  } catch {
    // Error is silently ignored — toast shown by Axios Interceptor
  }
};

// Add a new sub-department
const addNewSubDepartment = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/sub-departments/`,
    data,
  });

  dispatch(addSubDepartment(res.data));
  toast.success("Sub-department has been successfully added.");
};

// Update an existing sub-department
const updateSubDepartment = async (
  organisation_id,
  sub_department_id,
  data,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/sub-departments/${sub_department_id}/`,
    data,
  });

  dispatch(editSubDepartment(res.data));
  toast.success("Sub-department has been updated successfully.");
};

// Archive a sub-department
const archiveSubDepartment = async (
  organisation_id,
  sub_department_id,
  dispatch
) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/sub-departments/${sub_department_id}/archive/`,
  });

  dispatch(removeSubDepartment(res.data));
  toast.success("Sub-department has been archived successfully.");
};

export {
  // Departments
  getAllDepartments,
  addNewDepartment,
  updateDepartment,
  archiveDepartment,

  // Sub-departments
  getAllSubDepartments,
  addNewSubDepartment,
  updateSubDepartment,
  archiveSubDepartment,
};
