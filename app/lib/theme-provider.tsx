import { useEffect, createContext, useState } from "react";

enum Theme {
  Y2K = "y2k",
  Oceanic = "oceanic",
  ModernDark = "modern-dark",
  Beige = "beige",
}

const THEME_VALUES = Object.values(Theme);

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";
const DEFAULT: Theme = Theme.Oceanic;

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(DEFAULT);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && THEME_VALUES.includes(stored)) {
      setTheme(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, DEFAULT);
      setTheme(DEFAULT);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider, Theme };
