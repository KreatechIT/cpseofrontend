import { AddBankIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import {
  addNewBank,
  getAllBankTypes,
  getAllCurrencyTypes,
  updateBank,
} from "@/modules/finance-module/services/bankService";
import {
  FINANCE_BANK_TYPE_CHOICES,
  FINANCE_STATUS_CHOICES,
} from "../../../lib/financeEnums";

import { closeDialog } from "@/store/reducers/dialogSlice";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { cn } from "@/utils/cn";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addBankSchema,
  editBankSchema,
} from "@/modules/finance-module/validations/bankValidationSchema";

const AddEditBankForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { type: dialogType, props: bankInfo } = useSelector(
    (state) => state.dialog
  );
  const { bankTypes, currencyTypes } = useSelector((state) => state.banks);

  // Load bank and currency types.
  useEffect(() => {
    !bankTypes && getAllBankTypes(dispatch);
    !currencyTypes && getAllCurrencyTypes(dispatch);
  }, []);

  // Convert bankTypes into value/label
  const bankOptions = useMemo(
    () => arrayToSelectOptions(bankTypes, "string", "int"),
    [bankTypes]
  );

  // Convert currencyTypes into value/label
  const currencyOptions = useMemo(
    () => arrayToSelectOptions(currencyTypes, "string", "int"),
    [currencyTypes]
  );

  const addBankInitialValues = {
    bank: "",
    bank_code: "",
    bank_type: "",
    bank_holder: "",
    bank_number: "",
    maximum_bank_balance: 0,
    initial_balance: 0,
    daily_limit: 0,
    bank_currency: "",
  };

  const editBankInitialValues = {
    bank: bankInfo?.bank
      ? bankOptions.find((b) => b.label === bankInfo?.bank)?.value
      : "",
    bank_code: bankInfo?.bank_code || "",
    bank_type: bankInfo?.bank_type
      ? FINANCE_BANK_TYPE_CHOICES.find((b) => b.label === bankInfo?.bank_type)
          ?.value
      : "",
    bank_holder: bankInfo?.bank_holder || "",
    bank_number: bankInfo?.bank_number || "",
    maximum_bank_balance: bankInfo?.maximum_bank_balance || 0,
    daily_limit: bankInfo?.daily_limit || 0,
    display: bankInfo?.display ? "1" : "2",
    status: bankInfo?.status === "Active" ? "1" : "2",
    bank_currency: bankInfo?.bank_currency
      ? currencyOptions.find((c) => c.label === bankInfo?.bank_currency)?.value
      : "",
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    const data = { ...values };

    const action =
      dialogType === "editBank"
        ? updateBank(user.organisation_id, bankInfo?.id, data, dispatch)
        : addNewBank(user.organisation_id, data, dispatch);
    action
      .then(() => {
        dispatch(closeDialog(false));
      })
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddBankIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="mt-2 text-center text-xl font-medium">
          {dialogType === "editBank" ? "Edit Bank" : "Add New Bank"}
        </h2>
      </div>

      <Formik
        initialValues={
          dialogType === "editBank"
            ? editBankInitialValues
            : addBankInitialValues
        }
        validationSchema={
          dialogType === "editBank" ? editBankSchema : addBankSchema
        }
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2 -mt-2"
          >
            <div className={cn(dialogType === "addNewBank" && "md:col-span-2")}>
              <SelectField
                fieldName="bank"
                label="Bank"
                options={bankOptions}
                value={values.bank ? Number(values?.bank) : ""}
                error={errors.bank}
                touched={touched.bank}
                setFieldValue={setFieldValue}
                placeholder="Select Bank"
              />
            </div>

            <InputField
              fieldName="bank_code"
              label="Bank Code"
              value={values.bank_code}
              error={errors.bank_code}
              touched={touched.bank_code}
              handleChange={handleChange}
              placeholder="Enter bank code"
              isRequired={false}
            />

            <SelectField
              fieldName="bank_type"
              label="Bank Type"
              options={FINANCE_BANK_TYPE_CHOICES}
              value={values.bank_type}
              error={errors.bank_type}
              touched={touched.bank_type}
              setFieldValue={setFieldValue}
              placeholder="Select Bank Type"
            />

            <SelectField
              fieldName="bank_currency"
              label="Currency"
              options={currencyOptions}
              value={values.bank_currency ? Number(values?.bank_currency) : ""}
              error={errors.bank_currency}
              touched={touched.bank_currency}
              setFieldValue={setFieldValue}
              placeholder="Select currency type"
            />

            <InputField
              fieldName="bank_holder"
              label="Bank Holder"
              value={values.bank_holder}
              error={errors.bank_holder}
              touched={touched.bank_holder}
              handleChange={handleChange}
              placeholder="Enter bank holder name"
            />

            <InputField
              fieldName="bank_number"
              label="Bank Number"
              value={values.bank_number}
              error={errors.bank_number}
              touched={touched.bank_number}
              handleChange={handleChange}
              placeholder="Enter bank number"
            />

            <CurrencyField
              fieldName="maximum_bank_balance"
              label="Maximum Bank Balance"
              value={values.maximum_bank_balance}
              error={errors.maximum_bank_balance}
              touched={touched.maximum_bank_balance}
              setFieldValue={setFieldValue}
            />

            {dialogType === "addNewBank" && (
              <CurrencyField
                fieldName="initial_balance"
                label="initial balance"
                value={values.initial_balance}
                error={errors.initial_balance}
                touched={touched.initial_balance}
                setFieldValue={setFieldValue}
              />
            )}

            <CurrencyField
              fieldName="daily_limit"
              label="daily limit"
              value={values.daily_limit}
              error={errors.daily_limit}
              touched={touched.daily_limit}
              setFieldValue={setFieldValue}
            />

            {dialogType === "editBank" && (
              <>
                <SelectField
                  fieldName="display"
                  label="display"
                  options={[
                    { value: "1", label: "Yes" },
                    { value: "2", label: "No" },
                  ]}
                  value={values.display}
                  error={errors.display}
                  touched={touched.display}
                  setFieldValue={setFieldValue}
                />

                <SelectField
                  fieldName="status"
                  label="status"
                  options={FINANCE_STATUS_CHOICES}
                  value={values.status}
                  error={errors.status}
                  touched={touched.status}
                  setFieldValue={setFieldValue}
                />
              </>
            )}

            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditBankForm;
