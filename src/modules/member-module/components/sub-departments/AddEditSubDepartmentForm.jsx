import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewSubDepartment,
  updateSubDepartment,
} from "../../services/departmentService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { NewDepartmentIcon } from "@/components/icons/Icons";
import { addEditSubDepartmentSchema } from "../../validations/departmentValidationSchema";

export default function AddEditSubDepartmentForm() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.department);

  const { type: formType, props } = useSelector((state) => state.dialog);
  const { department = null, subDepartment = null } = props || {};

  // Format departments into select options format (label/value)
  const departmentsOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  const initialValues = {
    name: subDepartment?.name || "",
    department_id: subDepartment?.department_id || department?.id || "",
    strategy: subDepartment?.strategy || "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    const action =
      formType === "editSubDepartment"
        ? updateSubDepartment(
            user.organisation_id,
            subDepartment.id,
            data,
            dispatch
          )
        : addNewSubDepartment(user.organisation_id, data, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewDepartmentIcon className="mx-auto size-12 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {formType === "editSubDepartment"
            ? "Edit Sub Department"
            : "Add Sub Department"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditSubDepartmentSchema}
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
              placeholder="Enter sub department name"
            />

            <SelectField
              options={departmentsOptions}
              fieldName="department_id"
              label="Department"
              value={values.department_id}
              error={errors.department_id}
              touched={touched.department_id}
              setFieldValue={setFieldValue}
              placeholder="Select department"
            />

            <InputField
              fieldName="strategy"
              label="strategy"
              value={values.strategy}
              error={errors.strategy}
              touched={touched.strategy}
              handleChange={handleChange}
              placeholder="Enter strategy"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
}
