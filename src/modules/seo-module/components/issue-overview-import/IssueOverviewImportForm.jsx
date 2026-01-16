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
import IssueOverviewImportTable from "./IssueOverviewImportTable";
import {
  storeImportedData,
  setImportLoading,
  clearImportedData,
} from "../../store/issueOverviewImportSlice";
import { importIssueOverviewData } from "../../services/issueOverviewImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const IssueOverviewImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.issueOverviewImport);

  const [fileTitle, setFileTitle] = useState("");
  const [uploadedDate, setUploadedDate] = useState(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [username, setUsername] = useState("");
  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedFile, setLastProcessedFile] = useState("");
  // New Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [severityFilter, setSeverityFilter] = useState(null); // null = All

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.organisation_id) return;

      setLoadingUsers(true);
      try {
        const res = await axiosInstance.get(
          `/organisation/${user.organisation_id}/users/`
        );
        setUsers(res.data);
        const currentUser = res.data.find((u) => u.id === user.id);
        if (currentUser) setUsername(currentUser.id);
      } catch (error) {
        toast.error("Failed to load users");
        console.error(error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
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

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    const basePayload = {
      file_title: fileTitle || "Issue Overview Import",
      uploaded_date: format(uploadedDate, "yyyy-MM-dd"),
      time,
      username,
    };

    const importPromises = importedData.map(async (row) => {
      try {
        const payload = {
          ...basePayload,
          issue_name: getValue(row, "Issue Name") || "",
          severity: getValue(row, "Severity") || "",
          description: getValue(row, "Description") || "",
          how_to_fix: getValue(row, "How To Fix") || "",
        };

        await importIssueOverviewData(payload);
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
  // Filtered Data
  const filteredData =
    importedData?.filter((row) => {
      // Search filter
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        const values = Object.values(row).join(" ").toLowerCase();
        if (!values.includes(term)) return false;
      }

      // Severity filter
      if (severityFilter !== null) {
        const severity = getValue(row, "Severity");
        if (severity !== severityFilter) return false;
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
        <Button onClick={handleImport} disabled={loading || !importedData}>
          {loading ? "Uploading..." : "Upload Issue Overview"}
        </Button>
      </div>

      {/* Preview Table */}
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

            {/* Date Range - Removed as not in Excel data */}

            <div className="w-[200px]">
              <Label className="mb-3">Severity</Label>
              <Select
                value={severityFilter ?? ""}
                onValueChange={(v) => setSeverityFilter(v || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Severities</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <IssueOverviewImportTable data={filteredData} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default IssueOverviewImportForm;
