import DateField from "@/components/form-fields/DateField";
import FileUplaodField from "@/components/form-fields/FileUploadField";
import ImageUploadField from "@/components/form-fields/ImageUploadField";
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
import {
  GENDER_CHOICES,
  MARITAL_STATUS_CHOICES,
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
  page = "apply",
}) => {
  return (
    <Card className="shadow-none">
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

          <SelectField
            options={GENDER_CHOICES}
            fieldName="gender"
            label="Gender"
            value={values.gender}
            error={errors.gender}
            touched={touched.gender}
            setFieldValue={setFieldValue}
            placeholder="Select gender"
          />

          {values.gender === "99" && (
            <InputField
              fieldName="gender_others"
              label="Specify Gender"
              value={values.gender_others}
              error={errors.gender_others}
              touched={touched.gender_others}
              handleChange={handleChange}
              placeholder="Enter gender name"
            />
          )}

          <SelectField
            options={MARITAL_STATUS_CHOICES}
            fieldName="marital_status"
            label="Marital Status"
            value={values.marital_status}
            error={errors.marital_status}
            touched={touched.marital_status}
            setFieldValue={setFieldValue}
            placeholder="Select marital status"
          />

          {values.marital_status === "99" && (
            <InputField
              fieldName="marital_status_others"
              label="Specify Marital Status"
              value={values.marital_status_others}
              error={errors.marital_status_others}
              touched={touched.marital_status_others}
              handleChange={handleChange}
              placeholder="Enter marital status"
            />
          )}

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

          <DateField
            fieldName="preferred_start_date"
            label="Preferred Start Date"
            error={errors.preferred_start_date}
            touched={touched.preferred_start_date}
            date={values.preferred_start_date}
            setDate={(date) => setFieldValue("preferred_start_date", date)}
          />

          <div className="grid md:col-span-2 grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 gap-0.5 text-sm capitalize">
                Resume
                <span className="text-destructive/75 text-sm">*</span>
              </Label>
              <FileUplaodField
                onFileChange={(file) => {
                  setFieldValue("resume", file);
                }}
                initialFiles={values.resume ? [values.resume] : []}
              />
              {errors.resume && touched.resume && (
                <p className="text-destructive mt-1.5 text-xs">
                  {errors.resume}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-1 gap-0.5 text-sm capitalize">
                Recent Photo{" "}
                <span className="text-destructive/75 text-sm">*</span>
              </Label>
              {page === "apply" ? (
                <ImageUploadFieldWithCamera
                  onFileChange={(file) => {
                    setFieldValue("image", file);
                  }}
                  initialFiles={values.image ? [values.image] : []}
                />
              ) : (
                <>
                  <ImageUploadField
                    onFileChange={(file) => {
                      setFieldValue("image", file);
                    }}
                    initialFiles={values.image ? [values.image] : []}
                  />
                </>
              )}
              {errors.image && touched.image && (
                <p className="text-destructive mt-1.5 text-xs">
                  {errors.image}
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
