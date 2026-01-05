import { cn } from "@/utils/cn";
import { CalendarIcon } from "lucide-react";
import { useRef } from "react";

export function MonthField({ date, setDate, view = "form" }) {
  const inputRef = useRef(null);

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-white/10 p-1 border rounded-md mt-0.5",
        view === "form" && "p-1.5"
      )}
    >
      <input
        ref={inputRef}
        type="month"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          inputRef.current?.blur(); // 👈 blur after selecting month
        }}
        className="p-2 py-1 pr-10 text-sm dark:text-white focus:outline-0 w-full"
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          MozAppearance: "none",
        }}
        onClick={() =>
          inputRef.current?.showPicker?.() || inputRef.current?.focus()
        }
      />
      <div
        className="absolute right-4 top-3 cursor-pointer text-gray-500 dark:text-gray-300"
        onClick={() =>
          inputRef.current?.showPicker?.() || inputRef.current?.focus()
        }
      >
        <CalendarIcon className="size-4" />
      </div>
    </div>
  );
}
