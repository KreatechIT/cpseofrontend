import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import ExcelUploadField from "@/components/form-fields/ExcelUploadField";
import OrderImportTable from "./OrderImportTable";
import ExportDataModal from "./ExportDataModal";
import {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} from "../../store/orderImportSlice";
import { importOrderData } from "../../services/orderImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const OrderImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.orderImport);

  const [fileTitle, setFileTitle] = useState("");
  const [uploadedDate, setUploadedDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedFile, setLastProcessedFile] = useState("");
  
  // Modal state for export data
  const [showExportModal, setShowExportModal] = useState(false);
  const [importedOrders, setImportedOrders] = useState([]);

  // Fetch users, projects, vendors
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.organisation_id) return;

      setLoadingUsers(true);
      try {
        const [usersRes, projectsRes, vendorsRes] = await Promise.all([
          axiosInstance.get(`/organisation/${user.organisation_id}/users/`),
          axiosInstance.get("/seo/projects/"),
          axiosInstance.get("/seo/vendors/"),
        ]);

        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setVendors(vendorsRes.data);

        // Auto-select current user
        const currentUser = usersRes.data.find((u) => u.id === user.id);
        if (currentUser) setUsername(currentUser.id);
      } catch (error) {
        toast.error("Failed to load users, projects, or vendors");
        console.error(error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchData();
  }, [user?.organisation_id, user?.id]);

  const handleFileChange = (file) => {
    if (!file) {
      setFileName("");
      dispatch(clearImportedData());
      setLastProcessedFile("");
      return;
    }

    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      toast.error("Please upload an Excel file (.xls or .xlsx)");
      return;
    }

    if (file.name === fileName && importedData) return;

    setFileName(file.name);
    setLastProcessedFile("");
    dispatch(setImportLoading(true));

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: "arraybuffer",
          cellDates: true,
          cellText: true,
          sheetStubs: true,
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
          raw: false,
        });

        if (jsonData.length < 2) {
          toast.error("File is empty or has no data rows");
          dispatch(setImportLoading(false));
          return;
        }

        const cleanedHeaders = jsonData[0].map((h) =>
          typeof h === "string" ? h.trim() : ""
        );
        setColumns(cleanedHeaders);

        const rows = jsonData.slice(1).filter((row) =>
          row.some((cell) => cell !== "" && cell !== null && cell !== undefined)
        );

        const parsedRows = rows.map((row) => {
          const obj = {};
          cleanedHeaders.forEach((header, index) => {
            let value = row[index] || "";
            if (typeof value === "string") value = value.trim();
            obj[header] = value;
          });
          return obj;
        });

        dispatch(storeImportedData(parsedRows));
        setUploadedDate(new Date());
        setTime(format(new Date(), "HH:mm"));

        if (lastProcessedFile !== file.name) {
          toast.success(`Successfully parsed ${parsedRows.length} rows`);
          setLastProcessedFile(file.name);
        }
      } catch (err) {
        console.error("Parse error:", err);
        toast.error("Failed to read Excel file. Try saving as .xlsx");
      } finally {
        dispatch(setImportLoading(false));
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      dispatch(setImportLoading(false));
    };

    reader.readAsArrayBuffer(file);
  };

  // Helper to get value safely
  const getValue = (row, columnName) => {
    if (!row || !columnName) return "";
    const key = Object.keys(row).find(
      (k) => k.toLowerCase() === columnName.toLowerCase()
    );
    return key ? row[key] : "";
  };

  // Filter data
  const filteredData = importedData?.filter((row) => {
    // Search
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      if (
        !Object.values(row).some((v) =>
          v?.toString().toLowerCase().includes(term)
        )
      ) {
        return false;
      }
    }

    // Date filter (using Created Date)
    if (dateFilter.from || dateFilter.to) {
      const rowDateStr = getValue(row, "Created Date");
      if (!rowDateStr) return false;
      const rowDate = new Date(rowDateStr);
      if (isNaN(rowDate.getTime())) return false;
      if (dateFilter.from && rowDate < dateFilter.from) return false;
      if (dateFilter.to && rowDate > dateFilter.to) return false;
    }

    return true;
  }) || [];

  const handleImport = async () => {
    if (!importedData || importedData.length === 0) {
      return toast.error("No data to import");
    }
    if (!selectedProject || !selectedVendor) {
      return toast.error("Please select Project and Vendor");
    }

    setLoading(true);

    try {
      // Prepare all orders for bulk import
      const orders = importedData.map((row) => ({
        created_date: getValue(row, "Created Date")
          ? format(new Date(getValue(row, "Created Date")), "dd/MM/yyyy")
          : format(new Date(), "dd/MM/yyyy"),
        domain: getValue(row, "Unique Domain") || "",
        vendor: vendors.find(v => v.id === selectedVendor)?.vendor_name || "",
        link_type: getValue(row, "Link Type") || "Guest Post",
        keyword_1: getValue(row, "Keyword (1)") || "",
        target_url_1: getValue(row, "Target URL (1)") || "",
        keyword_2: getValue(row, "Keyword (2)") || "",
        target_url_2: getValue(row, "Target URL (2)") || "",
        link_amount: parseInt(getValue(row, "Link Amount") || 0),
      }));

      // Find the selected project
      const selectedProjectObj = projects.find(p => p.id === selectedProject);
      
      if (!selectedProjectObj || !selectedProjectObj.project_name) {
        toast.error("Invalid project selected");
        setLoading(false);
        return;
      }

      // Prepare bulk import payload matching API spec
      const payload = {
        project_id: selectedProjectObj.project_name, // Use project_name like "PA", "PA.1"
        publish_date_from: format(uploadedDate, "dd/MM/yyyy"),
        publish_date_to: format(new Date(uploadedDate.getTime() + 30 * 24 * 60 * 60 * 1000), "dd/MM/yyyy"), // 30 days later
        orders: orders,
      };

      console.log("Sending payload:", payload);

      // Call bulk import API
      const response = await importOrderData(payload);

      // Log the response to see what we get back
      console.log("Import response:", response);

      toast.success(response.message || `Successfully imported ${response.total_orders} orders and generated ${response.total_links_generated} links!`);
      
      // Show modal with export_data from response
      setImportedOrders(response.export_data || []);
      setShowExportModal(true);

      // Clear form
      dispatch(clearImportedData());
      setFileName("");
      setFileTitle("");
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 mt-3">
      {/* Form Fields */}
      <div className="space-y-6 ">
        <div>
          <Label className="mb-3">File Title</Label>
          <Input value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} />
        </div>

        <div>
          <Label className="mb-3">Uploaded Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(uploadedDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={uploadedDate} onSelect={setUploadedDate} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="mb-3">Time</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>

        <div>
          <Label className="mb-3">Username</Label>
          <Select value={username} onValueChange={setUsername}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loadingUsers ? "Loading..." : "Select user"} />
            </SelectTrigger>
            <SelectContent>
              {loadingUsers ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Project *</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
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

        <div className="w-full">
          <Label className="mb-3">Vendor *</Label>
          <Select value={selectedVendor} onValueChange={setSelectedVendor} className="w-full">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.vendor_name || v.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Excel Upload */}
      <div>
        <Label className="mb-3">Excel File Upload</Label>
        <ExcelUploadField onFileChange={handleFileChange} />
        {fileName && <p className="text-sm text-muted-foreground mt-2">Uploaded: {fileName}</p>}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <Button onClick={handleImport} disabled={loading || !importedData || !selectedProject || !selectedVendor}>
          {loading ? "Uploading..." : "Upload Orders"}
        </Button>
      </div>

      {/* Preview Section */}
      {importedData && (
        <div className="border p-6 rounded-lg space-y-6 bg-gray-50">
          <h3 className="text-lg font-semibold">Data Preview</h3>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <Label className="mb-3">Search</Label>
              <Input
                placeholder="Search any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-[250px]">
              <Label className="mb-3">Date Filter</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter.from
                      ? dateFilter.to
                        ? `${format(dateFilter.from, "PP")} - ${format(dateFilter.to, "PP")}`
                        : format(dateFilter.from, "PP")
                      : "Select range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="range" selected={dateFilter} onSelect={setDateFilter} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Table */}
          <OrderImportTable data={filteredData} columns={columns} />
        </div>
      )}

      {/* Export Data Modal */}
      <ExportDataModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        orders={importedOrders}
      />
    </div>
  );
};

export default OrderImportForm;
