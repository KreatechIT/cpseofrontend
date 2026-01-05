import InputField from "@/components/form-fields/InputField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const assets = [
  { id: "access_card", label: "Access Card" },
  { id: "name_tag_and_lanyard", label: "Name Tag & Lanyard" },
  { id: "hdmi_cable", label: "HDMI Cable" },
  { id: "adapter", label: "Adapter" },
  { id: "mat", label: "Mat" },
  { id: "monitor", label: "Monitor" },
];

const CompanyAssetsInfo = ({
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
            <h4 className="">Crafting Your Story</h4>
            <div className="relative mt-4 mb-1.5">
              <Progress value={65} className="h-4" />
              <span className="absolute text-white text-sm left-2 -top-0.5">
                65%
              </span>
            </div>
            <p className="text-muted-foreground font-normal text-sm">
              Keep the momentum going
            </p>
          </div>
        </div>
      )}

      <CardHeader>
        <CardTitle>Company Assets</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-start gap-2">
            <Checkbox
              id={asset.id}
              checked={values.company_assets[0][asset.id] || false}
              onCheckedChange={(checked) =>
                setFieldValue(`company_assets[0].${asset.id}`, checked)
              }
            />
            <Label htmlFor={asset.id} className="text-sm">
              {asset.label}
            </Label>
          </div>
        ))}

        <div className="my-1 grid grid-cols-1 space-y-4 gap-x-4 md:grid-cols-2">
          <InputField
            fieldName="company_assets[0].macbook_serial_number"
            label="Macbook (Serial Number)"
            value={values.company_assets[0].macbook_serial_number}
            error={errors.company_assets?.[0]?.macbook_serial_number}
            touched={touched.company_assets?.[0]?.macbook_serial_number}
            handleChange={handleChange}
            placeholder="Enter serial number"
          />

          <InputField
            fieldName="company_assets[0].phone_number"
            label="Phone Number"
            value={values.company_assets[0].phone_number}
            error={errors.company_assets?.[0]?.phone_number}
            touched={touched.company_assets?.[0]?.phone_number}
            handleChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyAssetsInfo;
