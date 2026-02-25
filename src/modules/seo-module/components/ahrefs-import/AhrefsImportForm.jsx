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
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import ExcelUploadField from "@/components/form-fields/ExcelUploadField"; // ← Your reliable component
import AhrefsImportTable from "./AhrefsImportTable";
import {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} from "../../store/ahrefsImportSlice";
import {
  importProjectData,
  importCompetitorData,
} from "../../services/ahrefsImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";


const AhrefsImportForm = () => {
const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.ahrefsImport);

  const [fileTitle, setFileTitle] = useState("");
  const [uploadedDate, setUploadedDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  // const [username] = useState(user?.username || "");
  const [pic, setPic] = useState("");
  const [fileName, setFileName] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importType, setImportType] = useState('project'); // "project" or "competitor"
  const [projects, setProjects] = useState([]); // Fetched projects
  const [vendors, setVendors] = useState([]); // Fetched vendors
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [username, setUsername] = useState(""); // Now controlled by dropdown

  const statusOptions = ["Active", "Inactive"];
  const setImportError = (error) => {
    toast.error(error);
  };

  const picOptions = ["PIC1", "PIC2", "PIC3"]; // Replace with API later

  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  const [lastProcessedFile, setLastProcessedFile] = useState(""); // Track last file name

  // Fetch projects and vendors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await axiosInstance.get("/seo/projects/");
        setProjects(projectsRes.data);

        const vendorsRes = await axiosInstance.get("/seo/vendors/");
        setVendors(vendorsRes.data);
      } catch (error) {
        toast.error("Failed to load projects or vendors");
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
  const fetchUsers = async () => {
    if (!user?.organisation_id) {
      toast.error("Organisation ID not found");
      setLoadingUsers(false);
      return;
    }

    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get(`/organisation/${user.organisation_id}/users/`);
      setUsers(res.data);
      setLoadingUsers(false);

      // Optional: Auto-select current user if available
      const currentUserInList = res.data.find(u => u.id === user?.id);
      if (currentUserInList) {
        setUsername(currentUserInList.id);
      }
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
      setLoadingUsers(false);
    }
  };

  fetchUsers();
}, [user?.organisation_id]);
useEffect(() => {
  if (!importType && importedData) {
    setImportType("project"); // Default selection
  }
}, [importedData]);
  const handleFileChange = (file) => {
    if (!file) {
      setFileName("");
      dispatch(clearImportedData());
      setLastProcessedFile(""); // Reset
      return;
    }

    if (!file.name.match(/\.(xls|xlsx)$/i)) {
      toast.error("Please upload an Excel file (.xls or .xlsx)");
      return;
    }

    // Prevent duplicate processing for same file
    if (file.name === fileName && importedData) {
      // Same file already processed — don't re-parse
      return;
    }

    setFileName(file.name);
    setLastProcessedFile(""); // Reset toast for new file
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

        const rawHeaders = jsonData[0];
        const cleanedHeaders = rawHeaders.map((h) =>
          typeof h === "string" ? h.replace(/[_x0000_]/g, " ").trim() : ""
        );
        setColumns(cleanedHeaders);

        const rows = jsonData
          .slice(1)
          .filter((row) =>
            row.some(
              (cell) => cell !== "" && cell !== null && cell !== undefined
            )
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

        // Show toast ONLY if not already shown for this file
        if (lastProcessedFile !== file.name) {
          toast.success(`Successfully parsed ${parsedRows.length} rows`);
          setLastProcessedFile(file.name);
        }

        // Remove console.log unless debugging
        // console.log("Parsed Rows:", parsedRows);
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

  // Safe formatting
const formatDateForAPI = (dateInput) => {
  if (!dateInput) return null;

  let date;

  if (typeof dateInput === "string") {
    // Clean string
    const cleanStr = dateInput.trim().split(" ")[0]; // Remove time if present

    // Parse M/D/YY or MM/DD/YY
    const parts = cleanStr.split("/");
    if (parts.length === 3) {
      let [month, day, year] = parts.map(Number);
      year = year < 100 ? 2000 + year : year;
      month = month || 1; // Default if missing
      day = day || 1;
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(cleanStr);
    }
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  return format(date, "yyyy-MM-dd");
};
const handleImport = async () => {
    if (!importedData || !importType) return toast.error("Select import type and upload data");

    if (importType === "project" && (!selectedProject || !selectedVendor)) {
      return toast.error("Project and Vendor are required");
    }
    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    // Common fields
    const basePayload = {
      file_title: fileTitle || "Ahrefs Import",
      uploaded_date: format(uploadedDate, "yyyy-MM-dd"),
      time: time || format(new Date(), "HH:mm"),
      username: username,
      pic: pic || null,
    };

    // Helper to safely get value from row by column name (case-insensitive + trimmed)
    const getValue = (row, columnName) => {
      if (!row || !columnName) return null;
      const key = Object.keys(row).find(
        (k) => k.trim().toLowerCase() === columnName.trim().toLowerCase()
      );
      return key ? row[key] || null : null;
    };

    const importPromises = importedData.map(async (row) => {
      try {
        let payload = { ...basePayload };

        if (importType === "project") {
          // Map fields for /seo/purchased/ including new Ahrefs fields
          payload = {
            ...payload,
            created_date: formatDateForAPI(getValue(row, "First seen")),
            order_month: formatDateForAPI(getValue(row, "First seen")),
            domain: getValue(row, "Referring page URL")?.split('/')[2] || getValue(row, "Referring page URL"),
            link_type: "Guest Post", // or map from "Type" column if needed
            price_usd: getValue(row, "Keywords") ? "1.00" : "0.00", // placeholder
            price_myr: getValue(row, "Keywords") ? "4.70" : "0.00", // placeholder
            unique_domain: getValue(row, "Referring page URL")?.split('/')[2] || "",
            live_link: getValue(row, "Referring page URL") || "",
            keyword_1: getValue(row, "Anchor") || "",
            target_url_1: getValue(row, "Target URL") || "",
            keyword_2: "",
            target_url_2: "",
            status: "Found",
            link_status: "200",
            follow: getValue(row, "Nofollow") === "TRUE" ? "No" : "Yes",
            domain_rating: getValue(row, "Domain rating") || "0",
            domain_authority: getValue(row, "Domain rating") || 0,
            page_authority: getValue(row, "UR") || 0,
            spam_score: 0,
            domain_created_date: "2000-01-01", // placeholder
            domain_expiration_date: "2026-01-01", // placeholder
            domain_age: "26 years, 0 months",
            remark: getValue(row, "Referring page title") || "",
            backlinks_id: `PA-${Date.now()}`,
            project: selectedProject, // Selected UUID
            vendor: selectedVendor, // Selected UUID
            // New Ahrefs fields
            url_rating: getValue(row, "UR") || null,
            domain_traffic: getValue(row, "Domain traffic") || null,
            referring_domains: getValue(row, "Referring domains") || null,
            linked_domains: getValue(row, "Linked domains") || null,
            external_links: getValue(row, "External links") || null,
            page_traffic: getValue(row, "Page traffic") || null,
            total_organic_keywords: getValue(row, "Keywords") || null,
            anchor_text: getValue(row, "Anchor") || "",
            redirect_chain_urls: getValue(row, "Redirect Chain URLs") || "",
            redirect_chain_status_codes: getValue(row, "Redirect Chain status codes") || "",
            first_seen: formatDateForAPI(getValue(row, "First seen")),
            last_seen: formatDateForAPI(getValue(row, "Last seen")),
            lost: formatDateForAPI(getValue(row, "Lost")) || null,
          };

          await importProjectData(payload);
        } 
        else if (importType === "competitor") {
          // Map fields for /seo/competitor-pool/ including new Ahrefs fields
          console.log("Importing competitor with row:", row);
          payload = {
            ...payload,
            unique_domain: getValue(row, "Referring page URL")?.split('/')[2] || "",
            live_link: getValue(row, "Referring page URL") || "",
            vendor: "Ahrefs Import",
            price_usd: "0.00",
            overlap_competitors: "",
            associated_vendors: "",
            project_consists_link: "",
            domain_rating: getValue(row, "Domain rating") || "0",
            domain_authority: getValue(row, "Domain rating") || 0,
            spam_score: 0,
            first_seen: formatDateForAPI(getValue(row, "First seen")),
            last_seen: formatDateForAPI(getValue(row, "Last seen")),
            // New Ahrefs fields
            url_rating: getValue(row, "UR") || null,
            domain_traffic: getValue(row, "Domain traffic") || null,
            referring_domains: getValue(row, "Referring domains") || null,
            linked_domains: getValue(row, "Linked domains") || null,
            external_links: getValue(row, "External links") || null,
            page_traffic: getValue(row, "Page traffic") || null,
            total_organic_keywords: getValue(row, "Keywords") || null,
            target_url: getValue(row, "Target URL") || "",
            anchor_text: getValue(row, "Anchor") || "",
            redirect_chain_urls: getValue(row, "Redirect Chain URLs") || "",
            redirect_chain_status_codes: getValue(row, "Redirect Chain status codes") || "",
            follow: getValue(row, "Nofollow") === "TRUE" ? "No" : "Yes",
            lost: formatDateForAPI(getValue(row, "Lost")) || null,
          };

          await importCompetitorData(payload);
        }

        successCount++;
      } catch (error) {
        errorCount++;
        console.error("Import failed for row:", row, error);
      }
    });

    try {
      await Promise.all(importPromises);

      toast.success(
        `Import complete! ${successCount} rows imported successfully.` +
        (errorCount > 0 ? ` ${errorCount} failed.` : "")
      );

      dispatch(clearImportedData());
      setFileName("");
      setFileTitle("");
      setPic("");
      setSelectedProject(null);
      setSelectedVendor(null);
      // columns should be null now since importedData is cleared
      setColumns([]);

    } catch (err) {
      toast.error("Import failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Filter by date (assuming a 'date' column in data)
  const filteredData =
    importedData?.filter((row) => {
      if (!dateFilter.from && !dateFilter.to) return true;
      const rowDate = new Date(row.date); // Adjust to your date column
      if (dateFilter.from && rowDate < dateFilter.from) return false;
      if (dateFilter.to && rowDate > dateFilter.to) return false;
      return true;
    }) || [];

    function cn(...inputs) {
      return inputs.filter(Boolean).join(' ');
    }

  return (
    <div className="space-y-8 mt-3">
      {/* Upload Area */}
      {/* <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium">
          Drop your file here or click to upload
        </p>
        <p className="text-sm text-muted-foreground">
          You can upload (.xls, .xlsx, or other supported document files).
        </p>
        <Input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Label htmlFor="file-upload" className="mt-4 block">
          <Button variant="outline" asChild>
            <span>Select File</span>
          </Button>
        </Label>
      </div> */}
      {/* File Upload using your component */}
       <div>
          <Label className="mb-3">File Title</Label>
          <Input
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
          />
        </div>
        <div>
          <Label className="mb-3">Uploaded Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {uploadedDate ? format(uploadedDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={uploadedDate}
                onSelect={setUploadedDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      {/* Dynamic Fields */}
        {importType === "project" && (
          <div className="space-y-4">
            <div className="w-full">
              <Label className="mb-3">Project *</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject} className="w-full">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_name || project.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full">
              <Label className="mb-3">Vendor *</Label>
              <Select value={selectedVendor} onValueChange={setSelectedVendor} className="w-full">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.vendor_name || vendor.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        <div>
          <Label className="mb-3">Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      <div>
        <Label className="mb-3">Username</Label>
        <Select value={username} onValueChange={setUsername}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingUsers ? "Loading users..." : "Select a user"} />
          </SelectTrigger>
          <SelectContent>
            {loadingUsers ? (
              <SelectItem value="loading" disabled>
                Loading users...
              </SelectItem>
            ) : users.length > 0 ? (
              users.map((userItem) => (
                <SelectItem key={userItem.id} value={userItem.id}>
                  {userItem.first_name} {userItem.last_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                No users found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="mb-3">Excel File Upload</Label>
        <ExcelUploadField onFileChange={handleFileChange} />
      </div>


      {/* Form Fields */}


      {/* Single Import Button */}
      <div className="flex flex-wrap gap-6 justify-end">
        <Button onClick={handleImport} disabled={loading || !importedData}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
      
      <div className="border p-4 space-y-6 border-gray-200 rounded-lg">
        {/* Right Side: PIC, File Name, Calendar Filter */}
        <div className="flex flex-wrap gap-6 justify-between">
          {/* Import Type Select */}
          <div>
            <div className="flex gap-4">
              <Button
                variant={importType === "project" ? "default" : "outline"}
                className={cn(
                  " transition-all",
                  importType === "project" && "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setImportType("project")}
              >
                Project Data
              </Button>

              <Button
                variant={importType === "competitor" ? "default" : "outline"}
                className={cn(
                  "transition-all",
                  importType === "competitor" && "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setImportType("competitor")}
              >
                Competitor Data
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="w-[200px]">
              <Label className="mb-3">PIC</Label>
              <Select value={pic} onValueChange={setPic}>
                <SelectTrigger>
                  <SelectValue placeholder="Select PIC" />
                </SelectTrigger>
                <SelectContent>
                  {picOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <Label className="mb-3">File Name</Label>
              <Input value={fileName} disabled />
            </div>

            <div className="w-[280px]">
              <Label className="mb-3">Calendar Filter</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter.from
                      ? dateFilter.to
                        ? `${format(dateFilter.from, "PPP")} - ${format(
                            dateFilter.to,
                            "PPP"
                          )}`
                        : format(dateFilter.from, "PPP")
                      : "Select date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div> 
          </div>
        </div>

        {/* Preview Table */}
        <AhrefsImportTable data={filteredData} columns={columns} />
      </div>
    </div>
  );
};

export default AhrefsImportForm;
