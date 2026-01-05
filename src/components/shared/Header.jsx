import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/themes/ThemeToggle";
import GlobalSearch from "./GlobalSearch";

const Header = function ({ children }) {
  const { toggleSidebar } = useSidebar();

  return (
    <section className="mb-4 flex items-center gap-x-2">
      {/* Sidebar Trigger for Mobile */}
      <Button
        size="icon"
        className="rounded-lg md:hidden"
        onClick={toggleSidebar}
      >
        <ChevronRight className="scale-125" />
      </Button>

      <div className="flex h-10 w-full items-center justify-end gap-2 rounded-lg border border-black/10 bg-gray-200/15 p-1 md:h-11 dark:border-white/10 dark:bg-white/5">
        <GlobalSearch>{children}</GlobalSearch>

        <ThemeToggle />
        <HeaderClock />
      </div>
    </section>
  );
};

export default Header;

const HeaderClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-foreground/75 flex h-full shrink-0 items-center justify-center rounded-lg bg-gray-200/50 px-2 text-sm font-medium dark:bg-white/5 w-50">
      <span className="mr-1 hidden md:inline">
        {format(currentTime, "EEE, MMM d,")}
      </span>
      {format(currentTime, "hh:mm:ss a")}
    </div>
  );
};
