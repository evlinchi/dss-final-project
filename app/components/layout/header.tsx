import { useTheme } from "~/lib/use-theme";
import { Theme } from "~/lib/theme-provider";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";

export default function Header() {
  const { theme, setTheme, getAllAvailableThemes } = useTheme();

  return (
    <header className="relative px-5 py-3 flex justify-between items-center h-auto w-full">
      <img src="/images/logo.png" className="w-40" />
      <div className="flex items-center gap-4">
        <span className="font-heading italic">Clear tasks. Clear mind.</span>
        <Combobox
          items={Object.entries(getAllAvailableThemes())}
          defaultValue={theme}
          onValueChange={(e) => setTheme(e as Theme)}
        >
          <ComboboxInput
            placeholder="Select theme"
            value={getAllAvailableThemes()[theme]}
            size={10}
          />
          <ComboboxContent align="center">
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {([key, label]) => (
                <ComboboxItem key={key} value={key}>
                  {label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </header>
  );
}
