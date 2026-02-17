import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { PageHeading } from "@/components/shared/PageHeading";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/utils/cn";

const BAR_COLORS = {
  latestLinkIndexed: "#FBC02D",
  referringDomainIndex: "#8E24AA",
  ahrefsIndex: "#3872FA",
};

const IndexRate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Filters
  const [linkTypeSearch, setLinkTypeSearch] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: null, to: null });
  const [selectedVendors, setSelectedVendors] = useState([]); // Multi-select for vendors ("projects")
    const [domain, setDomain] = useState("");
  const [orderMonth, setOrderMonth] = useState("");
    const [linkType, setLinkType] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/seo/backlinks/index-rate/");
        setData(res.data);

        // Auto-select first 2 vendors on first load
        const vendors = res.data.filters?.available_vendors || [];
        if (selectedVendors.length === 0 && vendors.length > 0) {
          const firstTwo = vendors.slice(0, 2).map(v => v.name);
          setSelectedVendors(firstTwo);
        }
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
    return <div className="text-center py-12 text-muted-foreground">Loading Index Rate data...</div>;
  }

  if (error || !data) {
    return <div className="text-center py-12 text-red-600">Error loading data. Please try again.</div>;
  }

  // Extract options
  const availableLinkTypes = data.filters?.available_link_types?.map(lt => lt.name) || [];
  const availableVendors = data.filters?.available_vendors?.map(v => v.name) || [];
  const dateRange = data.filters?.date_range || {};

  // Toggle vendor selection
  const toggleVendor = (vendorName) => {
    setSelectedVendors(prev =>
      prev.includes(vendorName)
        ? prev.filter(v => v !== vendorName)
        : [...prev, vendorName]
    );
  };

  // Filter vendors data based on selected vendors
  const selectedVendorData = (data.vendors || []).filter(v => selectedVendors.includes(v.vendor_name));

  return (
    <div className="space-y-8">
      <PageHeading pageTitle="Index Rate" />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="md:col-span-4">
          <Label className="mb-3">Search by Link Type</Label>
          <Input
            value={linkTypeSearch}
            onChange={(e) => setLinkTypeSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>

        <div className="md:col-span-3">
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
                    ? `${format(dateFilter.from, "PPP")} - ${format(dateFilter.to, "PPP")}`
                    : format(dateFilter.from, "PPP")
                  : dateRange.min_date && dateRange.max_date
                  ? `${format(new Date(dateRange.min_date), "PPP")} - ${format(new Date(dateRange.max_date), "PPP")}`
                  : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
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
                    {availableVendors.map((v) => (
                      <CommandItem
                        key={v}
                        value={v}
                        onSelect={() => toggleVendor(v)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedVendors.includes(v) ? "opacity-100" : "opacity-0")} />
                        {v}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Other filters */}
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
              {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"].map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
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

      {/* Multiple Bar Charts - One per Selected Vendor */}
      <div className="space-y-12">
        {selectedVendorData.length > 0 ? (
          selectedVendorData.map((vendor) => {
            // Chart data for this vendor (only one group of bars since per-vendor)
            const chartData = [{
              vendor: vendor.vendor_name,
              latestLinkIndexed: vendor.latest_link_indexed_rate || 0,
              referringDomainIndex: vendor.unique_domain_index_rate || 0,
              ahrefsIndex: vendor.ahrefs_index_rate || 0,
            }];

            return (
              <div key={vendor.vendor_id} className="border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">{vendor.vendor_name} Index Rate</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="vendor" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar dataKey="latestLinkIndexed" fill={BAR_COLORS.latestLinkIndexed} name="Latest Link Indexed" />
                    <Bar dataKey="referringDomainIndex" fill={BAR_COLORS.referringDomainIndex} name="Referring Domain Index" />
                    <Bar dataKey="ahrefsIndex" fill={BAR_COLORS.ahrefsIndex} name="Ahrefs Index" />
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
            );
          })
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Select at least one vendor to view index rate
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexRate;