import { AddExpenseIcon } from "@/components/icons/FinanceIcons";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import {
  addNewExpenseSubSubCategory,
  getAllCategories,
  getAllSubCategories,
  updateSubSubCategory,
} from "@/modules/finance-module/services/expensesCategoryService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import {
  arrayToSelectOptions,
  filterSubCategoriesBySelectedCategory,
} from "@/utils/arrayToSelectOptions";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseSubSubCategorySchema } from "@/modules/finance-module/validations/expensesValidationSchema";

const AddEditExpenseSubSubCategoryForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { expenseCategories, expenseSubCategories } = useSelector(
    (state) => state.expenseCategory
  );

  // Fetch Expense Categories
  useEffect(() => {
    !expenseCategories && getAllCategories(user.organisation_id, dispatch);
    !expenseSubCategories &&
      getAllSubCategories(user.organisation_id, dispatch);
  }, []);

  const { type: dialogType, props: expenseSubSubCategoryInfo } = useSelector(
    (state) => state.dialog
  );

  const expenseCategoryOptions = useMemo(
    () => arrayToSelectOptions(expenseCategories, "name", "id"),
    [expenseCategories]
  );

  function getExpenseCategoryIdFromSubCategoryId(subCategoryId) {
    if (!subCategoryId || !expenseCategories || !expenseSubCategories)
      return "";

    // Find Sub Category using ID
    const subCategory = expenseSubCategories.find(
      (sub) => sub.id === subCategoryId
    );

    const category = expenseCategories.find(
      (c) => c.id === subCategory.expenses_category_id
    );

    return category.id || "";
  }

  const initialValues = {
    name: expenseSubSubCategoryInfo?.name || "",
    expenses_category_id: getExpenseCategoryIdFromSubCategoryId(
      expenseSubSubCategoryInfo?.expenses_sub_category_id
    ),
    expenses_sub_category_id:
      expenseSubSubCategoryInfo?.expenses_sub_category_id || "",
    type: expenseSubSubCategoryInfo?.type
      ? expenseSubSubCategoryInfo?.type === "FIX"
        ? "2"
        : "1"
      : "",
    strategy: expenseSubSubCategoryInfo?.strategy || "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    const action =
      dialogType === "editExpenseSubSubCategory"
        ? updateSubSubCategory(
            user?.organisation_id,
            expenseSubSubCategoryInfo?.id,
            data,
            dispatch
          )
        : addNewExpenseSubSubCategory(user?.organisation_id, data, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddExpenseIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="mt-2 text-center text-xl font-medium">
          {dialogType === "editExpenseSubSubCategory"
            ? "Edit Expense Sub Sub Category"
            : "Add Expense Sub Sub Category"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={expenseSubSubCategorySchema}
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
              placeholder="Enter sub sub category name"
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
              placeholder="Select sub category"
            />

            <SelectField
              options={[
                { value: "1", label: "VARIABLE" },
                { value: "2", label: "FIX" },
              ]}
              fieldName="type"
              label="type"
              value={values.type}
              error={errors.type}
              touched={touched.type}
              setFieldValue={setFieldValue}
              placeholder="Select type"
            />

            <InputField
              fieldName="strategy"
              label="strategy"
              value={values.strategy}
              error={errors.strategy}
              touched={touched.strategy}
              handleChange={handleChange}
              placeholder="Enter strategy"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditExpenseSubSubCategoryForm;
