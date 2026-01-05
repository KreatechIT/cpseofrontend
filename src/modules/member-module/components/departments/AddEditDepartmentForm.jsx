import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewDepartment,
  updateDepartment,
} from "../../services/departmentService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { NewDepartmentIcon } from "@/components/icons/Icons";

import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { addEditDepartmentSchema } from "../../validations/departmentValidationSchema";

const AddEditDepartmentForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);

  const { type: formType, props } = useSelector((state) => state.dialog);

  const { company = null, department = null } = props || {};

  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const initialValues = {
    name: department?.name || "",
    companies:
      formType === "editDepartment"
        ? arrayToSelectOptions(department.companies, "name", "id")
        : company
        ? [{ label: company.name, value: company.id }]
        : [],
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {};
    data.name = values.name;
    data.company_ids = [];
    values.companies.map((company) => data.company_ids.push(company.value));

    const action =
      formType === "editDepartment"
        ? updateDepartment(user.organisation_id, department.id, data, dispatch)
        : addNewDepartment(user.organisation_id, data, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <NewDepartmentIcon className="mx-auto size-12 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {formType === "editDepartment" ? "Edit Department" : "Add Department"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditDepartmentSchema}
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
              placeholder="Enter department name"
            />

            <MultiSelectField
              fieldName="companies"
              label="Companies"
              value={values.companies}
              error={errors.companies}
              touched={touched.companies}
              placeholder="Select companies"
              options={companiesOptions}
              handleChange={(selected) => setFieldValue("companies", selected)}
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditDepartmentForm;
