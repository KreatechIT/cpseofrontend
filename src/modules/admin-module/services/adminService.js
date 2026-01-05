import {
  //Admins
  addAdminData,
  editAdminData,
  removeAdminData,
  storeAllAdminData,

  // Admin Roles
  addAdminRoleData,
  editAdminRoleData,
  removeAdminRoleData,
  storeAdminRoleFormat,
  storeAllAdminRolesData,
} from "../store/adminSlice";

import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";

// Fetches all admins and stores them in Redux
const getAllAdmins = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/administration/admins/`,
    });

    dispatch(storeAllAdminData(res.data));
  } catch {
    // Handled by Axios Interceptor
  }
};

// Sends new admin data to the API and adds the response to Redux store
const addNewAdmin = async (data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/administration/admins/`,
    data,
  });

  dispatch(addAdminData(res.data));
  toast.success("Admin has been successfully added.");
};

// Updates an existing admin and adds the response to Redux store
const updateAdmin = async (admin_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/administration/admins/${admin_id}/`,
    data,
  });

  dispatch(editAdminData(res.data));
  toast.success("Admin details have been updated successfully.");
};

// Archives an admin by ID and removes it from Redux store
const archiveAdmin = async (admin_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/administration/admins/${admin_id}/archive/`,
  });

  dispatch(removeAdminData(res.data));
  toast.success("Admin has been archived.");
};

// Admin Reset Password
const adminResetPassword = async (admin_id, data) => {
  await axiosInstance({
    method: "PATCH",
    url: `/administration/admins/${admin_id}/resetpassword/`,
    data,
  });

  toast.success("Your password has been successfully reset.");
};

// Fetches all admin roles and stores them in Redux
const getAllAdminRoles = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/administration/roles/`,
    });

    dispatch(storeAllAdminRolesData(res.data));
  } catch {
    // Handled by Axios Interceptor
  }
};

// Sends new admin role to the API and adds the response to Redux store
const addNewAdminRole = async (data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/administration/roles/`,
    data,
  });

  dispatch(addAdminRoleData(res.data));
  toast.success("Admin role has been successfully added.");
};

// Updates an existing admin role using its ID and updates Redux store
const updateAdminRole = async (role_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/administration/roles/${role_id}/`,
    data,
  });

  dispatch(editAdminRoleData(res.data));
  toast.success("Admin role has been updated successfully.");
};

// Archives an admin role and removes it from the Redux store
const archiveAdminRole = async (role_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/administration/roles/${role_id}/archive/`,
  });

  dispatch(removeAdminRoleData(res.data));
  toast.success("Admin role has been archived.");
};

// Fetches role permission format (all available permissions for role setup)
// Used for role creation/edit UI
const getAdminRoleFormat = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/administration/roles/all-permissions/`,
    });
    dispatch(storeAdminRoleFormat(res.data));
  } catch {
    // Handled by Axios Interceptor
  }
};

export {
  // Admins
  getAllAdmins,
  addNewAdmin,
  updateAdmin,
  archiveAdmin,
  adminResetPassword,

  // Admin Roles
  getAllAdminRoles,
  addNewAdminRole,
  updateAdminRole,
  archiveAdminRole,
  getAdminRoleFormat,
};
