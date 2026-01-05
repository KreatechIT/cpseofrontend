import { AddBankIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";
import FileUplaodField from "@/components/form-fields/FileUploadField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { Label } from "@/components/ui/label";
import {
  getAllCategories,
  getAllSubCategories,
  getAllSubSubCategories,
} from "@/modules/finance-module/services/expensesCategoryService";
import {
  addNewCreditTransaction,
  addNewDebitTransaction,
} from "@/modules/finance-module/services/transactionService";
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
  filterSubDepartmentsBySelectedDept,
  filterSubSubCategoriesBySelectedSubCategory,
} from "@/utils/arrayToSelectOptions";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDebitCreditSchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const AddDebitCreditForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { type: transactionType } = useSelector((state) => state.dialog);
  const { companies } = useSelector((state) => state.company);
  const { departments, subDepartments } = useSelector(
    (state) => state.department
  );
  const { expenseCategories, expenseSubCategories, expenseSubSubCategories } =
    useSelector((state) => state.expenseCategory);

  const { getMyActiveBanks } = useBanks();

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

  // Format companies into select options format (label/value)
  const companyOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const myBanks = getMyActiveBanks();

  const bankOptions = useMemo(
    () =>
      myBanks.map((bank) => {
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
    category: transactionType === "addCreditTransaction" ? 1 : 2, // Credit 1, Debit 2
    transaction_date: new Date(),
    amount: 0,
    company_id: "",
    department_id: "",
    sub_department_id: "",

    expenses_category_id: "",
    expenses_sub_category_id: "",
    expenses_sub_sub_category_id: "",

    bank_id: "",
    description: "",
    receipt: null,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      transaction_date: format(values.transaction_date, "yyyy-MM-dd"),
    };

    const action =
      transactionType === "addCreditTransaction"
        ? addNewCreditTransaction(user?.organisation_id, data, dispatch)
        : addNewDebitTransaction(user?.organisation_id, data, dispatch);

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
        <AddBankIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">
          {transactionType === "addCreditTransaction"
            ? "New Credit Transaction"
            : "New Debit Transaction"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addDebitCreditSchema}
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2 -mt-4"
          >
            <DateField
              fieldName="transaction_date"
              label="Date"
              error={errors.transaction_date}
              touched={touched.transaction_date}
              date={values.transaction_date}
              setDate={(date) => setFieldValue("transaction_date", date)}
            />

            <CurrencyField
              fieldName="amount"
              label="amount"
              value={values.amount}
              error={errors.amount}
              touched={touched.amount}
              setFieldValue={setFieldValue}
            />

            <SelectField
              options={companyOptions}
              fieldName="company_id"
              label="Company"
              value={values.company_id}
              error={errors.company_id}
              touched={touched.company_id}
              setFieldValue={setFieldValue}
              placeholder="Select company"
              onValueChange={(value) => {
                setFieldValue("company_id", value);
                setFieldValue("department_id", "");
                setFieldValue("sub_department_id", "");
              }}
            />

            <SelectField
              options={filterDepartmentsBySelectedCompany(
                values.company_id,
                departments
              )}
              fieldName="department_id"
              label="Department"
              value={values.department_id}
              error={errors.department_id}
              touched={touched.department_id}
              setFieldValue={setFieldValue}
              placeholder="Select department"
              isRequired={false}
              onValueChange={(value) => {
                setFieldValue("sub_department_id", "");
                setFieldValue("department_id", value);
              }}
            />

            <SelectField
              options={filterSubDepartmentsBySelectedDept(
                values.department_id,
                subDepartments
              )}
              fieldName="sub_department_id"
              label="Sub Department"
              value={values.sub_department_id}
              error={errors.sub_department_id}
              touched={touched.sub_department_id}
              setFieldValue={setFieldValue}
              placeholder="Select sub department"
              isRequired={false}
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
              isRequired={false}
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
              isRequired={false}
            />

            <InputField
              fieldName="description"
              label="description"
              value={values.description}
              error={errors.description}
              touched={touched.description}
              handleChange={handleChange}
              placeholder="Enter description"
              isRequired={true}
            />

            <div className="col-span-2">
              <Label className="mb-1 gap-0.5 text-xs uppercase">Receipt</Label>
              <FileUplaodField
                onFileChange={(file) => {
                  setFieldValue("receipt", file);
                }}
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

export default AddDebitCreditForm;
