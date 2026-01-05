import { TransferIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";

import { FormButtons } from "@/components/form-fields/FormButtons";
import { SelectField } from "@/components/form-fields/SelectField";
import TextareaField from "@/components/form-fields/TextareaField";
import {
  bankDepositWithdraw,
  getAllTransactionDescriptions,
} from "@/modules/finance-module/services/bankService";

import useBanks from "../../../hooks/useBanks";
import { FINANCE_TRANSACTION_TYPE_CHOICES } from "../../../lib/financeEnums";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { depositWithdrawSchema } from "@/modules/finance-module/validations/bankValidationSchema";

const DepositWithdrawForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { props: bankInfo } = useSelector((state) => state.dialog);
  const { transactionDescriptions } = useSelector((state) => state.banks);

  const { getMyActiveBanks } = useBanks();

  useEffect(() => {
    if (!transactionDescriptions)
      getAllTransactionDescriptions(user.organisation_id, dispatch);
  }, []);

  const descriptionDepositOptions = useMemo(
    () =>
      arrayToSelectOptions(
        transactionDescriptions?.filter((des) => des.purpose === "Deposit"),
        "description",
        "description"
      ),
    [transactionDescriptions]
  );

  const descriptionWithdrawOptions = useMemo(
    () =>
      arrayToSelectOptions(
        transactionDescriptions?.filter((des) => des.purpose === "Withdraw"),
        "description",
        "description"
      ),
    [transactionDescriptions]
  );

  const myBanks = getMyActiveBanks();

  const bankOptions = useMemo(
    () =>
      myBanks?.map((bank) => {
        return {
          label: `${bank.bank_code} (Bank No: ${bank.bank_number})`,
          value: bank.id,
        };
      }),
    [myBanks]
  );

  const initialValues = {
    from_bank_id: bankInfo?.id || "",
    transaction_date: new Date(),
    transaction_type: "",
    amount: 0,
    description: "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
    };

    bankDepositWithdraw(user.organisation_id, data.from_bank_id, data, dispatch)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <TransferIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">Deposit/Withdraw</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={depositWithdrawSchema}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          handleChange,
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
              options={FINANCE_TRANSACTION_TYPE_CHOICES}
              fieldName="transaction_type"
              label="transaction type"
              value={values.transaction_type}
              error={errors.transaction_type}
              touched={touched.transaction_type}
              setFieldValue={setFieldValue}
              placeholder="Select type"
            />

            <CurrencyField
              fieldName="amount"
              label="amount"
              value={values.amount}
              error={errors.amount}
              touched={touched.amount}
              setFieldValue={setFieldValue}
            />

            <SelectField
              options={bankOptions}
              fieldName="from_bank_id"
              label="Bank"
              value={values.from_bank_id}
              error={errors.from_bank_id}
              touched={touched.from_bank_id}
              setFieldValue={setFieldValue}
              placeholder="Select bank"
              disabled={bankInfo}
            />

            <div className="md:col-span-2 space-y-4">
              <SelectField
                options={
                  values.transaction_type == "1"
                    ? descriptionDepositOptions
                    : descriptionWithdrawOptions
                }
                fieldName="description"
                label="description"
                value={values.description}
                error={errors.description}
                touched={touched.description}
                setFieldValue={setFieldValue}
                placeholder="Select description"
                isRequired={false}
              />

              <TextareaField
                fieldName="extra_description"
                label="extra description"
                value={values.extra_description}
                error={errors.extra_description}
                touched={touched.extra_description}
                handleChange={handleChange}
                placeholder="Enter extra description"
                isRequired={false}
              />
            </div>

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default DepositWithdrawForm;
