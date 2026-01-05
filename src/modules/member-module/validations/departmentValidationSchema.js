import * as Yup from "yup";

const addEditDepartmentSchema = Yup.object().shape({
  name: Yup.string().required("Department name is required"),
  companies: Yup.array()
    .min(1, "At least one company must be selected")
    .of(
      Yup.object().shape({
        label: Yup.string().required(),
        value: Yup.string().required(),
      })
    ),
});

const addEditSubDepartmentSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  department_id: Yup.string().required("Department is required"),
});

export { addEditDepartmentSchema, addEditSubDepartmentSchema };
