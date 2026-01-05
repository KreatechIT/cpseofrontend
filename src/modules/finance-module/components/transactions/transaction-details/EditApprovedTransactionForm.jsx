import { AddBankIcon } from "@/components/icons/FinanceIcons";
import FileUplaodField from "@/components/form-fields/FileUploadField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { Label } from "@/components/ui/label";

import { updateApprovedTransaction } from "@/modules/finance-module/services/transactionService";

import { closeDialog } from "@/store/reducers/dialogSlice";

import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { editApprovedTransactionSchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const EditApprovedTransactionForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { props: transactionInfo } = useSelector((state) => state.dialog);

  const initialValues = {
    description: transactionInfo.description,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
    };

    updateApprovedTransaction(
      user?.organisation_id,
      transactionInfo.id,
      data,
      dispatch
    )
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
        <h2 className="text-center text-xl font-medium">Edit Transaction</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={editApprovedTransactionSchema}
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
            className="my-1 space-y-4 gap-x-4 -mt-4"
          >
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
            <div className="">
              <Label className="mb-1 gap-0.5 text-xs uppercase">Receipt</Label>
              <FileUplaodField
                onFileChange={(file) => {
                  setFieldValue("receipt", file);
                }}
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

export default EditApprovedTransactionForm;
