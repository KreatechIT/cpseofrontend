import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { hasFinanceProduct, hasHrProduct } from "@/utils/hasPermission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addNewMemberRole,
  getMemberRoleFormat,
  updateMemberRole,
} from "../../services/organisationService";
import PermissionsGroup from "@/modules/admin-module/components/admin-roles/PermissionGroup";
import { memberRoleSchema } from "../../validations/memberValidationSchema";

const AddEditMemberRole = () => {
  const dispatch = useDispatch();

  const { type: formType, props: memberRoleInfo } = useSelector(
    (state) => state.dialog
  );

  const { organisation, memberRoleFormat } = useSelector(
    (state) => state.organisation
  );

  // Fetch Organisations, members and roles
  useEffect(() => {
    if (!memberRoleFormat) getMemberRoleFormat(dispatch);
  }, []);

  const initialValues = {
    name: memberRoleInfo?.name || "",
    permissions: memberRoleInfo?.permissions
      ? { ...memberRoleInfo?.permissions }
      : memberRoleFormat,
  };

  if (memberRoleInfo?.permissions) {
    delete initialValues.permissions.group;
  }

  const handleFormSubmit = function (values, { setSubmitting }) {
    const action =
      formType === "editMemberRole"
        ? updateMemberRole(
            organisation?.id,
            memberRoleInfo?.id,
            values,
            dispatch
          )
        : addNewMemberRole(organisation?.id, values, dispatch);

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
        <h2 className="text-center text-xl font-medium">
          {formType === "editMemberRole" ? "Edit Role" : "Add Role"}
        </h2>
      </div>

      {memberRoleFormat && (
        <Formik
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
          validationSchema={memberRoleSchema}
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
            <form onSubmit={handleSubmit} className="my-1">
              <InputField
                fieldName="name"
                label="role name"
                value={values.name}
                error={errors.name}
                touched={touched.name}
                handleChange={handleChange}
                placeholder="Enter role name"
              />

              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-1 h-24 md:h-auto md:grid-cols-3 border-b">
                  <TabsTrigger value="general">
                    User Access Permissions
                  </TabsTrigger>
                  {hasFinanceProduct(organisation?.products) && (
                    <TabsTrigger value="finance">
                      Finance Permissions
                    </TabsTrigger>
                  )}
                  {hasHrProduct(organisation?.products) && (
                    <TabsTrigger value="hr">HR Permissions</TabsTrigger>
                  )}
                </TabsList>

                <div className="relative min-h-[350px] overflow-scroll mt-2.5">
                  {/* General Permissions */}
                  <TabsContent
                    value="general"
                    className="absolute inset-0 data-[state=active]:block hidden"
                  >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {Object.keys(values.permissions).map((permissionKey) => {
                        if (permissionKey.includes("Actions")) return null;
                        if (permissionKey.includes("finance")) return null;
                        if (permissionKey.includes("hr")) return null;

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
                  </TabsContent>

                  {/* Finance Permissions */}
                  {hasFinanceProduct(organisation?.products) && (
                    <TabsContent
                      value="finance"
                      className="absolute inset-0 data-[state=active]:block hidden"
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {Object.keys(values.permissions).map(
                          (permissionKey) => {
                            if (permissionKey.includes("Actions")) return null;
                            if (!permissionKey.includes("finance")) return null;

                            return (
                              <PermissionsGroup
                                key={permissionKey}
                                values={values}
                                permissionKey={permissionKey}
                                setFieldValue={setFieldValue}
                              />
                            );
                          }
                        )}
                      </div>
                    </TabsContent>
                  )}

                  {/* HR Permissions */}
                  {hasHrProduct(organisation?.products) && (
                    <TabsContent
                      value="hr"
                      className="absolute inset-0 data-[state=active]:block hidden"
                    >
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {Object.keys(values.permissions).map(
                          (permissionKey) => {
                            if (permissionKey.includes("Actions")) return null;
                            if (!permissionKey.includes("hr")) return null;

                            return (
                              <PermissionsGroup
                                key={permissionKey}
                                values={values}
                                permissionKey={permissionKey}
                                setFieldValue={setFieldValue}
                              />
                            );
                          }
                        )}
                      </div>
                    </TabsContent>
                  )}
                </div>
              </Tabs>

              {/* Submit Button */}
              <FormButtons isSubmitting={isSubmitting} />
            </form>
          )}
        </Formik>
      )}
    </section>
  );
};

export default AddEditMemberRole;
