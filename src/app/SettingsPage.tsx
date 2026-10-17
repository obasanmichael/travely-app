import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeChoice } from "../theme/themeContext";
import { Card } from "../ui/Card";
import { cn } from "../ui/cn";

const OPTIONS: { value: ThemeChoice; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function SettingsPage() {
  const { choice, setChoice } = useTheme();
  return (
    <Card className="p-6">
      <h2 className="m-0 text-lg font-bold text-ink">Appearance</h2>
      <div role="radiogroup" aria-label="Theme" className="mt-4 grid grid-cols-3 gap-3">
        {OPTIONS.map(({ value, label, Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={choice === value}
            onClick={() => setChoice(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-semibold transition-colors",
              choice === value ? "border-primary bg-primary-wash text-primary" : "border-line text-muted hover:text-ink"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </Card>
  );
}
