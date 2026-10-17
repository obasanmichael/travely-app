import * as RadixSwitch from "@radix-ui/react-switch";

export function Switch({ checked, onCheckedChange, label }: { checked: boolean; onCheckedChange: (v: boolean) => void; label: string }) {
  return (
    <RadixSwitch.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      aria-label={label}
      className="relative h-7 w-12 shrink-0 rounded-full bg-line transition-colors data-[state=checked]:bg-primary"
    >
      <RadixSwitch.Thumb className="block h-5 w-5 translate-x-1 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6" />
    </RadixSwitch.Root>
  );
}
