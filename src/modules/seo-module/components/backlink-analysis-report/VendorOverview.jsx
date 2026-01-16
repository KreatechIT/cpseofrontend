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

const VendorOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [selectedCompareProjects, setSelectedCompareProjects] = useState([]);
  const [domain, setDomain] = useState("");
  const [orderMonth, setOrderMonth] = useState("");
  const [linkType, setLinkType] = useState("");

  // Table data per project
  const [tableDataByProject, setTableDataByProject] = useState({});

  const [open, setOpen] = useState(false); // For multi-select popover

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/vendor-overview/");
        setData(res.data);

        // Build table data (single for now, extend for multi later)
        const opportunities = res.data.data || [];
        const formatted = opportunities.map((opp, index) => ({
          vendor: opp.vendor_name || "-",
          domainRating: opp.domain_rating || "-",
          domainAuthority: opp.domain_authority || "-",
          note: opp.remark || "-",
          pageAuthority: opp.page_authority || "-",
          spamScore: opp.spam_score || "-",
          latestLinkIndexRate: "0.00", // Placeholder (not in response yet)
          uniqueDomainIndexRate: "0.00", // Placeholder
          ahrefsIndexRate: "0.00", // Placeholder
        }));

        setTableDataByProject({ "All Projects": formatted });
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Vendor Overview data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Loading Vendor Overview...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-12 text-red-600">Error loading data. Please try again.</div>;
  }

  // Extract options from API response
  const dateRange = data.filters?.date_range || {};
  const availableVendors = data.filters?.available_vendors?.map((v) => v.name) || [];

  // Toggle project selection
  const toggleProject = (projectId) => {
    setSelectedCompareProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((p) => p !== projectId)
        : [...prev, projectId]
    );
  };

  // For now, single table (multi-project support can be added later)
  const activeTableData = tableDataByProject["All Projects"] || [];

  // For now, single project (multi-project support can be added later)
  const tableData = activeTableData.filter((row) => {
    if (searchQuery) {
      return row.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Filters - same layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Label className="mb-3">Search</Label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="md:col-span-2">
          <Label className="mb-3">Date Wise Filter</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter.from
                  ? dateFilter.to
                    ? `${format(dateFilter.from, "PPP")} - ${format(dateFilter.to, "PPP")}`
                    : format(dateFilter.from, "PPP")
                  : dateRange.min_date && dateRange.max_date
                  ? `${format(new Date(dateRange.min_date), "PPP")} - ${format(new Date(dateRange.max_date), "PPP")}`
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

        <div>
          <Label className="mb-3">Compare Project</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedCompareProjects.length > 0
                  ? `${selectedCompareProjects.length} project${selectedCompareProjects.length > 1 ? "s" : ""} selected`
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
                    {data.accessible_project_ids?.map((pid) => (
                      <CommandItem
                        key={pid}
                        value={pid}
                        onSelect={() => toggleProject(pid)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCompareProjects.includes(pid) ? "opacity-100" : "opacity-0"
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

        <div>
          <Label className="mb-3">Domain</Label>
          <Select value={domain} onValueChange={setDomain}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select domain" />
            </SelectTrigger>
            <SelectContent>
              {availableVendors.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Order Month</Label>
          <Select value={orderMonth} onValueChange={setOrderMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3">Link Type</Label>
          <Select value={linkType} onValueChange={setLinkType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select link type" />
            </SelectTrigger>
            <SelectContent>
              {data.filters?.available_link_types?.map((lt) => (
                <SelectItem key={lt.name} value={lt.name}>
                  {lt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Multiple Tables - One per selected project */}
      <div className="space-y-10">
        {selectedCompareProjects.length === 0 && tableData.length > 0 && (
          <div className="border rounded-lg bg-card">
            <div className="p-4 font-semibold text-lg">All Projects - Vendor Overview</div>
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Domain Rating</TableHead>
                    <TableHead>Domain Authority</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Page Authority</TableHead>
                    <TableHead>Spam Score</TableHead>
                    <TableHead>Latest Link Index Rate (%)</TableHead>
                    <TableHead>Unique Domain Index Rate (%)</TableHead>
                    <TableHead>Ahrefs Index Rate (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell>{row.domainRating}</TableCell>
                      <TableCell>{row.domainAuthority}</TableCell>
                      <TableCell>{row.note}</TableCell>
                      <TableCell>{row.pageAuthority}</TableCell>
                      <TableCell>{row.spamScore}</TableCell>
                      <TableCell>{row.latestLinkIndexRate}</TableCell>
                      <TableCell>{row.uniqueDomainIndexRate}</TableCell>
                      <TableCell>{row.ahrefsIndexRate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        {selectedCompareProjects.length > 0 &&
          selectedCompareProjects.map((projectId) => {
            const selected = data.projects?.find((p) => p.project_id === projectId);
            const projectName = selected?.project_name || projectId;
            // For now, same data (extend with real per-project later)
            const projectData = tableData;

            return (
              <div key={projectId} className="border rounded-lg bg-card">
                <div className="p-4 font-semibold text-lg">{projectName}</div>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Domain Rating</TableHead>
                        <TableHead>Domain Authority</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead>Page Authority</TableHead>
                        <TableHead>Spam Score</TableHead>
                        <TableHead>Latest Link Index Rate (%)</TableHead>
                        <TableHead>Unique Domain Index Rate (%)</TableHead>
                        <TableHead>Ahrefs Index Rate (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.vendor}</TableCell>
                          <TableCell>{row.domainRating}</TableCell>
                          <TableCell>{row.domainAuthority}</TableCell>
                          <TableCell>{row.note}</TableCell>
                          <TableCell>{row.pageAuthority}</TableCell>
                          <TableCell>{row.spamScore}</TableCell>
                          <TableCell>{row.latestLinkIndexRate}</TableCell>
                          <TableCell>{row.uniqueDomainIndexRate}</TableCell>
                          <TableCell>{row.ahrefsIndexRate}</TableCell>
                        </TableRow>
                      ))}
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

export default VendorOverview;