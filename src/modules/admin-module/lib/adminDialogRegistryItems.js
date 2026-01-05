import AddEditAdminRole from "../components/admin-roles/AddEditAdminRole";
import ArchiveAdminRole from "../components/admin-roles/ArchiveAdminRole";
import AddEditAdminForm from "../components/admins/AddEditAdminForm";
import AdminResetPasswordForm from "../components/admins/AdminResetPasswordForm";
import AdminRoleDetails from "../components/admins/AdminRoleDetails";
import ArchiveAdminAlert from "../components/admins/ArchiveAdminAlert";
import AddEditMemberRoleByAdmin from "../components/member-roles/AddEditMemberRoleByAdmin";
import ArchiveMemberRoleByAdmin from "../components/member-roles/ArchiveMemberRoleByAdmin";
import MemberRoleDetailsByAdmin from "../components/member-roles/MemberRoleDetailsByAdmin";
import AddEditMemberFormByAdmin from "../components/members/AddEditMemberFormByAdmin";
import ArchiveMemberByAdmin from "../components/members/ArchiveMemberByAdmin";
import AddEditOrganisationForm from "../components/organisations/AddEditOrganisationForm";
import ArchiveOrganisation from "../components/organisations/ArchiveOrganisation";

const adminDialogRegistryItems = {
  // Organisations
  addOrganisation: AddEditOrganisationForm,
  editOrganisation: AddEditOrganisationForm,
  archiveOrganisation: ArchiveOrganisation,

  // Organisation Members (By Admin)
  addMemberByAdmin: AddEditMemberFormByAdmin,
  editMemberByAdmin: AddEditMemberFormByAdmin,
  archiveMemberByAdmin: ArchiveMemberByAdmin,

  // Organisation Member Roles (By Admin)
  addMemberRoleByAdmin: AddEditMemberRoleByAdmin,
  editMemberRoleByAdmin: AddEditMemberRoleByAdmin,
  archiveMemberRoleByAdmin: ArchiveMemberRoleByAdmin,
  memberRoleDetailsByAdmin: MemberRoleDetailsByAdmin,

  // Admins
  addAdmin: AddEditAdminForm,
  editAdmin: AddEditAdminForm,
  archiveAdmin: ArchiveAdminAlert,
  resetAdminPassword: AdminResetPasswordForm,

  // Admin Roles
  addAdminRole: AddEditAdminRole,
  editAdminRole: AddEditAdminRole,
  archiveAdminRole: ArchiveAdminRole,
  adminRoleDetails: AdminRoleDetails,
};

export default adminDialogRegistryItems;
