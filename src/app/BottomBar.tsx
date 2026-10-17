import { NavLink } from "react-router-dom";
import { cn } from "../ui/cn";
import { MAIN_NAV, SETTINGS_NAV } from "./nav";

const MOBILE_ITEMS = [...MAIN_NAV.filter((i) => i.to !== "/app/trips"), SETTINGS_NAV];

/** Phone navigation: the dashboard sidebar becomes a bottom tab bar. */
export function BottomBar() {
  return (
    <nav
      aria-label="App"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="m-0 grid list-none grid-cols-5 p-1.5">
        {MOBILE_ITEMS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium no-underline transition-colors",
                  isActive ? "text-primary" : "text-muted"
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label.replace("Plan a trip", "Plan")}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
