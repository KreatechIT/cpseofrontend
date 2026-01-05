import * as Yup from "yup";

const FILE_SIZE = 1024 * 1024 * 2; // 2MB
const SUPPORTED_FORMATS_IMAGE = ["image/jpeg", "image/png", "image/jpg"];

const personalInfoSchema = Yup.object({
  full_name: Yup.string().required("Full name is required."),
  first_name: Yup.string().required("First name is required."),
  last_name: Yup.string().required("Last name is required."),
  chinese_name: Yup.string().nullable(),

  birth_date: Yup.date().required("Birth date is required."),
  address: Yup.string().required("Address is required."),
  id_number: Yup.string().required("ID number is required."),

  race: Yup.string().required("Race is required."),
  race_others: Yup.string().when("race", {
    is: "99",
    then: (schema) => schema.required("Please specify race."),
    otherwise: (schema) => schema,
  }),

  religion: Yup.string().required("Religion is required."),
  religion_others: Yup.string().when("religion", {
    is: "99",
    then: (schema) => schema.required("Please specify religion."),
    otherwise: (schema) => schema,
  }),

  nationality: Yup.string().required("Nationality is required."),
  nationality_others: Yup.string().when("nationality", {
    is: "99",
    then: (schema) => schema.required("Please specify nationality."),
    otherwise: (schema) => schema,
  }),

  contact_number: Yup.string().required("Contact number is required."),
  email: Yup.string().required("Email is required.").email("Invalid email."),
  epf_no: Yup.string().nullable(),
  income_tax_no: Yup.string().nullable(),

  photo: Yup.mixed()
    .required("Photo is required")
    .test("fileSize", "File size must be less than 2MB.", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true; // existing string
      if (typeof value === "object" && "url" in value) return true; // existing {id, url}
      if (typeof value === "object" && "size" in value) {
        return value.size <= FILE_SIZE; // File object
      }
      return false;
    })
    .test(
      "fileFormat",
      "Only JPEG, JPG and PNG files are accepted.",
      (value) => {
        if (!value) return false;
        if (typeof value === "string") return true;
        if (typeof value === "object" && "url" in value) return true; // skip validation for saved URL
        if (typeof value === "object" && "type" in value) {
          return SUPPORTED_FORMATS_IMAGE.includes(value.type);
        }
        return false;
      }
    ),
});

const bankInfoSchema = Yup.object({
  bank_name: Yup.string().nullable(),
  bank_account_name: Yup.string().nullable(),
  bank_account_no: Yup.string().nullable(),
});

const emergencyContactsSchema = Yup.object({
  emergency_contacts: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required."),
      relation_to_you: Yup.string().required("Relationship is required."),
      contact_number: Yup.string().required("Contact number is required."),
    })
  ),
});

const companyAssetsSchema = Yup.object({
  company_assets: Yup.array().of(
    Yup.object({
      access_card: Yup.boolean(),
      name_tag_and_lanyard: Yup.boolean(),
      hdmi_cable: Yup.boolean(),
      adapter: Yup.boolean(),
      mat: Yup.boolean(),
      monitor: Yup.boolean(),
      macbook_serial_number: Yup.string().required(
        "Macbook serial number is required."
      ),
      phone_number: Yup.string().required("Phone number is required."),
    })
  ),
});

const termsConditionsSchema = Yup.object({
  authorisation: Yup.boolean().oneOf([true], "This field is required."),
  accuracy_of_information: Yup.boolean().oneOf(
    [true],
    "This field is required."
  ),
  security_measures: Yup.boolean().oneOf([true], "This field is required."),
  dispute_resolution: Yup.boolean().oneOf([true], "This field is required."),
  ownership: Yup.boolean().oneOf([true], "This field is required."),
  responsibility: Yup.boolean().oneOf([true], "This field is required."),
  authorised_use: Yup.boolean().oneOf([true], "This field is required."),
  maintenance: Yup.boolean().oneOf([true], "This field is required."),
  security: Yup.boolean().oneOf([true], "This field is required."),
  return_of_assets: Yup.boolean().oneOf([true], "This field is required."),
  loss_or_damage: Yup.boolean().oneOf([true], "This field is required."),
  confidentiality: Yup.boolean().oneOf([true], "This field is required."),
  governing_law: Yup.boolean().oneOf([true], "This field is required."),
  acceptance_of_terms: Yup.boolean().oneOf([true], "This field is required."),
  acknowledgement: Yup.boolean().oneOf([true], "This field is required."),
  //   signature: null,
});

export {
  personalInfoSchema,
  bankInfoSchema,
  emergencyContactsSchema,
  companyAssetsSchema,
  termsConditionsSchema,
};
