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

import {
  NATIONALITY_CHOICES,
  RACE_CHOICES,
  RELIGION_CHOICES,
} from "../../lib/hrEnums";

import PersonalInfo from "./PersonalInfo";
import BankInfo from "./BankInfo";
import EmergencyContactsInfo from "./EmergencyContactsInfo";
import CompanyAssetsInfo from "./CompanyAssetsInfo";
import TermsAndConditions from "./TermsConditions";
import { updateMemberTaskChecklist } from "../../services/onboardingTaskChecklistService";

import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { addBaseURL } from "@/utils/addBaseUrl";

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

export default function EditTaskChecklist() {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useSelector((state) => state.auth);
  const { checklist: checklistData } = useSelector(
    (state) => state.taskChecklist
  );

  const raceChoice = RACE_CHOICES.find(
    (race) => race.label === checklistData.race
  );

  const religionChoice = RELIGION_CHOICES.find(
    (religion) => religion.label === checklistData.religion
  );

  const nationalityChoice = NATIONALITY_CHOICES.find(
    (nationality) => nationality.label === checklistData.nationality
  );

  const initialValues = {
    full_name: checklistData.full_name || "",
    first_name: checklistData.first_name || "",
    last_name: checklistData.last_name || "",
    chinese_name: checklistData.chinese_name || "",
    birth_date: checklistData.birth_date || null,
    race: raceChoice ? raceChoice.value : "99",
    race_others: raceChoice ? "" : checklistData.race || "",

    religion: religionChoice ? religionChoice.value : "99",
    religion_others: religionChoice ? "" : checklistData.religion || "",
    address: checklistData.address || "",
    id_number: checklistData.id_number || "",
    nationality: nationalityChoice ? nationalityChoice.value : "99",
    nationality_others: nationalityChoice
      ? ""
      : checklistData.nationality || "",
    contact_number: checklistData.contact_number || "",
    email: checklistData.email || "",
    epf_no: checklistData.epf_no || "",
    income_tax_no: checklistData.income_tax_no || "",
    photo: checklistData?.photo
      ? {
          id: "existing-photo",
          url: addBaseURL(checklistData.photo),
        }
      : null,
    bank_name: checklistData.bank_name || "",
    bank_account_name: checklistData.bank_account_name || "",
    bank_account_no: checklistData.bank_account_no || "",
    emergency_contacts:
      checklistData.emergency_contacts.length > 0
        ? checklistData.emergency_contacts
        : [
            {
              name: "",
              relation_to_you: "",
              contact_number: "",
            },
          ],
    company_assets:
      checklistData.company_assets.length > 0
        ? checklistData.company_assets.length
        : [
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
    updateMemberTaskChecklist(user.organisation_id, user.id, formData, dispatch)
      .then(() => {
        dispatch(closeDialog());
      })
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
                type="edit"
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
                type="edit"
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
                type="edit"
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
                type="edit"
              />
            )}

            {/* Step 5: Terms & Conditions */}
            {currentStep === 5 && (
              <TermsAndConditions
                values={values}
                errors={errors}
                touched={touched}
                setFieldValue={setFieldValue}
                type="edit"
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
