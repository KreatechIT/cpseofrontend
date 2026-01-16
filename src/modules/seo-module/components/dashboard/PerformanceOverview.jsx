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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/utils/cn";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const ITEMS_PER_PAGE = 10;

const PerformanceOverview = ({ overview }) => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [period, setPeriod] = useState("day");
  const [pageByProject, setPageByProject] = useState({});
    const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overview?.projects?.length) return;

    if (selectedProjects.length === 0) {
      setSelectedProjects(overview.projects.map(p => p.project_id));
    }
  }, [overview]);

  // Filter data per project
  const filteredDataByProject = {};
  selectedProjects.forEach(projectId => {
    const project = overview.projects.find(p => p.project_id === projectId);
    if (!project) return;

    let filtered = project.data || [];
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.period);
        if (dateRange.from && rowDate < dateRange.from) return false;
        if (dateRange.to && rowDate > dateRange.to) return false;
        return true;
      });
    }

    filteredDataByProject[project.project_name || project.project_id] = filtered;
  });

  // Calculate totals for cards
  let totals = {
    totalClicks: 0,
    totalImpressions: 0,
    avgCtr: 0,
    avgPosition: 0,
    totalUser: 0,
    organicUser: 0,
    directUser: 0,
    referralUser: 0,
    totalInquiry: 0,
    inquiryDownload: 0,
    inquiryWhatsapp: 0,
    register: 0,
    join: 0,
  };

  Object.values(filteredDataByProject).forEach(projectData => {
    projectData.forEach(row => {
      totals.totalClicks += row.clicks || 0;
      totals.totalImpressions += row.impressions || 0;
      totals.totalUser += row.total_user || 0;
      totals.organicUser += row.organic_search || 0;
      totals.directUser += row.direct || 0;
      totals.referralUser += row.referral || 0;
      totals.inquiryDownload += row.inquiry_download || 0;
      totals.inquiryWhatsapp += row.inquiry_whatsapp || 0;
      totals.register += row.register || 0;
      totals.join += row.join || 0;
    });
  });

  const totalRows = Object.values(filteredDataByProject).reduce((sum, d) => sum + d.length, 0);
  totals.avgCtr = totalRows > 0 ? (totals.totalClicks / totals.totalImpressions * 100).toFixed(2) : 0;
  totals.avgPosition = totalRows > 0 ? (Object.values(filteredDataByProject).flat().reduce((sum, r) => sum + (r.position || 0), 0) / totalRows).toFixed(1) : 0;

  // Prepare chart data (aggregated across all selected projects)
  const chartDataMap = new Map();

  Object.values(filteredDataByProject).flat().forEach(row => {
    const date = row.period;
    if (!chartDataMap.has(date)) {
      chartDataMap.set(date, {
        date,
        analytics: 0,
        searchConsole: 0,
        conversion: 0,
      });
    }

    const entry = chartDataMap.get(date);
    entry.analytics += row.total_user || 0;
    entry.searchConsole += row.clicks || 0;
    entry.conversion += row.join || 0;
  });

  const chartData = Array.from(chartDataMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Pagination per project
  const changePage = (projectName, newPage) => {
    setPageByProject(prev => ({ ...prev, [projectName]: newPage }));
  };
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

  if (!overview?.projects?.length) {
    return <div className="text-center py-12 text-muted-foreground">No performance data available</div>;
  }
  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex justify-between gap-4 flex-wrap align-items-center ">
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="sm" onClick={() => {/* 24h logic */}}>
            24 Hours
          </Button>
          <Button variant="outline" size="sm" onClick={() => {/* 7d logic */}}>
            7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => {/* 28d logic */}}>
            28 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => {/* 3m logic */}}>
            3 Months
          </Button>
        </div>
        <div className="flex gap-4">
            <div className="w-[280px]">
            {/* <Label className="mb-3">Date Range</Label> */}
            <Popover>
                <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from
                    ? dateRange.to
                        ? `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                        : format(dateRange.from, "PPP")
                    : "Select range"}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                </PopoverContent>
            </Popover>
            </div>

            <div className="w-[300px]">
            {/* <Label className="mb-3">Compare Project</Label> */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selectedProjects.length > 0
                    ? `${selectedProjects.length} project${selectedProjects.length > 1 ? "s" : ""} selected`
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
                        {overview.projects.map((p) => (
                        <CommandItem
                            key={p.project_id}
                            value={p.project_id}
                            onSelect={() => toggleProject(p.project_id)}
                        >
                            <Check className={cn("mr-2 h-4 w-4", selectedProjects.includes(p.project_id) ? "opacity-100" : "opacity-0")} />
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
            {/* <Label className="mb-3">Period</Label> */}
            <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full">
                <SelectValue placeholder="Per Day" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="week">Per Week</SelectItem>
                <SelectItem value="month">Per Month</SelectItem>
                <SelectItem value="year">Per Year</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalClicks.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Clicks</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalImpressions.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Impressions</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.avgCtr}%</p>
          <p className="text-sm text-muted-foreground">Average CTR</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.avgPosition}</p>
          <p className="text-sm text-muted-foreground">Average Position</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.totalUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total User</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.organicUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Organic User</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.directUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Direct User</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-2xl font-bold">{totals.referralUser.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Referral User</p>
        </div>
      </div>

      {/* Real Line Chart */}
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Performance Graph</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), "dd MMM")} />
            <YAxis />
            <Tooltip
              formatter={(value) => value.toLocaleString()}
              labelFormatter={(date) => format(new Date(date), "EEEE, MMM dd")}
            />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="analytics" stroke="#3872FA" name="Analytics (Total User)" />
            <Line type="monotone" dataKey="searchConsole" stroke="#0EB170" name="Search Console (Clicks)" />
            <Line type="monotone" dataKey="conversion" stroke="#B94DF3" name="Conversion (Join)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Project Tables with Pagination */}
      {/* <div className="space-y-10">
        {selectedProjects.map(projectId => {
          const project = overview.projects.find(p => p.project_id === projectId);
          if (!project) return null;

          const projectName = project.project_name || project.project_id;
          const projectData = filteredDataByProject[projectName] || [];

          const currentPage = pageByProject[projectId] || 1;
          const totalPages = Math.ceil(projectData.length / ITEMS_PER_PAGE);
          const paginated = projectData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

          return (
            <div key={projectId} className="border rounded-lg bg-card">
              <div className="p-4 font-semibold text-lg">{projectName}</div>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10" style={{ background: "#3872FA33" }}>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Impression</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">First Deposit</TableHead>
                      <TableHead className="text-right">Total User</TableHead>
                      <TableHead className="text-right">Total Deposit</TableHead>
                      <TableHead className="text-right">Organic Search</TableHead>
                      <TableHead className="text-right">Direct</TableHead>
                      <TableHead className="text-right">Referral</TableHead>
                      <TableHead className="text-right">Organic Social</TableHead>
                      <TableHead className="text-right">Unassigned</TableHead>
                      <TableHead className="text-right">Total Inquiry</TableHead>
                      <TableHead className="text-right">Inquiry (Download)</TableHead>
                      <TableHead className="text-right">Inquiry (WhatsApp)</TableHead>
                      <TableHead className="text-right">Register</TableHead>
                      <TableHead className="text-right">Join</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.length > 0 ? (
                      paginated.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.period}</TableCell>
                          <TableCell className="text-right">{row.impressions?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.clicks?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.ctr || "-"}</TableCell>
                          <TableCell>{row.note || "-"}</TableCell>
                          <TableCell className="text-right">{row.position || "-"}</TableCell>
                          <TableCell className="text-right">{row.first_deposit?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.total_user?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.total_deposit?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.organic_search?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.direct?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.referral?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.organic_social?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.unassigned?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.total_inquiry?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.inquiry_download?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.inquiry_whatsapp?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.register?.toLocaleString() || "-"}</TableCell>
                          <TableCell className="text-right">{row.join?.toLocaleString() || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={19} className="text-center py-8 text-muted-foreground">
                          No data for {projectName}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Pagination per project 
              {totalPages > 1 && (
                <Pagination className="mt-4 flex justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => changePage(projectName, Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              onClick={() => changePage(projectName, page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (page === currentPage - 3 || page === currentPage + 3) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => changePage(projectName, Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default PerformanceOverview;