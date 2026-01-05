import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import TextareaField from "@/components/form-fields/TextareaField";

import { getAllDepartments } from "@/modules/member-module/services/departmentService";

import { closeDialog } from "@/store/reducers/dialogSlice";

import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewVacancy } from "../../services/hiringVacancyService";
import { DocsIcon } from "@/components/icons/HrIcons";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { addVacancyValidationSchema } from "@/modules/hr-module/validations/vacancyValidationSchema";

const AddNewHiringForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.department);

  useEffect(() => {
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  // Format companies into select options format (label/value)
  const departmentOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  const initialValues = {
    date: new Date(),
    department_id: "",
    position: "",
    reason_for_hiring: "",
    number_of_vacancies: 0,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
    };

    addNewVacancy(user?.organisation_id, data, dispatch)
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
        <DocsIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium mt-2">
          New Hiring Form
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addVacancyValidationSchema}
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
              fieldName="date"
              label="date"
              error={errors.date}
              touched={touched.date}
              date={values.date}
              setDate={(date) => setFieldValue("date", date)}
            />

            <SelectField
              options={departmentOptions}
              fieldName="department_id"
              label="Department"
              value={values.department_id}
              error={errors.department_id}
              touched={touched.department_id}
              setFieldValue={setFieldValue}
              placeholder="Select department"
            />

            <div className="col-span-2 space-y-3">
              <InputField
                fieldName="position"
                label="position"
                value={values.position}
                error={errors.position}
                touched={touched.position}
                handleChange={handleChange}
                placeholder="Enter position name"
                isRequired={true}
              />

              <TextareaField
                fieldName="reason_for_hiring"
                label="reason for hiring"
                value={values.reason_for_hiring}
                error={errors.reason_for_hiring}
                touched={touched.reason_for_hiring}
                handleChange={handleChange}
                placeholder="Enter reason for hiring"
                isRequired={false}
              />

              <InputField
                fieldName="number_of_vacancies"
                label="number of vacancies"
                value={values.number_of_vacancies}
                error={errors.number_of_vacancies}
                touched={touched.number_of_vacancies}
                handleChange={handleChange}
                placeholder="Enter number of vacancies"
                type="number"
                isRequired={true}
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

export default AddNewHiringForm;
