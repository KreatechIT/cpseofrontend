import { AddBankIcon } from "@/components/icons/FinanceIcons";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { addNewTransactionDescription } from "@/modules/finance-module/services/bankService";
import { FINANCE_TRANSACTION_TYPE_CHOICES } from "../../../lib/financeEnums";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { addTransactionDescriptionSchema } from "@/modules/finance-module/validations/bankValidationSchema";

const AddTransactionDescriptionForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    description: "",
    purpose: "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    addNewTransactionDescription(user?.organisation_id, data, dispatch)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddBankIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          Add Transaction Description
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addTransactionDescriptionSchema}
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
          <form onSubmit={handleSubmit} className="my-1 space-y-4">
            <InputField
              fieldName="description"
              label="description"
              value={values.description}
              error={errors.description}
              touched={touched.description}
              handleChange={handleChange}
              placeholder="Enter description"
            />

            <SelectField
              options={FINANCE_TRANSACTION_TYPE_CHOICES}
              fieldName="purpose"
              label="purpose"
              value={values.purpose ? values.purpose : ""}
              error={errors.purpose}
              touched={touched.purpose}
              setFieldValue={setFieldValue}
              placeholder="Select purpose"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddTransactionDescriptionForm;
