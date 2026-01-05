import { Check, ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";

function SelectFilter({ options, selected, setSelected, title }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 text-foreground/60",
            selected && "text-foreground/80"
          )}
        >
          {title}

          <ChevronDownIcon className="size-4 mt-0.5 opacity-75" />
          {selected && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {options.find((o) => o.value === selected)?.label}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[230px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      setSelected(isSelected ? null : option.value);
                    }}
                  >
                    <div
                      className={cn(
                        `border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border`,
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="text-primary-foreground h-4 w-4" />
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span className="truncate">{option.label}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectFilter;
