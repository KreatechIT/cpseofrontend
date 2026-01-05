import { FinanceTransactionIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { approveClaimByFinance } from "@/modules/finance-module/services/claimService";
import {
  getAllCategories,
  getAllSubCategories,
  getAllSubSubCategories,
} from "@/modules/finance-module/services/expensesCategoryService";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import {
  getAllDepartments,
  getAllSubDepartments,
} from "@/modules/member-module/services/departmentService";
import useBanks from "@/modules/finance-module/hooks/useBanks";

import { closeDialog } from "@/store/reducers/dialogSlice";
import {
  arrayToSelectOptions,
  filterDepartmentsBySelectedCompany,
  filterSubCategoriesBySelectedCategory,
  filterSubSubCategoriesBySelectedSubCategory,
} from "@/utils/arrayToSelectOptions";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { approveClaimByFinanceSchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const ApproveEmployeeClaimByFinanceForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { getMyActiveBanks } = useBanks();
  const claimInfo = useSelector((state) => state.dialog.props);
  const { companies } = useSelector((state) => state.company);
  const { departments, subDepartments } = useSelector(
    (state) => state.department
  );
  const { expenseCategories, expenseSubCategories, expenseSubSubCategories } =
    useSelector((state) => state.expenseCategory);

  useEffect(() => {
    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
    if (!subDepartments) getAllSubDepartments(user?.organisation_id, dispatch);

    if (!expenseCategories) getAllCategories(user.organisation_id, dispatch);
    if (!expenseSubCategories)
      getAllSubCategories(user.organisation_id, dispatch);
    if (!expenseSubSubCategories)
      getAllSubSubCategories(user.organisation_id, dispatch);
  }, []);

  const myBanks = getMyActiveBanks();

  const bankOptions = useMemo(
    () =>
      myBanks?.map((bank) => {
        return {
          label: `${bank.bank_code} (Bank No: ${bank.bank_number})`,
          value: bank.id,
        };
      }),
    [myBanks]
  );

  const expenseCategoryOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );

  const initialValues = {
    department_id: "",
    expenses_category_id: "",
    expenses_sub_category_id: "",
    expenses_sub_sub_category_id: "",
    bank_id: "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    approveClaimByFinance(user?.organisation_id, claimInfo.id, values, dispatch)
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
        <FinanceTransactionIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">Finance Claim Form</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={approveClaimByFinanceSchema}
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2 -mt-2"
          >
            <DateField
              fieldName="claim_date"
              label="Date"
              error={errors?.claim_date}
              touched={touched?.claim_date}
              date={claimInfo.claim_date}
              setDate={(date) => setFieldValue("claim_date", date)}
              isRequired={false}
              disabled={true}
            />

            <InputField
              fieldName="claimed_by"
              label="claim by"
              value={claimInfo?.claimed_by}
              error={errors?.claimed_by}
              touched={touched?.claimed_by}
              handleChange={handleChange}
              isRequired={false}
              disabled
            />

            <CurrencyField
              fieldName="claim_amount"
              label="claim amount"
              value={claimInfo?.claim_amount}
              error={errors?.claim_amount}
              touched={touched?.claim_amount}
              setFieldValue={setFieldValue}
              isRequired={false}
              disabled={true}
            />

            <InputField
              fieldName="company_id"
              label="Company"
              value={claimInfo?.company}
              error={errors?.company_id}
              touched={touched?.company_id}
              handleChange={handleChange}
              isRequired={false}
              disabled
            />

            <SelectField
              options={filterDepartmentsBySelectedCompany(
                companies.find((company) => company.name === claimInfo.company)
                  .id,
                departments
              )}
              fieldName="department_id"
              label="Department"
              value={values.department_id}
              error={errors.department_id}
              touched={touched.department_id}
              setFieldValue={setFieldValue}
              placeholder="Select department"
            />

            <SelectField
              options={bankOptions}
              fieldName="bank_id"
              label="Bank"
              value={values.bank_id}
              error={errors.bank_id}
              touched={touched.bank_id}
              setFieldValue={setFieldValue}
              placeholder="Select bank"
            />

            <SelectField
              options={expenseCategoryOptions}
              fieldName="expenses_category_id"
              label="Transaction Category"
              value={values.expenses_category_id}
              error={errors.expenses_category_id}
              touched={touched.expenses_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select transaction category"
              onValueChange={(value) => {
                setFieldValue("expenses_category_id", value);
                setFieldValue("expenses_sub_category_id", "");
                setFieldValue("expenses_sub_sub_category_id", "");
              }}
            />

            <SelectField
              options={filterSubCategoriesBySelectedCategory(
                values.expenses_category_id,
                expenseSubCategories
              )}
              fieldName="expenses_sub_category_id"
              label="Transaction Sub Category"
              value={values.expenses_sub_category_id}
              error={errors.expenses_sub_category_id}
              touched={touched.expenses_sub_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select transaction sub category"
              onValueChange={(value) => {
                setFieldValue("expenses_sub_sub_category_id", "");
                setFieldValue("expenses_sub_category_id", value);
              }}
            />

            <div className="col-span-2">
              <SelectField
                options={filterSubSubCategoriesBySelectedSubCategory(
                  values.expenses_sub_category_id,
                  expenseSubSubCategories
                )}
                fieldName="expenses_sub_sub_category_id"
                label="Transaction Sub Sub Category"
                value={values.expenses_sub_sub_category_id}
                error={errors.expenses_sub_sub_category_id}
                touched={touched.expenses_sub_sub_category_id}
                setFieldValue={setFieldValue}
                placeholder="Select sub sub category"
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

export default ApproveEmployeeClaimByFinanceForm;
