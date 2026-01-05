import * as Yup from "yup";

const addBudgetSchema = Yup.object({
  forecast_month: Yup.date()
    .required("Forecast month is required")
    .typeError("Invalid date format"),

  company_id: Yup.string().required("Company is required"),
  department_id: Yup.string().required("Department is required"),
  sub_department_id: Yup.string().required("Sub-department is required"),

  expenses_category_id: Yup.string().required("Expense category is required"),
  expenses_sub_category_id: Yup.string().required(
    "Expense sub-category is required"
  ),
  expenses_sub_sub_category_id: Yup.string().nullable().notRequired(),

  quantity: Yup.number()
    .required("Quantity is required")
    .min(0, "Quantity can't be less than 0")
    .typeError("Quantity must be a valid number"),

  forecast_cost: Yup.number()
    .nullable()
    .min(0, "Forecast bonus given must be 0 or a positive number")
    .notRequired()
    .typeError("Forecast cost must be a valid number"),

  description: Yup.string().nullable().notRequired(),
  goal: Yup.string().nullable().notRequired(),
  execution_period_start: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date format"),

  execution_period_end: Yup.date()
    .required("End date is required")
    .typeError("Invalid end date format")
    .min(
      Yup.ref("execution_period_start"),
      "End date cannot be before start date"
    ),
});

export { addBudgetSchema };
