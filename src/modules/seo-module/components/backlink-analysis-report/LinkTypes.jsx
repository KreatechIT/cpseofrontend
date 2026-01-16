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
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/PageHeading";
const COLORS = ["#80CBC4", "#284654", "#E9C46B", "#F4A361", "#E66E51"];

const LinkTypes = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters (same as others)
  const [linkTypeSearch, setLinkTypeSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [compareProject, setCompareProject] = useState("");
  const [domain, setDomain] = useState("");
  const [orderMonth, setOrderMonth] = useState("");
  const [linkType, setLinkType] = useState("");

  // Pie chart data
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/link-types/");
        setData(res.data);

        // Build pie chart from distribution array
        const distribution = res.data.distribution || [];
        const chartData = distribution.map((d, index) => ({
          name: d.type || `Type ${index + 1}`,
          value: d.count || 0,
          percentage: d.percentage?.toFixed(2) || 0,
          color: COLORS[index % COLORS.length],
        }));

        setPieData(chartData);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load Link Types data");
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
        Loading Link Types data...
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
  const availableLinkTypes =
    data.filters?.available_link_types?.map((lt) => lt.name) || [];
  const availableVendors =
    data.filters?.available_vendors?.map((v) => v.name) || [];
  const dateRange = data.filters?.date_range || {};

  const totalLinks = data.total_links || 0;
  const totalProjects = data.total_projects || 0;

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Link Types" />
      {/* Filters - same as others */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Label className="mb-3">Search by Link Type</Label>
          <Input
            value={linkTypeSearch}
            onChange={(e) => setLinkTypeSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="md:col-span-2">
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

      {/* Pie Chart */}
      <div className="border p-6 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Link Types ({totalLinks.toLocaleString()} links from {totalProjects}{" "}
            projects)
          </h3>
          {/* No Compare Project dropdown here */}
        </div>

        <div className="flex justify-center">
          <PieChart width={600} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              dataKey="value"
              label={({ name, percentage }) => `${name} ${percentage}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `${value} links (${
                  pieData.find((d) => d.value === value)?.percentage
                }%)`
              }
            />
          </PieChart>
        </div>

        {/* Bottom Vendor Bar */}
        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span>
                {entry.name} ({entry.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkTypes;
