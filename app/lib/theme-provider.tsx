import { useEffect, createContext, useState } from "react";

enum Theme {
  Light = "light",
  Dark = "dark",
}

const THEME_LABELS: Record<Theme, string> = {
  [Theme.Light]: "Light Mode ☀️",
  [Theme.Dark]: "Dark Mode 🌙",
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  getAllAvailableThemes: () => Record<Theme, string>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Dark);

  // Load theme from localStorage on client mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme && Object.values(Theme).includes(storedTheme)) {
      setTheme(storedTheme);
    } else {
      localStorage.setItem("theme", Theme.Dark);
      setTheme(Theme.Dark);
    }
  }, []);

  function toggleTheme() {
    if (theme === Theme.Dark) {
      setTheme(Theme.Light);
    } else {
      setTheme(Theme.Dark);
    }
  }

  function getAllAvailableThemes(): Record<Theme, string> {
    return THEME_LABELS;
  }

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        getAllAvailableThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider, Theme };
