import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/themes/ThemeProvider";

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  // Get click coordinates to pass for animated theme transition
  const handleThemeToggle = (event) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="border-none bg-transparent shadow-none"
      onClick={handleThemeToggle}
    >
      {/* Sun icon (shown in light mode, hidden in dark mode) */}
      <Sun className="h-[1.25rem] w-[1.25rem] scale-150 rotate-0 fill-[#f99100] stroke-[#f99100] transition-all dark:scale-0 dark:-rotate-90" />

      {/* Moon icon (shown in dark mode, hidden in light mode) */}
      <Moon className="absolute h-[1.25rem] w-[1.25rem] scale-0 rotate-90 fill-[#8eb1ff] stroke-[#8eb1ff] transition-all dark:scale-150 dark:rotate-0" />

      {/* Accessibility: descriptive text for screen readers */}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export default ThemeToggle;
