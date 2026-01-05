import * as Yup from "yup";

const addNewJobPostSchema = Yup.object({
  job_title: Yup.string()
    .required("Job title is required")
    .max(100, "Job title must be at most 100 characters"),
  company_id: Yup.string().required("Company is required"),
  department_id: Yup.string().required("Department is required"),
  job_type: Yup.string().required("Job type is required"),
  location: Yup.string().nullable().notRequired(),
  vacancy: Yup.number()
    .required("Number of vacancies is required")
    .min(1, "Number of vacancies can't be less than 1")
    .typeError("Number of vacancies must be a valid number"),
  salary: Yup.string().nullable(),
  application_deadline: Yup.date()
    .nullable()
    .notRequired()
    .typeError("Invalid date format"),
  position: Yup.string()
    .nullable()
    .max(100, "Position must be at most 100 characters"),
  job_requirement: Yup.string().nullable().notRequired(),
  job_description: Yup.string().nullable().notRequired(),
});

const editJobPostSchema = Yup.object({
  job_title: Yup.string()
    .required("Job title is required")
    .max(100, "Job title must be at most 100 characters"),
  company_id: Yup.string().required("Company is required"),
  department_id: Yup.string().required("Department is required"),
  job_type: Yup.string().required("Job type is required"),
  location: Yup.string().nullable().notRequired(),
  vacancy: Yup.number()
    .required("Number of vacancies is required")
    .min(1, "Number of vacancies can't be less than 1")
    .typeError("Number of vacancies must be a valid number"),
  salary: Yup.string().nullable(),
  application_deadline: Yup.date()
    .nullable()
    .notRequired()
    .typeError("Invalid date format"),
  position: Yup.string()
    .nullable()
    .max(100, "Position must be at most 100 characters"),
  job_requirement: Yup.string().nullable().notRequired(),
  job_description: Yup.string().nullable().notRequired(),
});

export { addNewJobPostSchema, editJobPostSchema };
