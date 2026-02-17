import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import {CommandList } from "@/components/ui/command";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/PageHeading";
import { cn } from "@/utils/cn";

const ITEMS_PER_PAGE = 10;

const BacklinksOpportunity = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [selectedVendors, setSelectedVendors] = useState([]); // Multi-select for vendors
  const [open, setOpen] = useState(false);

  // Vendor Overview Modal
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [vendorLoading, setVendorLoading] = useState(false);
  const [vendorCurrentPage, setVendorCurrentPage] = useState(1);
   const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/seo/backlinks/opportunities/");
        const opportunities = res.data.opportunities || res.data || [];
        const formatted = opportunities.map((opp, index) => ({
          no: index + 1,
          uniqueDomain: opp.unique_domain || "-",
          linkType: opp.link_type || "-",
          note: opp.remark || "-",
          domainRating: opp.domain_rating || "-",
          domainAuthority: opp.domain_authority || "-",
          pageAuthority: opp.page_authority || "-",
          spamScore: opp.spam_score || "-",
          domainCreatedDate: opp.domain_created_date || "-",
          domainExpirationDate: opp.domain_expiration_date || "-",
          domainAge: opp.domain_age || "-",
          associatedVendors: opp.associated_vendors || "-",
          lowestPriceUSD: opp.lowest_price_usd || "-",
          discoveredDate: opp.discovered_date || "-",
          discoveredBy: opp.discovered_by || "-",
          overlapCompetitors: opp.overlap_competitors || "-",
          projectConsistsLink: opp.project_consists_link || "-",
          remark: opp.remark || "-",
        }));
        setTableData(formatted);
      } catch (err) {
        toast.error("Failed to load backlink opportunities");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch vendor details when a metric is clicked
  useEffect(() => {
    if (!selectedDomain) return;

    const fetchVendorDetails = async () => {
      setVendorLoading(true);
      setVendorData(null);
      try {
        const res = await axiosInstance.get(
          `/seo/backlinks/opportunity-vendor-details/?unique_domain=${encodeURIComponent(selectedDomain)}`
        );
        setVendorData(res.data);
      } catch (err) {
        toast.error("Failed to load vendor details");
      } finally {
        setVendorLoading(false);
      }
    };

    fetchVendorDetails();
  }, [selectedDomain]);

  // Handle click on metric columns
  const handleMetricClick = (domain) => {
    if (!domain || domain === "-") return;
    setSelectedDomain(domain);
    setVendorModalOpen(true);
    setVendorCurrentPage(1);
  };

  // Vendor pagination
  const vendorTotalPages = vendorData?.vendors
    ? Math.ceil(vendorData.vendors.length / ITEMS_PER_PAGE)
    : 0;
  const vendorStart = (vendorCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVendors = vendorData?.vendors?.slice(vendorStart, vendorStart + ITEMS_PER_PAGE) || [];

  // Toggle vendor selection
  const toggleVendor = (vendorName) => {
    setSelectedVendors(prev =>
      prev.includes(vendorName)
        ? prev.filter(v => v !== vendorName)
        : [...prev, vendorName]
    );
  };

  // Auto-select first 2 vendors on load (if needed)
  useEffect(() => {
    if (selectedVendors.length === 0 && data?.filters?.available_vendors?.length > 0) {
      const firstTwo = data.filters.available_vendors.slice(0, 2).map(v => v.name);
      setSelectedVendors(firstTwo);
    }
  }, [data]);

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Backlinks Opportunity" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Label className="mb-3">Search by Keyword</Label>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="md:col-span-3">
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
                    ? `${format(dateFilter.from, "PPP")} - ${format(dateFilter.to, "PPP")}`
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

        {/* Multi-Select for Compare Project (Vendors) */}
        <div className="md:col-span-3">
          <Label className="mb-3">Compare Project</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between">
                {selectedVendors.length > 0
                  ? `${selectedVendors.length} vendor${selectedVendors.length > 1 ? "s" : ""} selected`
                  : "Compare Vendor"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search vendor..." />
                <CommandList>
                  <CommandEmpty>No vendor found.</CommandEmpty>
                  <CommandGroup>
                    {(data?.filters?.available_vendors || []).map((v) => (
                      <CommandItem
                        key={v.name}
                        value={v.name}
                        onSelect={() => toggleVendor(v.name)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedVendors.includes(v.name) ? "opacity-100" : "opacity-0")} />
                        {v.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]" >
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead>Unique Domain</TableHead>
                <TableHead>Link Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Domain Rating</TableHead>
                <TableHead>Domain Authority</TableHead>
                <TableHead>Page Authority</TableHead>
                <TableHead>Spam Score</TableHead>
                <TableHead>Domain Created Date</TableHead>
                <TableHead>Domain Expiration Date</TableHead>
                <TableHead>Domain Age</TableHead>
                <TableHead>Associated Vendors</TableHead>
                <TableHead>Lowest Price (USD)</TableHead>
                <TableHead>Discovered Date</TableHead>
                <TableHead>Discovered By</TableHead>
                <TableHead>Overlap Competitors</TableHead>
                <TableHead>Project Consists Link</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={17} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : tableData.length > 0 ? (
                tableData
                  .filter((row) =>
                    searchQuery
                      ? row.keyword
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      : true
                  )
                  .map((row) => (
                    <TableRow key={row.no}>
                      <TableCell className="font-medium">{row.no}</TableCell>
                      <TableCell>{row.uniqueDomain}</TableCell>
                      <TableCell>{row.linkType}</TableCell>
                      <TableCell>{row.note}</TableCell>

                      {/* Clickable columns */}
                      <TableCell
                        className="text-right cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleMetricClick(row.uniqueDomain)}
                      >
                        {row.domainRating}
                      </TableCell>
                      <TableCell
                        className="text-right cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleMetricClick(row.uniqueDomain)}
                      >
                        {row.domainAuthority}
                      </TableCell>
                      <TableCell
                        className="text-right cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleMetricClick(row.uniqueDomain)}
                      >
                        {row.pageAuthority}
                      </TableCell>
                      <TableCell
                        className="text-right cursor-pointer hover:underline text-blue-600"
                        onClick={() => handleMetricClick(row.uniqueDomain)}
                      >
                        {row.spamScore}
                      </TableCell>

                      <TableCell>{row.domainCreatedDate}</TableCell>
                      <TableCell>{row.domainExpirationDate}</TableCell>
                      <TableCell>{row.domainAge}</TableCell>
                      <TableCell>{row.associatedVendors}</TableCell>
                      <TableCell>{row.lowestPriceUSD}</TableCell>
                      <TableCell>{row.discoveredDate}</TableCell>
                      <TableCell>{row.discoveredBy}</TableCell>
                      <TableCell>{row.overlapCompetitors}</TableCell>
                      <TableCell>{row.projectConsistsLink}</TableCell>
                      <TableCell>{row.remark}</TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={17} className="text-center py-8 text-muted-foreground">
                    No opportunities found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Vendor Overview Modal */}
      <Dialog open={vendorModalOpen} onOpenChange={setVendorModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Vendor Overview - {selectedDomain || "Selected Domain"}</DialogTitle>
          </DialogHeader>

          {vendorLoading ? (
            <div className="text-center py-12">Loading vendors...</div>
          ) : vendorData && vendorData.vendors?.length > 0 ? (
            <div className="mt-4 flex flex-col h-full overflow-scroll">
              <ScrollArea className="flex-1 h-110 overflow-scroll border rounded-lg" style={{ overflowX: "scroll" }}>
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Lowest Price (USD)</TableHead>
                      <TableHead>Domain Rating</TableHead>
                      <TableHead>Traffic</TableHead>
                      <TableHead>Domain Authority</TableHead>
                      <TableHead>Page Authority</TableHead>
                      <TableHead>Spam Score</TableHead>
                      <TableHead>Domain Created Date</TableHead>
                      <TableHead>Domain Expiration Date</TableHead>
                      <TableHead>Domain Age</TableHead>
                      <TableHead>Overlap Competitors</TableHead>
                      <TableHead>Project Consists Link</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedVendors.map((v) => (
                      <TableRow key={v.no}>
                        <TableCell>{v.no}</TableCell>
                        <TableCell>{v.vendor || "-"}</TableCell>
                        <TableCell>${v.lowest_price_usd?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{v.domain_rating || "-"}</TableCell>
                        <TableCell>{v.traffic?.toLocaleString() || "-"}</TableCell>
                        <TableCell>{v.domain_authority || "-"}</TableCell>
                        <TableCell>{v.page_authority || "-"}</TableCell>
                        <TableCell>{v.spam_score || "-"}</TableCell>
                        <TableCell>{v.domain_created_date || "-"}</TableCell>
                        <TableCell>{v.domain_expiration_date || "-"}</TableCell>
                        <TableCell>{v.domain_age || "-"}</TableCell>
                        <TableCell>{v.overlap_competitors || "-"}</TableCell>
                        <TableCell>{v.project_consists_link || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Pagination */}
              {vendorTotalPages > 1 && (
                <Pagination className="mt-4 flex justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setVendorCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={vendorCurrentPage === 1}
                      />
                    </PaginationItem>

                    {Array.from({ length: vendorTotalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === vendorTotalPages ||
                        (page >= vendorCurrentPage - 2 && page <= vendorCurrentPage + 2)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === vendorCurrentPage}
                              onClick={() => setVendorCurrentPage(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (page === vendorCurrentPage - 3 || page === vendorCurrentPage + 3) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setVendorCurrentPage((p) => Math.min(vendorTotalPages, p + 1))}
                        disabled={vendorCurrentPage === vendorTotalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No vendors found for {selectedDomain}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BacklinksOpportunity;