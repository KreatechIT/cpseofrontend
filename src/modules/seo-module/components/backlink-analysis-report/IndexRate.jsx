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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/PageHeading";

const BAR_COLORS = {
  latestLinkIndexed: "#FBC02D",
  referringDomainIndex: "#8E24AA",
  ahrefsIndex: "#3872FA",
};

const IndexRate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters (same as Total Links)
  const [linkTypeSearch, setLinkTypeSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");
  const [domain, setDomain] = useState("");
  const [orderMonth, setOrderMonth] = useState("");
  const [linkType, setLinkType] = useState("");

  // Bar chart data
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/index-rate/");
        setData(res.data);

        // Build bar chart data from vendors array
        const vendors = res.data.vendors || [];
        const chartData = vendors.map((v, index) => ({
          vendor: v.vendor_name || `Vendor ${String.fromCharCode(65 + index)}`, // A, B, C, etc.
          latestLinkIndexed: v.latest_link_indexed_rate || 0,
          referringDomainIndex: v.unique_domain_index_rate || 0,
          ahrefsIndex: v.ahrefs_index_rate || 0,
        }));

        setBarData(chartData);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Index Rate data");
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
        Loading Index Rate data...
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

  // Extract options from API response (same as Total Links)
  const availableLinkTypes =
    data.filters?.available_link_types?.map((lt) => lt.name) || [];
  const availableVendors =
    data.filters?.available_vendors?.map((v) => v.name) || [];
  const dateRange = data.filters?.date_range || {};

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Index Rate" />
      {/* Filters - same as Total Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Label className="mb-3">Search by Link Type</Label>
          <Input
            value={linkTypeSearch}
            onChange={(e) => setLinkTypeSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="md:col-span-3   ">
          <Label className="mb-3">Date Wise Filter</Label>
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

        <div>
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
              {[
                "JAN",
                "FEB",
                "MAR",
                "APR",
                "MAY",
                "JUN",
                "JUL",
                "AUG",
                "SEP",
                "OCT",
                "NOV",
                "DEC",
              ].map((month) => (
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
              {availableLinkTypes.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="border p-6 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Index Rate</h3>
          <Select
            value={compareProject}
            onValueChange={setCompareProject}
            className="w-[200px]"
          >
            <SelectTrigger>
              <SelectValue placeholder="Compare Project" />
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

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendor" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Bar
              dataKey="latestLinkIndexed"
              fill={BAR_COLORS.latestLinkIndexed}
              name="Latest Link Indexed"
            />
            <Bar
              dataKey="referringDomainIndex"
              fill={BAR_COLORS.referringDomainIndex}
              name="Referring Domain Index"
            />
            <Bar
              dataKey="ahrefsIndex"
              fill={BAR_COLORS.ahrefsIndex}
              name="Ahrefs Index"
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Bottom Legend Bar */}
        {/* <div className="flex justify-center gap-6 mt-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: BAR_COLORS.latestLinkIndexed }}
            ></div>
            <span>Latest Link Indexed</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: BAR_COLORS.referringDomainIndex }}
            ></div>
            <span>Referring Domain Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: BAR_COLORS.ahrefsIndex }}
            ></div>
            <span>Ahrefs Index</span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default IndexRate;
