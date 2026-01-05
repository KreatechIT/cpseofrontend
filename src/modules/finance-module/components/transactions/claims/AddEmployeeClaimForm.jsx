import { AddExpenseIcon } from "@/components/icons/FinanceIcons";
import CurrencyField from "@/components/form-fields/CurrencyField";
import DateField from "@/components/form-fields/DateField";
import FileUplaodField from "@/components/form-fields/FileUploadField";
import { FormButtons } from "@/components/form-fields/FormButtons";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import { Label } from "@/components/ui/label";
import { addNewClaim } from "@/modules/finance-module/services/claimService";
import { getAllCompanies } from "@/modules/member-module/services/companyService";

import { closeDialog } from "@/store/reducers/dialogSlice";
import { arrayToSelectOptions } from "@/utils/arrayToSelectOptions";
import { format } from "date-fns";
import { Formik } from "formik";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEmployeeClaimSchema } from "@/modules/finance-module/validations/transactionValidationSchema";

const AddEmployeeClaimForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.company);

  useEffect(() => {
    if (!companies) getAllCompanies(user?.organisation_id, dispatch);
  }, []);

  // Format companies into select options format (label/value)
  const companyOptions = useMemo(
    () => arrayToSelectOptions(companies, "name", "id"),
    [companies]
  );

  const initialValues = {
    claim_date: new Date(),
    claim_amount: 0,
    claimed_by: `${user.first_name} ${user.last_name}`,
    company_id: "",
    details: "",
    receipt: null,
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = {
      ...values,
      claim_date: format(values.claim_date, "yyyy-MM-dd"),
    };

    addNewClaim(user?.organisation_id, data, dispatch)
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
        <AddExpenseIcon className="mx-auto size-14 drop-shadow-md" />
        <h2 className="text-center text-xl font-medium">Employee Claim Form</h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEmployeeClaimSchema}
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
            className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2 -mt-2"
          >
            <DateField
              fieldName="claim_date"
              label="Date"
              error={errors.claim_date}
              touched={touched.claim_date}
              date={values.claim_date}
              setDate={(date) => setFieldValue("claim_date", date)}
            />

            <InputField
              fieldName="claimed_by"
              label="claim by"
              value={values.claimed_by}
              error={errors.claimed_by}
              touched={touched.claimed_by}
              handleChange={handleChange}
              isRequired={true}
              disabled
            />

            <CurrencyField
              fieldName="claim_amount"
              label="claim amount"
              value={values.claim_amount}
              error={errors.claim_amount}
              touched={touched.claim_amount}
              setFieldValue={setFieldValue}
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

            <div className="col-span-2">
              <InputField
                fieldName="details"
                label="details"
                value={values.details}
                error={errors.details}
                touched={touched.details}
                handleChange={handleChange}
                placeholder="Enter details"
                isRequired={false}
              />
            </div>

            <div className="col-span-2">
              <Label className="mb-1 gap-0.5 text-xs uppercase">Receipt</Label>
              <FileUplaodField
                onFileChange={(file) => {
                  setFieldValue("receipt", file);
                }}
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

export default AddEmployeeClaimForm;
