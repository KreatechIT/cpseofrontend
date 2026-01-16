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

const BacklinksOpportunity = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters (only right side)
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");

  // Table data
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/opportunities/");
        setData(res.data);

        // Build table rows from opportunities array
        const opportunities = res.data.opportunities || [];
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
        setError(err.message);
        toast.error("Failed to load Backlinks Opportunity data");
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
        Loading Backlinks Opportunity data...
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
  const availableVendors =
    data.filters?.available_vendors?.map((v) => v.name) || [];
  const searchQuery = data.filters?.search_query || "";

  return (
    <div className="space-y-8">
      {/* Filters - Only right side */}
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

        <div className="w-[200px]">
          <Label className="mb-3">Compare Project</Label>
          <Select value={compareProject} onValueChange={setCompareProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select project" />
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
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]">
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
              {tableData
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
                    <TableCell>{row.domainRating}</TableCell>
                    <TableCell>{row.domainAuthority}</TableCell>
                    <TableCell>{row.pageAuthority}</TableCell>
                    <TableCell>{row.spamScore}</TableCell>
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
                ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default BacklinksOpportunity;
