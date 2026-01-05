import * as Yup from "yup";

const addBankSchema = Yup.object({
  bank: Yup.string().required("Bank is required"),
  bank_code: Yup.string().nullable(),
  bank_type: Yup.string().required("Bank type is required"),
  bank_holder: Yup.string().required("Bank holder is required"),
  bank_number: Yup.string().required("Bank number is required"),
  maximum_bank_balance: Yup.number()
    .required("Maximum bank balance is required")
    .min(0, "Maximum Bank Balance must be 0 or a positive number")
    .typeError("Maximum Bank Balance must be a valid number"),
  initial_balance: Yup.number()
    .nullable()
    .min(0, "Initial Balance must be 0 or a positive number")
    .typeError("Initial Balance must be a valid number")
    .when("maximum_bank_balance", (maxBalance, schema) =>
      maxBalance != null
        ? schema.max(
            maxBalance,
            "Initial Balance cannot be greater than Maximum Bank Balance"
          )
        : schema
    ),
  daily_limit: Yup.number()
    .nullable()
    .min(0, "Daily limit must be 0 or a positive number")
    .typeError("Daily limit must be a valid number"),
  bank_currency: Yup.number().required("Currency is required"),
});

const editBankSchema = Yup.object({
  bank: Yup.number().required("Bank is required"),
  bank_code: Yup.string().nullable(),
  bank_type: Yup.number().required("Bank Type is required"),
  bank_holder: Yup.string().required("Bank Holder is required"),
  bank_number: Yup.string().required("Bank Number is required"),
  maximum_bank_balance: Yup.number()
    .required("Maximum Bank Balance is required")
    .min(0, "Maximum Bank Balance must be 0 or a positive number")
    .typeError("Maximum Bank Balance must be a valid number"),
  daily_limit: Yup.number()
    .nullable()
    .min(0, "Daily limit must be 0 or a positive number")
    .typeError("Daily limit must be a valid number"),
  display: Yup.number().required("Display is required"),
  status: Yup.number().required("Status is required"),
  bank_currency: Yup.number().required("Currency is required"),
});

const bankTransferSchema = Yup.object({
  from_bank_id: Yup.string().required("From bank is required"),
  to_bank_id: Yup.string().required("To bank is required"),
  initial_amount: Yup.number()
    .required("Initial amount is required")
    .positive("Initial amount must be greater than zero")
    .typeError("Initial amount must be a valid number"),
  exchange_rate: Yup.number()
    .required("Exchange rate is required")
    .positive("Exchange rate must be greater than zero")
    .typeError("Exchange rate must be a valid number"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than zero")
    .typeError("Amount must be a valid number"),
  operation: Yup.string()
    .oneOf(["*", "/"], "Invalid operation")
    .required("Operation is required"),
  description: Yup.string().nullable(),
  transaction_date: Yup.date().required("Transaction Date is required"),
});

const depositWithdrawSchema = Yup.object({
  from_bank_id: Yup.string().required("From bank is required"),
  transaction_type: Yup.number().required("Transaction type is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be greater than zero")
    .typeError("Amount must be a valid number"),
  description: Yup.string().nullable(),
  extra_description: Yup.string().nullable(),
  transaction_date: Yup.date().required("Transaction Date is required"),
});

const addTransactionDescriptionSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
  purpose: Yup.number().required("Purpose is required"),
});

export {
  addBankSchema,
  editBankSchema,
  bankTransferSchema,
  depositWithdrawSchema,
  addTransactionDescriptionSchema,
};
