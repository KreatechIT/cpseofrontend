import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateField from "@/components/form-fields/DateField"; // ← Your custom date picker
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import {
  createCompetitor,
  updateCompetitorById,
} from "../../services/competitorDetailsService";
import { ArrowLeft } from "lucide-react";
import { differenceInMonths, differenceInYears } from "date-fns";
import { format } from "date-fns";

const CompetitorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const dispatch = useDispatch();
const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    unique_domain: "",
    redirection: "",
    product: "",
    business_type: "",
    domain_rating: "",
    url_rating: "",
    domain_authority: "",
    page_authority: "",
    spam_score: "",
    total_backlinks: "",
    referring_domain: "",
    total_organic_keywords: "",
    domain_created_date: "",
    domain_expiration_date: "",
    domain_age: "",
    date_start_ranking: "",
  });

  const [loading, setLoading] = useState(isEditMode);

  // Auto-calculate Domain Age when domain_created_date changes
  useEffect(() => {
    if (formData.domain_created_date) {
      const created = new Date(formData.domain_created_date);
      const now = new Date();
      const years = differenceInYears(now, created);
      const months = differenceInMonths(now, created) % 12;
      setFormData(prev => ({
        ...prev,
        domain_age: `${years} years, ${months} months`
      }));
    } else {
      setFormData(prev => ({ ...prev, domain_age: "" }));
    }
  }, [formData.domain_created_date]);

  // Load data on edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCompetitor = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/seo/competitors/${id}/`);
          const data = res.data;
          setFormData({
            company: data.company || "",
            unique_domain: data.unique_domain || "",
            redirection: data.redirection || "",
            product: data.product || "",
            business_type: data.business_type || "",
            domain_rating: data.domain_rating || "",
            url_rating: data.url_rating || "",
            domain_authority: data.domain_authority || "",
            page_authority: data.page_authority || "",
            spam_score: data.spam_score || "",
            total_backlinks: data.total_backlinks || "",
            referring_domain: data.referring_domain || "",
            total_organic_keywords: data.total_organic_keywords || "",
            domain_created_date: data.domain_created_date || "",
            domain_expiration_date: data.domain_expiration_date || "",
            domain_age: data.domain_age || "",
            date_start_ranking: data.date_start_ranking || "",
          });
        } catch (error) {
          toast.error("Failed to load competitor");
          navigate("/seo/competitor/competitor-details");
        } finally {
          setLoading(false);
        }
      };
      fetchCompetitor();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
    setSubmitting(true); // ← Start loading

  // Format dates to YYYY-MM-DD string
  const payload = {
    ...formData,
    domain_created_date: formData.domain_created_date
      ? format(new Date(formData.domain_created_date), "yyyy-MM-dd")
      : null,
    domain_expiration_date: formData.domain_expiration_date
      ? format(new Date(formData.domain_expiration_date), "yyyy-MM-dd")
      : null,
    date_start_ranking: formData.date_start_ranking
      ? format(new Date(formData.date_start_ranking), "yyyy-MM-dd")
      : null,
  };

  try {
    if (isEditMode) {
      await updateCompetitorById(dispatch, id, payload);
    } else {
      await createCompetitor(dispatch, payload);
    }
    navigate("/seo/competitor/competitor-details");
  } catch (error) {
    // Error handled in service
  }
  finally {
    setSubmitting(false); // ← Stop loading even if error
  }
};

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-semibold">
            {isEditMode ? "Edit Competitor" : "Add New Competitor"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <Label className="mb-3">Company <span className="text-red-500">*</span></Label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="mb-3">Unique Domain <span className="text-red-500">*</span></Label>
                <Input
                  name="unique_domain"
                  value={formData.unique_domain}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="mb-3">Redirection</Label>
                <Input
                  name="redirection"
                  value={formData.redirection}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Product</Label>
                <Input
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Business Type</Label>
                <Input
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Domain Rating</Label>
                <Input
                  name="domain_rating"
                  type="number"
                  step="0.01"
                  value={formData.domain_rating}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Total Organic Keywords</Label>
                <Input
                  name="total_organic_keywords"
                  type="number"
                  value={formData.total_organic_keywords}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="">Domain Created Date</Label>
                <DateField
                  fieldName="domain_created_date"
                  date={formData.domain_created_date}
                  setDate={(date) => handleDateChange("domain_created_date", date)}
                  isRequired={false}
                />
              </div>

              <div>
                <Label className="">Domain Expiration Date</Label>
                <DateField
                  fieldName="domain_expiration_date"
                  // label="Domain Expiration Date"
                  date={formData.domain_expiration_date}
                  setDate={(date) => handleDateChange("domain_expiration_date", date)}
                  isRequired={false}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <Label className="mb-3">URL Rating</Label>
                <Input
                  name="url_rating"
                  type="number"
                  step="0.01"
                  value={formData.url_rating}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Domain Authority</Label>
                <Input
                  name="domain_authority"
                  type="number"
                  value={formData.domain_authority}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Page Authority</Label>
                <Input
                  name="page_authority"
                  type="number"
                  value={formData.page_authority}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Spam Score</Label>
                <Input
                  name="spam_score"
                  type="number"
                  value={formData.spam_score}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Total Backlinks</Label>
                <Input
                  name="total_backlinks"
                  type="number"
                  value={formData.total_backlinks}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="mb-3">Referring Domain</Label>
                <Input
                  name="referring_domain"
                  type="number"
                  value={formData.referring_domain}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label className="">Date Start Ranking</Label>
                <DateField
                  fieldName="date_start_ranking"
                  // label="Date Start Ranking"
                  date={formData.date_start_ranking}
                  setDate={(date) => handleDateChange("date_start_ranking", date)}
                  isRequired={false}
                />
              </div>

              <div>
                <Label className="mb-3">Domain Age (Auto calculated)</Label>
                <Input
                  value={formData.domain_age}
                  disabled
                  className="bg-gray-100"
                  placeholder="Calculated automatically"
                />
              </div>
            </div>
          </div>

         {/* Submit Buttons */}
          <div className="flex justify-end gap-4 mt-12 pt-8 border-t">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 min-w-[160px]"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                isEditMode ? "Update Competitor" : "Create Competitor"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetitorForm;