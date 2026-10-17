import type { ReactNode } from "react";

/** The page's own heading block. The top bar already names the section, so this carries the description. */
export function PageIntro({ title, children, actions }: { title: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="m-0 font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-tight text-ink">{title}</h2>
        {children && <p className="mb-0 mt-2 max-w-[56ch] text-muted">{children}</p>}
      </div>
      {actions}
    </header>
  );
}
