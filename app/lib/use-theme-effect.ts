import { useEffect } from "react";
import { useTheme } from "./use-theme";

export function useThemeEffect(): void {
  const { theme } = useTheme();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);
}
