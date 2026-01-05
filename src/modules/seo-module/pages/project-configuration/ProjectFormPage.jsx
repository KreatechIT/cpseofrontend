import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ProjectFormPage = () => {
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
    project_name: "",
    sub_project_name: "",
    project_id: "",
    website: "",
    status: "Active",
    join: "",
    keywords: "",
    due_date: "",
    launched_date: "",
    domain_created: "",
    domain_expires: "",
    pic: "",
    owner: "",
    creator: "",
    server_location: "",
    web_server: "",
    login_ips: "",
    impressions: "",
    clicks: "",
    remarks: "",
  });

  // Fetch members for PIC & Owner
  useEffect(() => {
    if (!organisationId) {
      toast.error("Organisation not found");
      setMembersLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        const res = await axiosInstance.get(
          `/organisation/${organisationId}/users/`
        );
        setMembers(res.data); // full list is fine, we filter display below
      } catch (error) {
        toast.error("Failed to load team members");
        console.error(error);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [organisationId]);

  // Fetch project if editing
  useEffect(() => {
    if (isEditMode && organisationId) {
      const fetchProject = async () => {
        try {
          const res = await axiosInstance.get(`/seo/projects/${id}/`);
          const data = res.data;
          setFormData({
            project_name: data.project_name || "",
            sub_project_name: data.sub_project_name || "",
            project_id: data.project_id || "",
            website: data.website || "",
            status: data.status || "Active",
            join: data.join || "",
            keywords: data.keywords || "",
            due_date: data.due_date || "",
            launched_date: data.launched_date || "",
            domain_created: data.domain_created || "",
            domain_expires: data.domain_expires || "",
            pic: data.pic || "",
            owner: data.owner || "",
            creator: data.creator || "",
            server_location: data.server_location || "",
            web_server: data.web_server || "",
            login_ips: data.login_ips || "",
            impressions: data.impressions || "",
            clicks: data.clicks || "",
          });
        } catch (error) {
          toast.error("Failed to load project");
          navigate("/seo/project-configuration");
        } finally {
          setFetching(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode, organisationId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organisationId) {
      toast.error("Organisation ID missing");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData };

      if (isEditMode) {
        await axiosInstance.put(`/seo/projects/${id}/`, payload);
        toast.success("Project updated successfully!");
      } else {
        await axiosInstance.post("/seo/projects/", payload);
        toast.success("Project added successfully!");
      }
      navigate("/seo/project-configuration");
    } catch (error) {
      const errors = error.response?.data;
      if (errors) {
        const msg = Object.values(errors).flat().join("; ");
        toast.error(msg || "Failed to save project");
      } else {
        toast.error("Network error. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || membersLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-semibold">
            {isEditMode ? "Edit Project" : "Add New Project"}
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ==================== SECTION 1: Project Basics ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side: Main Fields (2 columns on large screens) */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Project Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="project_name"
                  required
                  value={formData.project_name}
                  onChange={handleChange}
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2 block">
                  Project ID
                </Label>
                <Input
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  placeholder="e.g. ORN-2025-001"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2 block">
                  Website
                </Label>
                <Input
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label className="text-base font-medium mb-2 block">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleSelectChange("status", v)}
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*Right Side: Sub Project (full height, single field)  <span className="text-red-500">*</span>/ */}
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2 block">
                  Sub Project
                </Label>
                <Input
                  name="sub_project_name"
                  value={formData.sub_project_name}
                  onChange={handleChange}
                  placeholder="Optional sub-project name"
                />
              </div>
            </div>
          </div>

          {/* ==================== SECTION 2: Dates ==================== */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="mb-2 block">
                  Launched Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="launched_date"
                  type="date"
                  required
                  value={formData.launched_date}
                  onChange={handleChange}
                  className="w-[100%] md:w-full"
                />
              </div>
              <div>
                <Label className="mb-2 block">
                  Domain Created <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="domain_created"
                  type="date"
                  required
                  value={formData.domain_created}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="mb-2 block">
                  Domain Expires <span className="text-red-500">*</span>
                </Label>
                <Input
                  name="domain_expires"
                  type="date"
                  required
                  value={formData.domain_expires}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label className="mb-2 block">
                  Due Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  required
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ==================== SECTION 3: Technical & Assignment ==================== */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Technical Details & Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label className="mb-2 block">Server Location</Label>
                <Input
                  name="server_location"
                  value={formData.server_location || ""}
                  onChange={handleChange}
                  placeholder="e.g. AWS US-East-1"
                />
              </div>
              <div>
                <Label className="mb-2 block">Web Server</Label>
                <Input
                  name="web_server"
                  value={formData.web_server || ""}
                  onChange={handleChange}
                  placeholder="e.g. Apache, Nginx"
                />
              </div>
              <div>
                <Label className="mb-2 block">Login IPs</Label>
                <Input
                  name="login_ips"
                  value={formData.login_ips || ""}
                  onChange={handleChange}
                  placeholder="Allowed IP addresses"
                />
              </div>

              <div>
                <Label className="mb-2 block">
                  PIC (Person In Charge) <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.pic}
                  onValueChange={(v) => handleSelectChange("pic", v)}
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select PIC" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Creator</Label>
                <Select
                  value={formData.creator || ""}
                  onValueChange={(v) => handleSelectChange("creator", v)}
                  className="w-full"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">
                  Owner <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.owner}
                  onValueChange={(v) => handleSelectChange("owner", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.first_name} {member.last_name} ({member.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* ==================== SECTION 4: KPIs ==================== */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              KPIs (Key Performance Indicators)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="mb-2 block">
                  Impressions{" "}
                  <span className="text-red-500">
                    {" "}
                    <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  name="impressions"
                  type="number"
                  required
                  value={formData.impressions || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="mb-2 block">
                  Clicks{" "}
                  <span className="text-red-500">
                    {" "}
                    <span className="text-red-500">*</span>
                  </span>
                </Label>
                <Input
                  name="clicks"
                  type="number"
                  required
                  value={formData.clicks || ""}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <Label className="mb-2 block">Join</Label>
                <Input
                  name="join"
                  value={formData.join}
                  onChange={handleChange}
                  placeholder="e.g. Affiliate link or source"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-2 block">Keywords</Label>
              <Input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="seo, marketing, web, ranking"
              />
            </div>
            <div className="mt-6">
              <Label className="mb-2 block">Remark</Label>
              <Input
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Additional notes or remarks"
              />
            </div>
          </div>

          {/*==================== Submit Buttons ====================  */}
          <div className="flex justify-end gap-4 pt-6 pt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormPage;
