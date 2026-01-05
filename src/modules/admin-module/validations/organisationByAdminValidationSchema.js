import * as Yup from "yup";

const addMemberSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required")
    .max(50, "First name must be at most 50 characters"),

  last_name: Yup.string()
    .required("Last name is required")
    .max(50, "Last name must be at most 50 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  member_role_id: Yup.string().required("Member role is required"),

  account_password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password can't exceed 64 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    ),

  confirm_password: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("account_password")], "Passwords must match"),
});

const editMemberSchema = Yup.object({
  first_name: Yup.string()
    .required("First name is required")
    .max(50, "First name must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9\s.'-]+$/,
      "First name can't contain special characters"
    ),
  last_name: Yup.string()
    .required("Last name is required")
    .max(50, "Last name must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9\s.'-]+$/,
      "Last name can't contain special characters"
    ),

  member_role_id: Yup.string().required("Member role is required"),
});

const memberRoleSchema = Yup.object({
  name: Yup.string()
    .required("Role name is required")
    .max(50, "Role name must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9\s.'-]+$/,
      "Role name can't contain special characters"
    ),
});

const addEditOrganisationSchema = Yup.object({
  name: Yup.string()
    .required("Organisation name is required")
    .min(3, "Organisation name must be at least 3 characters")
    .max(50, "Organisation name must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9\s.'-]+$/,
      "Organisation name can't contain any special characters"
    ),
});

export {
  addMemberSchema,
  editMemberSchema,
  memberRoleSchema,
  addEditOrganisationSchema,
};
