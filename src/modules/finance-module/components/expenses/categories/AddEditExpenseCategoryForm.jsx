import { AddExpenseIcon } from "@/components/icons/FinanceIcons";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import {
  addNewExpenseCategory,
  updateCategory,
} from "@/modules/finance-module/services/expensesCategoryService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { expenseCategorySchema } from "@/modules/finance-module/validations/expensesValidationSchema";

const AddEditExpenseCategoryForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { type: dialogType, props: expenseCategoryInfo } = useSelector(
    (state) => state.dialog
  );

  const initialValues = {
    name: expenseCategoryInfo?.name || "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };

    const action =
      dialogType === "editExpenseCategory"
        ? updateCategory(
            user?.organisation_id,
            expenseCategoryInfo?.id,
            data,
            dispatch
          )
        : addNewExpenseCategory(user?.organisation_id, data, dispatch);

    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddExpenseIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="mt-2 text-center text-xl font-medium">
          {dialogType === "editExpenseCategory"
            ? "Edit Expense Category"
            : "Add Expense Category"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={expenseCategorySchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
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
              placeholder="Enter category name"
            />

            {/* Submit Button */}
            <FormButtons isSubmitting={isSubmitting} />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditExpenseCategoryForm;
