import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import DateField from "@/components/form-fields/DateField";
import { format } from "date-fns";
// import { Formik } from "formik";
// import { addVendorSchema } from "@/modules/seo-module/validations/vendorValidationSchema";

const VendorFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { user } = useSelector((state) => state.auth);
  const organisationId = user?.organisation_id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const [formData, setFormData] = useState({
    discovered_date: "",
    vendor_name: "",
    website_url: "",
    teams_id: "",
    pic: "",
    whatsapp: "",
    visibility: "public",
    hidden_reason: "", // array for multi-checkbox
    payment_method: "",
    payment_details: "",
    price_by_link_type: "",
    price_usd: "",
    average_domain_rating: "",
    average_domain_authority: "",
    total_general_links: "",
    total_unique_domain_link_type: "",
    total_unique_domain_amount: "",
    total_niche_link_category: "",
    total_niche_link_amount: "",
    last_updated: "",
    comment_remark: "",
    recommendation: "",
  });

  // Fetch members for PIC dropdown
  useEffect(() => {
    if (!organisationId) return;

    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get(`/organisation/${organisationId}/users/`);
        setMembers(res.data);
      } catch (error) {
        toast.error("Failed to load team members");
      } finally {
        setMembersLoading(false);
      }
    };
    fetchMembers();
  }, [organisationId]);

  // Fetch vendor data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchVendor = async () => {
        try {
          const res = await axiosInstance.get(`/seo/vendors/${id}/`);
          const data = res.data;
          setFormData({
            discovered_date: data.discovered_date || "",
            vendor_name: data.vendor_name || "",
            website_url: data.website_url || "",
            teams_id: data.teams_id || "",
            pic: data.pic || "",
            whatsapp: data.whatsapp || "",
            visibility: data.visibility || "public",
            hidden_reason: data.hidden_reason || "",
            payment_method: data.payment_method || "",
            payment_details: data.payment_details || "",
            price_by_link_type: data.price_by_link_type || "",
            price_usd: data.price_usd || "",
            average_domain_rating: data.average_domain_rating || "",
            average_domain_authority: data.average_domain_authority || "",
            total_general_links: data.total_general_links || "",
            total_unique_domain_link_type: data.total_unique_domain_by_type || "",
            total_unique_domain_amount: data.total_unique_domain_by_type || "",
            total_niche_link_category: data.total_niche_links_by_category || "",
            total_niche_link_amount: data.total_niche_links_by_category || "",
            last_updated: data.last_updated || "",
            comment_remark: data.comment_remark || "",
            recommendation: data.recommendation || "",
          });
        } catch (error) {
          toast.error("Failed to load vendor");
          navigate("/seo/vendor/vendor-details");
        } finally {
          setFetching(false);
        }
      };
      fetchVendor();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const reasons = prev.hidden_reason || [];
      if (reasons.includes(value)) {
        return { ...prev, hidden_reason: reasons.filter(r => r !== value) };
      } else {
        return { ...prev, hidden_reason: [...reasons, value] };
      }
    });
  };
  
  

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // Clean and format payload correctly
  const payload = {
    ...formData,

    // 1. Fix dates → YYYY-MM-DD string
    discovered_date: formData.discovered_date
      ? format(new Date(formData.discovered_date), "yyyy-MM-dd")
      : null,
    last_updated: formData.last_updated
      ? format(new Date(formData.last_updated), "yyyy-MM-dd")
      : null,

      visibility: formData.visibility || "public",
    // 2. Ensure hidden_reason is always an array (never string or null)
    // hidden_reason: Array.isArray(formData.hidden_reason)
    //   ? formData.hidden_reason
    //   : [],

    // 3. Convert number fields from string to integer
    total_general_links: formData.total_general_links
      ? parseInt(formData.total_general_links, 10)
      : 0,
    price_usd: formData.price_usd ? parseFloat(formData.price_usd) : null,
    total_unique_domain_amount: formData.total_unique_domain_amount
      ? parseInt(formData.total_unique_domain_amount, 10)
      : null,
    total_niche_link_amount: formData.total_niche_link_amount
      ? parseInt(formData.total_niche_link_amount, 10)
      : null,

    // 4. Ensure PIC is sent (even if empty string → backend may allow null)
    pic: formData.pic || null,
  };

  console.log("Sending payload:", payload); // ← Check this in browser console!

  try {
    if (isEditMode) {
      await axiosInstance.put(`/seo/vendors/${id}/`, payload);
      toast.success("Vendor updated successfully!");
    } else {
      await axiosInstance.post("/seo/vendors/", payload);
      toast.success("Vendor added successfully!");
    }
    navigate("/seo/vendor/vendor-details");
  } catch (error) {
    console.error("API Error:", error.response?.data);
    const msg =
      error.response?.data
        ? Object.values(error.response.data).flat().join("; ")
        : "Failed to save vendor";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  if (fetching || membersLoading) return <div className="p-8 text-center">Loading...</div>;

  const hiddenReasons = ["high_risk", "blacklisted", "low_quality_backlink", "low_productivity"];
  

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-semibold">
            {isEditMode ? "Edit Vendor" : "Add New Vendor"}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* SECTION 1: Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side */}
            <div className="space-y-6">
              <div>
                <DateField
                  fieldName="discovered_date"
                  label="Discovered Date"
                  date={formData.discovered_date}
                  setDate={(date) => setFormData({ ...formData, discovered_date: date })}
                />
              </div>
              <div>
                <Label className="mb-3">Vendor Name *</Label>
                <Input name="vendor_name" required value={formData.vendor_name} onChange={handleChange} />
              </div>
              <div>
                <Label className="mb-3">Website URL</Label>
                <Input name="website_url" type="url" value={formData.website_url} onChange={handleChange} />
              </div>
              <div>
                <Label className="mb-3">Teams ID</Label>
                <Input name="teams_id" value={formData.teams_id} onChange={handleChange} />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <div>
                <Label className="mb-3">PIC (Person In Charge)</Label>
                <Select value={formData.pic} onValueChange={(v) => handleSelectChange("pic", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select PIC" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.first_name} {m.last_name} ({m.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3">Hide Visibility Reason</Label>
                <Select value={formData.hidden_reason} onValueChange={(v) => handleSelectChange("hidden_reason", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {hiddenReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-3">Whatsapp</Label>
                <Input name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 2: Payment & Price */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Payment Method */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-3">Method</Label>
                  <Input name="payment_method" value={formData.payment_method} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-3">Payment Details</Label>
                  <Input name="payment_details" value={formData.payment_details} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Right: Price */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Price</h3>
              <div className="space-y-4">
                <div>
                  <Label className="mb-3">Link Type</Label>
                  <Select value={formData.price_by_link_type} onValueChange={(v) => handleSelectChange("price_by_link_type", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select link type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest_post">Guest Post</SelectItem>
                      <SelectItem value="niche_edit">Niche Edit</SelectItem>
                      <SelectItem value="link_insertion">Link Insertion</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-3">Price (USD)</Label>
                  <Input name="price_usd" type="number" value={formData.price_usd} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: Metrics & Unique Domains */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: General Metrics */}
            <div className="space-y-6">
              <div>
                <Label className="mb-3">Average Domain Rating</Label>
                <Input name="average_domain_rating" value={formData.average_domain_rating} onChange={handleChange} />
              </div>
              <div>
                <Label className="mb-3">Average Domain Authority</Label>
                <Input name="average_domain_authority" value={formData.average_domain_authority} onChange={handleChange} />
              </div>
              <div>
                <Label className="mb-3">Total of General Links</Label>
                <Input name="total_general_links" type="number" value={formData.total_general_links} onChange={handleChange} />
              </div>
            </div>

            {/* Right: Total Unique Domain */}
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Total Unique Domain</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-3">Link Type</Label>
                  <Input name="total_unique_domain_link_type" value={formData.total_unique_domain_link_type} onChange={handleChange} />
                </div>
                <div>
                  <Label className="mb-3">Link Amount</Label>
                  <Input name="total_unique_domain_amount" type="number" value={formData.total_unique_domain_amount} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: Total Niche Link */}
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Total Niche Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-3">Category</Label>
                <Input name="total_niche_link_category" value={formData.total_niche_link_category} onChange={handleChange} />
              </div>
              <div>
                <Label className="mb-3">Link Amount</Label>
                <Input name="total_niche_link_amount" type="number" value={formData.total_niche_link_amount} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* SECTION 5: Final Fields & Submit */}
          <div className="space-y-6">
            <div>
              <DateField
                fieldName="last_updated"
                label="Last Updated"
                date={formData.last_updated}
                setDate={(date) => setFormData({ ...formData, last_updated: date })}
              />
            </div>
            <div>
              <Label className="mb-3">Comment / Remark</Label>
              <Textarea name="comment_remark" value={formData.comment_remark} onChange={handleChange} rows={4} />
            </div>
            <div>
              <Label className="mb-3">Recommendation</Label>
              <Textarea name="recommendation" value={formData.recommendation} onChange={handleChange} rows={4} />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Saving..." : isEditMode ? "Update Vendor" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorFormPage;