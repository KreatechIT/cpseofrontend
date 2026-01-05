import {
  arrayToSelectOptions,
  filterDepartmentsBySelectedCompanies,
  filterSubDepartmentsBySelectedDepartments,
} from "@/utils/arrayToSelectOptions";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewMember,
  getAllMemberRoles,
  updateMember,
} from "../../services/organisationService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { AddMemberIcon } from "@/components/icons/Icons";

import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import PasswordField from "@/components/form-fields/PasswordField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import { getAllCompanies } from "../../services/companyService";
import {
  getAllDepartments,
  getAllSubDepartments,
} from "../../services/departmentService";
import {
  addMemberSchema,
  editMemberSchema,
} from "../../validations/memberValidationSchema";

const AddEditMemberForm = () => {
  const dispatch = useDispatch();
  const { type: formType, props: memberInfo } = useSelector(
    (state) => state.dialog
  );
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);
  const { departments, subDepartments } = useSelector(
    (state) => state.department
  );
  const { memberRoles } = useSelector((state) => state.organisation);

  // Fetch member roles, companies, departments and sub-departments
  useEffect(() => {
    !memberRoles && getAllMemberRoles(user?.organisation_id, dispatch);

    !companies && getAllCompanies(user.organisation_id, dispatch);
    !departments && getAllDepartments(user.organisation_id, dispatch);
    !subDepartments && getAllSubDepartments(user.organisation_id, dispatch);
  }, []);

  // Format roles into select options format (label/value)
  const memberRoleOptions = useMemo(
    () => arrayToSelectOptions(memberRoles, "name", "id"),
    [memberRoles]
  );

  // Format companies into select options format (label/value)
  const companiesOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  // Format member's assigned companies into select options format.
  function getMemberCompanies() {
    if (!companies) return [];

    const filteredCompanies = companies.filter((company) =>
      memberInfo?.company_ids?.includes(company.id)
    );

    const companiesOptions = filteredCompanies.map((company) => ({
      value: company.id,
      label: company.name,
    }));

    return companiesOptions;
  }

  // Format member's assigned departments into select options format.
  // Note: Backend doesn't store or return deparments. So first get departments from sub departments, then convert them into select options format.
  function getMemberDepartments() {
    if (!departments) return [];

    const filteredSubDepartments = subDepartments.filter((subDept) =>
      memberInfo?.sub_department_ids?.includes(subDept.id)
    );

    const departmentIds = filteredSubDepartments.map(
      (sub) => sub.department_id
    );

    const departmentsOptions = departments
      .filter((dept) => departmentIds.includes(dept.id))
      .map((dept) => ({
        value: dept.id,
        label: dept.name,
      }));
    return departmentsOptions;
  }

  // Format member's assigned sub-departments into select options format.
  function getMemberSubDepartments() {
    if (!subDepartments) return [];

    const filteredSubDepartments = subDepartments.filter((subDept) =>
      memberInfo?.sub_department_ids?.includes(subDept.id)
    );

    const subDepartmentOptions = filteredSubDepartments.map((subDept) => ({
      value: subDept.id,
      label: subDept.name,
    }));

    return subDepartmentOptions;
  }

  const addMemberInitialValues = {
    first_name: "",
    last_name: "",
    email: "",
    member_role_id: "",
    companies: [],
    departments: [],
    sub_departments: [],
    account_password: "",
    confirm_password: "",
  };

  const editMemberInitialValues = {
    first_name: memberInfo?.first_name || "",
    last_name: memberInfo?.last_name || "",
    member_role_id:
      memberRoleOptions.find((member) => member.label == memberInfo?.role)
        ?.value || "",
    companies: formType === "editMember" ? getMemberCompanies() : [],
    departments: formType === "editMember" ? getMemberDepartments() : [],
    sub_departments: formType === "editMember" ? getMemberSubDepartments() : [],
  };

  const handleFormSubmit = function (values, { setSubmitting, setErrors }) {
    const data = { ...values };

    data.company_ids = [];
    values.companies.map((company) => data.company_ids.push(company.value));

    data.department_ids = [];
    values.departments.map((dept) => data.department_ids.push(dept.value));

    data.sub_department_ids = [];
    values.sub_departments.map((subDept) =>
      data.sub_department_ids.push(subDept.value)
    );

    const action =
      formType === "editMember"
        ? updateMember(user?.organisation_id, memberInfo?.id, data, dispatch)
        : addNewMember(user?.organisation_id, data, dispatch);

    action
      .then(() => {
        dispatch(closeDialog());
      })
      .catch((error) => {
        setSubmitting(false);

        const rawDetail = error?.response?.data?.detail;

        try {
          // Convert Python-style dict string to JSON
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
        <AddMemberIcon className="mx-auto size-12 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {formType === "editMember" ? "Edit Member" : "Add Member"}
        </h2>
      </div>

      <Formik
        initialValues={
          formType === "editMember"
            ? editMemberInitialValues
            : addMemberInitialValues
        }
        onSubmit={handleFormSubmit}
        validationSchema={
          formType === "editMember" ? editMemberSchema : addMemberSchema
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2 px-2.5"
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

            {formType === "addMember" && (
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

            <div className={formType === "editMember" ? "col-span-2" : ""}>
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

            {user?.role === "MEMBER" && (
              <div className="col-span-2 space-y-3">
                <MultiSelectField
                  fieldName="companies"
                  label="Companies"
                  value={values.companies}
                  error={errors.companies}
                  defaultOptions={values.companies}
                  touched={touched.companies}
                  placeholder="Select companies"
                  options={companiesOptions}
                  handleChange={(selected) =>
                    setFieldValue("companies", selected)
                  }
                  isRequired={false}
                />

                <MultiSelectField
                  fieldName="departments"
                  label="departments"
                  value={values.departments}
                  defaultOptions={values.departments}
                  error={errors.departments}
                  touched={touched.departments}
                  placeholder="Select departments"
                  options={filterDepartmentsBySelectedCompanies(
                    values.companies,
                    departments
                  )}
                  handleChange={(selected) =>
                    setFieldValue("departments", selected)
                  }
                  isRequired={false}
                />

                <MultiSelectField
                  fieldName="sub_departments"
                  label="sub departments"
                  value={values.sub_departments}
                  error={errors.sub_departments}
                  touched={touched.sub_departments}
                  defaultOptions={values.sub_departments}
                  placeholder="Select sub departments"
                  options={filterSubDepartmentsBySelectedDepartments(
                    values.departments,
                    subDepartments
                  )}
                  handleChange={(selected) =>
                    setFieldValue("sub_departments", selected)
                  }
                  isRequired={false}
                />
              </div>
            )}

            {formType === "addMember" && (
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

export default AddEditMemberForm;
