import ThemeSwitcher from "../ui/theme-switcher";

export default function Header() {
  return (
    <header className="glass relative z-10 px-4 py-3 sm:px-5 box-border flex justify-between items-center gap-4 h-auto w-full rounded-2xl">
      <img src="/images/logo.png" className="w-32 sm:w-40" alt="Taskly" />
      <div className="flex items-center gap-3 sm:gap-5">
        <span className="hidden sm:inline font-heading italic text-muted-foreground text-sm">
          Clear tasks. Clear mind.
        </span>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
