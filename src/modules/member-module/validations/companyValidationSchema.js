import * as Yup from "yup";

export const addEditCompanySchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
});
