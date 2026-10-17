import { Compass, Heart, History, LayoutDashboard, Settings, ShieldCheck, Sparkles, Tags, type LucideIcon } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  Icon: LucideIcon;
  end?: boolean;
}

export const MAIN_NAV: NavItem[] = [
  { to: "/app", label: "Overview", Icon: LayoutDashboard, end: true },
  { to: "/app/plan", label: "Plan a trip", Icon: Sparkles },
  { to: "/app/explore", label: "Explore", Icon: Compass },
  { to: "/app/saved", label: "Saved", Icon: Heart },
  { to: "/app/trips", label: "Trips", Icon: History },
];

export const ADMIN_NAV: NavItem[] = [
  { to: "/app/admin/review", label: "Review", Icon: ShieldCheck },
  { to: "/app/admin/prices", label: "Prices", Icon: Tags },
];

export const SETTINGS_NAV: NavItem = { to: "/app/settings", label: "Settings", Icon: Settings };

const TITLES: [RegExp, string][] = [
  [/^\/app\/plan/, "Plan a trip"],
  [/^\/app\/trips\/.+/, "Your trip"],
  [/^\/app\/trips/, "Trips"],
  [/^\/app\/explore/, "Explore"],
  [/^\/app\/places\/.+/, "Place"],
  [/^\/app\/saved/, "Saved places"],
  [/^\/app\/settings/, "Settings"],
  [/^\/app\/admin\/prices/, "Prices"],
  [/^\/app\/admin/, "Review"],
  [/^\/app\/results/, "Results"],
];

export function titleFor(pathname: string): string {
  return TITLES.find(([pattern]) => pattern.test(pathname))?.[1] ?? "Overview";
}
