import { Calendar } from "@/components/ui/calendar";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

export default function DateField({
  fieldName,
  label,
  error,
  touched,
  date,
  setDate,
  isRequired = true,
  disabled = false,
}) {
  return (
    <div>
      <div className="*:not-first:mt-0.5">
        <Label htmlFor={fieldName} className="gap-0.5 text-sm capitalize">
          {label}
          <span
            className={cn(
              "text-destructive/75 text-sm",
              !isRequired && "opacity-0"
            )}
          >
            *
          </span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={fieldName}
              variant={"outline"}
              className={cn(
                "group bg-background hover:bg-background border-input focus-visible:outline-[2px] w-full justify-between px-3 py-5 font-normal outline-offset-0 outline-none",
                !date && "text-muted-foreground",
                error && touched && "border-destructive dark:border-destructive"
              )}
              disabled={disabled}
            >
              <span
                className={cn("truncate", !date && "text-muted-foreground")}
              >
                {date ? format(date, "PP") : "Pick a date"}
              </span>
              <CalendarIcon
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto border-0 p-0 shadow-xl"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-2"
              classNames={{
                month_caption: "mx-0",
              }}
              captionLayout="dropdown"
              defaultMonth={new Date()}
              startMonth={new Date(1960, 6)}
            />
          </PopoverContent>
        </Popover>

        {error && touched && (
          <p className="text-destructive mt-1.5 text-xs">{error}</p>
        )}
      </div>
    </div>
  );
}
