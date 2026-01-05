import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EditIcon, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { addBaseURL } from "@/utils/addBaseUrl";

const TaskChecklistDetails = () => {
  const dispatch = useDispatch();
  const { checklist } = useSelector((state) => state.onboardingTaskChecklist);

  if (!checklist) return null;

  return (
    <div className="w-full space-y-8 ">
      {/* Profile Card */}
      <Card className="w-full py-0 mt-6 shadow-lg border rounded-2xl overflow-hidden bg-primary/5 relative">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Panel */}
          <div className="bg-[#D1DFFF] p-6 flex flex-col items-center justify-center">
            <Avatar className="h-28 w-28 mb-4 shadow-md rounded-none">
              <AvatarImage
                src={checklist.photo ? addBaseURL(checklist.photo) : ""}
                alt={checklist.full_name}
              />
              <AvatarFallback className="rounded-none">
                {checklist.first_name?.[0]}
                {checklist.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">{checklist.full_name}</h2>
            <p className="text-sm text-gray-600">{checklist.email}</p>
            <p className="text-sm text-gray-600">{checklist.contact_number}</p>

            <div className="flex items-center gap-2 mt-8 text-sm text-gray-700">
              <MapPin className="w-4 h-4" />
              <span>{checklist.address}</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-span-2 p-6 space-y-4 py-10">
            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Birth Date" value={checklist.birth_date} />
              <Info label="ID Number" value={checklist.id_number} />
              <Info label="Religion" value={checklist.religion} />
              <Info label="Nationality" value={checklist.nationality} />
              <Info label="Race" value={checklist.race} />
            </div>

            <Separator />

            {/* Company Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="EPF No" value={checklist.epf_no} />
              <Info label="Income Tax No" value={checklist.income_tax_no} />
            </div>

            <Separator />

            {/* Bank Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Bank Name" value={checklist.bank_name} />
              <Info label="Account No" value={checklist.bank_account_no} />
              <div className="sm:col-span-2">
                <Info
                  label="Account Name"
                  value={checklist.bank_account_name}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-2 top-2">
          <Button
            onClick={() => {
              dispatch(
                setDialogData({
                  type: "editTaskChecklist",
                  styles:
                    "md:min-w-[750px] lg:min-w-[850px] xl:min-w-[1000px] 2xl:min-w-[1200px]",
                })
              );
            }}
          >
            <EditIcon /> Edit
          </Button>
        </div>
      </Card>

      {/* Emergency Contacts */}
      {checklist.emergency_contacts?.length > 0 && (
        <Card className="p-6 shadow-lg border rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            {checklist.emergency_contacts.map((contact, i) => (
              <div
                key={contact.id || i}
                className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/30"
              >
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-600">
                  Relation: {contact.relation_to_you}
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-1" /> {contact.contact_number}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Company Assets */}
      {checklist.company_assets?.length > 0 && (
        <Card className="p-6 shadow-lg border rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Company Assets</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklist.company_assets.map((asset, i) => (
              <div
                key={asset.id || i}
                className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900/30"
              >
                <p className="font-medium">Asset #{i + 1}</p>
                <ul className="text-sm text-gray-600 space-y-1 mt-2">
                  <li>Access Card: {asset.access_card ? "Yes" : "No"}</li>
                  <li>
                    Name Tag & Lanyard:{" "}
                    {asset.name_tag_and_lanyard ? "Yes" : "No"}
                  </li>
                  <li>HDMI Cable: {asset.hdmi_cable ? "Yes" : "No"}</li>
                  <li>Adapter: {asset.adapter ? "Yes" : "No"}</li>
                  <li>Mat: {asset.mat ? "Yes" : "No"}</li>
                  <li>Monitor: {asset.monitor ? "Yes" : "No"}</li>
                  <li>
                    MacBook Serial:{" "}
                    <span className="font-medium">
                      {asset.macbook_serial_number || "-"}
                    </span>
                  </li>
                  <li>
                    Phone Number:{" "}
                    <span className="font-medium">
                      {asset.phone_number || "-"}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

export default TaskChecklistDetails;
