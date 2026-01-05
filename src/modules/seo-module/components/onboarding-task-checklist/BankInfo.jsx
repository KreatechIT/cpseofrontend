import InputField from "@/components/form-fields/InputField";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BankInfo = ({
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
          <h3 className="text-lg">The Setup Spellbook</h3>

          <div className="border p-2 rounded-md mt-4 bg-primary/5">
            <h4 className="">Bits and Pieces</h4>
            <div className="relative  mt-4 mb-1.5">
              <Progress value={35} className="h-4" />
              <span className="absolute text-white text-sm left-2 -top-0.5">
                35%
              </span>
            </div>
            <p className="text-muted-foreground font-normal text-sm">
              A few playful pieces before the big picture comes together
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Bank Information</CardTitle>
        <CardDescription>Please provide your bank details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2">
          <InputField
            fieldName="bank_name"
            label="Bank Name"
            value={values.bank_name}
            error={errors.bank_name}
            touched={touched.bank_name}
            handleChange={handleChange}
            placeholder="Enter bank name"
            isRequired={false}
          />

          <InputField
            fieldName="bank_account_name"
            label="Bank Account Name"
            value={values.bank_account_name}
            error={errors.bank_account_name}
            touched={touched.bank_account_name}
            handleChange={handleChange}
            placeholder="Enter bank account name"
            isRequired={false}
          />

          <InputField
            fieldName="bank_account_no"
            label="Bank Account No"
            value={values.bank_account_no}
            error={errors.bank_account_no}
            touched={touched.bank_account_no}
            handleChange={handleChange}
            placeholder="Enter bank account no"
            isRequired={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BankInfo;
