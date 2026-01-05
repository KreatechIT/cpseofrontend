import { TransferIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import CurrencyFieldWithSymbol from "@/components/form-fields/CurrencyFieldWithSymbol";
import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { SelectField } from "@/components/form-fields/SelectField";
import TextareaField from "@/components/form-fields/TextareaField";
import {
  bankTransfer,
  getAllCurrencyTypes,
  getAllTransactionDescriptions,
} from "@/modules/finance-module/services/bankService";

import useBanks from "../../../hooks/useBanks";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { bankTransferSchema } from "@/modules/finance-module/validations/bankValidationSchema";

/**
 * Component to handle derived field updates inside the form.
 * - Automatically updates `exchange_rate` when same currency is selected.
 * - Calculates and updates the `amount` field whenever initial_amount or exchange_rate changes.
 */
const TransferFormEffectHandler = ({
  from_bank_id,
  to_bank_id,
  initial_amount,
  exchange_rate,
  amount,
  operation,
  setFieldValue,
  getCurrencySymbol,
}) => {
  useEffect(() => {
    // Get currency symbols for the selected banks
    const fromSymbol = getCurrencySymbol(from_bank_id);
    const toSymbol = getCurrencySymbol(to_bank_id);

    // If both banks have the same currency, enforce exchange_rate = 1
    const sameCurrency = fromSymbol && toSymbol && fromSymbol === toSymbol;
    if (sameCurrency && exchange_rate !== 1) {
      setFieldValue("exchange_rate", 1);
    }

    // Parse numeric values for calculation
    const initialAmountParsed = parseFloat(initial_amount);
    const exchangeRateParsed = parseFloat(exchange_rate);

    // If values are valid, calculate converted amount
    if (!isNaN(initialAmountParsed) && !isNaN(exchangeRateParsed)) {
      let calculatedAmount =
        operation === "*"
          ? initialAmountParsed * exchangeRateParsed
          : initialAmountParsed / exchangeRateParsed;

      // Limit to 4 decimal places
      calculatedAmount = +calculatedAmount.toFixed(4);

      // Update amount if different from calculated
      if (amount !== calculatedAmount) {
        setFieldValue("amount", calculatedAmount);
      }
    }
  }, [
    from_bank_id,
    to_bank_id,
    initial_amount,
    exchange_rate,
    amount,
    operation,
    setFieldValue,
    getCurrencySymbol,
  ]);

  return null;
};

/**
 * Main Bank Transfer form component.
 * Handles bank-to-bank transfers with exchange rate and currency support.
 */
const BankTransferForm = () => {
  const dispatch = useDispatch();

  // Get user info from auth state
  const { user } = useSelector((state) => state.auth);

  // Get data passed through dialog (bank info if transfer is initiated from a bank detail view)
  const { props: bankInfo } = useSelector((state) => state.dialog);

  // Get existing finance-related state (transaction descriptions, currency types)
  const { transactionDescriptions, currencyTypes } = useSelector(
    (state) => state.banks
  );

  // Custom hook to fetch current user’s active banks
  const { getMyActiveBanks } = useBanks();

  // Fetch transaction descriptions and currency types if not already loaded
  useEffect(() => {
    if (!transactionDescriptions)
      getAllTransactionDescriptions(user.organisation_id, dispatch);

    if (!currencyTypes) getAllCurrencyTypes(dispatch);
  }, []);

  // Get all banks owned by current user
  const myBanks = getMyActiveBanks();

  // Build bank options for Select dropdown
  const bankOptions = useMemo(
    () =>
      myBanks?.map((bank) => ({
        label: `${bank.bank_code} (Bank No: ${bank.bank_number})`,
        value: bank.id,
      })),
    [myBanks]
  );

  // Initial form values
  const initialValues = {
    from_bank_id: bankInfo?.id || "", // Pre-select if bankInfo passed
    to_bank_id: "",
    transaction_date: new Date(),
    initial_amount: 0,
    exchange_rate: 0,
    amount: 0,
    description: "",
    operation: "*", // Default operator: multiply
  };

  // Submit handler
  const handleFormSubmit = (values, { setSubmitting }) => {
    const data = {
      ...values,
      // Format date before sending to backend
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
    };

    // Call API and close dialog on success
    bankTransfer(user.organisation_id, data, dispatch)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  // Utility to get the currency symbol for a given bank
  const getCurrencySymbol = (bankId) => {
    const selectedBank = myBanks?.find((bank) => bank.id === bankId);
    return (
      currencyTypes?.find((c) => c.string === selectedBank?.bank_currency)
        ?.symbol || ""
    );
  };

  return (
    <section>
      {/* Header */}
      <div className="-mt-6 mb-8">
        <TransferIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">Transfer</h2>
      </div>

      {/* Formik handles form state, validation, and submission */}
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={bankTransferSchema}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleChange,
          setFieldValue,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2"
          >
            {/* Effect handler for exchange rate and amount calculation */}
            <TransferFormEffectHandler
              from_bank_id={values.from_bank_id}
              to_bank_id={values.to_bank_id}
              initial_amount={values.initial_amount}
              exchange_rate={values.exchange_rate}
              amount={values.amount}
              operation={values.operation}
              setFieldValue={setFieldValue}
              getCurrencySymbol={getCurrencySymbol}
            />

            {/* From Bank */}
            <SelectField
              options={bankOptions}
              fieldName="from_bank_id"
              label="From Bank"
              value={values.from_bank_id}
              error={errors.from_bank_id}
              touched={touched.from_bank_id}
              setFieldValue={setFieldValue}
              placeholder="Select bank"
              disabled={!!bankInfo} // Disable if preselected
            />

            {/* To Bank */}
            <SelectField
              options={bankOptions?.filter(
                (option) => option.value !== values.from_bank_id
              )}
              fieldName="to_bank_id"
              label="To Bank"
              value={values.to_bank_id}
              error={errors.to_bank_id}
              touched={touched.to_bank_id}
              setFieldValue={setFieldValue}
              placeholder="Select bank"
            />

            {/* Initial amount (currency from source bank) */}
            <CurrencyFieldWithSymbol
              fieldName="initial_amount"
              label="Initial Amount"
              value={values.initial_amount}
              error={errors.initial_amount}
              touched={touched.initial_amount}
              setFieldValue={setFieldValue}
              symbol={getCurrencySymbol(values.from_bank_id)}
            />

            {/* Operation selector (* or /) */}
            <SelectField
              options={[
                { label: "Multiply (*)", value: "*" },
                { label: "Divide (/)", value: "/" },
              ]}
              fieldName="operation"
              label="Operation"
              value={values.operation}
              error={errors.operation}
              touched={touched.operation}
              setFieldValue={setFieldValue}
              placeholder="Select operation"
            />

            {/* Exchange rate (disabled if same currency) */}
            <CurrencyField
              fieldName="exchange_rate"
              label="Exchange Rate"
              value={values.exchange_rate}
              error={errors.exchange_rate}
              touched={touched.exchange_rate}
              setFieldValue={setFieldValue}
              readOnly={
                values.to_bank_id &&
                values.from_bank_id &&
                getCurrencySymbol(values.to_bank_id) ===
                  getCurrencySymbol(values.from_bank_id)
              }
            />

            {/* Converted amount (read-only, target currency) */}
            <CurrencyFieldWithSymbol
              fieldName="amount"
              label="Amount"
              value={values.amount}
              error={errors.amount}
              touched={touched.amount}
              setFieldValue={setFieldValue}
              readOnly={true}
              symbol={getCurrencySymbol(values.to_bank_id)}
            />

            {/* Transaction date */}
            <div className="md:col-span-2">
              <DateField
                fieldName="transaction_date"
                label="Date"
                error={errors.transaction_date}
                touched={touched.transaction_date}
                date={values.transaction_date}
                setDate={(date) => setFieldValue("transaction_date", date)}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <TextareaField
                fieldName="description"
                label="Description"
                value={values.description}
                error={errors.description}
                touched={touched.description}
                handleChange={handleChange}
                placeholder="Enter description"
                isRequired={true}
              />
            </div>

            {/* Submit & Cancel buttons */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default BankTransferForm;
