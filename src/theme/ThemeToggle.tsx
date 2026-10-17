import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./themeContext";
import type { ThemeChoice } from "./themeContext";

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/** Compact icon toggle for bars: cycles light, dark, system. */
export function ThemeToggle() {
  const { choice, setChoice } = useTheme();
  const index = OPTIONS.findIndex((o) => o.value === choice);
  const next = OPTIONS[(index + 1) % OPTIONS.length];
  const { Icon, label } = OPTIONS[index];
  return (
    <button
      type="button"
      onClick={() => setChoice(next.value)}
      aria-label={`Theme: ${label}. Switch to ${next.label}.`}
      title={`Theme: ${label}`}
      className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-line hover:text-ink"
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
    </button>
  );
}
