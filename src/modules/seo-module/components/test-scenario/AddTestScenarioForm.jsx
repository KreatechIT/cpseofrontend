import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { createTestScenario } from "../../services/testScenarioService";
import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";

const AddTestScenarioForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  
  // Form state with empty values
  const [formData, setFormData] = useState({
    created_date: new Date(),
    test_scenario: "",
    project: "",
    sub_project: "",
    unique_domain: "",
    page_url: "",
    hypothesis: "",
    expected_result: "",
    start_date: null,
    found_date: null,
    outcome: "",
    analysis: "",
    result: "",
    conclusion: "",
    next_steps: "",
    implementation_date: null,
  });

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get("/seo/projects/");
        setProjects(res.data);
      } catch (error) {
        toast.error("Failed to load projects");
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      { field: 'test_scenario', label: 'Test Scenario' },
      { field: 'project', label: 'Project' },
      { field: 'unique_domain', label: 'Unique Domain' },
      { field: 'hypothesis', label: 'Hypothesis' },
      { field: 'expected_result', label: 'Expected Result' },
      { field: 'start_date', label: 'Start Date' },
      { field: 'found_date', label: 'Found Date' },
      { field: 'outcome', label: 'Outcome' },
      { field: 'analysis', label: 'Analysis' },
      { field: 'result', label: 'Result' },
    ];

    const missingFields = requiredFields.filter(({ field }) => !formData[field]);
    
    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ label }) => label).join(', ');
      toast.error(`Please fill in required fields: ${fieldNames}`);
      return;
    }

    setLoading(true);

    try {
      // Format dates for API
      const payload = {
        ...formData,
        created_date: formData.created_date ? format(formData.created_date, "yyyy-MM-dd") : null,
        start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
        found_date: formData.found_date ? format(formData.found_date, "yyyy-MM-dd") : null,
        implementation_date: formData.implementation_date ? format(formData.implementation_date, "yyyy-MM-dd") : null,
      };

      await createTestScenario(payload);
      toast.success("Test scenario created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Create failed:", error);
      toast.error("Failed to create test scenario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <h2 className="text-lg font-semibold sticky top-0 bg-background pb-2">Add Test Scenario</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Created Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.created_date ? format(formData.created_date, "dd/MM/yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.created_date}
                onSelect={(date) => setFormData({ ...formData, created_date: date })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Project *</Label>
          <Select value={formData.project} onValueChange={(value) => setFormData({ ...formData, project: value })}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.project_name || p.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Test Scenario *</Label>
        <Textarea
          value={formData.test_scenario}
          onChange={(e) => setFormData({ ...formData, test_scenario: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Sub Project</Label>
          <Input
            value={formData.sub_project}
            onChange={(e) => setFormData({ ...formData, sub_project: e.target.value })}
            className="mt-2"
          />
        </div>

        <div>
          <Label>Unique Domain *</Label>
          <Input
            value={formData.unique_domain}
            onChange={(e) => setFormData({ ...formData, unique_domain: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label>Page URL</Label>
        <Input
          type="url"
          value={formData.page_url}
          onChange={(e) => setFormData({ ...formData, page_url: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label>Hypothesis *</Label>
        <Textarea
          value={formData.hypothesis}
          onChange={(e) => setFormData({ ...formData, hypothesis: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div>
        <Label>Expected Result *</Label>
        <Textarea
          value={formData.expected_result}
          onChange={(e) => setFormData({ ...formData, expected_result: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.start_date}
                onSelect={(date) => setFormData({ ...formData, start_date: date })}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Found Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.found_date ? format(formData.found_date, "dd/MM/yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.found_date}
                onSelect={(date) => setFormData({ ...formData, found_date: date })}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label>Outcome *</Label>
        <Textarea
          value={formData.outcome}
          onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div>
        <Label>Analysis *</Label>
        <Textarea
          value={formData.analysis}
          onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div>
        <Label>Result *</Label>
        <Select value={formData.result} onValueChange={(value) => setFormData({ ...formData, result: value })}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Positive">Positive</SelectItem>
            <SelectItem value="Negative">Negative</SelectItem>
            <SelectItem value="Neutral">Neutral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Conclusion</Label>
        <Textarea
          value={formData.conclusion}
          onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div>
        <Label>Next Steps</Label>
        <Textarea
          value={formData.next_steps}
          onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>

      <div>
        <Label>Implementation Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal mt-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.implementation_date ? format(formData.implementation_date, "dd/MM/yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.implementation_date}
              onSelect={(date) => setFormData({ ...formData, implementation_date: date })}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-background border-t">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default AddTestScenarioForm;
