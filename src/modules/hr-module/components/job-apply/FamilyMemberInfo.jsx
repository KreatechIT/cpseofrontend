import InputField from "@/components/form-fields/InputField";
import { SelectField } from "@/components/form-fields/SelectField";
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
import { GENDER_CHOICES } from "../../lib/hrEnums";
import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";

const FamilyMemberInfo = ({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Family Members</CardTitle>
        <CardDescription>
          Add information about your family members
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldArray name="family_members">
          {({ push, remove }) => (
            <div className="space-y-4">
              <NoFamilyMemberCheckbox
                push={push}
                remove={remove}
                values={values}
              />

              {values.family_members.map((member, index) => {
                const memberErrors = errors?.family_members?.[index] || {};
                const memberTouched = touched?.family_members?.[index] || {};

                return (
                  <Card key={index} className="p-4 shadow-none">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Family Member {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={values.family_members.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-2">
                      <InputField
                        fieldName={`family_members.${index}.name`}
                        label="Name"
                        value={member.name}
                        error={memberErrors.name}
                        touched={memberTouched.name}
                        handleChange={handleChange}
                        placeholder="Enter name"
                      />

                      <InputField
                        fieldName={`family_members.${index}.relationship`}
                        label="Relationship"
                        value={member.relationship}
                        error={memberErrors.relationship}
                        touched={memberTouched.relationship}
                        handleChange={handleChange}
                        placeholder="e.g., Father, Mother, Spouse"
                      />

                      <SelectField
                        options={GENDER_CHOICES}
                        fieldName={`family_members.${index}.gender`}
                        label="Gender"
                        value={member.gender}
                        error={memberErrors.gender}
                        touched={memberTouched.gender}
                        setFieldValue={setFieldValue}
                        placeholder="Select gender"
                      />

                      {member.gender === "99" && (
                        <InputField
                          fieldName={`family_members.${index}.gender_others`}
                          label="Specify Gender"
                          value={member.gender_others}
                          error={memberErrors.gender_others}
                          touched={memberTouched.gender_others}
                          handleChange={handleChange}
                          placeholder="Please specify"
                        />
                      )}

                      <InputField
                        type="number"
                        fieldName={`family_members.${index}.age`}
                        label="Age"
                        value={member.age}
                        error={memberErrors.age}
                        touched={memberTouched.age}
                        handleChange={handleChange}
                        placeholder="Enter age"
                      />

                      <InputField
                        fieldName={`family_members.${index}.occupation`}
                        label="Occupation"
                        value={member.occupation}
                        error={memberErrors.occupation}
                        touched={memberTouched.occupation}
                        handleChange={handleChange}
                        placeholder="Enter occupation"
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
                    name: "",
                    relationship: "",
                    gender: "",
                    gender_others: "",
                    age: "",
                    occupation: "",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Family Member
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberInfo;

const NoFamilyMemberCheckbox = ({ push, remove, values }) => {
  const handleCheckedChange = (checked) => {
    if (checked) {
      values.family_members.map((_, index) => remove(index));
    } else if (values.family_members.length === 0) {
      push({
        name: "",
        relationship: "",
        gender: "",
        gender_others: "",
        age: "",
        occupation: "",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <Checkbox id="family_member" onCheckedChange={handleCheckedChange} />
      <Label htmlFor="family_member">No family members</Label>
    </div>
  );
};
