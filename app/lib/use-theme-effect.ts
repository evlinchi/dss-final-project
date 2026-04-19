import { useEffect } from "react";
import { useTheme } from "./use-theme";
import { getThemeMeta } from "./theme-meta";

export function useThemeEffect(): void {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    const meta = getThemeMeta(theme);
    root.dataset.theme = theme;
    root.classList.toggle("dark", meta.isDark);
    root.style.colorScheme = meta.isDark ? "dark" : "light";
  }, [theme]);
}
