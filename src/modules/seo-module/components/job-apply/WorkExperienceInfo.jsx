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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";

const WorkExperienceInfo = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
        <CardDescription>Add your work experience</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldArray name="work_experiences">
          {({ push, remove }) => (
            <div className="space-y-4">
              <FreshGraduateCheckbox
                push={push}
                remove={remove}
                values={values}
              />
              {values.work_experiences.map((work, index) => {
                const workErrors = errors?.work_experiences?.[index] || {};
                const workTouched = touched?.work_experiences?.[index] || {};

                return (
                  <Card key={index} className="p-4 shadow-none">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">
                        Work Experience {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={values.work_experiences.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        fieldName={`work_experiences.${index}.company_name`}
                        label="Company Name"
                        value={work.company_name}
                        error={workErrors.company_name}
                        touched={workTouched.company_name}
                        handleChange={handleChange}
                        placeholder="Enter company name"
                      />

                      <InputField
                        fieldName={`work_experiences.${index}.position`}
                        label="Position"
                        value={work.position}
                        error={workErrors.position}
                        touched={workTouched.position}
                        handleChange={handleChange}
                        placeholder="Enter position"
                      />

                      <InputField
                        fieldName={`work_experiences.${index}.department`}
                        label="Department"
                        value={work.department}
                        error={workErrors.department}
                        touched={workTouched.department}
                        handleChange={handleChange}
                        placeholder="Enter department"
                      />

                      <InputField
                        fieldName={`work_experiences.${index}.location`}
                        label="Location"
                        value={work.location}
                        error={workErrors.location}
                        touched={workTouched.location}
                        handleChange={handleChange}
                        placeholder="Enter location"
                        isRequired={false}
                      />

                      <DateField
                        fieldName={`work_experiences.${index}.start_date`}
                        label="Start Date"
                        error={workErrors.start_date}
                        touched={workTouched.start_date}
                        date={work.start_date}
                        setDate={(date) =>
                          setFieldValue(
                            `work_experiences.${index}.start_date`,
                            date
                          )
                        }
                      />

                      <DateField
                        fieldName={`work_experiences.${index}.end_date`}
                        label="End Date"
                        error={workErrors.end_date}
                        touched={workTouched.end_date}
                        date={work.end_date}
                        setDate={(date) =>
                          setFieldValue(
                            `work_experiences.${index}.end_date`,
                            date
                          )
                        }
                        placeholder="Select end date (leave blank if current)"
                        isRequired={false}
                      />
                    </div>

                    <div className="space-y-4">
                      <TextareaField
                        fieldName={`work_experiences.${index}.job_responsibilities`}
                        label="Job Responsibilities"
                        value={work.job_responsibilities}
                        error={workErrors.job_responsibilities}
                        touched={workTouched.job_responsibilities}
                        handleChange={handleChange}
                        placeholder="Describe your job responsibilities"
                        rows={3}
                        isRequired={false}
                      />

                      <TextareaField
                        fieldName={`work_experiences.${index}.reason_of_leaving`}
                        label="Reason for Leaving"
                        value={work.reason_of_leaving}
                        error={workErrors.reason_of_leaving}
                        touched={workTouched.reason_of_leaving}
                        handleChange={handleChange}
                        placeholder="Enter reason for leaving"
                        isRequired={false}
                      />
                    </div>
                  </Card>
                );
              })}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  push({
                    company_name: "",
                    position: "",
                    department: "",
                    location: "",
                    start_date: null,
                    end_date: null,
                    job_responsibilities: "",
                    reason_of_leaving: "",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Work Experience
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>
    </Card>
  );
};

export default WorkExperienceInfo;

const FreshGraduateCheckbox = ({ push, remove, values }) => {
  const handleCheckedChange = (checked) => {
    if (checked) {
      values.work_experiences.map((_, index) => remove(index));
    } else if (values.work_experiences.length === 0) {
      push({
        company_name: "",
        position: "",
        department: "",
        location: "",
        start_date: null,
        end_date: null,
        job_responsibilities: "",
        reason_of_leaving: "",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Checkbox id="fresh_graduate" onCheckedChange={handleCheckedChange} />
      <Label htmlFor="fresh_graduate">Fresh graduate</Label>
    </div>
  );
};
