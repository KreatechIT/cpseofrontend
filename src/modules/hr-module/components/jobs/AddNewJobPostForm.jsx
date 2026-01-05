import DateField from "@/components/form-fields/DateField";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AddJobPostingIcon } from "@/components/icons/HrIcons";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { addNewJobPost } from "../../services/jobsService";
import RichTextEditor from "@/components/form-fields/RichTextEditor";
import { JOB_TYPE_CHOICES, SALARY_CHOICES } from "../../lib/hrEnums";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, SaveIcon, XIcon } from "lucide-react";
import { addNewJobPostSchema } from "../../validations/jobsValidationSchema";

const AddNewJobPostForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);
  const [submitAction, setSubmitAction] = useState("publish");

  useEffect(() => {
    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
    if (!departments) getAllDepartments(user?.organisation_id, dispatch);
  }, []);

  // Format departments into select options format (label/value)
  const companyOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const departmentOptions = useMemo(
    () => arrayToSelectOptions(departments, "name", "id"),
    [departments]
  );

  const initialValues = {
    job_title: "",
    company_id: "",
    department_id: "",
    job_type: "",
    location: "",
    vacancy: 1,
    salary: "",
    application_deadline: new Date(),
    position: "",
    job_requirement: "",
    job_description: "",
    status: 4,
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    const data = {
      ...values,
      status: submitAction === "publish" ? 1 : 4,
      application_deadline: format(values.application_deadline, "yyyy-MM-dd"),
    };

    if (!data.salary) delete data.salary;
    if (!data.position) delete data.position;

    addNewJobPost(user?.organisation_id, data, dispatch)
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
        <AddJobPostingIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium mt-2">
          Add Job Posting
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addNewJobPostSchema}
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
            {/* Row 1: Job Title and Company */}
            <InputField
              fieldName="job_title"
              label="job title"
              value={values.job_title}
              error={errors.job_title}
              touched={touched.job_title}
              handleChange={handleChange}
              placeholder="Enter job title"
              isRequired={true}
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
            />

            {/* Row 2: Department and Job Type */}
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

            <SelectField
              options={JOB_TYPE_CHOICES}
              fieldName="job_type"
              label="Job Type"
              value={values.job_type}
              error={errors.job_type}
              touched={touched.job_type}
              setFieldValue={setFieldValue}
              placeholder="Select job type"
            />

            {/* Row 3: Location and Vacancy */}
            <InputField
              fieldName="location"
              label="location"
              value={values.location}
              error={errors.location}
              touched={touched.location}
              handleChange={handleChange}
              placeholder="Enter location (optional)"
              isRequired={false}
            />

            <InputField
              fieldName="vacancy"
              label="number of vacancies"
              value={values.vacancy}
              error={errors.vacancy}
              touched={touched.vacancy}
              handleChange={handleChange}
              placeholder="Enter number of vacancies"
              type="number"
              isRequired={true}
            />

            {/* Row 4: Salary and Application Deadline */}
            <SelectField
              options={SALARY_CHOICES}
              fieldName="salary"
              label="Salary Range"
              value={values.salary}
              error={errors.salary}
              touched={touched.salary}
              setFieldValue={setFieldValue}
              placeholder="Select salary range"
              isRequired={false}
            />

            <DateField
              fieldName="application_deadline"
              label="application deadline"
              error={errors.application_deadline}
              touched={touched.application_deadline}
              date={values.application_deadline}
              setDate={(date) => setFieldValue("application_deadline", date)}
              isRequired={false}
            />

            {/* Row 5: Position (full width) */}
            <div className="md:col-span-2">
              <InputField
                fieldName="position"
                label="position"
                value={values.position}
                error={errors.position}
                touched={touched.position}
                handleChange={handleChange}
                placeholder="Enter position name"
                isRequired={false}
              />
            </div>

            {/* Row 6: Job Requirements (full width) */}
            <div className="md:col-span-2">
              <RichTextEditor
                label="Job Requirements"
                value={values.job_requirement}
                onChange={(value) => setFieldValue("job_requirement", value)}
                error={errors.job_requirement}
                touched={touched.job_requirement}
                placeholder="Enter job requirements, qualifications, and skills needed..."
                isRequired={false}
              />
            </div>

            {/* Row 7: Job Description (full width) */}
            <div className="md:col-span-2">
              <RichTextEditor
                label="Job Description"
                value={values.job_description}
                onChange={(value) => setFieldValue("job_description", value)}
                error={errors.job_description}
                touched={touched.job_description}
                placeholder="Enter detailed job description, responsibilities, and duties..."
                isRequired={false}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <Button
                  variant="secondary"
                  type="button"
                  className="border/50 border bg-white dark:bg-white/5"
                  disabled={isSubmitting}
                  onClick={() => dispatch(closeDialog())}
                >
                  <XIcon
                    className="-ms-1 opacity-80"
                    size={16}
                    aria-hidden="true"
                  />
                  Cancel
                </Button>

                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  type="submit"
                  onClick={() => setSubmitAction("draft")}
                >
                  {isSubmitting ? (
                    <LoaderCircle
                      className="-ms-1 animate-spin opacity-80"
                      size={16}
                    />
                  ) : (
                    <SaveIcon className="-ms-1 opacity-80" size={16} />
                  )}
                  Save to Draft
                </Button>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  onClick={() => setSubmitAction("publish")}
                >
                  {isSubmitting ? (
                    <LoaderCircle
                      className="-ms-1 animate-spin opacity-80"
                      size={16}
                    />
                  ) : (
                    <Check className="-ms-1 opacity-80" size={16} />
                  )}
                  Publish
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddNewJobPostForm;
