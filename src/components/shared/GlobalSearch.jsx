import * as React from "react";
import { Search } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useDispatch, useSelector } from "react-redux";
import { toggleSeachDialogOpen } from "@/store/reducers/dialogSlice";

const GlobalSearch = function ({ children }) {
  const dispatch = useDispatch();
  const { isSearchDialogOpen } = useSelector((state) => state.dialog);

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(toggleSeachDialogOpen(true));
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [dispatch, isSearchDialogOpen]);

  return (
    <>
      <div
        className="text-muted-foreground flex h-full w-full items-center gap-1 p-2 text-sm "
        onClick={() => dispatch(toggleSeachDialogOpen(true))}
      >
        <Search size={16} className="mr-1.5" />
        Search <span className="hidden md:inline">or press</span>{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-sans text-[10px] font-medium opacity-100 select-none md:flex">
          <span className="text-xs">⌘</span>
          <span className="text-xs">/</span>
          <span className="text-xs">Ctrl</span>
          <span className="text-xs">+</span>
          <span className="text-xs">J</span>
        </kbd>
      </div>

      <CommandDialog
        open={isSearchDialogOpen}
        onOpenChange={(value) => dispatch(toggleSeachDialogOpen(value))}
      >
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {children}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
