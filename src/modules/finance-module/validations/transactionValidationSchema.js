import * as Yup from "yup";

const addEmployeeClaimSchema = Yup.object({
  claim_date: Yup.date().required("Date is required"),
  claimed_by: Yup.string().required("Claim by is required"),

  claim_amount: Yup.number()
    .required("Claim amount is required")
    .positive("Claim amount must be greater than 0"),

  company_id: Yup.string().required("Company is required"),

  details: Yup.string().nullable(),
});

const approveClaimByFinanceSchema = Yup.object({
  department_id: Yup.string().required("Department is required"),

  expenses_category_id: Yup.string().required("Expense category is required"),

  expenses_sub_category_id: Yup.string().required(
    "Expense sub-category is required"
  ),

  expenses_sub_sub_category_id: Yup.string().required(
    "Expense sub-sub category is required"
  ),

  bank_id: Yup.string().required("Bank selection is required"),
});

const rejectClaimSchema = Yup.object({
  remark: Yup.string().required("Remark is required"),
});

const addDebitCreditSchema = Yup.object({
  transaction_date: Yup.date().required("Date is required"),

  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount can't be less than 0"),

  company_id: Yup.string().required("Company is required"),

  expenses_category_id: Yup.string().required("Expenses category is required"),
  expenses_sub_category_id: Yup.string().required(
    "Expense sub-category is required"
  ),
  description: Yup.string().required("Description is required"),
});

const editApprovedTransactionSchema = Yup.object({
  description: Yup.string().required("Description is required"),
});

const editTransactionSchema = Yup.object({
  transaction_date: Yup.date().required("Date is required"),

  amount: Yup.number()
    .required("Amount is required")
    .min(0, "Amount can't be less than 0"),

  company_id: Yup.string().required("Company is required"),

  expenses_category_id: Yup.string().required("Expenses category is required"),
  expenses_sub_category_id: Yup.string().required(
    "Expense sub-category is required"
  ),
  description: Yup.string().required("Description is required"),
});

const addWalletActivitySchema = Yup.object({
  transaction_date: Yup.date().required("Date is required"),

  deposit_amount: Yup.number()
    .required("Deposit amount is required")
    .min(0, "Deposit amount can't be less than 0"),
  withdraw_amount: Yup.number()
    .required("Withdraw amount is required")
    .min(0, "Withdraw amount can't be less than 0"),
  bonus_given_amount: Yup.number()
    .required("Bonus given amount is required")
    .min(0, "Bonus given amount can't be less than 0"),

  company_id: Yup.string().required("Company is required"),
  description: Yup.string().nullable(),
});

export {
  addEmployeeClaimSchema,
  approveClaimByFinanceSchema,
  rejectClaimSchema,
  addDebitCreditSchema,
  editApprovedTransactionSchema,
  editTransactionSchema,
  addWalletActivitySchema,
};
