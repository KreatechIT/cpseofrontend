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
import SeRankingImportTable from "./SeRankingImportTable";
import { storeImportedData, setImportLoading, clearImportedData } from "../../store/seRankingImportSlice";
import { importSeRankingData, importSeStatusData } from "../../services/seRankingImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const SeRankingImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.seRankingImport);

  const [fileTitle, setFileTitle] = useState("");
  const [uploadedDate, setUploadedDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedFile, setLastProcessedFile] = useState("");
  const [importType, setImportType] = useState("se-ranking");
  const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState("");

  // Fetch users and projects

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
      setVendors(vendorsRes.data); // ← Add this

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
          typeof h === "string" ? h.replace(/ï»¿/, "").trim() : ""
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

  const formatDateForAPI = (dateInput) => {
    if (!dateInput) return null;

    let date;

    if (typeof dateInput === "string") {
      const cleanStr = dateInput.trim().split(" ")[0];
      const parts = cleanStr.split("/");
      if (parts.length === 3) {
        let [day, month, year] = parts.map(Number);
        year = year < 100 ? 2000 + year : year;
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

  // Helper to get value
  const getValue = (row, columnName) => {
    if (!row || !columnName) return "";
    const key = Object.keys(row).find((k) => k.toLowerCase() === columnName.toLowerCase());
    return key ? row[key] : "";
  };

  const handleImport = async () => {
    if (!importedData || importedData.length === 0) return toast.error("No data to import");
    if (!selectedProject) return toast.error("Please select a Project");

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    const basePayload = {
      file_title: fileTitle || "SE Ranking Import",
      uploaded_date: format(uploadedDate, "yyyy-MM-dd"),
      time,
      username,
    };

    const importPromises = importedData.map(async (row) => {
      try {
        let payload = { ...basePayload, project: selectedProject };

        if (importType === "se-ranking") {
          payload = {
            ...payload,
            // Map to /seo/se-ranking/ (assumed similar to purchased)
            // Adjust based on actual fields
            backlink: getValue(row, "Backlink") || "",
            status: getValue(row, "Status") || "Found",
            indexing_google: getValue(row, "Indexing Google") || 0,
            toxicity_score: getValue(row, "Toxicity score") || 0,
            target_url: getValue(row, "Target URL") || "",
            anchor: getValue(row, "Anchor") || "",
            dt: getValue(row, "DT") || "",
            nofollow: getValue(row, "NoFollow") || "no",
            image: getValue(row, "Image") || "no",
            ugc: getValue(row, "UGC") || "no",
            sponsored: getValue(row, "Sponsored") || "no",
            facebook_likes: getValue(row, "Facebook likes") || 0,
            external_links: getValue(row, "External links") || 0,
            country: getValue(row, "Country") || "",
            first_seen: formatDateForAPI(getValue(row, "First seen")) || format(new Date(), "yyyy-MM-dd"),
            last_seen: formatDateForAPI(getValue(row, "Last seen")) || format(new Date(), "yyyy-MM-dd"),
            disavow: getValue(row, "Disavow") || "no",
            price: getValue(row, "Price") || "0.00",
            manager: getValue(row, "Manager") || "",
            note: getValue(row, "Note") || "",
            date_of_publication: formatDateForAPI(getValue(row, "Date of publication")) || format(new Date(), "yyyy-MM-dd"),
            processing_status: getValue(row, "Processing status") || "unchecked",
          };
          await importSeRankingData(payload);
        } else if (importType === "se-status") {
          payload = {
            ...payload,
            created_date: formatDateForAPI(getValue(row, "Date of publication")) || format(new Date(), "yyyy-MM-dd"),
            order_month: format(new Date(), "MMM yyyy").toUpperCase(),
            domain: new URL(getValue(row, "Backlink")).hostname || "",
            link_type: "Guest Post",
            price_usd: getValue(row, "Price").replace(/ USD$/, "") || "0.00",
            price_myr: "0.00",
            unique_domain: new URL(getValue(row, "Backlink")).hostname || "",
            live_link: getValue(row, "Backlink") || "",
            keyword_1: getValue(row, "Anchor") || "",
            target_url_1: getValue(row, "Target URL") || "",
            keyword_2: "",
            target_url_2: "",
            status: getValue(row, "Status") || "Found",
            link_status: getValue(row, "Status") || "200",
            follow: getValue(row, "NoFollow") === "no" ? "Yes" : "No",
            domain_rating: getValue(row, "DT") || "0.10",
            domain_authority: 0,
            page_authority: 0,
            spam_score: getValue(row, "Toxicity score") || 0,
            domain_created_date: "2000-01-01",
            domain_expiration_date: "2026-01-01",
            domain_age: "26 years, 0 months",
            remark: getValue(row, "Note") || "",
            backlinks_id: `SE-${Date.now()}`,
            project: selectedProject,
            vendor: selectedVendor, // ← Now included
          };
          await importSeStatusData(payload);
        }

        successCount++;
      } catch (error) {
        errorCount++;
      }
    });

    try {
      await Promise.all(importPromises);
      toast.success(`Import complete: ${successCount} successes, ${errorCount} errors`);
      dispatch(clearImportedData());
      setFileName("");
      setFileTitle("");
    } catch (err) {
      toast.error("Import interrupted");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = importedData?.filter((row) => {
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      if (!Object.values(row).some(v => v?.toString().toLowerCase().includes(term))) return false;
    }
    return true;
  }) || [];

  return (
    <div className="space-y-8 mt-3">
      {/* Form Fields */}
      <div className="space-y-4">
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
                {format(uploadedDate, "PPP")}
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
        {importType === "se-status" && (
          <div>
            <Label className="mb-3">Vendor *</Label>
            <Select value={selectedVendor} onValueChange={setSelectedVendor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.vendor_name || v.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Excel Upload */}
      <div>
        <Label className="mb-3">Excel File Upload</Label>
        <ExcelUploadField onFileChange={handleFileChange} />
        {fileName && <p className="text-sm text-muted-foreground mt-2">Uploaded: {fileName}</p>}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <Button
            onClick={handleImport}
            disabled={
                loading ||
                !importedData ||
                !selectedProject ||
                (importType === "se-status" && !selectedVendor)
            }
            >
            {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {/* Preview Section */}
      {importedData && (
        <div className="border p-6 rounded-lg space-y-6 bg-gray-50">
          {/* <h3 className="text-lg font-semibold">Data Preview</h3> */}

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[300px]">
              <Label className="mb-3">Search</Label>
              <Input
                placeholder="Search any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-3">Import Type</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="se-ranking">SE Ranking</SelectItem>
                  <SelectItem value="se-status">SE Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <SeRankingImportTable data={filteredData} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default SeRankingImportForm;