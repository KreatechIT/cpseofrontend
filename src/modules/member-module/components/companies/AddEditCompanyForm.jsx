import { closeDialog } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";
import { addNewCompany, updateCompany } from "../../services/companyService";

import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { NewCompanyIcon } from "@/components/icons/Icons";
import { addEditCompanySchema } from "../../validations/companyValidationSchema";

const AddEditCompanyForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { type: formType, props: companyInfo } = useSelector(
    (state) => state.dialog
  );

  const initialValues = {
    name: companyInfo?.name || "",
    is_hq: companyInfo?.is_hq || false,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("is_hq", values.is_hq);

    if (values.logo) formData.append("logo", values.logo);

    const action =
      formType === "editCompany"
        ? updateCompany(
            user?.organisation_id,
            companyInfo?.id,
            formData,
            dispatch
          )
        : addNewCompany(user?.organisation_id, formData, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewCompanyIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl mt-2 font-medium">
          {formType === "editCompany" ? "Edit Company" : "Add Company"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditCompanySchema}
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
              fieldName="name"
              label="name"
              value={values.name}
              error={errors.name}
              touched={touched.name}
              handleChange={handleChange}
              placeholder="Enter company name"
            />

            <SelectField
              options={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              fieldName="is_hq"
              label="HQ"
              value={values.is_hq.toString()}
              error={errors.is_hq}
              touched={touched.is_hq}
              setFieldValue={setFieldValue}
              placeholder="Select"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditCompanyForm;
