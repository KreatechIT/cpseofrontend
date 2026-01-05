import { AddExpenseIcon } from "@/components/icons/FinanceIcons";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import {
  addNewExpenseSubCategory,
  getAllCategories,
  updateSubCategory,
} from "@/modules/finance-module/services/expensesCategoryService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseSubCategorySchema } from "@/modules/finance-module/validations/expensesValidationSchema";

const AddEditExpenseSubCategoryForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenseCategories } = useSelector((state) => state.expenseCategory);

  // Fetch Expense Categories
  useEffect(() => {
    !expenseCategories && getAllCategories(user.organisation_id, dispatch);
  }, []);

  const { type: dialogType, props: expenseSubCategoryInfo } = useSelector(
    (state) => state.dialog
  );

  const expenseCategoryOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );

  const initialValues = {
    name: expenseSubCategoryInfo?.name || "",
    expenses_category_id: expenseSubCategoryInfo?.expenses_category_id || "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    const action =
      dialogType === "editExpenseSubCategory"
        ? updateSubCategory(
            user?.organisation_id,
            expenseSubCategoryInfo?.id,
            data,
            dispatch
          )
        : addNewExpenseSubCategory(user?.organisation_id, data, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddExpenseIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="mt-2 text-center text-xl font-medium">
          {dialogType === "editExpenseSubCategory"
            ? "Edit Expense Sub Category"
            : "Add Expense Sub Category"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={expenseSubCategorySchema}
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
              placeholder="Enter sub category name"
            />

            <SelectField
              options={expenseCategoryOptions}
              fieldName="expenses_category_id"
              label="Expense Category"
              value={values.expenses_category_id}
              error={errors.expenses_category_id}
              touched={touched.expenses_category_id}
              setFieldValue={setFieldValue}
              placeholder="Select category"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditExpenseSubCategoryForm;
