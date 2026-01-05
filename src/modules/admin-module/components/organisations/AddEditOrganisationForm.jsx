import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewOrganisation,
  getOrganisationProducts,
  updateOrganisation,
} from "../../services/organisationByAdminService";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AddOrganisationIcon } from "@/components/icons/Icons";
import InputField from "@/components/form-fields/InputField";
import { Label } from "@/components/ui/label";
import MultiSelectFormField from "@/components/form-fields/MultiSelectField";
import { Formik } from "formik";
import ImageUploadField from "@/components/form-fields/ImageUploadField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { addEditOrganisationSchema } from "../../validations/organisationByAdminValidationSchema";

const AddEditOrganisationForm = () => {
  const dispatch = useDispatch();
  const { organisationProducts } = useSelector(
    (state) => state.organisationsByAdmin
  );

  const { type: formType, props: organisationInfo } = useSelector(
    (state) => state.dialog
  );

  // Fetch Organisation Products if null
  useEffect(() => {
    if (!organisationProducts) getOrganisationProducts(dispatch);
  }, []);

  // Format organisation products into select options format (label/value)
  const organisationProductsOptions = useMemo(
    () => arrayToSelectOptions(organisationProducts, "name", "id"),
    [organisationProducts]
  );

  const initialValues = {
    name: organisationInfo?.name || "",
    address: organisationInfo?.address || "",
    products: organisationInfo
      ? arrayToSelectOptions(organisationInfo?.products, "name", "id")
      : [],
    logo: organisationInfo?.logo
      ? {
          id: "existing-logo",
          url: organisationInfo.logo,
        }
      : null,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const formData = new FormData();

    formData.append("name", values.name);

    if (values.address !== "") formData.append("address", values.address);
    if (values.logo) formData.append("logo", values.logo);

    values.products.forEach((product) => {
      formData.append("product_ids", product.value);
    });

    const action =
      formType === "editOrganisation"
        ? updateOrganisation(organisationInfo?.id, formData, dispatch)
        : addNewOrganisation(formData, dispatch);

    action
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
        <AddOrganisationIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {formType === "editOrganisation"
            ? "Edit Organisation"
            : "Create Organisation"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditOrganisationSchema}
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
              label="organisation name"
              value={values.name}
              error={errors.name}
              touched={touched.name}
              handleChange={handleChange}
              placeholder="Enter organisation name"
            />

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

            <MultiSelectFormField
              fieldName="products"
              label="Products"
              value={values.products}
              error={errors.products}
              touched={touched.products}
              placeholder="Select products"
              options={organisationProductsOptions}
              handleChange={(selected) => setFieldValue("products", selected)}
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

export default AddEditOrganisationForm;
