import { Button } from "@/components/ui/button";
import { Check, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addCandidateReferrer } from "../../services/candidatesService";
import * as Yup from "yup";

const AddReferrer = ({ candidate_id, setIsAddingReferrer }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    refferer_id: "",
    referrer_name: "",
  };

  const validationSchema = Yup.object().shape({
    refferer_id: Yup.string().required("Referrer id is required"),
    referrer_name: Yup.string().required("Referrer name is required"),
  });

  const handleFormSubmit = function (values, { setSubmitting }) {
    addCandidateReferrer(user?.organisation_id, candidate_id, values, dispatch)
      .then(() => setIsAddingReferrer(false))
      .finally(() => setSubmitting(false));
  };

  return (
    <section className="md:col-span-2">
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}
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
            className="my-1 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-4"
          >
            <InputField
              fieldName="refferer_id"
              label="referrer id"
              value={values.refferer_id}
              error={errors.refferer_id}
              touched={touched.refferer_id}
              handleChange={handleChange}
            />

            <InputField
              fieldName="referrer_name"
              label="referrer name"
              value={values.referrer_name}
              error={errors.referrer_name}
              touched={touched.referrer_name}
              handleChange={handleChange}
              placeholder="Enter referrer name"
            />

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2 grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                type="button"
                className="border/50 border bg-white dark:bg-white/5"
                disabled={isSubmitting}
                onClick={() => setIsAddingReferrer(false)}
              >
                <XIcon
                  className="-ms-1 opacity-80"
                  size={16}
                  aria-hidden="true"
                />
                Cancel
              </Button>

              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <LoaderCircle
                    className="-ms-1 animate-spin opacity-80"
                    size={16}
                    aria-hidden="true"
                  />
                ) : (
                  <Check
                    className="-ms-1 opacity-80"
                    size={16}
                    aria-hidden="true"
                  />
                )}
                Confirm
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddReferrer;
