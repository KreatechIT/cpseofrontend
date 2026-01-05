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
import SearchConsoleImportTable from "./SearchConsoleImportTable";
import { storeImportedData, setImportLoading, clearImportedData } from "../../store/searchConsoleImportSlice";
import { importSearchConsoleData } from "../../services/searchConsoleImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const SearchConsoleImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.searchConsoleImport);

  const [fileTitle, setFileTitle] = useState("");
  const [uploadedDate, setUploadedDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedFile, setLastProcessedFile] = useState("");
const [dateFilter, setDateFilter] = useState({ from: null, to: null });
const [totalUsersFilter, setTotalUsersFilter] = useState(null); // ← null, not ""
const [importType, setImportType] = useState("performance"); // default

  // Fetch users and projects
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.organisation_id) return;

      setLoadingUsers(true);
      try {
        const [usersRes, projectsRes] = await Promise.all([
          axiosInstance.get(`/organisation/${user.organisation_id}/users/`),
          axiosInstance.get("/seo/projects/"),
        ]);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);

        // Auto-select current user
        const currentUser = usersRes.data.find((u) => u.id === user.id);
        if (currentUser) setUsername(currentUser.id);
      } catch (error) {
        toast.error("Failed to load users or projects");
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

        // Use "Chart" sheet for main data
        const sheetName = "Chart"; // Your main sheet
        if (!workbook.SheetNames.includes(sheetName)) {
          toast.error("Excel must have a 'Chart' sheet");
          dispatch(setImportLoading(false));
          return;
        }

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

  const formatDateForAPI = (dateInput) => {
    if (!dateInput) return null;

    let date;

    if (typeof dateInput === "string") {
      const cleanStr = dateInput.trim().split(" ")[0];
      const parts = cleanStr.split("-");
      if (parts.length === 3) {
        const [year, month, day] = parts.map(Number);
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
      file_title: fileTitle || "Search Console Import",
      uploaded_date: format(uploadedDate, "yyyy-MM-dd"),
      time,
      username,
    };

    const importPromises = importedData.map(async (row) => {
        const ctr = getValue(row, "CTR");
      try {
        const payload = {
          ...basePayload,
          date: formatDateForAPI(getValue(row, "Date")) || format(new Date(), "yyyy-MM-dd"),
          impressions: parseInt(getValue(row, "Impressions") || 0),
          clicks: parseInt(getValue(row, "Clicks") || 0),
          ctr: (getValue(row, 'CTR') || "").replace(/%$/i, "") || "0",
          position: getValue(row, "Position") || "0",
          total_user: parseInt(getValue(row, "totalUsers") || 0),
          organic_search: 0, // Map if available in other sheets
          direct: 0,
          referral: 0,
          organic_social: 0,
          unassigned: 0,
          inquiry_download: 0,
          inquiry_whatsapp: 0,
          register: 0,
          join: 0,
          first_deposit: "0",
          total_deposit: "0",
          project: selectedProject,
        };

        await importSearchConsoleData(payload);
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
    // Filter data
  const filteredData = importedData?.filter((row) => {
    // Date filter
    if (dateFilter.from || dateFilter.to) {
      const rowDateStr = getValue(row, "date");
      if (!rowDateStr) return false;
      const rowDate = new Date(rowDateStr);
      if (isNaN(rowDate.getTime())) return false;
      if (dateFilter.from && rowDate < dateFilter.from) return false;
      if (dateFilter.to && rowDate > dateFilter.to) return false;
    }

    // Total Users filter (exact match or range?)
// Total Users filter
if (totalUsersFilter !== null && getValue(row, "totalUsers") !== totalUsersFilter) {
  return false;
}

    return true;
  }) || [];

  // Auto-select Performance when file is uploaded
  useEffect(() => {
    if (importedData && importedData.length > 0) {
      setImportType("performance");
    }
  }, [importedData]);
    function cn(...inputs) {
      return inputs.filter(Boolean).join(' ');
    }

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
      </div>

      {/* Excel Upload */}
      <div>
        <Label className="mb-3">Excel File Upload</Label>
        <ExcelUploadField onFileChange={handleFileChange} />
        {fileName && <p className="text-sm text-muted-foreground mt-2">Uploaded: {fileName}</p>}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        {/* Upload button - only show in Performance mode */}
        {importType === "performance" && (
          <Button onClick={handleImport} disabled={loading || !importedData || !selectedProject}>
            {loading ? "Uploading..." : "Upload Search Console"}
          </Button>
        )}
      </div>

{/* Import Type Buttons - Same as Ahrefs Import */}
      {importedData && (
        <div className="mt-8">
          <div className="flex gap-4 items-center justify-between mb-6">
            <div className="flex gap-4">
              <Button
                variant={importType === "performance" ? "default" : "outline"}
                className={cn(
                  "transition-all",
                  importType === "performance" && "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setImportType("performance")}
              >
                Performance
              </Button>

              <Button
                variant={importType === "latest-link" ? "default" : "outline"}
                className={cn(
                  "transition-all",
                  importType === "latest-link" && "bg-blue-600 hover:bg-blue-700"
                )}
                onClick={() => setImportType("latest-link")}
              >
                Latest Link
              </Button>
            </div>

            {/* Upload button - only show in Performance mode */}
            {/* {importType === "performance" && (
              <Button
                onClick={handleImport}
                disabled={loading || !importedData || !selectedProject}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Uploading..." : "Upload to /seo/daily/"}
              </Button>
            )} */}
          </div>

          {/* Preview Section */}
          <div className="border p-6 rounded-lg space-y-6 bg-gray-50">
            {/* <h3 className="text-lg font-semibold">
              Data Preview ({importType === "performance" ? "Performance" : "Latest Link"})
            </h3> */}

            {/* Filters */}
            {/* <div className="flex flex-wrap gap-4">
              <div className="w-[280px]">
                <Label className="mb-3">Date Filter</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFilter.from
                        ? dateFilter.to
                          ? `${format(dateFilter.from, "PPP")} - ${format(dateFilter.to, "PPP")}`
                          : format(dateFilter.from, "PPP")
                        : "Select range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="range" selected={dateFilter} onSelect={setDateFilter} numberOfMonths={2} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-[200px]">
                <Label className="mb-3">Total Users Filter</Label>
                <Select value={totalUsersFilter ?? ""} onValueChange={(v) => setTotalUsersFilter(v || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All</SelectItem>
                    {[...new Set(importedData.map(r => getValue(r, "totalUsers")))]
                      .filter(Boolean)
                      .map((tu) => (
                        <SelectItem key={tu} value={tu}>
                          {tu}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div> */}

            {/* Table */}
            <SearchConsoleImportTable data={filteredData} columns={columns} />
          </div>
        </div>
      )}


    </div>
  );
};

export default SearchConsoleImportForm;