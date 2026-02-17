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
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// Central Pagination components (adjust path if needed)
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PageHeading } from "@/components/shared/PageHeading";

const ITEMS_PER_PAGE = 10;

const PerformanceOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Filters
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedProjects, setSelectedProjects] = useState([]); // Multi-select
  const [period, setPeriod] = useState("day");

  // Table data per project
  const [tableDataByProject, setTableDataByProject] = useState({});

  // Pagination state per project (page number)
  const [pageByProject, setPageByProject] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/performance/overview/");
        setData(res.data);

        // Default to first project
        if (selectedProjects.length === 0 && res.data.projects?.length > 0) {
          setSelectedProjects([res.data.projects[0].project_id]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Performance Overview data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update table data & initialize pagination when selection/filter changes
  useEffect(() => {
    if (!data) return;

    const newTableData = {};
    const newPageData = { ...pageByProject };

    selectedProjects.forEach((projectId) => {
      const selected = data.projects.find((p) => p.project_id === projectId);
      if (selected) {
        let filtered = selected.data || [];
        if (dateRange.from || dateRange.to) {
          filtered = filtered.filter((row) => {
            const rowDate = new Date(row.period);
            if (dateRange.from && rowDate < dateRange.from) return false;
            if (dateRange.to && rowDate > dateRange.to) return false;
            return true;
          });
        }
        newTableData[selected.project_name || selected.project_id] = filtered;

        // Initialize pagination for this project if not set
        if (!(projectId in newPageData)) {
          newPageData[projectId] = 1;
        }
      }
    });

    setTableDataByProject(newTableData);
    setPageByProject(newPageData);
  }, [data, selectedProjects, dateRange]);

  // Helper to change page for a specific project
  const changePage = (projectId, newPage) => {
    setPageByProject((prev) => ({
      ...prev,
      [projectId]: newPage,
    }));
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Performance Overview...
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

  const projects = data.projects || [];

  const toggleProject = (projectId) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((p) => p !== projectId)
        : [...prev, projectId],
    );
  };

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Performance Overview" />
      {/* Filters */}
      <div className="flex justify-end gap-4 flex-wrap">
        <div className="w-[280px]">
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
                        "PPP",
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
                    {projects.map((project) => (
                      <CommandItem
                        key={project.project_id}
                        value={project.project_id}
                        onSelect={() => toggleProject(project.project_id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProjects.includes(project.project_id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {project.project_name}
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
              <SelectItem value="week">Per Week</SelectItem>
              <SelectItem value="month">Per Month</SelectItem>
              <SelectItem value="year">Per Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Multiple Tables - One per selected project */}
      <div className="space-y-10">
        {selectedProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Please select at least one project to view data.
          </div>
        )}

        {selectedProjects.map((projectId) => {
          const selected = data.projects.find(
            (p) => p.project_id === projectId,
          );
          const projectName = selected?.project_name || projectId;
          const projectData = tableDataByProject[projectName] || [];

          const currentPage = pageByProject[projectId] || 1;
          const totalPages = Math.ceil(projectData.length / ITEMS_PER_PAGE);
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginated = projectData.slice(start, start + ITEMS_PER_PAGE);

          return (
            <div key={projectId} className="border rounded-lg ">
              <div className="p-4 font-semibold text-lg">{projectName}</div>
              <ScrollArea className="">
                <Table>
                  <TableHeader
                    className="sticky top-0 bg-background z-10"
                    style={{ background: "#3872FA33" }}
                  >
                    <TableRow>
                      {/* <TableHead>Date</TableHead> */}
                      <TableHead className="text-right">Impression</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">CTR</TableHead>
                      {/* <TableHead>Note</TableHead> */}
                      <TableHead className="text-right">Position</TableHead>
                      <TableHead className="text-right">Total User</TableHead>
                      <TableHead className="text-right">
                        Organic Search
                      </TableHead>
                      <TableHead className="text-right">Direct</TableHead>
                      <TableHead className="text-right">Referral</TableHead>
                      <TableHead className="text-right">
                        Organic Social
                      </TableHead>
                      <TableHead className="text-right">Unassigned</TableHead>
                      <TableHead className="text-right">
                        Total Inquiry
                      </TableHead>
                      <TableHead className="text-right">
                        Inquiry (Download)
                      </TableHead>
                      <TableHead className="text-right">
                        Inquiry (WhatsApp)
                      </TableHead>
                      <TableHead className="text-right">Register</TableHead>
                      <TableHead className="text-right">Join</TableHead>
                      <TableHead className="text-right">
                        First Deposit
                      </TableHead>
                      <TableHead className="text-right">
                        Total Deposit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.length > 0 ? (
                      paginated.map((row, index) => (
                        <TableRow key={index}>
                          {/* <TableCell className="font-medium">
                            {row.period}
                          </TableCell> */}
                          <TableCell className="text-right">
                            {row.impressions?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.clicks?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.ctr || "-"}
                          </TableCell>
                          {/* <TableCell>{row.note || "-"}</TableCell> */}
                          <TableCell className="text-right">
                            {row.position || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_user?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.organic_search?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.direct?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.referral?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.organic_social?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.unassigned?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_inquiry?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.inquiry_download?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.inquiry_whatsapp?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.register?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.join?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.first_deposit?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.total_deposit?.toLocaleString() || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={19}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No data available for {projectName}.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Pagination for this project */}
              {totalPages > 1 && (
                <Pagination className="mt-4 flex justify-center pb-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          changePage(projectId, Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show ellipsis logic
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => changePage(projectId, page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return <PaginationEllipsis key={page} />;
                        }
                        return null;
                      },
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          changePage(
                            projectId,
                            Math.min(totalPages, currentPage + 1),
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceOverview;
