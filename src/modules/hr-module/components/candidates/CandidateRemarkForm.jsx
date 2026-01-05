import { Button } from "@/components/ui/button";

import { Check, LoaderCircle, XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addCandidateToBlacklistPool,
  addCandidateToTalentPool,
  changeCandidateStatus,
} from "../../services/candidatesService";

import * as Yup from "yup";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";

const CandidateRemarkForm = ({ remarkType, setRemarkType, candidate_id }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const initialValues = {
    remark: "",
  };

  const validationSchema = Yup.object().shape({
    remark: Yup.string().nullable(),
  });

  const handleFormSubmit = function (values, { setSubmitting }) {
    let action;
    if (remarkType == "reject") {
      action = changeCandidateStatus(
        user.organisation_id,
        candidate_id,
        { status: "6", remark: values.remark },
        dispatch
      );
    } else if (remarkType == "blacklist") {
      action = addCandidateToBlacklistPool(
        user.organisation_id,
        candidate_id,
        values,
        dispatch
      );
    } else if (remarkType == "talent") {
      action = addCandidateToTalentPool(
        user.organisation_id,
        candidate_id,
        values,
        dispatch
      );
    }

    action.then(() => setRemarkType("")).finally(() => setSubmitting(false));
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
            className="my-1 space-y-4 grid grid-cols-1 gap-x-4"
          >
            <InputField
              fieldName="remark"
              label="remark"
              value={values.remark}
              error={errors.remark}
              touched={touched.remark}
              handleChange={handleChange}
              isRequired={false}
            />

            {/* Submit Button */}
            <div className="md:col-span-2 mt-2 grid grid-cols-2 gap-4">
              <Button
                variant="secondary"
                type="button"
                className="border/50 border bg-white dark:bg-white/5"
                disabled={isSubmitting}
                onClick={() => setRemarkType("")}
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

export default CandidateRemarkForm;
