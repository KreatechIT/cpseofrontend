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
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import CompetitorPoolTable from "./CompetitorPoolTable";
import { Button } from "@/components/ui/button";

const CompetitorPoolFilters = ({ competitors }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const vendorOptions = useMemo(() => {
    return [...new Set(competitors.map((c) => c.vendor).filter(Boolean))];
  }, [competitors]);

  const filteredCompetitors = useMemo(() => {
    return competitors.filter((comp) => {
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        if (
          !Object.values(comp).some((v) =>
            v?.toString().toLowerCase().includes(term)
          )
        )
          return false;
      }

      if (selectedVendor && comp.vendor !== selectedVendor) return false;

      // Use first_seen if available, otherwise created
      const itemDate = comp.first_seen
        ? new Date(comp.first_seen)
        : new Date(comp.created);

      if (dateRange.from && itemDate < dateRange.from) return false;
      if (dateRange.to && itemDate > dateRange.to) return false;

      return true;
    });
  }, [competitors, searchQuery, selectedVendor, dateRange]);

  return (
    <div className="space-y-6 mt-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Vendor */}
        <div>
          <Label className="mb-3">Vendor</Label>
          <Select
            value={selectedVendor ?? ""}
            onValueChange={(v) => setSelectedVendor(v || null)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Vendors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>All Vendors</SelectItem>
              {vendorOptions.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from
                ? dateRange.to
                  ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(
                      dateRange.to,
                      "dd MMM yyyy"
                    )}`
                  : format(dateRange.from, "dd MMM yyyy")
                : "Discovered Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <CompetitorPoolTable competitors={filteredCompetitors} />
    </div>
  );
};

export default CompetitorPoolFilters;
