import { format, setMonth, setYear } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from(
  { length: 50 },
  (_, i) => new Date().getFullYear() - i
);

const MonthSelector = ({ title = "Select Month", fromDate, setFromDate }) => {
  const handleMonthChange = (monthIndex) => {
    const updatedDate = fromDate
      ? setMonth(fromDate, parseInt(monthIndex))
      : setMonth(new Date(), parseInt(monthIndex));
    setFromDate(updatedDate);
  };

  const handleYearChange = (year) => {
    const updatedDate = fromDate
      ? setYear(fromDate, parseInt(year))
      : setYear(new Date(), parseInt(year));
    setFromDate(updatedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "group bg-background hover:bg-background border-input focus-visible:outline-[2px] w-full justify-between px-3 py-5 font-normal outline-offset-0 outline-none",
            !fromDate && "text-muted-foreground"
          )}
        >
          <span
            className={cn("truncate", !fromDate && "text-muted-foreground")}
          >
            {fromDate ? format(fromDate, "MMMM yyyy") : title}
          </span>
          <CalendarIcon
            size={16}
            className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-xs p-4">
        <div className="flex flex-col gap-3">
          <Select
            value={fromDate ? String(fromDate.getMonth()) : ""}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={month} value={String(index)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={fromDate ? String(fromDate.getFullYear()) : ""}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthSelector;
