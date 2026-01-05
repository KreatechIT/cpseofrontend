import { useDispatch, useSelector } from "react-redux";
import {
  addNewAdminRole,
  getAdminRoleFormat,
  getAllAdminRoles,
  updateAdminRole,
} from "../../services/adminService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";

import { FormButtons } from "@/components/form-fields/FormButtons";
import { useEffect } from "react";
import { adminRoleSchema } from "../../validations/adminValidationSchema";
import PermissionsGroup from "./PermissionGroup";

const AddEditAdminRole = () => {
  const dispatch = useDispatch();

  const { type, props: adminRoleInfo } = useSelector((state) => state.dialog);

  const { adminRoles, adminRoleFormat } = useSelector((state) => state.admin);

  // Fetch Organisations, admins and roles
  useEffect(() => {
    if (!adminRoles) getAllAdminRoles(dispatch);
    if (!adminRoleFormat) getAdminRoleFormat(dispatch);
  }, []);

  const initialValues = {
    name: adminRoleInfo?.name || "",
    permissions: adminRoleInfo?.permissions
      ? { ...adminRoleInfo.permissions }
      : adminRoleFormat,
  };

  if (adminRoleInfo?.permissions) {
    delete initialValues.permissions.group;
  }

  const handleFormSubmit = function (values, { setSubmitting }) {
    const action =
      type === "editAdminRole"
        ? updateAdminRole(adminRoleInfo?.id, values, dispatch)
        : addNewAdminRole(values, dispatch);

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
      <div className="-mt-6 mb-4">
        {/* <AddAdminIcon className="drop-shadow-md mx-auto size-20" /> */}
        <h2 className="text-center text-xl font-medium">
          {type === "editAdminRole" ? "Edit Admin Role" : "Add Admin Role"}
        </h2>
      </div>

      {adminRoleFormat && (
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={adminRoleSchema}
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
            <form onSubmit={handleSubmit} className="my-1 space-y-6">
              <InputField
                fieldName="name"
                label="role name"
                value={values.name}
                error={errors.name}
                touched={touched.name}
                handleChange={handleChange}
                placeholder="Enter role name"
              />

              {/* Permissions */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {Object.keys(values?.permissions)?.map((permissionKey) => {
                  if (permissionKey.includes("Actions")) return null;

                  return (
                    <PermissionsGroup
                      key={permissionKey}
                      values={values}
                      permissionKey={permissionKey}
                      setFieldValue={setFieldValue}
                    />
                  );
                })}
              </div>

              {/* Submit Button */}
              <FormButtons isSubmitting={isSubmitting} />
            </form>
          )}
        </Formik>
      )}
    </section>
  );
};

export default AddEditAdminRole;
