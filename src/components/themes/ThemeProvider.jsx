import { createContext, useContext, useEffect, useState } from "react";

// Initial theme state with default values
const initialState = {
  theme: "light", // Default theme
  setTheme: () => null,
  toggleTheme: () => null,
};

// Create the Theme Context
const ThemeProviderContext = createContext(initialState);

const ThemeProvider = ({
  children,
  defaultTheme = "light",
  storageKey = "core360-theme",
  ...props
}) => {
  // Initialize theme state from localStorage or use default
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );

  // Update the <html> class whenever the theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Save theme to localStorage and update state
  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  /**
   * Toggle between light and dark themes.
   * If `startViewTransition` is supported and motion is allowed,
   * uses smooth transition based on click coordinates.
   */
  const toggleTheme = (coords) => {
    const root = document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Fallback if transitions are not supported or motion is reduced
    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(newTheme);
      return;
    }

    // Pass coordinates to CSS for animation origin
    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    // Trigger smooth view transition
    document.startViewTransition(() => {
      setTheme(newTheme);
    });
  };

  // Context value to be provided to consumers
  const value = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
