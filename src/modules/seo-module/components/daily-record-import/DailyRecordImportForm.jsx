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
import DailyRecordImportTable from "./DailyRecordImportTable";
import {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} from "../../store/dailyRecordImportSlice";
import { importDailyRecordData } from "../../services/dailyRecordImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const DailyRecordImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.dailyRecordImport);

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

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });

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
    } else if (typeof dateInput === "number") {
      // Excel serial date (45870 = 2025-09-01)
      date = new Date((dateInput - 25569) * 86400 * 1000);
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
    const key = Object.keys(row).find(
      (k) => k.toLowerCase() === columnName.toLowerCase()
    );
    return key ? row[key] : "";
  };

  const handleImport = async () => {
    if (!importedData || importedData.length === 0)
      return toast.error("No data to import");
    if (!selectedProject) return toast.error("Please select a Project");

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    const basePayload = {
      file_title: fileTitle || "Daily Record Import",
      uploaded_date: format(uploadedDate, "yyyy-MM-dd"),
      time,
      username,
      project: selectedProject,
    };

    const importPromises = importedData.map(async (row) => {
      try {
        const payload = {
          ...basePayload,
          date:
            formatDateForAPI(getValue(row, "Date")) ||
            format(new Date(), "yyyy-MM-dd"),
          impressions: parseInt(getValue(row, "Impressions") || 0),
          clicks: parseInt(getValue(row, "Clicks") || 0),
          ctr: getValue(row, "CTR") || "0.00",
          position: getValue(row, "Position") || "0.00",
          total_user: parseInt(getValue(row, "Total User") || 0),
          organic_search: parseInt(getValue(row, "Organic Search") || 0),
          direct: parseInt(getValue(row, "Direct") || 0),
          referral: parseInt(getValue(row, "Referral") || 0),
          organic_social: parseInt(getValue(row, "Organic Social") || 0),
          unassigned: parseInt(getValue(row, "Unassigned") || 0),
          inquiry_download: parseInt(getValue(row, "Download") || 0),
          inquiry_whatsapp: parseInt(getValue(row, "WhatsApp") || 0),
          register: parseInt(getValue(row, "Register") || 0),
          join: parseInt(getValue(row, "Join") || 0),
          first_deposit: parseFloat(
            getValue(row, "First Deposit") || 0
          ).toFixed(2),
          total_deposit: parseFloat(
            getValue(row, "Total Deposit") || 0
          ).toFixed(2),
        };

        await importDailyRecordData(payload);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    });

    try {
      await Promise.all(importPromises);
      toast.success(
        `Import complete: ${successCount} successes, ${errorCount} errors`
      );
      dispatch(clearImportedData());
      setFileName("");
      setFileTitle("");
    } catch (err) {
      toast.error("Import interrupted");
    } finally {
      setLoading(false);
    }
  };

  // Filtered Data for Preview
  const filteredData =
    importedData?.filter((row) => {
      // Search
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        const values = Object.values(row).join(" ").toLowerCase();
        if (!values.includes(term)) return false;
      }

      // Calendar (date range)
      if (dateFilter.from || dateFilter.to) {
        const rowDateStr = getValue(row, "Date");
        if (!rowDateStr) return false;
        const rowDate = new Date(formatDateForAPI(rowDateStr));
        if (isNaN(rowDate.getTime())) return false;
        if (dateFilter.from && rowDate < dateFilter.from) return false;
        if (dateFilter.to && rowDate > dateFilter.to) return false;
      }

      return true;
    }) || [];

  return (
    <div className="space-y-8 mt-6">
      {/* Form Fields */}
      <div className="space-y-6">
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
                {format(uploadedDate, "PPP")}
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
              <SelectValue
                placeholder={loadingUsers ? "Loading..." : "Select user"}
              />
            </SelectTrigger>
            <SelectContent>
              {loadingUsers ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
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
        {fileName && (
          <p className="text-sm text-muted-foreground mt-2">
            Uploaded: {fileName}
          </p>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleImport}
          disabled={loading || !importedData || !selectedProject}
        >
          {loading ? "Uploading..." : "Upload Daily Record"}
        </Button>
      </div>

      {/* Preview Table with Filters */}
      {importedData && (
        <div className="border p-6 rounded-lg bg-gray-50 space-y-6">
          <h3 className="text-lg font-semibold">Data Preview</h3>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[300px]">
              <Label className="mb-3">Search</Label>
              <Input
                placeholder="Search any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

          {/* Table */}
          <DailyRecordImportTable data={filteredData} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default DailyRecordImportForm;
