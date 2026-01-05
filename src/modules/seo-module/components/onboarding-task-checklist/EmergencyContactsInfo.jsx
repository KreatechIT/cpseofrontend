import InputField from "@/components/form-fields/InputField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FieldArray } from "formik";
import { Plus, Trash2 } from "lucide-react";

const EmergencyContactsInfo = ({
  values,
  errors,
  touched,
  handleChange,
  type = "create",
}) => {
  return (
    <Card className="shadow-none">
      {type === "create" && (
        <div className="px-6 font-semibold">
          <h3 className="text-lg">Your Creative Map</h3>

          <div className="border p-2 rounded-md mt-4 bg-primary/5">
            <h4 className="">Bits and Pieces</h4>
            <div className="relative  mt-4 mb-1.5">
              <Progress value={50} className="h-4" />
              <span className="absolute text-white text-sm left-2 -top-0.5">
                50%
              </span>
            </div>
            <p className="text-muted-foreground font-normal text-sm">
              Just a few setup steps before your grand entrance
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>
          Add information about your emergency contacts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldArray name="emergency_contacts">
          {({ push, remove }) => (
            <div className="space-y-4">
              {values.emergency_contacts.map((member, index) => {
                const memberErrors = errors?.emergency_contacts?.[index] || {};
                const memberTouched =
                  touched?.emergency_contacts?.[index] || {};

                return (
                  <Card key={index} className="p-4 shadow-none">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">
                        Emergency Contact {index + 1}
                      </h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={values.emergency_contacts.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-2">
                      <InputField
                        fieldName={`emergency_contacts.${index}.name`}
                        label="Name"
                        value={member.name}
                        error={memberErrors.name}
                        touched={memberTouched.name}
                        handleChange={handleChange}
                        placeholder="Enter name"
                      />

                      <InputField
                        fieldName={`emergency_contacts.${index}.relation_to_you`}
                        label="Relationship to you"
                        value={member.relation_to_you}
                        error={memberErrors.relation_to_you}
                        touched={memberTouched.relation_to_you}
                        handleChange={handleChange}
                        placeholder="e.g., Father, Mother, Spouse"
                      />

                      <InputField
                        fieldName={`emergency_contacts.${index}.contact_number`}
                        label="contact number"
                        value={member.contact_number}
                        error={memberErrors.contact_number}
                        touched={memberTouched.contact_number}
                        handleChange={handleChange}
                        placeholder="Enter contact number"
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
                    relation_to_you: "",
                    contact_number: "",
                  })
                }
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Emergency Contact
              </Button>
            </div>
          )}
        </FieldArray>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsInfo;
