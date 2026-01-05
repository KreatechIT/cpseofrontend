import { toast } from "sonner";
import {
  storeAllProjects,
  addProjectData,
  editProjectData,
  removeProjectData,
} from "../store/projectSlice"; // Adjust path if needed
import { format } from "date-fns";

import axiosInstance from "@/services/axiosInstance";

// Action types or creators — you'll need these in your projectSlice.js
// We'll define them below if you don't have the slice yet

export const getAllProjects = async (
  organisation_id, // keep param if needed, but may not be used
  dispatch,
  fromDate,
  toDate
) => {
  const queryParams = new URLSearchParams({});

  if (!fromDate || !toDate) {
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
  }

  queryParams.append("fromDate", format(fromDate, "yyyy-MM-dd"));
  queryParams.append("toDate", format(toDate, "yyyy-MM-dd"));
  // Remove organisation_id from query if backend uses token/auth header instead

  try {
    const res = await axiosInstance({
      method: "GET",
      // url: `/seo/projects/?${queryParams.toString()}`, // → becomes https://seo.kreatech.org/seo/projects/?fromDate=...
      url: `/seo/projects`, // → becomes https://seo.kreatech.org/seo/projects/?fromDate=...
    });

    dispatch(storeAllProjects(res.data));
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    // Toast/error handled by your global interceptor
  }
};

// Optional: If you support adding a new project
export const addNewProject = async (organisation_id, data, dispatch) => {
  try {
    const res = await axiosInstance({
      headers: { "Content-Type": "multipart/form-data" }, // if uploading files
      method: "POST",
      url: `/seo/projects?organisation_id=${organisation_id}`,
      data,
    });

    dispatch(addProjectData(res.data));
    toast.success("Project has been added successfully.");
  } catch (error) {
    // Error handled by axios interceptor
  }
};

// Optional: Update project
export const updateProject = async (
  organisation_id,
  project_id,
  data,
  dispatch
) => {
  try {
    const res = await axiosInstance({
      headers: { "Content-Type": "multipart/form-data" },
      method: "PUT",
      url: `/seo/projects/${project_id}?organisation_id=${organisation_id}`,
      data,
    });

    dispatch(editProjectData(res.data));
    toast.success("Project has been updated successfully.");
  } catch (error) {
    // Error handled globally
  }
};

// Optional: Archive or delete project
export const archiveProject = async (organisation_id, project_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "PATCH", // or DELETE if fully removing
      url: `/seo/projects/${project_id}/archive?organisation_id=${organisation_id}`,
    });

    dispatch(removeProjectData(res.data));
    toast.success("Project has been archived successfully.");
  } catch (error) {
    // Error handled globally
  }
};
