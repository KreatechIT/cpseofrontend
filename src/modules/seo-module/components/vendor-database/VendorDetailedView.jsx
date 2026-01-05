import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Globe, User } from "lucide-react";
import { addBaseURL } from "@/utils/addBaseUrl";

const VendorDetailedView = () => {
  const vendor = useSelector((state) => state.dialog.props); // gets the vendor object passed via props

  if (!vendor) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-muted-foreground">No vendor data available.</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="text-center -mt-6 mb-8">
        <h2 className="text-2xl font-semibold">Vendor Details</h2>
      </div>

      {/* Main Profile Card */}
      <Card className="overflow-hidden rounded-2xl shadow-lg bg-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left Panel - Logo & Basic Info */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col items-center justify-center text-center">
            <Avatar className="h-32 w-32 mb-6 border-4 border-white shadow-xl">
              <AvatarImage
                src={vendor.logo ? addBaseURL(vendor.logo) : ""}
                alt={vendor.vendor_name || vendor.company_name}
              />
              <AvatarFallback className="text-4xl bg-primary/20">
                <Building2 className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>

            <h2 className="text-xl font-bold">
              {vendor.vendor_name || vendor.company_name || "Unnamed Vendor"}
            </h2>

            {vendor.vendor_type_name && (
              <Badge variant="secondary" className="mt-2">
                {vendor.vendor_type_name}
              </Badge>
            )}

            <div className="mt-6 space-y-3 text-sm">
              {vendor.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              {vendor.website && (
                <div className="flex items-center justify-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="md:col-span-2 p-8 space-y-6">
            {/* Contact Person */}
            {vendor.contact_person && (
              <>
                <SectionGrid>
                  <Info label="Contact Person" value={vendor.contact_person} icon={<User className="h-4 w-4" />} />
                  <Info label="Contact Email" value={vendor.contact_email} icon={<Mail className="h-4 w-4" />} />
                  <Info label="Contact Phone" value={vendor.contact_phone} icon={<Phone className="h-4 w-4" />} />
                </SectionGrid>
                <Separator />
              </>
            )}

            {/* Company Info */}
            <SectionGrid>
              <Info label="Company Name" value={vendor.company_name} />
              <Info label="Registration No" value={vendor.registration_no || "-"} />
              <Info label="Tax ID" value={vendor.tax_id || "-"} />
              <Info label="Address" value={vendor.address} icon={<MapPin className="h-4 w-4" />} />
            </SectionGrid>

            <Separator />

            {/* Additional Info */}
            <SectionGrid>
              <Info label="Payment Terms" value={vendor.payment_terms || "-"} />
              <Info label="Credit Limit" value={vendor.credit_limit || "-"} />
              <Info label="Currency" value={vendor.currency || "MYR"} />
              <Info label="Status" value={vendor.status || "Active"} />
            </SectionGrid>
          </div>
        </div>
      </Card>

      {/* Notes / Remarks */}
      {vendor.remarks && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Remarks / Notes</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{vendor.remarks}</p>
        </Card>
      )}
    </section>
  );
};

export default VendorDetailedView;

// Helper Components
const Info = ({ label, value, icon }) => (
  <div>
    <p className="text-sm text-muted-foreground flex items-center gap-1">
      {icon}
      {label}
    </p>
    <p className="font-medium mt-1">{value || "-"}</p>
  </div>
);

const SectionGrid = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{children}</div>
);