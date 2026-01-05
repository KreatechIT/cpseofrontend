import {
  User,
  Users,
  GraduationCap,
  Briefcase,
  CheckCircle,
} from "lucide-react";

import {
  educationSchema,
  familyMembersSchema,
  personalInfoSchema,
  reviewSchema,
  workExperienceSchema,
} from "@/modules/hr-module/validations/jobApplyValidationSchema";

import * as Yup from "yup";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Formik } from "formik";

import { Button } from "@/components/ui/button";

import { postCandidate } from "../../services/candidatesService";
import PersonalInfo from "./PersonalInfo";
import FamilyMemberInfo from "./FamilyMemberInfo";
import EducationInfo from "./EducationInfo";
import WorkExperienceInfo from "./WorkExperienceInfo";
import ReviewInfo from "./ReviewInfo";

const initialValues = {
  full_name: "",
  first_name: "",
  last_name: "",
  chinese_name: "",
  gender: "",
  gender_others: "",
  marital_status: "",
  marital_status_others: "",
  birth_date: null,
  race: "",
  race_others: "",
  religion: "",
  religion_others: "",
  address: "",
  id_number: "",
  nationality: "",
  nationality_others: "",
  contact_number: "",
  email: "",
  preferred_start_date: null,
  resume: null,
  image: null,
  family_members: [
    {
      name: "",
      relationship: "",
      gender: "",
      gender_others: "",
      age: "",
      occupation: "",
    },
  ],
  education_experiences: [
    {
      institution: "",
      qualification: "",
      field_of_study: "",
      start_date: null,
      end_date: null,
      result: "",
      location: "",
    },
  ],

  work_experiences: [
    {
      company_name: "",
      position: "",
      department: "",
      location: "",
      start_date: null,
      end_date: null,
      job_responsibilities: "",
      reason_of_leaving: "",
    },
  ],
  // fresh_graduate: false,

  certification: false,
  confidentiality: false,
  consent: false,
};

const stepFields = {
  1: Object.keys(initialValues).filter(
    (key) =>
      ![
        "certification",
        "confidentiality",
        "consent",
        "family_members",
        "education_experiences",
        "work_experiences",
      ].includes(key)
  ),
  2: ["family_members"],
  3: ["education_experiences"],
  4: ["work_experiences"],
  5: ["certification", "confidentiality", "consent"],
};

const setTouchedToCurrentStepFields = (currentStep, setTouched, values) => {
  const touchedFields = {};

  stepFields[currentStep]?.forEach((field) => {
    if (Array.isArray(values[field])) {
      touchedFields[field] = values[field].map((item) =>
        Object.keys(item).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {})
      );
    } else {
      touchedFields[field] = true;
    }
  });

  setTouched(touchedFields);
};

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Family Members", icon: Users },
  { id: 3, title: "Education", icon: GraduationCap },
  { id: 4, title: "Work Experience", icon: Briefcase },
  { id: 5, title: "Review and Acknowledgement", icon: CheckCircle },
];

export default function JobApplicationForm({
  job_link_id,
  setIsAppliedSuccessfully,
  companyName,
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((currentStep) => currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitForm = (values) => {
    const formData = new FormData();

    const isValidValue = (val) =>
      val !== null && val !== undefined && val !== "";

    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      return isNaN(d) ? null : d.toISOString().split("T")[0];
    };

    // Simple flat fields
    const flatFields = [
      "full_name",
      "first_name",
      "last_name",
      "chinese_name",
      "gender",
      "gender_others",
      "marital_status",
      "marital_status_others",
      "race",
      "race_others",
      "religion",
      "religion_others",
      "address",
      "id_number",
      "nationality",
      "nationality_others",
      "contact_number",
      "email",
    ];

    flatFields.forEach((field) => {
      if (isValidValue(values[field])) {
        formData.append(field, values[field]);
      }
    });

    // Date fields
    const dateFields = ["birth_date", "preferred_start_date"];
    dateFields.forEach((field) => {
      const formatted = formatDate(values[field]);
      if (formatted) {
        formData.append(field, formatted);
      }
    });

    // Family members (as JSON string)
    if (Array.isArray(values.family_members)) {
      const cleanedFamily = values.family_members.filter((member) =>
        Object.values(member).some(isValidValue)
      );
      formData.append("family_members", JSON.stringify(cleanedFamily));
    }

    // Education experience (as JSON string)
    if (Array.isArray(values.education_experiences)) {
      const formattedEducation = values.education_experiences.map((edu) => ({
        ...edu,
        start_date: formatDate(edu.start_date),
        end_date: formatDate(edu.end_date),
      }));
      formData.append(
        "education_experiences",
        JSON.stringify(formattedEducation)
      );
    }

    // Work experience (as JSON string)
    if (Array.isArray(values.work_experiences)) {
      const formattedWork = values.work_experiences.map((work) => ({
        ...work,
        start_date: formatDate(work.start_date),
        end_date: formatDate(work.end_date),
      }));
      formData.append("work_experiences", JSON.stringify(formattedWork));
    }

    // Files
    if (values.resume instanceof File) {
      formData.append("resume", values.resume);
    }
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    // Submit via your API
    postCandidate(job_link_id, formData)
      .then(() => setIsAppliedSuccessfully(true))
      .catch((err) => {
        console.error("Submit failed", err);
      });
  };

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1:
        return personalInfoSchema;
      case 2:
        return familyMembersSchema;
      case 3:
        return educationSchema;
      case 4:
        return workExperienceSchema;
      case 5:
        return reviewSchema;
      default:
        return Yup.object();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-full border transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : ""
                )}
              >
                <Icon className="w-5 h-5 opacity-75" />
              </div>
              <div className="ml-3 hidden md:block">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-green-600"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-0.5 mx-4",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={(values) => {
          if (currentStep === steps.length) {
            handleSubmitForm(values);
          } else {
            handleNext();
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setTouched,
          handleChange,
          handleSubmit,
          validateForm,
        }) => (
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <PersonalInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 2: Family Members */}
            {currentStep === 2 && (
              <FamilyMemberInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 3: Education */}
            {currentStep === 3 && (
              <EducationInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 4: Work Experience */}
            {currentStep === 4 && (
              <WorkExperienceInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <ReviewInfo
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                companyName={companyName}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              <Button
                type="button"
                onClick={async () => {
                  setTouchedToCurrentStepFields(
                    currentStep,
                    setTouched,
                    values
                  );
                  const errors = await validateForm();

                  const currentStepFields = stepFields[currentStep] || [];

                  // Flatten error keys to check if errors exist in current step
                  const hasStepErrors = currentStepFields.some(
                    (field) =>
                      errors[field]?.length || typeof errors[field] === "string"
                  );

                  // Don't proceed if current step has required errors
                  if (hasStepErrors) return;

                  if (currentStep < steps.length) {
                    handleNext();
                  } else {
                    if (
                      values.certification &&
                      values.confidentiality &&
                      values.consent
                    ) {
                      handleSubmit(values);
                    }
                  }
                }}
              >
                {currentStep === steps.length ? "Submit Application" : "Next"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
