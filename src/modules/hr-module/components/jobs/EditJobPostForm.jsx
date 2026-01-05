import DateField from "@/components/form-fields/DateField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { getAllDepartments } from "@/modules/member-module/services/departmentService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AddJobPostingIcon } from "@/components/icons/HrIcons";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { getAllCompanies } from "@/modules/member-module/services/companyService";
import { updateJobPost } from "../../services/jobsService";
import RichTextEditor from "@/components/form-fields/RichTextEditor";
import {
  JOB_STATUS_CHOICES,
  JOB_TYPE_CHOICES,
  SALARY_CHOICES,
} from "../../lib/hrEnums";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, XIcon } from "lucide-react";
import { editJobPostSchema } from "../../validations/jobsValidationSchema";

const decodeHtml = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  txt.innerHTML = txt.value; // second decode
  return txt.value;
};

const EditJobPostForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const jobPostingInfo = useSelector((state) => state.dialog.props);
  const { companies } = useSelector((state) => state.company);
  const { departments } = useSelector((state) => state.department);

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
    job_title: jobPostingInfo.job_title || "",
    company_id:
      companyOptions?.find((c) => c.label === jobPostingInfo?.company)?.value ||
      "",
    department_id:
      departmentOptions?.find((d) => d.label === jobPostingInfo?.department)
        ?.value || "",
    job_type:
      JOB_TYPE_CHOICES?.find((type) => type.label === jobPostingInfo?.job_type)
        .value || "",
    location: jobPostingInfo.location || "",
    vacancy: jobPostingInfo.vacancy || 0,
    salary: jobPostingInfo.salary
      ? SALARY_CHOICES.find((s) => s.label === jobPostingInfo?.salary).value
      : "",
    application_deadline: jobPostingInfo.application_deadline || new Date(),
    position: jobPostingInfo.position || "",
    job_requirement: decodeHtml(jobPostingInfo.job_requirement) || "",
    job_description: decodeHtml(jobPostingInfo.job_description) || "",
    status: JOB_STATUS_CHOICES.find((c) => c.label === jobPostingInfo.status)
      ?.value,
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    const data = {
      ...values,
      application_deadline: format(values.application_deadline, "yyyy-MM-dd"),
      // status: 1,
    };

    if (!data.salary) delete data.salary;
    if (!data.position) delete data.position;

    updateJobPost(user?.organisation_id, jobPostingInfo.id, data, dispatch)
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
          Edit Job Posting
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={editJobPostSchema}
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
                isRequired={true}
              />
            </div>

            {/* Row 6: Job Requirements */}
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

            {/* Row 7: Job Description */}
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
              <div className="mt-6 grid grid-cols-2 gap-4">
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

                <Button disabled={isSubmitting} type="submit">
                  {isSubmitting ? (
                    <LoaderCircle
                      className="-ms-1 animate-spin opacity-80"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <Check
                      className="-ms-1 opacity-80"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default EditJobPostForm;
