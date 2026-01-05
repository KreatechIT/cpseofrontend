import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { Formik } from "formik";
import { rejectVacancy } from "../../services/hiringVacancyService";
import TextareaField from "@/components/form-fields/TextareaField";
import { rejectVacancySchema } from "../../validations/vacancyValidationSchema";

const RejectVacanyAlert = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { props: vacancy } = useSelector((state) => state.dialog);

  const handleConfirm = function (values, { setSubmitting }) {
    rejectVacancy(user.organisation_id, vacancy.id, values, dispatch)
      .then(() => {
        dispatch(closeDialog());
      })
      .catch(() => setSubmitting(false));
  };

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Reject Hiring Vacancy</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to reject this? This action cannot be undone.
        </p>
      </div>

      <Formik
        initialValues={{ reject_reason: "" }}
        onSubmit={handleConfirm}
        validationSchema={rejectVacancySchema}
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 mt-8 text-left"
          >
            <TextareaField
              fieldName="reject_reason"
              label="reject reason"
              value={values.reject_reason}
              error={errors.reject_reason}
              touched={touched.reject_reason}
              placeholder="Leave a comment"
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

export default RejectVacanyAlert;
