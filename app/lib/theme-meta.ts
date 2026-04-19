import { Theme } from "./theme-provider";

export interface ThemeMeta {
  slug: Theme;
  label: string;
  isDark: boolean;
  swatches: [string, string, string, string];
  confettiColors: string[];
}

export const THEME_META: Record<Theme, ThemeMeta> = {
  [Theme.Y2K]: {
    slug: Theme.Y2K,
    label: "Pink Paradise",
    isDark: false,
    swatches: ["#ffe1ef", "#ffffff", "#ff4ea1", "#c49dff"],
    confettiColors: ["#ff4ea1", "#ff9dc8", "#c49dff", "#e9d9ff", "#ffffff"],
  },
  [Theme.Oceanic]: {
    slug: Theme.Oceanic,
    label: "Deep Ocean",
    isDark: true,
    swatches: ["#071425", "#0f2238", "#2fd3e0", "#4ac4ff"],
    confettiColors: ["#2fd3e0", "#4ac4ff", "#88e8f2", "#0ea5bd"],
  },
  [Theme.ModernDark]: {
    slug: Theme.ModernDark,
    label: "Modern Dark",
    isDark: true,
    swatches: ["#171718", "#222224", "#e4e4e7", "#a1a1aa"],
    confettiColors: ["#e4e4e7", "#a1a1aa", "#71717a", "#f4f4f5"],
  },
  [Theme.Beige]: {
    slug: Theme.Beige,
    label: "Warm Beige",
    isDark: false,
    swatches: ["#f5eee2", "#fbf7ef", "#8f6a3f", "#b99470"],
    confettiColors: ["#b99470", "#d7b08c", "#8f6a3f", "#efd9b5", "#6b4a2a"],
  },
};

export const THEME_ORDER: Theme[] = [
  Theme.Y2K,
  Theme.Oceanic,
  Theme.ModernDark,
  Theme.Beige,
];

export const DEFAULT_THEME: Theme = Theme.Oceanic;

export function getThemeMeta(theme: Theme): ThemeMeta {
  return THEME_META[theme];
}
