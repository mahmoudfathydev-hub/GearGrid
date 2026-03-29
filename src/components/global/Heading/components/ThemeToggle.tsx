import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  theme?: string;
  onToggle: () => void;
  mounted: boolean;
}

export const ThemeToggle = ({ theme, onToggle, mounted }: ThemeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      aria-label="Toggle dark mode"
    >
      {!mounted ? (
        <div className="w-5 h-5" />
      ) : theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
};
