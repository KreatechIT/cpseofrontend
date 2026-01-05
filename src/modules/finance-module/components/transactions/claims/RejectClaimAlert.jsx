import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { rejectClaim } from "@/modules/finance-module/services/claimService";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { rejectClaimSchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const RejectClaimAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { props: claim } = useSelector((state) => state.dialog);

  const handleConfirm = function (values, { setSubmitting }) {
    rejectClaim(user.organisation_id, claim.id, values, dispatch)
      .then(() => {
        dispatch(closeDialog());
      })
      .catch(() => setSubmitting(false));
  };
  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Reject Claim</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to reject this claim? This action cannot be
          undone.
        </p>
      </div>

      <Formik
        initialValues={{ remark: "" }}
        onSubmit={handleConfirm}
        validationSchema={rejectClaimSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 mt-6 text-left"
          >
            <InputField
              fieldName="remark"
              label="remark"
              value={values.remark}
              error={errors.remark}
              touched={touched.remark}
              handleChange={handleChange}
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </div>
  );
};

export default RejectClaimAlert;
