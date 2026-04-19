import { useRef } from "react";
import { Check } from "lucide-react";
import { useTheme } from "~/lib/use-theme";
import { Theme } from "~/lib/theme-provider";
import { THEME_META, THEME_ORDER } from "~/lib/theme-meta";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const groupRef = useRef<HTMLDivElement>(null);

  function focusByIndex(i: number) {
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      "[data-theme-swatch]",
    );
    if (!buttons) return;
    const idx = ((i % buttons.length) + buttons.length) % buttons.length;
    buttons[idx]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusByIndex(currentIndex + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusByIndex(currentIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusByIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusByIndex(THEME_ORDER.length - 1);
    }
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Theme"
      className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm"
    >
      {THEME_ORDER.map((slug, i) => {
        const meta = THEME_META[slug];
        const isActive = theme === slug;

        return (
          <Tooltip>
            <TooltipTrigger>
              <button
                key={slug}
                type="button"
                role="radio"
                aria-checked={isActive}
                aria-label={meta.label}
                data-theme-swatch
                tabIndex={isActive ? 0 : -1}
                onClick={() => setTheme(slug as Theme)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "relative grid size-8 place-items-center rounded-full transition-all outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "scale-110 shadow-[var(--shadow-md)]"
                    : "hover:scale-105",
                )}
                style={{
                  background: `conic-gradient(from 180deg, ${meta.swatches[0]} 0deg 90deg, ${meta.swatches[1]} 90deg 180deg, ${meta.swatches[2]} 180deg 270deg, ${meta.swatches[3]} 270deg 360deg)`,
                  boxShadow: isActive
                    ? `0 0 0 2px var(--background), 0 0 0 4px var(--ring)`
                    : `0 0 0 1px var(--border)`,
                }}
              >
                {isActive ? (
                  <Check
                    className="size-3.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]"
                    style={{ color: "#fff" }}
                    strokeWidth={3}
                  />
                ) : null}
                <span className="sr-only">{meta.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{meta.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
