import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/contexts/AppContext";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const lightStyles = {
    backgroundColor: "#F5F5FF",
    color: "#050912",
  };

  const darkStyles = {
    backgroundColor: "#050912",
    color: "#FFFFFF",
  };

  const currentStyles = theme === "light" ? lightStyles : darkStyles;

  return (
    <button
      onClick={toggleTheme}
      className="hidden lg:block fixed top-4 right-4 z-50 p-3 rounded-md transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        backgroundColor: currentStyles.backgroundColor,
        color: currentStyles.color,
      }}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" style={{ color: currentStyles.color }} />
      ) : (
        <Sun className="w-5 h-5" style={{ color: currentStyles.color }} />
      )}
    </button>
  );
};

