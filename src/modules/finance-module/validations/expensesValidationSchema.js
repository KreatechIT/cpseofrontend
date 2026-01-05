import * as Yup from "yup";

const expenseCategorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
});

const expenseSubCategorySchema = Yup.object().shape({
  name: Yup.string().required("Sub category name is required"),
  expenses_category_id: Yup.string().required("Expense category is required"),
});

const expenseSubSubCategorySchema = Yup.object().shape({
  name: Yup.string().required("Sub sub category name is required"),
  expenses_category_id: Yup.string().required("Expense category is required"),
  expenses_sub_category_id: Yup.string().required(
    "Expense sub category is required"
  ),
  type: Yup.string().required("Type is required"),
  strategy: Yup.string().required("Strategy is required"),
});

export {
  expenseCategorySchema,
  expenseSubCategorySchema,
  expenseSubSubCategorySchema,
};
