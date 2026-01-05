import { useRef, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function MonthRangeFilter({
  title,
  fromMonth,
  setFromMonth,
  toMonth,
  setToMonth,
}) {
  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    // Delay blur slightly to avoid initial browser highlight
    const timeout = setTimeout(() => {
      fromRef.current?.blur();
      toRef.current?.blur();
    }, 50);

    return () => clearTimeout(timeout);
  }, []);

  const formatMonth = (monthStr) => {
    try {
      return format(parse(monthStr, "yyyy-MM", new Date()), "MMM yyyy");
    } catch {
      return "Invalid";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 text-foreground/90">
          <CalendarIcon className="size-4 opacity-75" />
          {title}
          {fromMonth && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                <span>{formatMonth(fromMonth)}</span>
              </Badge>
            </>
          )}
          {toMonth && (
            <>
              <Separator orientation="horizontal" className="!w-2" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                <span>{formatMonth(toMonth)}</span>
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto border p-4 shadow-xl grid gap-4"
        align="start"
      >
        <div className="grid gap-1">
          <label htmlFor="fromMonth" className="text-sm text-muted-foreground">
            From Month
          </label>
          <div className="relative bg-black/[2%] dark:bg-black/50 p-1 rounded-md">
            <input
              autoComplete="off"
              autoFocus={false}
              tabIndex={-1}
              id="fromMonth"
              ref={fromRef}
              type="month"
              value={fromMonth}
              onChange={(e) => {
                setFromMonth(e.target.value);
                fromRef.current?.blur();
              }}
              className="p-2 py-1 pr-10 text-sm dark:text-white focus:outline-0 w-full bg-transparent"
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
              onClick={() => fromRef.current?.showPicker?.()}
            />
            <CalendarIcon
              className="absolute right-3 top-2.5 size-4 text-gray-500 cursor-pointer"
              onClick={() => fromRef.current?.showPicker?.()}
            />
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="toMonth" className="text-sm text-muted-foreground">
            To Month
          </label>
          <div className="relative bg-black/[2%] dark:bg-black/50 p-1 rounded-md">
            <input
              autoComplete="off"
              autoFocus={false}
              tabIndex={-1}
              id="toMonth"
              ref={toRef}
              type="month"
              value={toMonth}
              onChange={(e) => {
                setToMonth(e.target.value);
                toRef.current?.blur();
              }}
              className="p-2 py-1 pr-10 text-sm dark:text-white focus:outline-0 w-full bg-transparent"
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
              }}
              onClick={() => toRef.current?.showPicker?.()}
            />
            <CalendarIcon
              className="absolute right-3 top-2.5 size-4 text-gray-500 cursor-pointer"
              onClick={() => toRef.current?.showPicker?.()}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
