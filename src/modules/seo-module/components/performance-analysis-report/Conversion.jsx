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

// Your central Pagination components (adjust path if needed)
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // ← your central component folder
import { cn } from "@/utils/cn";
import { Check, ChevronsUpDown } from "lucide-react";
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

const Conversion = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Filters
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedProjects, setSelectedProjects] = useState([]); // Multi-select
  const [period, setPeriod] = useState("day");

  // Pagination state per project
  const [pageByProject, setPageByProject] = useState({});

  // Table data per project
  const [tableDataByProject, setTableDataByProject] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/performance/conversion/");
        setData(res.data);

        // Default to first project if nothing selected
        if (selectedProjects.length === 0 && res.data.projects?.length > 0) {
          setSelectedProjects([res.data.projects[0].project_id]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Conversion data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Recompute table data when selection or filters change
  useEffect(() => {
    if (!data?.projects) return;

    const newTableData = {};
    const newPageData = { ...pageByProject };

    selectedProjects.forEach((projectId) => {
      const selected = data.projects.find((p) => p.project_id === projectId);
      if (selected) {
        let filtered = [...(selected.data || [])];

        // Date range filter
        if (dateRange.from || dateRange.to) {
          filtered = filtered.filter((row) => {
            const rowDate = new Date(row.period);
            if (dateRange.from && rowDate < dateRange.from) return false;
            if (dateRange.to && rowDate > dateRange.to) return false;
            return true;
          });
        }

        newTableData[selected.project_name || selected.project_id] = filtered;

        // Initialize pagination if not set
        if (!(projectId in newPageData)) {
          newPageData[projectId] = 1;
        }
      }
    });

    setTableDataByProject(newTableData);
    setPageByProject(newPageData);
  }, [data, selectedProjects, dateRange]);

  const changePage = (projectId, newPage) => {
    setPageByProject((prev) => ({
      ...prev,
      [projectId]: newPage,
    }));
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

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Conversion data...
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
  const paginationItemsToDisplay = 10; // Number of pagination items to show around current page

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Performance Overview" />
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

      {/* Multiple Tables - One per selected project */}
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
          const projectData = tableDataByProject[projectName] || [];

          const currentPage = pageByProject[projectName] || 1;
          const totalPages = Math.ceil(projectData.length / ITEMS_PER_PAGE);
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          const paginated = projectData.slice(start, start + ITEMS_PER_PAGE);

          return (
            <div key={projectId} className="border rounded-lg bg-card">
              <div className="p-4 font-semibold text-lg text-black text-start">
                {projectName}
              </div>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      {/* <TableHead>Date</TableHead> */}
                      <TableHead className="text-left">Inquiry</TableHead>
                      <TableHead className="text-left">Download</TableHead>
                      {/* <TableHead>Note</TableHead> */}
                      <TableHead className="text-left">WhatsApp</TableHead>
                      <TableHead className="text-left">Register</TableHead>
                      <TableHead className="text-left">Join</TableHead>
                      <TableHead className="text-left">First Deposit</TableHead>
                      <TableHead className="text-left">Total Deposit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.length > 0 ? (
                      paginated.map((row, idx) => (
                        <TableRow key={idx}>
                          {/* <TableCell>{row.period}</TableCell> */}
                          <TableCell className="text-left">
                            {row.inquiry?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.download?.toLocaleString() || "-"}
                          </TableCell>
                          {/* <TableCell>{row.note || "-"}</TableCell> */}
                          <TableCell className="text-left">
                            {row.whatsapp?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.register?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.join?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.first_deposit?.toLocaleString() || "-"}
                          </TableCell>
                          <TableCell className="text-left">
                            {row.total_deposit?.toLocaleString() || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No data for {projectName}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Central Pagination Component */}
              {totalPages > 1 && (
                <Pagination className="py-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          changePage(projectName, Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>

                    {/* Add the ellipsis only if there are more pages than the number of items to display */}
                    {totalPages > paginationItemsToDisplay && (
                      <PaginationItem>
                        <PaginationEllipsis
                          className="hidden sm:block" // Hide on small screens
                          onClick={() =>
                            changePage(
                              projectName,
                              currentPage - paginationItemsToDisplay / 2
                            )
                          }
                          disabled={
                            currentPage === paginationItemsToDisplay / 2 + 1
                          }
                        />
                      </PaginationItem>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => changePage(projectName, page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))
                      .slice(
                        // Adjust the start and end range to handle the ellipsis
                        currentPage - 1 > paginationItemsToDisplay / 2
                          ? currentPage - paginationItemsToDisplay / 2
                          : 0,
                        currentPage + paginationItemsToDisplay / 2 > totalPages
                          ? totalPages
                          : currentPage + paginationItemsToDisplay / 2
                      )}

                    {/* Add the ellipsis only if there are more pages than the number of items to display */}
                    {totalPages > paginationItemsToDisplay && (
                      <PaginationItem>
                        <PaginationEllipsis
                          className="hidden sm:block" // Hide on small screens
                          onClick={() =>
                            changePage(
                              projectName,
                              currentPage + paginationItemsToDisplay / 2
                            )
                          }
                          disabled={
                            currentPage ===
                            totalPages - paginationItemsToDisplay / 2
                          }
                        />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          changePage(
                            projectName,
                            Math.min(totalPages, currentPage + 1)
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

export default Conversion;
