import {
  personalInfoSchema,
  bankInfoSchema,
  emergencyContactsSchema,
  companyAssetsSchema,
  termsConditionsSchema,
} from "@/modules/hr-module/validations/onboardingTaskChecklistValidationSchema";

import * as Yup from "yup";
import { useState } from "react";
import { Formik } from "formik";
import { Button } from "@/components/ui/button";

import PersonalInfo from "./PersonalInfo";
import BankInfo from "./BankInfo";
import EmergencyContactsInfo from "./EmergencyContactsInfo";
import CompanyAssetsInfo from "./CompanyAssetsInfo";
import TermsAndConditions from "./TermsConditions";
import { postMemberTaskChecklist } from "../../services/onboardingTaskChecklistService";
import { PageHeading } from "@/components/shared/PageHeading";
import ThemeToggle from "@/components/themes/ThemeToggle";
import { logout } from "@/modules/auth-module/services/authService";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";

const initialValues = {
  full_name: "",
  first_name: "",
  last_name: "",
  chinese_name: "",
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
  epf_no: "",
  income_tax_no: "",
  photo: null,
  bank_name: "",
  bank_account_name: "",
  bank_account_no: "",
  emergency_contacts: [
    {
      name: "",
      relation_to_you: "",
      contact_number: "",
    },
  ],
  company_assets: [
    {
      access_card: false,
      name_tag_and_lanyard: false,
      hdmi_cable: false,
      adapter: false,
      mat: false,
      monitor: false,
      macbook_serial_number: "",
      phone_number: "",
    },
  ],
  authorisation: false,
  accuracy_of_information: false,
  security_measures: false,
  dispute_resolution: false,
  ownership: false,
  responsibility: false,
  authorised_use: false,
  maintenance: false,
  security: false,
  return_of_assets: false,
  loss_or_damage: false,
  confidentiality: false,
  governing_law: false,
  acceptance_of_terms: false,
  acknowledgement: false,
  // signature: null,
};

const totalSteps = 5;

const stepFields = {
  1: [
    "full_name",
    "first_name",
    "last_name",
    "chinese_name",
    "birth_date",
    "race",
    "race_others",
    "religion",
    "religion_others",
    "religion_others",
    "address",
    "id_number",
    "nationality",
    "nationality_others",
    "contact_number",
    "nationality_others",
    "email",
    "epf_no",
    "income_tax_no",
    "photo",
  ],
  2: ["bank_name", "bank_account_name", "bank_account_no"],
  3: ["emergency_contacts"],
  4: ["company_assets"],
  5: [
    "authorisation",
    "accuracy_of_information",
    "security_measures",
    "dispute_resolution",
    "ownership",
    "responsibility",
    "authorised_use",
    "maintenance",
    "security",
    "return_of_assets",
    "loss_or_damage",
    "confidentiality",
    "governing_law",
    "acceptance_of_terms",
    "acknowledgement",
    "signature",
  ],
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

export default function CreateTaskChecklist({
  organisation_id,
  member_id,
  dispatch,
  full_name,
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < totalSteps) {
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
      "epf_no",
      "income_tax_no",
      "bank_name",
      "bank_account_name",
      "bank_account_no",
    ];

    flatFields.forEach((field) => {
      if (isValidValue(values[field])) {
        formData.append(field, values[field]);
      }
    });

    // Date fields
    const dateFields = ["birth_date"];
    dateFields.forEach((field) => {
      const formatted = formatDate(values[field]);
      if (formatted) {
        formData.append(field, formatted);
      }
    });

    // Emergency Contacts (as JSON string)
    if (Array.isArray(values.emergency_contacts)) {
      const cleanedEmergencyContacts = values.emergency_contacts.filter(
        (member) => Object.values(member).some(isValidValue)
      );
      formData.append(
        "emergency_contacts",
        JSON.stringify(cleanedEmergencyContacts)
      );
    }

    // Company Assets (as JSON string)
    if (Array.isArray(values.company_assets)) {
      const cleanedCompanyAssets = values.company_assets.filter((asset) =>
        Object.values(asset).some(isValidValue)
      );
      formData.append("company_assets", JSON.stringify(cleanedCompanyAssets));
    }

    // Files
    if (values.photo instanceof File) {
      formData.append("photo", values.photo);
    }

    // Submit via API
    postMemberTaskChecklist(organisation_id, member_id, formData, dispatch)
      .then(() => true)
      .catch((err) => {
        console.error("Submit failed", err);
      });
  };

  const getValidationSchema = () => {
    switch (currentStep) {
      case 1:
        return personalInfoSchema;
      case 2:
        return bankInfoSchema;
      case 3:
        return emergencyContactsSchema;
      case 4:
        return companyAssetsSchema;
      case 5:
        return termsConditionsSchema;
      default:
        return Yup.object();
    }
  };

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <PageHeading withCardTableView={false}>
          <span className="text-primary text-xl">Welcome, {full_name}!</span>{" "}
          <span className="text-lg font-normal">Let's get you onboarded.</span>
        </PageHeading>

        <div className="space-x-4">
          <ThemeToggle />
          <Button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            size="icon"
            variant="outline"
          >
            <LogOutIcon />
          </Button>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
        onSubmit={(values) => {
          if (currentStep === totalSteps) {
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

            {/* Step 2: Bank Info */}
            {currentStep === 2 && (
              <BankInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 3: Emergency Contacts */}
            {currentStep === 3 && (
              <EmergencyContactsInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 4: Company Assets */}
            {currentStep === 4 && (
              <CompanyAssetsInfo
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
              />
            )}

            {/* Step 5: Terms & Conditions */}
            {currentStep === 5 && (
              <TermsAndConditions
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
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

                  if (currentStep < totalSteps) {
                    handleNext();
                  } else {
                    handleSubmit(values);
                  }
                }}
              >
                {currentStep === totalSteps ? "Submit Application" : "Next"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
