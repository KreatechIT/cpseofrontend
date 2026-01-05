import DateField from "@/components/form-fields/DateField";
import InputField from "@/components/form-fields/InputField";
import TextareaField from "@/components/form-fields/TextareaField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";

const EducationInfo = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Education Experience</CardTitle>
        <CardDescription>Add your educational background</CardDescription>
      </CardHeader>

      <CardContent>
        <FieldArray name="education_experiences">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.education_experiences.map((education, index) => {
                const eduErrors = errors?.education_experiences?.[index] || {};
                const eduTouched =
                  touched?.education_experiences?.[index] || {};

                return (
                  <Card key={index} className="p-4 shadow-none">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={values.education_experiences.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-2">
                      <InputField
                        fieldName={`education_experiences.${index}.institution`}
                        label="Institution"
                        value={education.institution}
                        error={eduErrors.institution}
                        touched={eduTouched.institution}
                        handleChange={handleChange}
                        placeholder="Enter institution name"
                      />

                      <InputField
                        fieldName={`education_experiences.${index}.qualification`}
                        label="Qualification"
                        value={education.qualification}
                        error={eduErrors.qualification}
                        touched={eduTouched.qualification}
                        handleChange={handleChange}
                        placeholder="e.g., Bachelor's Degree, Diploma"
                      />

                      <InputField
                        fieldName={`education_experiences.${index}.field_of_study`}
                        label="Field of Study"
                        value={education.field_of_study}
                        error={eduErrors.field_of_study}
                        touched={eduTouched.field_of_study}
                        handleChange={handleChange}
                        placeholder="Enter field of study"
                      />

                      <InputField
                        fieldName={`education_experiences.${index}.result`}
                        label="Result"
                        value={education.result}
                        error={eduErrors.result}
                        touched={eduTouched.result}
                        handleChange={handleChange}
                        placeholder="e.g., CGPA 3.5, First Class"
                      />

                      <DateField
                        fieldName={`education_experiences.${index}.start_date`}
                        label="Start Date"
                        error={eduErrors.start_date}
                        touched={eduTouched.start_date}
                        date={education.start_date}
                        setDate={(date) =>
                          setFieldValue(
                            `education_experiences.${index}.start_date`,
                            date
                          )
                        }
                      />

                      <DateField
                        fieldName={`education_experiences.${index}.end_date`}
                        label="End Date"
                        error={eduErrors.end_date}
                        touched={eduTouched.end_date}
                        date={education.end_date}
                        setDate={(date) =>
                          setFieldValue(
                            `education_experiences.${index}.end_date`,
                            date
                          )
                        }
                        isRequired={false}
                      />

                      <div className="md:col-span-2">
                        <TextareaField
                          fieldName={`education_experiences.${index}.location`}
                          label="Location"
                          value={education.location}
                          error={eduErrors.location}
                          touched={eduTouched.location}
                          handleChange={handleChange}
                          placeholder="Enter location"
                          isRequired={false}
                        />
                      </div>
                    </div>
                  </Card>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  push({
                    institution: "",
                    qualification: "",
                    field_of_study: "",
                    start_date: null,
                    end_date: null,
                    result: "",
                    location: "",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>
    </Card>
  );
};

export default EducationInfo;
