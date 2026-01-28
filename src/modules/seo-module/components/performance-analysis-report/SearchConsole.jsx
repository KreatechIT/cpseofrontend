import { useState, useEffect } from "react";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";
import { PageHeading } from "@/components/shared/PageHeading";

const SearchConsole = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [period, setPeriod] = useState("day");
  const [open, setOpen] = useState(false);

  // Chart & Table data per project
  const [chartDataByProject, setChartDataByProject] = useState({});
  const [tableDataByProject, setTableDataByProject] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/performance/search-console/");
        setData(res.data);

        // Default to first project if none selected
        if (selectedProjects.length === 0 && res.data.projects?.length > 0) {
          setSelectedProjects([res.data.projects[0].project_id]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Search Console data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for chart & table when selected projects or data change
  useEffect(() => {
    if (!data) return;

    const newChartData = {};
    const newTableData = {};

    selectedProjects.forEach((projectId) => {
      const selected = data.projects.find((p) => p.project_id === projectId);
      if (selected) {
        // Chart data (use chart_data directly)
        newChartData[selected.project_name || selected.project_id] = {
          labels: selected.chart_data?.labels || [],
          impressions: selected.chart_data?.impressions || [],
          clicks: selected.chart_data?.clicks || [],
        };

        // Table data (use table_data)
        let filteredTable = selected.table_data || [];
        if (dateRange.from || dateRange.to) {
          filteredTable = filteredTable.filter((row) => {
            const rowDate = new Date(row.period);
            if (dateRange.from && rowDate < dateRange.from) return false;
            if (dateRange.to && rowDate > dateRange.to) return false;
            return true;
          });
        }

        newTableData[selected.project_name || selected.project_id] =
          filteredTable;
      }
    });

    setChartDataByProject(newChartData);
    setTableDataByProject(newTableData);
  }, [data, selectedProjects, dateRange]);

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Search Console...
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
  const toggleProject = (value) => {
    setSelectedProjects((prev) => {
      // If value is a string (single select fallback), treat as toggle
      if (typeof value === "string") {
        return prev.includes(value)
          ? prev.filter((p) => p !== value)
          : [...prev, value];
      }
      // If value is already an array (multi-select), use it directly
      return Array.isArray(value) ? value : prev;
    });
  };

  // Available projects
  const projects = data.projects || [];

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Search Console" />

      {/* Line Chart - Ranking Trend over Time */}
      <div className="border p-6 rounded-lg ">
        <h3 className="text-lg font-semibold text-start mb-8 text-black">
          Ranking Trend over Time
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                format(new Date(label), "EEEE MMM d, yyyy")
              }
              formatter={(value, name) => [
                value,
                name === "impressions" ? "Impressions" : "Clicks",
              ]}
            />
            <Legend />
            {Object.entries(chartDataByProject).map(([projectName, chart]) => (
              <Line
                key={projectName}
                type="monotone"
                dataKey="impressions"
                data={chart.labels.map((label, i) => ({
                  period: label,
                  impressions: chart.impressions[i],
                  clicks: chart.clicks[i],
                }))}
                name={`Impressions (${projectName})`}
                stroke="#3872FA"
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Filters */}
      <div className="flex justify-end gap-4 flex-wrap">
        <div className="w-[350px]">
          <Label className="mb-3">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from
                  ? dateRange.to
                    ? `${format(dateRange.from, "PPP")} - ${format(
                        dateRange.to,
                        "PPP"
                      )}`
                    : format(dateRange.from, "PPP")
                  : "Select range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-[300px]">
          <Label className="mb-3">Compare Project</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProjects.length > 0
                  ? `${selectedProjects.length} project${
                      selectedProjects.length > 1 ? "s" : ""
                    } selected`
                  : "Compare Project"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search project..." />
                <CommandList>
                  <CommandEmpty>No project found.</CommandEmpty>
                  <CommandGroup>
                    {projects.map((p) => (
                      <CommandItem
                        key={p.project_id}
                        value={p.project_id}
                        onSelect={() => toggleProject(p.project_id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProjects.includes(p.project_id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {p.project_name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-[200px]">
          <Label className="mb-3">Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Per Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Per Day</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
              <SelectItem value="year">Per Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Multiple Tables */}
      <div className="space-y-10">
        {selectedProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Please select at least one project to view data.
          </div>
        )}

        {selectedProjects.map((projectId) => {
          const selected = data.projects.find(
            (p) => p.project_id === projectId
          );
          const projectName = selected?.project_name || projectId;
          const projectTableData = tableDataByProject[projectName] || [];

          return (
            <div key={projectId} className="border rounded-lg bg-card">
              <div className="p-4 font-semibold text-lg text-left text-black">
                {projectName}
              </div>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      {/* <TableHead>Date</TableHead> */}
                      <TableHead className="text-left">Impression</TableHead>
                      <TableHead className="text-left">Clicks</TableHead>
                      <TableHead className="text-left">CTR</TableHead>
                      <TableHead className="text-left">Position</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectTableData.length > 0 ? (
                      projectTableData.map((row, index) => (
                        <TableRow key={index}>
                          {/* <TableCell>{row.period}</TableCell> */}
                          <TableCell className="text-left">
                            {row.impressions?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.clicks?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.ctr || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.position || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No data for {projectName}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchConsole;
