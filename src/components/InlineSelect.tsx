interface InlineSelectProps<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

/**
 * A select that reads as part of a sentence: as wide as the chosen option, not
 * the longest one. A real <select> sits transparently on top, so keyboard,
 * screen readers and the native mobile picker all still work.
 */
export function InlineSelect<T extends string | number>({ label, value, options, onChange }: InlineSelectProps<T>) {
  const current = options.find((o) => o.value === value)?.label ?? "";
  return (
    <span className="relative mx-1 inline-block border-b-2 border-lagoon px-1 font-bold text-lagoon focus-within:border-ink focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-sun">
      <span aria-hidden="true">{current}</span>
      <select
        aria-label={label}
        value={String(value)}
        onChange={(event) => {
          const chosen = options.find((o) => String(o.value) === event.target.value);
          if (chosen) onChange(chosen.value);
        }}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
