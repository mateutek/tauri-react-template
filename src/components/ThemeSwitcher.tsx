import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore, type ThemeMode } from "@/stores/themeStore";

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "system", label: "System", Icon: Monitor },
];

// Segmented Light / Dark / System control.
function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5"
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => (
        <button
          key={m}
          type="button"
          role="radio"
          aria-checked={mode === m}
          aria-label={label}
          title={label}
          onClick={() => setMode(m)}
          className={cn(
            "inline-flex size-7 items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
            mode === m && "bg-background text-foreground shadow-sm"
          )}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
