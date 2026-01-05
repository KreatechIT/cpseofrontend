import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

const DateRangeFilter = ({
  title,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  preset = false,
}) => {
  const presetOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 3 Days", value: "last3days" },
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last 30 Days", value: "last30days" },
    { label: "Month to Date", value: "monthToDate" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last 3 Months", value: "last3Months" },
    { label: "Year to Date", value: "yearToDate" },
  ];

  const handlePresetSelect = (value) => {
    const today = new Date();
    let newFromDate, newToDate;

    switch (value) {
      case "today":
        newFromDate = today;
        newToDate = today;
        break;
      case "yesterday":
        newFromDate = subDays(today, 1);
        newToDate = subDays(today, 1);
        break;
      case "last3days":
        newFromDate = subDays(today, 2); // Today - 2 days = 3 days including today
        newToDate = today;
        break;
      case "last7days":
        newFromDate = subDays(today, 6); // Today - 6 days = 7 days including today
        newToDate = today;
        break;
      case "last30days":
        newFromDate = subDays(today, 29); // Today - 29 days = 30 days including today
        newToDate = today;
        break;
      case "monthToDate":
        newFromDate = startOfMonth(today);
        newToDate = today;
        break;
      case "lastMonth":
        newFromDate = startOfMonth(subMonths(today, 1));
        newToDate = endOfMonth(subMonths(today, 1));
        break;
      case "last3Months":
        newFromDate = startOfMonth(subMonths(today, 2)); // Start of 3 months ago
        newToDate = endOfMonth(today);
        break;
      case "yearToDate":
        newFromDate = startOfYear(today);
        newToDate = today;
        break;
      default:
        break;
    }
    setFromDate(newFromDate);
    setToDate(newToDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 text-foreground/90">
          <CalendarIcon className="size-4 opacity-75" />
          {title}

          {fromDate && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                <span
                  className={cn(
                    "truncate",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  {fromDate ? format(fromDate, "PP") : "Pick a date"}
                </span>
              </Badge>
            </>
          )}

          {toDate && (
            <>
              <Separator orientation="horizontal" className="!w-2" />

              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                <span
                  className={cn("truncate", !toDate && "text-muted-foreground")}
                >
                  {toDate ? format(toDate, "PP") : "Pick a date"}
                </span>
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border p-3 shadow-xl md:flex gap-4"
        align="start"
      >
        {preset && (
          <div className="grid border-r pr-4">
            {presetOptions.map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                className="justify-start text-xs"
                size="sm"
                onClick={() => handlePresetSelect(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        )}
        <div>
          <p className="text-sm mb-1 text-muted-foreground">From Date</p>
          <div className="bg-black/[2%] dark:bg-black/50 rounded-md">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={setFromDate}
              className="rounded-md border p-2"
              classNames={{
                month_caption: "mx-0",
              }}
              captionLayout="dropdown"
              defaultMonth={fromDate ?? new Date()}
              startMonth={new Date(2001, 1)}
            />
          </div>
        </div>

        <div>
          <p className="text-sm mb-1 text-muted-foreground">To Date</p>
          <div className="bg-black/[2%] dark:bg-black/50 rounded-md">
            <Calendar
              mode="single"
              selected={toDate}
              onSelect={setToDate}
              className="rounded-md border p-2"
              classNames={{
                month_caption: "mx-0",
              }}
              captionLayout="dropdown"
              defaultMonth={toDate ?? new Date()}
              startMonth={new Date(2001, 1)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
