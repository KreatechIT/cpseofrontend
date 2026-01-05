import axiosInstance from "@/services/axiosInstance";
import {
  // Organisation
  storeOrganisationData,

  // Members
  addMemberData,
  editMemberData,
  removeMemberData,
  storeAllMemberData,

  // Member Roles
  addMemberRoleData,
  editMemberRoleData,
  removeMemberRoleData,
  storeAllMemberRolesData,
  storeMemberRoleFormat,
} from "../store/organisationSlice";
import { toast } from "sonner";

// Fetches organisation and stores them in Redux
const getOrganisation = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/organisations/${organisation_id}/`,
    });

    dispatch(storeOrganisationData(res.data));
  } catch {
    // Error is silently ignored — toast shown by Axios Interceptor
  }
};

// Updates an existing organisation using its ID, then dispatches the updated data
// Also uses multipart/form-data for logo/image uploads
const internalUpdateOrganisation = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "PATCH",
    url: `/organisation/organisations/${organisation_id}/internal-edit/`,
    data,
  });

  dispatch(storeOrganisationData(res.data));
  toast.success("Organisation details have been updated successfully.");
};

// Fetch all members for a specific organisation
// Stores them under the organisation_id in Redux
const getAllMembers = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/members/`,
    });

    dispatch(storeAllMemberData(res.data));
  } catch {
    // Error toast handled globally by Axios interceptor
  }
};

// Add a new member to a specific organisation
const addNewMember = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/members/`,
    data,
  });

  dispatch(addMemberData(res.data));
  toast.success("Member has been successfully added.");
};

// Update an existing member within an organisation
const updateMember = async (organisation_id, member_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/members/${member_id}/`,
    data,
  });

  dispatch(editMemberData(res.data));
  toast.success("Member has been updated successfully.");
};

// Archive a member within an organisation
const archiveMember = async (organisation_id, member_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/members/${member_id}/archive/`,
  });

  dispatch(removeMemberData(res.data));
  toast.success("Member has been archived successfully.");
};

// Member Reset Password
const memberResetPassword = async (organisation_id, member_id, data) => {
  await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/members/${member_id}/resetpassword/`,
    data,
  });

  toast.success("Password has been successfully reset.");
};

// Fetch all memberRoles for a specific organisation
// Stores them under the organisation_id in Redux
const getAllMemberRoles = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/roles/`,
    });
    dispatch(storeAllMemberRolesData(res.data));
  } catch {
    // Error toast handled globally by Axios interceptor
  }
};

// Add a new memberRole to a specific organisation
const addNewMemberRole = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/roles/`,
    data,
  });

  dispatch(addMemberRoleData(res.data));
  toast.success("Role has been successfully added.");
};

// Update an existing memberRole within an organisation
const updateMemberRole = async (organisation_id, role_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/roles/${role_id}/`,
    data,
  });

  dispatch(editMemberRoleData(res.data));
  toast.success("Role has been updated successfully.");
};

// Archive a memberRole within an organisation
const archiveMemberRole = async (organisation_id, role_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/roles/${role_id}/archive/`,
  });

  dispatch(removeMemberRoleData(res.data));
  toast.success("Role has been archived successfully.");
};

const getMemberRoleFormat = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/roles/all-permissions`,
    });
    dispatch(storeMemberRoleFormat(res.data));
  } catch {
    // Axios interceptor handles error toast globally
  }
};

export {
  getOrganisation,
  internalUpdateOrganisation,

  // members
  getAllMembers,
  addNewMember,
  updateMember,
  archiveMember,
  memberResetPassword,

  // member roles
  getAllMemberRoles,
  addNewMemberRole,
  updateMemberRole,
  archiveMemberRole,
  getMemberRoleFormat,
};
