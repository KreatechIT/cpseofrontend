import { closeDialog } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";

import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";

import { FormButtons } from "@/components/form-fields/FormButtons";
import { Label } from "@/components/ui/label";
import ImageUploadField from "@/components/form-fields/ImageUploadField";
import { addNewReferral, updateReferral } from "../../services/referralService";
import CurrencyField from "@/components/form-fields/CurrencyField";
import { addEditReferralSchema } from "../../validations/referralsValidationSchema";

const AddEditReferralForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { type: formType, props: referralInfo } = useSelector(
    (state) => state.dialog
  );

  const initialValues = {
    refferals_id: referralInfo?.refferals_id || "",
    referrer_name: referralInfo?.referrer_name || "",
    referee_name: referralInfo?.referee_name || "",
    job_reffered: referralInfo?.job_reffered || "",
    refferals_bonus: referralInfo?.refferals_bonus || 0,

    referrer_image: referralInfo?.referrer_image
      ? {
          id: "existing-referrer-image",
          url: referralInfo.referrer_image,
        }
      : null,
    referee_image: referralInfo?.referee_image
      ? {
          id: "existing-referee-image",
          url: referralInfo.referee_image,
        }
      : null,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const formData = new FormData();

    formData.append("refferals_id", values.refferals_id);
    formData.append("referrer_name", values.referrer_name);
    formData.append("referee_name", values.referee_name);
    formData.append("job_reffered", values.job_reffered);
    formData.append("refferals_bonus", values.refferals_bonus);

    if (values.referrer_image)
      formData.append("referrer_image", values.referrer_image);
    if (values.referee_image)
      formData.append("referee_image", values.referee_image);

    const action =
      formType === "editReferral"
        ? updateReferral(
            user?.organisation_id,
            referralInfo?.id,
            formData,
            dispatch
          )
        : addNewReferral(user?.organisation_id, formData, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <h2 className="text-center text-xl mt-2 font-medium">
          {formType === "editReferral" ? "Edit Referral" : "Add New Referral"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditReferralSchema}
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
            className="my-1 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-x-4"
          >
            <InputField
              fieldName="refferals_id"
              label="refferals id"
              value={values.refferals_id}
              error={errors.refferals_id}
              touched={touched.refferals_id}
              handleChange={handleChange}
              placeholder="Enter refferals id"
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

            <InputField
              fieldName="job_reffered"
              label="job reffered"
              value={values.job_reffered}
              error={errors.job_reffered}
              touched={touched.job_reffered}
              handleChange={handleChange}
              placeholder="Enter job reffered"
            />

            <InputField
              fieldName="referee_name"
              label="referee name"
              value={values.referee_name}
              error={errors.referee_name}
              touched={touched.referee_name}
              handleChange={handleChange}
              placeholder="Enter referee name"
            />

            <div className="col-span-2">
              <CurrencyField
                fieldName="refferals_bonus"
                label="refferals bonus"
                value={values.refferals_bonus}
                error={errors.refferals_bonus}
                touched={touched.refferals_bonus}
                setFieldValue={setFieldValue}
              />
            </div>

            <div>
              <Label className="mb-1 gap-0.5 text-sm capitalize">
                referrer image
              </Label>
              <ImageUploadField
                onFileChange={(file) => {
                  setFieldValue("referrer_image", file);
                }}
                initialFiles={
                  values.referrer_image &&
                  typeof values.referrer_image === "object" &&
                  values.referrer_image.url
                    ? [values.referrer_image]
                    : []
                }
              />
            </div>

            <div>
              <Label className="mb-1 gap-0.5 text-sm capitalize">
                referee image
              </Label>
              <ImageUploadField
                onFileChange={(file) => {
                  setFieldValue("referee_image", file);
                }}
                initialFiles={
                  values.referee_image &&
                  typeof values.referee_image === "object" &&
                  values.referee_image.url
                    ? [values.referee_image]
                    : []
                }
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

export default AddEditReferralForm;
