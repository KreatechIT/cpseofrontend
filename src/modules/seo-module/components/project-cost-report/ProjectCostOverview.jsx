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
import {
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  Check,
  ChevronsUpDown,
} from "lucide-react";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { cn } from "@/utils/cn";

// Your central Pagination components
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Adjust path

const ITEMS_PER_PAGE = 10;

const ProjectCostOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedProject, setSelectedProject] = useState(""); // Single project only

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Table data
  const [tableData, setTableData] = useState([]);

  const [open, setOpen] = useState(false); // For project popover

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/costs/report/");
        setData(res.data);

        // Default to first project
        if (res.data.accessible_project_ids?.length > 0) {
          setSelectedProject(res.data.accessible_project_ids[0]);
        }
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Project Cost Report");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and paginate table data
  useEffect(() => {
    if (!data?.data) return;

    let filtered = data.data;

    // Project filter (single)
    if (selectedProject) {
      filtered = filtered.filter((row) => row.project_id === selectedProject);
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter((row) => row.cost_type === typeFilter);
    }

    // Search
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Date range
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.created_date);
        if (dateRange.from && rowDate < dateRange.from) return false;
        if (dateRange.to && rowDate > dateRange.to) return false;
        return true;
      });
    }

    setTableData(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [data, selectedProject, typeFilter, searchQuery, dateRange]);

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = tableData.slice(start, start + ITEMS_PER_PAGE);

  const selectedProjectName =
    data?.data?.find((r) => r.project_id === selectedProject)?.project_name ||
    selectedProject ||
    "Select Project";

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">Loading...</div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12 text-red-600">Error loading data</div>
    );
  }

  const types = ["Tools", "Servers", "Backlinks", "Domains", "Content"];

  return (
    <div className="space-y-8 mt-6">
      {/* 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
        <div className="md:col-span-3 bg-[#3872FA33] rounded-xl p-6 flex items-center justify-between">
          <div className="bg-blue-600 rounded-full p-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-[#3872FA]">
              ${data.summary?.total_usd?.toLocaleString() || "0"}
            </div>
            <div className="text-2xl font-medium">
              RM{data.summary?.total_myr?.toLocaleString() || "0"}
            </div>
            <div className="text-lg text-[#3872FA] mt-2">Total Cost</div>
            <div className="flex items-center justify-end mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">+8% this month</span>
            </div>
          </div>
        </div>

        {types.map((title) => {
          const cost = data.summary?.by_type?.[title] || { myr: 0, usd: 0 };
          return (
            <div key={title} className="bg-muted rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold">{title}</div>
              <div className="text-1xl font-bold mt-2">
                RM{cost.myr?.toLocaleString() || "0"}
              </div>
              <div className="mt-2 flex items-center justify-center text-red-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">-2% this month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-150"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-[360px]">
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

          <div className="w-[200px]">
            <Label className="mb-3">Type</Label>
            <Select
              value={typeFilter ?? ""}
              onValueChange={(v) => setTypeFilter(v || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fixed Project Multi-Select */}
          <div className="w-[300px]">
            <Label className="mb-3">Project</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedProject ? selectedProject : "Select Project"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search project..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {data.accessible_project_ids?.map((pid) => (
                        <CommandItem
                          key={pid}
                          value={pid}
                          onSelect={() => {
                            setSelectedProject(pid);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProject === pid
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {pid}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Single Table */}
      <div className="border rounded-lg bg-card py-3">
        <ScrollArea className="">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Project/Project ID</TableHead>
                <TableHead>PIC</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price (MYR)</TableHead>
                <TableHead className="text-right">Price (USD)</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">
                  Price Without Tax (USD)
                </TableHead>
                <TableHead className="text-right">Currency Rate</TableHead>
                <TableHead>Documentation</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>
                      {row.project_name || row.project_id || "-"}
                    </TableCell>
                    <TableCell>{row.pic || "-"}</TableCell>
                    <TableCell>
                      {row.created_date 
                        ? format(
                            new Date(row.created_date),
                            "dd/MM/yyyy"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>{row.cost_type || "-"}</TableCell>
                    <TableCell>{row.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      {row.price_myr?.toLocaleString() || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.price_usd?.toLocaleString() || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.price_without_tax_usd?.toLocaleString() || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.tax || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.currency_rate || "-"}
                    </TableCell>
                    <TableCell>{row.documentation || "-"}</TableCell>
                    <TableCell>{row.remark || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={15}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Central Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default ProjectCostOverview;
