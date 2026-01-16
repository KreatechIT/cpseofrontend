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

const KeywordCost = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [currency, setCurrency] = useState("USD"); // USD or MYR
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");

  // Table data
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/keyword-cost/");
        setData(res.data);

        // Build table rows from keywords array
        const keywords = res.data.data || [];
        const formatted = keywords.map((k) => ({
          keyword: k.keyword,
          totalPrice:
            currency === "USD" ? k.total_price_usd : k.total_price_myr,
          totalKeyword: k.total_keyword,
          pbn: {
            price: k.breakdown?.PBN?.price_usd || 0,
            percentage: k.breakdown?.PBN?.percentage || 0,
          },
          gp: {
            price: k.breakdown?.["Guest Post"]?.price_usd || 0,
            percentage: k.breakdown?.["Guest Post"]?.percentage || 0,
          },
          dvi: {
            price: k.breakdown?.DVI?.price_usd || 0,
            percentage: k.breakdown?.DVI?.percentage || 0,
          },
          301: {
            price: k.breakdown?.["301"]?.price_usd || 0,
            percentage: k.breakdown?.["301"]?.percentage || 0,
          },
          edu: {
            price: k.breakdown?.EDU?.price_usd || 0,
            percentage: k.breakdown?.EDU?.percentage || 0,
          },
        }));

        setTableData(formatted);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Keyword Cost data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currency]); // Refresh when currency changes

  if (loading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading Keyword Cost data...
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

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-[180px]">
            <Label className="mb-3">Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="MYR">MYR</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[320px]">
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
                    ? `${format(
                        new Date(dateRange.min_date),
                        "PPP"
                      )} - ${format(new Date(dateRange.max_date), "PPP")}`
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
              <SelectTrigger>
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
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card">
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-right">Total Keyword</TableHead>
                <TableHead className="text-right">PBN - Total Price</TableHead>
                <TableHead className="text-right">
                  PBN - Total Keyword (%)
                </TableHead>
                <TableHead className="text-right">GP - Total Price</TableHead>
                <TableHead className="text-right">
                  GP - Total Keyword (%)
                </TableHead>
                <TableHead className="text-right">DVI - Total Price</TableHead>
                <TableHead className="text-right">
                  DVI - Total Keyword (%)
                </TableHead>
                <TableHead className="text-right">301 - Total Price</TableHead>
                <TableHead className="text-right">
                  301 - Total Keyword (%)
                </TableHead>
                <TableHead className="text-right">EDU - Total Price</TableHead>
                <TableHead className="text-right">
                  EDU - Total Keyword (%)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData
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
                      {currency === "USD"
                        ? row.totalPrice
                        : row.totalPrice * 4.7}{" "}
                      {/* Mock conversion */}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.totalKeyword}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.pbn.price}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.pbn.percentage}%
                    </TableCell>
                    <TableCell className="text-right">{row.gp.price}</TableCell>
                    <TableCell className="text-right">
                      {row.gp.percentage}%
                    </TableCell>
                    <TableCell className="text-right">
                      {row.dvi.price}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.dvi.percentage}%
                    </TableCell>
                    <TableCell className="text-right">
                      {row["301"].price}
                    </TableCell>
                    <TableCell className="text-right">
                      {row["301"].percentage}%
                    </TableCell>
                    <TableCell className="text-right">
                      {row.edu.price}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.edu.percentage}%
                    </TableCell>
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

export default KeywordCost;
