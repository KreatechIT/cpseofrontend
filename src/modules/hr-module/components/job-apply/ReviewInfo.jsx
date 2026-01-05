import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ReviewInfo = ({
  values,
  errors,
  touched,
  setFieldValue,
  companyName,
  page = "jobApplication",
}) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Review Your Application</CardTitle>
        <CardDescription>
          Please review all information before submitting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="font-semibold mb-2">Personal Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <strong>Name:</strong> {values.full_name}
            </div>
            <div>
              <strong>Email:</strong> {values.email}
            </div>
            <div>
              <strong>Contact:</strong> {values.contact_number}
            </div>
            <div>
              <strong>ID Number:</strong> {values.id_number}
            </div>
          </div>
        </div>

        <Separator />

        {/* Family Members */}
        <div>
          <h3 className="font-semibold mb-2">
            Family Members ({values.family_members?.length || 0})
          </h3>
          {values.family_members?.map((member, index) => (
            <Badge key={index} variant="secondary" className="mr-2 mb-2">
              {member.name} ({member.relationship})
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Education */}
        <div>
          <h3 className="font-semibold mb-2">
            Education ({values.education_experiences?.length || 0})
          </h3>
          {values.education_experiences?.map((edu, index) => (
            <Badge key={index} variant="secondary" className="mr-2 mb-2">
              {edu.qualification} - {edu.institution}
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Work Experience */}
        <div>
          <h3 className="font-semibold mb-2">
            Work Experience ({values.work_experiences?.length || 0})
          </h3>
          {values.work_experiences?.map((work, index) => (
            <Badge key={index} variant="secondary" className="mr-2 mb-2">
              {work.position} - {work.company_name}
            </Badge>
          ))}
        </div>

        <Separator />

        {/* Agreement Section */}
        {page === "jobApplication" && (
          <div className="space-y-4">
            <h3 className="font-semibold mb-4">
              Acknowledgement and Authorization
            </h3>

            {/* Certification */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="certification"
                  checked={values.certification || false}
                  onCheckedChange={(checked) =>
                    setFieldValue("certification", checked)
                  }
                />
                <Label htmlFor="certification" className="text-sm">
                  I confirm that the information provided is true and authorize
                  verification. False information may result in disqualification
                  or termination.
                </Label>
              </div>
              {errors?.certification && touched?.certification && (
                <p className="text-destructive text-xs ml-6">
                  {errors.certification}
                </p>
              )}
            </div>

            {/* Confidentiality */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="confidentiality"
                  checked={values.confidentiality || false}
                  onCheckedChange={(checked) =>
                    setFieldValue("confidentiality", checked)
                  }
                />
                <Label htmlFor="confidentiality" className="text-sm">
                  I agree to keep all interview information confidential.
                </Label>
              </div>
              {errors?.confidentiality && touched?.confidentiality && (
                <p className="text-destructive text-xs ml-6">
                  {errors.confidentiality}
                </p>
              )}
            </div>

            {/* consent */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={values.consent || false}
                  onCheckedChange={(checked) =>
                    setFieldValue("consent", checked)
                  }
                />
                <Label htmlFor="consent" className="text-sm">
                  I consent to the processing of my personal data by{" "}
                  {companyName} in accordance with the Personal Data Protection
                  Act 2010 (PDPA).
                </Label>
              </div>
              {errors?.consent && touched?.consent && (
                <p className="text-destructive text-xs ml-6">
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewInfo;
