import { AddBankIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { addNewWalletActivity } from "@/modules/finance-module/services/transactionService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { format } from "date-fns";
import { Formik } from "formik";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWalletActivitySchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const AddWalletActivityForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);

  // Format admin roles into select options format (label/value)
  const companyOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const initialValues = {
    transaction_date: new Date(),
    deposit_amount: 0,
    withdraw_amount: 0,
    bonus_given_amount: 0,
    company_id: "",
    description: "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
    };

    addNewWalletActivity(user?.organisation_id, data, dispatch)
      .then(() => {
        dispatch(closeDialog());
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddBankIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">New Wallet Activity</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addWalletActivitySchema}
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2"
          >
            <DateField
              fieldName="transaction_date"
              label="Date"
              error={errors.transaction_date}
              touched={touched.transaction_date}
              date={values.transaction_date}
              setDate={(date) => setFieldValue("transaction_date", date)}
            />

            <SelectField
              options={companyOptions}
              fieldName="company_id"
              label="Company"
              value={values.company_id}
              error={errors.company_id}
              touched={touched.company_id}
              setFieldValue={setFieldValue}
              placeholder="Select company"
            />

            <CurrencyField
              fieldName="deposit_amount"
              label="deposit amount"
              value={values.deposit_amount}
              error={errors.deposit_amount}
              touched={touched.deposit_amount}
              setFieldValue={setFieldValue}
            />

            <CurrencyField
              fieldName="withdraw_amount"
              label="withdraw amount"
              value={values.withdraw_amount}
              error={errors.withdraw_amount}
              touched={touched.withdraw_amount}
              setFieldValue={setFieldValue}
            />

            <CurrencyField
              fieldName="bonus_given_amount"
              label="bonus given amount"
              value={values.bonus_given_amount}
              error={errors.bonus_given_amount}
              touched={touched.bonus_given_amount}
              setFieldValue={setFieldValue}
            />

            <InputField
              fieldName="description"
              label="description"
              value={values.description}
              error={errors.description}
              touched={touched.description}
              handleChange={handleChange}
              placeholder="Enter description"
              isRequired={false}
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddWalletActivityForm;
