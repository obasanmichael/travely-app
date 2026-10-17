import { useSaved } from "../features/saved/savedContext";

export function SaveButton({ destinationId, name, tone = "light" }: { destinationId: string; name: string; tone?: "light" | "dark" }) {
  const { ids, toggle } = useSaved();
  const saved = ids.has(destinationId);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from saved places` : `Save ${name}`}
      onClick={() => void toggle(destinationId)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        saved
          ? "bg-sun text-ink"
          : tone === "dark"
            ? "bg-ink/60 text-white backdrop-blur hover:bg-ink/80"
            : "border border-line bg-surface text-ink hover:border-ink"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.6 5c2.1 0 3.6 1.2 4.4 2.6h2C13.8 6.2 15.3 5 17.4 5 21 5 23.1 8.6 21.6 11.9 19.5 16.4 12 21 12 21z" />
      </svg>
      {saved ? "Saved" : "Save"}
    </button>
  );
}
