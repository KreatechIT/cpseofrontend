import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { format } from "date-fns";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAdmin,
  getAllAdminRoles,
  updateAdmin,
} from "../../services/adminService";
import { closeDialog } from "@/store/reducers/dialogSlice";

import { AddAdminIcon } from "@/components/icons/Icons";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import PasswordField from "@/components/form-fields/PasswordField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import DateField from "@/components/form-fields/DateField";
import {
  addAdminSchema,
  editAdminSchema,
} from "../../validations/adminValidationSchema";

const AddEditAdminForm = () => {
  const dispatch = useDispatch();
  const { adminRoles } = useSelector((state) => state.admin);

  const { type, props: adminInfo } = useSelector((state) => state.dialog);

  useEffect(() => {
    if (!adminRoles) getAllAdminRoles(dispatch);
  }, []);

  // Format admin roles into select options format (label/value)
  const adminRoleOptions = useMemo(
    () => arrayToSelectOptions(adminRoles, "name", "id"),
    [adminRoles]
  );

  const addAdminInitialValues = {
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    admin_role_id: "",
    joined: new Date(),
    account_password: "",
    confirm_password: "",
  };

  const editAdminInitialValues = {
    first_name: adminInfo?.first_name || "",
    last_name: adminInfo?.last_name || "",
    department: adminInfo?.department || "",
    admin_role_id:
      adminRoleOptions.find((admin) => admin.label == adminInfo?.role)?.value ||
      "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    if (!values.department) delete data.department;

    if (values.joined)
      data.joined = format(new Date(values.joined), "yyyy-MM-dd");

    const action =
      type === "editAdmin"
        ? updateAdmin(adminInfo?.id, data, dispatch)
        : addNewAdmin(data, dispatch);

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
        <AddAdminIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {type === "editAdmin" ? "Edit Admin" : "Add Admin"}
        </h2>
      </div>

      <Formik
        initialValues={
          type === "editAdmin" ? editAdminInitialValues : addAdminInitialValues
        }
        onSubmit={handleFormSubmit}
        validationSchema={
          type === "editAdmin" ? editAdminSchema : addAdminSchema
        }
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2"
          >
            <InputField
              fieldName="first_name"
              label="first name"
              value={values.first_name}
              error={errors.first_name}
              touched={touched.first_name}
              handleChange={handleChange}
              placeholder="Enter first name"
            />

            <InputField
              fieldName="last_name"
              label="last name"
              value={values.last_name}
              error={errors.last_name}
              touched={touched.last_name}
              handleChange={handleChange}
              placeholder="Enter last name"
            />

            {!adminInfo && (
              <InputField
                fieldName="email"
                label="email"
                value={values.email}
                error={errors.email}
                touched={touched.email}
                handleChange={handleChange}
                placeholder="Enter email"
                autoComplete="off"
              />
            )}

            <InputField
              fieldName="department"
              label="department"
              value={values.department}
              error={errors.department}
              touched={touched.department}
              handleChange={handleChange}
              placeholder="Enter department"
              isRequired={false}
            />

            <SelectField
              options={adminRoleOptions}
              fieldName="admin_role_id"
              label="admin role"
              value={values.admin_role_id}
              error={errors.admin_role_id}
              touched={touched.admin_role_id}
              setFieldValue={setFieldValue}
              placeholder="Select role"
            />

            {!adminInfo && (
              <>
                <DateField
                  fieldName="joined"
                  label="Join Date"
                  error={errors.joined}
                  touched={touched.joined}
                  date={values.joined}
                  setDate={(date) => setFieldValue("joined", date)}
                />

                <PasswordField
                  fieldName="account_password"
                  label="account password"
                  value={values.account_password}
                  error={errors.account_password}
                  touched={touched.account_password}
                  handleChange={handleChange}
                  placeholder="Enter password"
                />

                <PasswordField
                  fieldName="confirm_password"
                  label="confirm password"
                  value={values.confirm_password}
                  error={errors.confirm_password}
                  touched={touched.confirm_password}
                  handleChange={handleChange}
                  placeholder="Enter password again"
                />
              </>
            )}

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditAdminForm;
