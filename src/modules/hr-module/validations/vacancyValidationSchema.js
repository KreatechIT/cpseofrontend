import * as Yup from "yup";

const addVacancyValidationSchema = Yup.object({
  date: Yup.date()
    .required("Date is required")
    .typeError("Invalid date format"),
  department_id: Yup.string().required("Department is required"),

  position: Yup.string()
    .required("Position is required")
    .max(100, "Position must be at most 100 characters"),

  reason_for_hiring: Yup.string().nullable().notRequired(),

  number_of_vacancies: Yup.number()
    .required("Number of vacancies is required")
    .min(1, "Number of vacancies can't be less than 1")
    .typeError("Number of vacancies must be a valid number"),
});

const rejectVacancySchema = Yup.object({
  reject_reason: Yup.string().required("Reject reason is required"),
});

export { addVacancyValidationSchema, rejectVacancySchema };
