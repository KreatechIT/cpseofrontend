import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import SamplePoolTable from "./SamplePoolTable";
import { Button } from "@/components/ui/button";

const SamplePoolFilters = ({ samples }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLinkType, setSelectedLinkType] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [selectedMonthFilter, setSelectedMonthFilter] = useState("all"); // "all" or "this_month"

  const currentDate = new Date();
  const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Unique options
  const vendorOptions = useMemo(() => [...new Set(samples.map(s => s.vendor).filter(Boolean))], [samples]);
  const categoryOptions = useMemo(() => [...new Set(samples.map(s => s.category).filter(Boolean))], [samples]);
  const linkTypeOptions = useMemo(() => [...new Set(samples.map(s => s.link_type).filter(Boolean))], [samples]);

  // Filtering
  const filteredSamples = useMemo(() => {
    return samples.filter(sample => {
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        if (!Object.values(sample).some(v => v?.toString().toLowerCase().includes(term))) return false;
      }

      if (selectedVendor && sample.vendor !== selectedVendor) return false;
      if (selectedCategory && sample.category !== selectedCategory) return false;
      if (selectedLinkType && sample.link_type !== selectedLinkType) return false;

      if (dateRange.from || dateRange.to) {
        const discDate = new Date(sample.discovered_date);
        if (dateRange.from && discDate < dateRange.from) return false;
        if (dateRange.to && discDate > dateRange.to) return false;
      }

      if (selectedMonthFilter === "this_month") {
        const discDate = new Date(sample.discovered_date);
        if (discDate < currentMonthStart || discDate > currentMonthEnd) return false;
      }

      return true;
    });
  }, [samples, searchQuery, selectedVendor, selectedCategory, selectedLinkType, dateRange, selectedMonthFilter]);

  return (
    <div className="space-y-6 mt-6">
      {/* Filters Row */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Search */}
        {/* <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}

        {/* Vendor */}
        <div>
          <Label className="mb-3">Vendor</Label>
          <Select value={selectedVendor ?? ""} onValueChange={(v) => setSelectedVendor(v || null)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Vendors</SelectItem>
              {vendorOptions.map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label className="mb-3">Category</Label>
          <Select value={selectedCategory ?? ""} onValueChange={(v) => setSelectedCategory(v || null)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Categories</SelectItem>
              {categoryOptions.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Link Type */}
        <div>
          <Label className="mb-3">Link Type</Label>
          <Select value={selectedLinkType ?? ""} onValueChange={(v) => setSelectedLinkType(v || null)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Link Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Link Types</SelectItem>
              {linkTypeOptions.map(lt => (
                <SelectItem key={lt} value={lt}>{lt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
                  : format(dateRange.from, "dd MMM yyyy")
                : "Discovered Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
          </PopoverContent>
        </Popover>

        {/* This Month Only - Now a Dropdown */}
        <div>
          <Label className="mb-3">Date Filter</Label>
          <Select value={selectedMonthFilter} onValueChange={setSelectedMonthFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="this_month">This Month Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <SamplePoolTable samples={filteredSamples} />
    </div>
  );
};

export default SamplePoolFilters;