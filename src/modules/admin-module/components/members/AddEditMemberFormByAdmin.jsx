import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMember,
  getAllMemberRoles,
  updateMember,
} from "../../services/organisationByAdminService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import { AddMemberIcon } from "@/components/icons/Icons";
import InputField from "@/components/form-fields/InputField";
import PasswordField from "@/components/form-fields/PasswordField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { SelectField } from "@/components/form-fields/SelectField";
import {
  addMemberSchema,
  editMemberSchema,
} from "../../validations/organisationByAdminValidationSchema";

const AddEditMemberFormByAdmin = () => {
  const dispatch = useDispatch();
  const {
    type: formType,
    props: { organisation_id, memberInfo },
  } = useSelector((state) => state.dialog);

  const memberRoles = useSelector(
    (state) => state.organisationsByAdmin?.memberRoles
  );

  useEffect(() => {
    if (!memberRoles[organisation_id])
      getAllMemberRoles(organisation_id, dispatch);
  }, []);

  // Format roles into select options format (label/value)
  const memberRoleOptions = useMemo(
    () => arrayToSelectOptions(memberRoles[organisation_id], "name", "id"),
    [memberRoles, organisation_id]
  );

  const addMemberInitialValues = {
    first_name: "",
    last_name: "",
    email: "",
    member_role_id: "",
    account_password: "",
    confirm_password: "",
  };

  const editMemberInitialValues = {
    first_name: memberInfo?.first_name || "",
    last_name: memberInfo?.last_name || "",
    member_role_id:
      memberRoleOptions.find((member) => member.label == memberInfo?.role)
        ?.value || "",
    company_ids: formType === "editMemberByAdmin" ? memberInfo.company_ids : [],
    sub_department_ids:
      formType === "editMemberByAdmin" ? memberInfo.sub_department_ids : [],
  };

  const handleFormSubmit = function (values, { setSubmitting, setErrors }) {
    const data = { ...values };

    const action =
      formType === "editMemberByAdmin"
        ? updateMember(organisation_id, memberInfo?.id, data, dispatch)
        : addNewMember(organisation_id, data, dispatch);

    action
      .then(() => {
        dispatch(closeDialog());
      })
      .catch((error) => {
        setSubmitting(false);

        const rawDetail = error?.response?.data?.detail;

        try {
          const parsed =
            rawDetail &&
            JSON.parse(
              rawDetail.replace(/'/g, '"') // convert single quotes to double quotes
            );

          // If parsed object has an 'email' error, set it in Formik
          if (parsed?.email?.length > 0) {
            setErrors({ email: parsed.email[0] });
          } else {
            setErrors({ general: "An error occurred." });
          }
        } catch {
          //
        }
      });
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddMemberIcon className="mx-auto size-12 mb-2 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {formType === "editMemberByAdmin" ? "Edit Member" : "Add Member"}
        </h2>
      </div>

      <Formik
        initialValues={
          formType === "editMemberByAdmin"
            ? editMemberInitialValues
            : addMemberInitialValues
        }
        onSubmit={handleFormSubmit}
        validationSchema={
          formType === "editMemberByAdmin" ? editMemberSchema : addMemberSchema
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

            {formType === "addMemberByAdmin" && (
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

            <div
              className={formType === "editMemberByAdmin" ? "col-span-2" : ""}
            >
              <SelectField
                options={memberRoleOptions}
                fieldName="member_role_id"
                label="member role"
                value={values.member_role_id}
                error={errors.member_role_id}
                touched={touched.member_role_id}
                setFieldValue={setFieldValue}
                placeholder="Select role"
              />
            </div>

            {formType === "addMemberByAdmin" && (
              <>
                <PasswordField
                  fieldName="account_password"
                  label="account password"
                  value={values.account_password}
                  error={errors.account_password}
                  touched={touched.account_password}
                  handleChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="off"
                />

                <PasswordField
                  fieldName="confirm_password"
                  label="confirm password"
                  value={values.confirm_password}
                  error={errors.confirm_password}
                  touched={touched.confirm_password}
                  handleChange={handleChange}
                  placeholder="Enter password again"
                  autoComplete="off"
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

export default AddEditMemberFormByAdmin;
