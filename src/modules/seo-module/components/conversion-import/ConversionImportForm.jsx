import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select";
import { format } from "date-fns";
import ExcelUploadField from "@/components/form-fields/ExcelUploadField";
import ConversionImportTable from "./ConversionImportTable";
import { storeImportedData, setImportLoading, clearImportedData } from "../../store/conversionImportSlice";
import { importConversionData } from "../../services/conversionImportService";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import axiosInstance from "@/services/axiosInstance";

const ConversionImportForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { importedData } = useSelector((state) => state.conversionImport);

  const [fileTitle, setFileTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastProcessedFile, setLastProcessedFile] = useState("");

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
        let [month, day, year] = parts.map(Number);
        year = year < 100 ? 2000 + year : year;
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(cleanStr);
      }
    } else if (typeof dateInput === "number") {
      // Handle Excel serial dates (e.g., 45963 = 2025-11-01)
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
    const key = Object.keys(row).find((k) => k.toLowerCase() === columnName.toLowerCase());
    return key ? row[key] : "";
  };
const cleanCurrency = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/[^0-9.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};
  const handleImport = async () => {
    if (!importedData || importedData.length === 0) return toast.error("No data to import");
    if (!selectedProject) return toast.error("Please select a Project");

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    const basePayload = {
      file_title: fileTitle || "Conversion Import",
      project: selectedProject,
    };

    const importPromises = importedData.map(async (row) => {
      try {
        const payload = {
            ...basePayload,
            date: formatDateForAPI(getValue(row, "Date")) || format(new Date(), "yyyy-MM-dd"),
            impressions: 0,
            clicks: 0,
            ctr: "0",
            position: "0",
            total_user: 0,
            organic_search: 0,
            direct: 0,
            referral: 0,
            organic_social: 0,
            unassigned: 0,
            inquiry_download: parseInt(getValue(row, "Inquiry (Download)") || 0),
            inquiry_whatsapp: parseInt(getValue(row, "Inquiry (WhatsApp)") || 0),
            register: parseInt(getValue(row, "Register") || 0),
            join: parseInt(getValue(row, "Join") || 0),
            first_deposit: cleanCurrency(getValue(row, "First Deposit")),
            total_deposit: cleanCurrency(getValue(row, "Total Deposit")),
            project: selectedProject,

        };

        await importConversionData(payload);
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

  return (
    <div className="space-y-8 mt-3">
      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label className="mb-3">File Title</Label>
          <Input value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} />
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
        <Button onClick={handleImport} disabled={loading || !importedData || !selectedProject}>
          {loading ? "Uploading..." : "Upload Conversion Data"}
        </Button>
      </div>

      {/* Preview Table (No filters) */}
      {importedData && (
        <div className="border p-6 rounded-lg space-y-6 bg-gray-50">
          <h3 className="text-lg font-semibold">Data Preview</h3>
          <ConversionImportTable data={importedData} columns={columns} />
        </div>
      )}
    </div>
  );
};

export default ConversionImportForm;