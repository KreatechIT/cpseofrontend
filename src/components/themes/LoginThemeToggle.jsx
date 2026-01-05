import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/utils/cn";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/themes/ThemeProvider";

const LoginThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className="peer data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 absolute top-3 right-4 z-50 inline-flex h-13 w-36 shrink-0 scale-90 items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black/80 dark:border-white/20 data-[state=unchecked]:dark:bg-white/90"
      checked={theme === "light"}
      onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div
        className={cn(
          "absolute text-xs font-bold uppercase",
          theme === "light" ? "left-3 text-white" : "right-3 text-black"
        )}
      >
        {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
      </div>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none flex size-12 items-center justify-center rounded-full shadow-lg ring-0 transition-transform duration-500 data-[state=checked]:translate-x-23 data-[state=unchecked]:translate-x-0 dark:bg-white/75"
        )}
      >
        {theme === "dark" ? <MoonIcon className="text-black" /> : <SunIcon />}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
};

export default LoginThemeToggle;
