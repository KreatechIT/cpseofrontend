import * as Yup from "yup";

const addVendorSchema = Yup.object().shape({
  discovered_date: Yup.date()
    .required("Discovered Date is required")
    .typeError("Invalid date format"),

  vendor_name: Yup.string()
    .required("Vendor Name is required")
    .max(255, "Vendor name is too long"),

  website_url: Yup.string()
    .url("Must be a valid URL (include https://)")
    .nullable()
    .notRequired(),

  teams_id: Yup.string()
    .nullable()
    .notRequired(),

  telegram: Yup.string()
    .nullable()
    .notRequired(),

  whatsapp: Yup.string()
    .nullable()
    .notRequired(),

  visibility: Yup.string()
    .oneOf(["public", "hidden"], "Invalid visibility")
    .default("public"),

  hidden_reason: Yup.array()
    .of(
      Yup.string().oneOf([
        "high_risk",
        "blacklisted",
        "low_quality_backlink",
        "low_productivity",
      ])
    )
    .nullable()
    .notRequired(),

  payment_method: Yup.string()
    .nullable()
    .notRequired(),

  payment_details: Yup.string()
    .nullable()
    .notRequired(),

  price_by_link_type: Yup.string()
    .nullable()
    .notRequired(),

  price_usd: Yup.number()
    .nullable()
    .min(0, "Price must be positive")
    .typeError("Price must be a valid number"),

  average_domain_rating: Yup.number()
    .nullable()
    .min(0, "DR must be ≥ 0")
    .max(100, "DR must be ≤ 100")
    .typeError("Must be a number"),

  average_domain_authority: Yup.number()
    .nullable()
    .min(0, "DA must be ≥ 0")
    .max(100, "DA must be ≤ 100")
    .typeError("Must be a number"),

  total_general_links: Yup.number()
    .nullable()
    .min(0, "Must be ≥ 0")
    .typeError("Must be a number"),

  total_unique_domain_by_type: Yup.string()
    .nullable()
    .notRequired(),

  total_niche_links_by_category: Yup.string()
    .nullable()
    .notRequired(),

  comment_remark: Yup.string()
    .nullable()
    .notRequired(),

  recommendation: Yup.string()
    .nullable()
    .notRequired(),

  pic: Yup.string()
    .uuid("Invalid PIC format")
    .nullable()
    .notRequired(),

  created_by: Yup.string()
    .uuid("Invalid creator format")
    .nullable()
    .notRequired(),
});

export { addVendorSchema };