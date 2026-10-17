import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "./Card";

export function EmptyState({ Icon, title, body, action }: { Icon: LucideIcon; title: string; body: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-wash text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="m-0 text-xl font-bold text-ink">{title}</h2>
      <p className="m-0 max-w-[44ch] text-muted">{body}</p>
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}
