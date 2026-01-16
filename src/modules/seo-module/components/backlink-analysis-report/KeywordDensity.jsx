import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/PageHeading";

const KeywordDensity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [selectedCompareProjects, setSelectedCompareProjects] = useState([]);

  // Table data (per project)
  const [tableDataByProject, setTableDataByProject] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/keyword-density/");
        setData(res.data);

        // For now, single view (extend for multi-project later)
        const keywords = res.data.keywords || [];
        setTableDataByProject({ "All Projects": keywords });
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Keyword Density data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Keyword Density data...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-red-600">
        Error loading data. Please try again.
      </div>
    );
  }

  // Extract options from API response
  const dateRange = data.filters?.date_range || {};

  const totalProjects = data.total_projects || 0;
  const totalKeywords = data.total_keywords || 0;

  // Toggle project selection
  const toggleCompareProject = (project) => {
    setSelectedCompareProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project]
    );
  };

  // For now, show single table (multi-project support can be added later)
  const activeTableData = tableDataByProject["All Projects"] || [];

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Keyword Density" />
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-[300px]">
          <Label className="mb-3">Date Range</Label>
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
                  : dateRange.min_date && dateRange.max_date
                  ? `${format(new Date(dateRange.min_date), "PPP")} - ${format(
                      new Date(dateRange.max_date),
                      "PPP"
                    )}`
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

        <div className="w-[250px]">
          <Label className="mb-3">Compare Project</Label>
          <Select
            value={selectedCompareProjects}
            onValueChange={(value) => toggleCompareProject(value)}
            multiple
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select projects" />
            </SelectTrigger>
            <SelectContent>
              {data.accessible_project_ids?.map((pid) => (
                <SelectItem key={pid} value={pid}>
                  {pid}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tables - One per selected project (or single if none) */}
      <div className="space-y-10">
        {selectedCompareProjects.length === 0 ? (
          // Single table
          <div className="border rounded-lg bg-card">
            {/* <div className="p-4 font-semibold">
              All Projects - Keyword Density
            </div> */}
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Keyword</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Percentage (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTableData
                    .filter((row) =>
                      searchQuery
                        ? row.keyword
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : true
                    )
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.keyword}</TableCell>
                        <TableCell className="text-right">
                          {row.amount}
                        </TableCell>
                        <TableCell className="text-right">
                          {row.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : (
          // Multiple tables
          selectedCompareProjects.map((project) => (
            <div key={project} className="border rounded-lg bg-card">
              <div className="p-4 font-semibold">
                {project} - Keyword Density
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>Keyword</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">
                        Percentage (%)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTableData
                      .filter((row) =>
                        searchQuery
                          ? row.keyword
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                          : true
                      )
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.keyword}</TableCell>
                          <TableCell className="text-right">
                            {row.amount}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.percentage}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KeywordDensity;
