import { PageHeading } from "@/components/shared/PageHeading";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import NumberMethodologyResult from "@/modules/hr-module/components/number-methodology/NumberMethodologyResult";
import { Calendar } from "@/components/ui/calendar";

const NumbersMethodologyPage = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(undefined);
  const [showResult, setShowResult] = useState(false);

  return (
    <>
      <title>Numbers Methodology - Core360</title>
      <main className="mt-1 flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <PageHeading pageTitle="Numbers Methodology" />
        </div>

        <div className="flex gap-4 items-end mt-8">
          <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
              Date of birth
            </Label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date ? format(date, "PP") : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
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
                  startMonth={new Date(1950, 6)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button onClick={() => date && setShowResult(true)}>
            Get Result
          </Button>
        </div>

        <div>
          {showResult && (
            <NumberMethodologyResult birthDate={format(date, "yyyy-MM-dd")} />
          )}
        </div>
      </main>
    </>
  );
};

export default NumbersMethodologyPage;
