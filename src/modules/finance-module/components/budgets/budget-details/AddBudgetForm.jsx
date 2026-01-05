import { AddBudgetIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { MonthField } from "@/components/form-fields/MonthField";
import { SelectField } from "@/components/form-fields/SelectField";
import TextareaField from "@/components/form-fields/TextareaField";
import { Label } from "@/components/ui/label";
import { addNewBudget } from "@/modules/finance-module/services/budgetService";
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

import { closeDialog } from "@/store/reducers/dialogSlice";
import {
  arrayToSelectOptions,
  filterDepartmentsBySelectedCompany,
  filterSubCategoriesBySelectedCategory,
  filterSubDepartmentsBySelectedDept,
  filterSubSubCategoriesBySelectedSubCategory,
} from "@/utils/arrayToSelectOptions";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBudgetSchema } from "@/modules/finance-module/validations/budgetValidationSchema";

const AddBudgetForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
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

  // Format companies into select options format (label/value)
  const companyOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const expenseCategoryOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );

  const initialValues = {
    forecast_month: format(new Date(), "yyyy-MM"),
    company_id: "",
    department_id: "",
    sub_department_id: "",
    expenses_category_id: "",
    expenses_sub_category_id: "",
    expenses_sub_sub_category_id: "",
    description: "",
    quantity: 0,
    forecast_cost: 0,
    goal: "",
    execution_period_start: new Date(),
    execution_period_end: new Date(),
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      forecast_month: format(values.forecast_month, "yyyy-MM-dd"),
      execution_period_start: format(
        values.execution_period_start,
        "yyyy-MM-dd"
      ),
      execution_period_end: format(values.execution_period_end, "yyyy-MM-dd"),
    };

    if (!values.expenses_sub_sub_category_id)
      delete data.expenses_sub_sub_category_id;

    addNewBudget(user?.organisation_id, data, dispatch)
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
        <AddBudgetIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium mt-2">Add Budget</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addBudgetSchema}
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
            <div>
              <Label
                htmlFor="forecast_month"
                className="gap-0.5 text-xs uppercase"
              >
                FORECAST MONTH
                <span className={cn("text-destructive/75 text-sm")}>*</span>
              </Label>

              <MonthField
                date={values.forecast_month}
                setDate={(date) => setFieldValue("forecast_month", date)}
              />

              {errors.forecast_month && touched.forecast_month && (
                <p className="text-destructive mt-1 text-xs">
                  {errors.forecast_month}
                </p>
              )}
            </div>

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
            />

            <SelectField
              options={expenseCategoryOptions}
              fieldName="expenses_category_id"
              label="Expense Category"
              value={values.expenses_category_id}
              error={errors.expenses_category_id}
              touched={touched.expenses_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select expense category"
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
              label="Expense Sub Category"
              value={values.expenses_sub_category_id}
              error={errors.expenses_sub_category_id}
              touched={touched.expenses_sub_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select expense sub category"
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
              label="Expense Sub Sub Category"
              value={values.expenses_sub_sub_category_id}
              error={errors.expenses_sub_sub_category_id}
              touched={touched.expenses_sub_sub_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select sub sub category"
              isRequired={false}
            />

            <InputField
              fieldName="quantity"
              label="quantity"
              value={values.quantity}
              error={errors.quantity}
              touched={touched.quantity}
              handleChange={handleChange}
              placeholder="Enter quantity"
              type="number"
              step="0.1"
              isRequired={true}
            />

            <div className="col-span-2 space-y-3">
              <CurrencyField
                fieldName="forecast_cost"
                label="forecast cost"
                value={values.forecast_cost}
                error={errors.forecast_cost}
                touched={touched.forecast_cost}
                setFieldValue={setFieldValue}
                isRequired={false}
              />

              <TextareaField
                fieldName="goal"
                label="goal"
                value={values.goal}
                error={errors.goal}
                touched={touched.goal}
                handleChange={handleChange}
                placeholder="Enter goal"
                isRequired={false}
              />

              <TextareaField
                fieldName="description"
                label="description"
                value={values.description}
                error={errors.description}
                touched={touched.description}
                handleChange={handleChange}
                placeholder="Enter description"
                isRequired={false}
              />
            </div>

            <DateField
              fieldName="execution_period_start"
              label="execution period start"
              error={errors.execution_period_start}
              touched={touched.execution_period_start}
              date={values.execution_period_start}
              setDate={(date) => setFieldValue("execution_period_start", date)}
            />

            <DateField
              fieldName="execution_period_end"
              label="execution period end"
              error={errors.execution_period_end}
              touched={touched.execution_period_end}
              date={values.execution_period_end}
              setDate={(date) => setFieldValue("execution_period_end", date)}
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddBudgetForm;
