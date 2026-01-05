import DateField from "@/components/form-fields/DateField";
import ImageUploadFieldWithCamera from "@/components/form-fields/ImageUploadFieldWithCamera";
import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
import TextareaField from "@/components/form-fields/TextareaField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  NATIONALITY_CHOICES,
  RACE_CHOICES,
  RELIGION_CHOICES,
} from "../../lib/hrEnums";

const PersonalInfo = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  type = "create",
}) => {
  return (
    <Card className="shadow-none">
      {type === "create" && (
        <div className="px-6 font-semibold">
          <h3 className="text-lg">The Setup Spellbook</h3>

          <div className="border p-2 rounded-md mt-4 bg-primary/5">
            <h4 className="">Roll In</h4>
            <div className="relative mt-4 mb-1.5">
              <Progress value={5} className="h-4" />
              <span className="absolute text-white text-sm left-2 -top-0.5">
                5%
              </span>
            </div>
            <p className="text-muted-foreground font-normal text-sm">
              The magic's already happening.
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Please provide your personal details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2">
          <InputField
            fieldName="full_name"
            label="Full Name (as per ID)"
            value={values.full_name}
            error={errors.full_name}
            touched={touched.full_name}
            handleChange={handleChange}
            placeholder="Enter full name"
            labelStyle=""
          />

          <InputField
            fieldName="first_name"
            label="First Name"
            value={values.first_name}
            error={errors.first_name}
            touched={touched.first_name}
            handleChange={handleChange}
            placeholder="Enter first name"
          />

          <InputField
            fieldName="last_name"
            label="Last Name"
            value={values.last_name}
            error={errors.last_name}
            touched={touched.last_name}
            handleChange={handleChange}
            placeholder="Enter last name"
          />

          <InputField
            fieldName="chinese_name"
            label="Chinese Name (if applicable)"
            value={values.chinese_name}
            error={errors.chinese_name}
            touched={touched.chinese_name}
            handleChange={handleChange}
            placeholder="Enter chinese name"
            isRequired={false}
            labelStyle=""
          />

          <DateField
            fieldName="birth_date"
            label="Birth date"
            error={errors.birth_date}
            touched={touched.birth_date}
            date={values.birth_date}
            setDate={(date) => setFieldValue("birth_date", date)}
          />

          <SelectField
            options={RACE_CHOICES}
            fieldName="race"
            label="Race"
            value={values.race}
            error={errors.race}
            touched={touched.race}
            setFieldValue={setFieldValue}
            placeholder="Select race"
          />

          {values.race === "99" && (
            <InputField
              fieldName="race_others"
              label="Specify Race"
              value={values.race_others}
              error={errors.race_others}
              touched={touched.race_others}
              handleChange={handleChange}
              placeholder="Please specify race"
            />
          )}

          <SelectField
            options={RELIGION_CHOICES}
            fieldName="religion"
            label="Religion"
            value={values.religion}
            error={errors.religion}
            touched={touched.religion}
            setFieldValue={setFieldValue}
            placeholder="Select religion"
          />

          <SelectField
            options={NATIONALITY_CHOICES}
            fieldName="nationality"
            label="Nationality"
            value={values.nationality}
            error={errors.nationality}
            touched={touched.nationality}
            setFieldValue={setFieldValue}
            placeholder="Select nationality"
          />

          {values.religion === "99" && (
            <InputField
              fieldName="religion_others"
              label="Specify Religion"
              value={values.religion_others}
              error={errors.religion_others}
              touched={touched.religion_others}
              handleChange={handleChange}
              placeholder="Please specify religion"
            />
          )}

          {values.nationality === "99" && (
            <InputField
              fieldName="nationality_others"
              label="Specify Nationality"
              value={values.nationality_others}
              error={errors.nationality_others}
              touched={touched.nationality_others}
              handleChange={handleChange}
              placeholder="Please specify nationality"
            />
          )}

          <div className="md:col-span-2">
            <TextareaField
              fieldName="address"
              label="Address"
              value={values.address}
              error={errors.address}
              touched={touched.address}
              handleChange={handleChange}
              placeholder="Enter your address"
              rows={3}
            />
          </div>

          <InputField
            fieldName="id_number"
            label="ID Number"
            value={values.id_number}
            error={errors.id_number}
            touched={touched.id_number}
            handleChange={handleChange}
            placeholder="Enter ID number"
          />

          <InputField
            fieldName="contact_number"
            label="Contact Number"
            value={values.contact_number}
            error={errors.contact_number}
            touched={touched.contact_number}
            handleChange={handleChange}
            placeholder="Enter contact number"
          />

          <InputField
            fieldName="email"
            label="Email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            handleChange={handleChange}
            placeholder="Enter email address"
            type="email"
          />

          <InputField
            fieldName="epf_no"
            label="EPF No"
            value={values.epf_no}
            error={errors.epf_no}
            touched={touched.epf_no}
            handleChange={handleChange}
            placeholder="Enter EPF number"
            isRequired={false}
          />

          <div className="grid md:col-span-2 gap-4">
            <InputField
              fieldName="income_tax_no"
              label="Income Tax No"
              value={values.income_tax_no}
              error={errors.income_tax_no}
              touched={touched.income_tax_no}
              handleChange={handleChange}
              placeholder="Enter income tax number"
              isRequired={false}
            />

            <div>
              <Label className="mb-1 gap-0.5 text-sm capitalize">
                Photo <span className="text-destructive/75 text-sm">*</span>
              </Label>

              <ImageUploadFieldWithCamera
                onFileChange={(file) => {
                  setFieldValue("photo", file);
                }}
                initialFiles={
                  values.photo &&
                  typeof values.photo === "object" &&
                  values.photo.url
                    ? [values.photo]
                    : []
                }
              />

              {errors.photo && touched.photo && (
                <p className="text-destructive mt-1.5 text-xs">
                  {errors.photo}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
