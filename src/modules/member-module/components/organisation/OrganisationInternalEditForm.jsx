import { useDispatch, useSelector } from "react-redux";
import { internalUpdateOrganisation } from "../../services/organisationService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AddOrganisationIcon } from "@/components/icons/Icons";
import InputField from "@/components/form-fields/InputField";
import { Label } from "@/components/ui/label";
import ImageUploadField from "@/components/form-fields/ImageUploadField";
import { Formik } from "formik";
import { FormButtons } from "@/components/form-fields/FormButtons";

const OrganisationInternalEditForm = () => {
  const dispatch = useDispatch();
  const { props: organisationInfo } = useSelector((state) => state.dialog);

  const initialValues = {
    address: organisationInfo?.address || "",
    logo: organisationInfo?.logo
      ? {
          id: "existing-logo",
          url: organisationInfo.logo,
        }
      : null,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const formData = new FormData();

    if (values.address !== "") formData.append("address", values.address);
    if (values.logo) formData.append("logo", values.logo);

    internalUpdateOrganisation(organisationInfo?.id, formData, dispatch)
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddOrganisationIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">Edit Organisation</h2>
      </div>

      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
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
              fieldName="address"
              label="address"
              value={values.address}
              error={errors.address}
              touched={touched.address}
              handleChange={handleChange}
              placeholder="Enter organisation address"
              isRequired={false}
            />

            <div>
              <Label className="mb-1 gap-0.5 text-xs uppercase">LOGO</Label>
              <ImageUploadField
                onFileChange={(file) => {
                  setFieldValue("logo", file);
                }}
                initialFiles={
                  values.logo &&
                  typeof values.logo === "object" &&
                  values.logo.url
                    ? [values.logo]
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

export default OrganisationInternalEditForm;
