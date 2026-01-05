import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const terms = [
  {
    id: "authorisation",
    label:
      "By providing your bank account details, you authorize the company to initiate electronic transfers or payments to your account as instructed by the payer.",
  },
  {
    id: "accuracy_of_information",
    label:
      "You are responsible for ensuring that the bank account information provided is accurate and up to date. the company will not be liable for any errors or delays resulting from incorrect or outdated account information.",
  },
  {
    id: "security_measures",
    label:
      "You agree to take reasonable precautions to safeguard your bank account information and prevent unauthorized access. This includes keeping your login credentials confidential and promptly reporting any suspected unauthorized activity.",
  },
  {
    id: "dispute_resolution",
    label:
      "In the event of any disputes or discrepancies regarding payments received to your bank account, you agree to notify the company promptly and cooperate in resolving the issue in a timely manner.",
  },
  {
    id: "ownership",
    label:
      "All assets provided by BlackRevo Sdn. Bhd. remain the property of the company and must be returned upon request or termination of employment.",
  },
  {
    id: "responsibility",
    label:
      "Employees are responsible for the care and safekeeping of company assets assigned to them. Any damage, loss, or theft of company assets must be reported immediately to the appropriate supervisor or department.",
  },
  {
    id: "authorised_use",
    label:
      "Company assets are to be used solely for business purposes related to the company operations. Personal use of company assets is strictly prohibited unless explicitly authorized by management.",
  },
  {
    id: "maintenance",
    label:
      "Employees are required to maintain company assets in good working condition. Routine maintenance and inspections may be scheduled by the company to ensure the continued functionality and safety of all assets.",
  },
  {
    id: "security",
    label:
      "Employees must take appropriate measures to safeguard company assets from theft, damage, or unauthorized access. This includes securing assets when not in use and following established security protocols.",
  },
  {
    id: "return_of_assets",
    label:
      "Upon termination of employment or upon request by the company, employees must return all company assets in their possession. Failure to return company assets may result in disciplinary action and/or legal consequences.",
  },
  {
    id: "loss_or_damage",
    label:
      "Employees may be held financially responsible for any loss or damage to company assets resulting from negligence or misuse.",
  },
  {
    id: "confidentiality",
    label:
      "Any proprietary or confidential information stored or accessed using company assets must be handled in accordance with the company confidentiality policies and applicable laws.",
  },
  {
    id: "governing_law",
    label:
      "These terms and conditions shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law provisions.",
  },
  {
    id: "acceptance_of_terms",
    label:
      "By providing your bank account information to the payer for making payments, you acknowledge that you have read, understood, and agree to abide by these terms and conditions.",
  },
  {
    id: "acknowledgement",
    label:
      "By signing below, the employee acknowledges receipt of the company assets listed and agrees to abide by the terms and conditions outlined in this form.",
  },
];

const TermsAndConditions = ({
  values,
  errors,
  touched,
  setFieldValue,
  type = "create",
}) => {
  return (
    <Card className="shadow-none">
      {type === "create" && (
        <div className="px-6 font-semibold">
          <h3 className="text-lg">The Setup Spellbook</h3>

          <div className="border p-2 rounded-md mt-4 bg-primary/5">
            <h4 className="">A Step Closer to Awesome</h4>
            <div className="relative mt-4 mb-1.5">
              <Progress value={85} className="h-4" />
              <span className="absolute text-white text-sm left-2 -top-0.5">
                85%
              </span>
            </div>
            <p className="text-muted-foreground font-normal text-sm">
              Almost ready to roll
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {terms.map((term) => (
            <div key={term.id} className="space-y-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={term.id}
                  checked={values[term.id] || false}
                  onCheckedChange={(checked) => setFieldValue(term.id, checked)}
                />
                <Label htmlFor={term.id} className="text-sm -mt-1 font-normal">
                  {term.label}
                </Label>
              </div>
              {errors?.[term.id] && touched?.[term.id] && (
                <p className="text-destructive text-xs ml-6">
                  {errors[term.id]}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TermsAndConditions;
