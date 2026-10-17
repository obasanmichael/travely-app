import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeChoice } from "../../theme/themeContext";
import { Card } from "../../ui/Card";
import { cn } from "../../ui/cn";

const OPTIONS: { value: ThemeChoice; label: string; body: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", body: "Bright and clean.", Icon: Sun },
  { value: "dark", label: "Dark", body: "Easier on the eyes at night.", Icon: Moon },
  { value: "system", label: "System", body: "Match your device.", Icon: Monitor },
];

export function AppearanceTab() {
  const { choice, setChoice, resolved } = useTheme();
  return (
    <Card className="max-w-2xl p-6 sm:p-8">
      <h3 className="m-0 text-lg font-bold text-ink">Appearance</h3>
      <p className="mb-0 mt-1 text-muted">Currently using the {resolved} theme.</p>
      <div role="radiogroup" aria-label="Theme" className="mt-6 grid gap-3 sm:grid-cols-3">
        {OPTIONS.map(({ value, label, body, Icon }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={choice === value}
            onClick={() => setChoice(value)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
              choice === value ? "border-primary bg-primary-wash shadow-card" : "border-line bg-surface hover:border-primary/50"
            )}
          >
            <Icon className={cn("h-5 w-5", choice === value ? "text-primary" : "text-muted")} aria-hidden="true" />
            <span className="font-bold text-ink">{label}</span>
            <span className="text-sm text-muted">{body}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
