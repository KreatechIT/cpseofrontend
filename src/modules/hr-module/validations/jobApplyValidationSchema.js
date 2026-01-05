import * as Yup from "yup";

const FILE_SIZE = 1024 * 1024; // 1MB
const SUPPORTED_FORMATS = ["application/pdf"];
const SUPPORTED_FORMATS_IMAGE = ["image/jpeg", "image/png", "image/jpg"];

const personalInfoSchema = Yup.object({
  full_name: Yup.string().required("Full name is required."),
  first_name: Yup.string().required("First name is required."),
  last_name: Yup.string().required("Last name is required."),
  chinese_name: Yup.string().nullable(),

  gender: Yup.string().required("Gender is required"),
  gender_others: Yup.string().when("gender", {
    is: "99",
    then: (schema) => schema.required("Please specify gender"),
    otherwise: (schema) => schema,
  }),

  marital_status: Yup.string().required("Marital status is required"),
  marital_status_others: Yup.string().when("marital_status", {
    is: "99",
    then: (schema) => schema.required("Please specify marital status"),
    otherwise: (schema) => schema,
  }),

  race: Yup.string().required("Race is required"),
  race_others: Yup.string().when("race", {
    is: "99",
    then: (schema) => schema.required("Please specify race"),
    otherwise: (schema) => schema,
  }),

  religion: Yup.string().required("Religion is required"),
  religion_others: Yup.string().when("religion", {
    is: "99",
    then: (schema) => schema.required("Please specify religion"),
    otherwise: (schema) => schema,
  }),

  nationality: Yup.string().required("Nationality is required"),
  nationality_others: Yup.string().when("nationality", {
    is: "99",
    then: (schema) => schema.required("Please specify nationality"),
    otherwise: (schema) => schema,
  }),

  address: Yup.string().required("Address is required"),
  id_number: Yup.string().required("ID number is required"),
  contact_number: Yup.string().required("Contact number is required"),
  email: Yup.string().required("Email is required").email("Invalid email"),

  birth_date: Yup.date().required("Birth date is required"),
  preferred_start_date: Yup.date().required("Preferred start date is required"),

  resume: Yup.mixed()
    .required("Resume is required")
    .test("fileSize", "File size must be less than 1MB", (value) => {
      return value && value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Only PDF files are accepted", (value) => {
      return value && SUPPORTED_FORMATS.includes(value.type);
    }),
  image: Yup.mixed()
    .required("Recent photo is required")
    .test("fileSize", "File size must be less than 1MB", (value) => {
      return value && value.size <= FILE_SIZE;
    })
    .test("fileFormat", "Only JPG/PNG files are accepted", (value) => {
      return value && SUPPORTED_FORMATS_IMAGE.includes(value.type);
    }),
});

const familyMembersSchema = Yup.object({
  family_members: Yup.array().of(
    Yup.object({
      name: Yup.string().required("Name is required"),
      relationship: Yup.string().required("Relationship is required"),

      gender: Yup.string().required("Gender is required"),
      gender_others: Yup.string().when("gender", {
        is: "99",
        then: (schema) => schema.required("Please specify gender"),
        otherwise: (schema) => schema,
      }),

      age: Yup.number()
        .required("Age is required")
        .min(0, "Age must be positive"),
      occupation: Yup.string().required("Occupation is required"),
    })
  ),
});

const educationSchema = Yup.object({
  education_experiences: Yup.array().of(
    Yup.object({
      institution: Yup.string().required("Institution is required"),
      qualification: Yup.string().required("Qualification is required"),
      field_of_study: Yup.string().required("Field of study is required"),

      result: Yup.string().required("Result is required"),
      location: Yup.string().nullable(),

      start_date: Yup.date().required("Start date is required"),
      end_date: Yup.date().nullable(),
    })
  ),
});

const workExperienceSchema = Yup.object({
  work_experiences: Yup.array().of(
    Yup.object({
      company_name: Yup.string().required("Company name is required"),
      position: Yup.string().required("Position is required"),
      department: Yup.string().required("Department is required"),

      start_date: Yup.date().required("Start date is required"),
      end_date: Yup.date().nullable(),

      job_responsibilities: Yup.string().nullable(),
      reason_of_leaving: Yup.string().nullable(),
      location: Yup.string().nullable(),
    })
  ),
});

const reviewSchema = Yup.object({
  certification: Yup.boolean().oneOf(
    [true],
    "You must certify the accuracy of your information"
  ),
  confidentiality: Yup.boolean().oneOf(
    [true],
    "You must agree to maintain confidentiality"
  ),
  consent: Yup.boolean().oneOf(
    [true],
    "You must consent to the processing of your personal data in accordance with the Personal Data Protection Act 2010 (PDPA)"
  ),
});

export {
  personalInfoSchema,
  familyMembersSchema,
  educationSchema,
  workExperienceSchema,
  reviewSchema,
};
