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
import CompetitorDetailsTable from "./CompetitorDetailsTable";
import { Button } from "@/components/ui/button";

const CompetitorDetailsFilters = ({ competitors = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  // FIX 1: Use a unique string that is NOT an empty string
  const [selectedCompany, setSelectedCompany] = useState("all_competitors");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const companyOptions = useMemo(() => {
    return [...new Set(competitors.map((c) => c.company).filter(Boolean))];
  }, [competitors]);

  const filteredCompetitors = useMemo(() => {
    const safeData = Array.isArray(competitors) ? competitors : [];

    return safeData.filter((comp) => {
      // SEARCH LOGIC FIX
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        const matches = Object.values(comp || {}).some((v) => {
          // FIX 2: Explicitly ignore null/undefined so .toString() doesn't fail
          if (v === null || v === undefined) return false;
          return v.toString().toLowerCase().includes(term);
        });
        if (!matches) return false;
      }

      // SELECT LOGIC FIX
      // FIX 3: Check against our unique string
      if (
        selectedCompany !== "all_competitors" &&
        comp.company !== selectedCompany
      ) {
        return false;
      }

      // DATE LOGIC (remains same, just ensure safety)
      if (dateRange?.from || dateRange?.to) {
        const createdDate = new Date(comp.created);
        if (isNaN(createdDate.getTime())) return true;
        if (dateRange.from && createdDate < dateRange.from) return false;
        if (dateRange.to && createdDate > dateRange.to) return false;
      }

      return true;
    });
  }, [competitors, searchQuery, selectedCompany, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[300px]">
          <Label className="mb-3">Search</Label>
          <Input
            placeholder="Search any field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[280px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from
                ? dateRange.to
                  ? `${format(dateRange.from, "dd MMM yyyy")} - ${format(
                      dateRange.to,
                      "dd MMM yyyy"
                    )}`
                  : format(dateRange.from, "dd MMM yyyy")
                : "Date Range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) =>
                setDateRange(range || { from: undefined, to: undefined })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <div>
          <Label className="mb-3">Company</Label>
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              {/* FIX 4: Use the non-empty string here */}
              <SelectItem value="all_competitors">All Companies</SelectItem>
              {companyOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <CompetitorDetailsTable filteredCompetitors={filteredCompetitors} />
    </div>
  );
};

export default CompetitorDetailsFilters;
