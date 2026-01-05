import axiosInstance from "@/services/axiosInstance";
import {
  // Organisations
  addOrganisationData,
  editOrganisationData,
  removeOrganisationData,
  storeAllOrganisationData,
  storeOrganisationProductsData,

  // Members
  addMemberData,
  editMemberData,
  removeMemberData,
  storeAllMemberData,

  // Member Roless
  addMemberRoleData,
  editMemberRoleData,
  removeMemberRoleData,
  storeAllMemberRoleData,
  storeMemberRoleFormat,
} from "../store/organisationByAdminSlice";
import { toast } from "sonner";

// Fetches all organisations and stores them in Redux
const getAllOrganisations = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/organisations/`,
    });

    dispatch(storeAllOrganisationData(res.data));
  } catch {
    // Error is silently ignored — toast shown by Axios Interceptor
  }
};

// Sends a new organisation to the API and adds it to Redux
// Accepts form data (multipart/form-data) for logo/image uploads
const addNewOrganisation = async (data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "POST",
    url: `/organisation/organisations/`,
    data,
  });

  dispatch(addOrganisationData(res.data));
  toast.success("Organisation has been successfully added.");
};

// Updates an existing organisation using its ID, then dispatches the updated data
// Also uses multipart/form-data for logo/image uploads
const updateOrganisation = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    headers: { "Content-Type": "multipart/form-data" },
    method: "PUT",
    url: `/organisation/organisations/${organisation_id}/`,
    data,
  });

  dispatch(editOrganisationData(res.data));
  toast.success("Organisation details have been updated successfully.");
};

// Archives an organisation by its ID
// Then removes the associated organisation from Redux store
const archiveOrganisation = async (organisation_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/organisations/${organisation_id}/archive/`,
  });

  dispatch(removeOrganisationData(res.data));
  toast.success("Organisation has been archived successfully.");
};

// Fetches all available SaaS modules (organisation products) and stores them in Redux
// These represent features/modules like Finance Management, HR Management, etc.
const getOrganisationProducts = async (dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/products/`,
    });

    dispatch(storeOrganisationProductsData(res.data));
  } catch {
    // Error is silently ignored —  toast shown by Axios Interceptor
  }
};

// Fetch all members for a specific organisation
// Stores them under the organisation_id in Redux
const getAllMembers = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/members/`,
    });
    dispatch(
      storeAllMemberData({
        organisation_id,
        data: res.data,
      })
    );
  } catch {
    // Error is silently ignored —  toast shown by Axios Interceptor
  }
};

// Add a new member to a specific organisation
const addNewMember = async (organisation_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "POST",
    url: `/organisation/${organisation_id}/members/`,
    data,
  });

  dispatch(
    addMemberData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member has been successfully added.");
};

// Update an existing member within an organisation
const updateMember = async (organisation_id, member_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/members/${member_id}/`,
    data,
  });

  dispatch(
    editMemberData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member has been updated successfully.");
};

// Archive a member within an organisation
const archiveMember = async (organisation_id, member_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/members/${member_id}/archive/`,
  });

  dispatch(
    removeMemberData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member has been archived successfully.");
};

// Fetch all memberRoles for a specific organisation
// Stores them under the organisation_id in Redux
const getAllMemberRoles = async (organisation_id, dispatch) => {
  try {
    const res = await axiosInstance({
      method: "GET",
      url: `/organisation/${organisation_id}/roles/`,
    });

    dispatch(
      storeAllMemberRoleData({
        organisation_id,
        data: res.data,
      })
    );
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

  dispatch(
    addMemberRoleData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member role has been successfully added.");
};

// Update an existing memberRole within an organisation
const updateMemberRole = async (organisation_id, role_id, data, dispatch) => {
  const res = await axiosInstance({
    method: "PUT",
    url: `/organisation/${organisation_id}/roles/${role_id}/`,
    data,
  });

  dispatch(
    editMemberRoleData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member role has been updated successfully.");
};

// Archive a memberRole within an organisation
const archiveMemberRole = async (organisation_id, role_id, dispatch) => {
  const res = await axiosInstance({
    method: "PATCH",
    url: `/organisation/${organisation_id}/roles/${role_id}/archive/`,
  });

  dispatch(
    removeMemberRoleData({
      organisation_id,
      data: res.data,
    })
  );
  toast.success("Member role has been archived successfully.");
};

// Fetches role permission format (all available permissions for role setup)
// Used for role creation/edit UI
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
  // Organisations
  getAllOrganisations,
  getOrganisationProducts,
  addNewOrganisation,
  updateOrganisation,
  archiveOrganisation,

  // Members
  getAllMembers,
  addNewMember,
  updateMember,
  archiveMember,

  // Member Roles
  getAllMemberRoles,
  addNewMemberRole,
  updateMemberRole,
  archiveMemberRole,
  getMemberRoleFormat,
};
