import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/authContext";
import { useSaved } from "../features/saved/savedContext";
import { cn } from "../ui/cn";
import { ADMIN_NAV, MAIN_NAV, SETTINGS_NAV, type NavItem } from "./nav";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function Item({ item, collapsed, badge }: { item: NavItem; collapsed: boolean; badge?: number }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          "group relative flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium no-underline transition-colors",
          isActive ? "bg-primary-wash text-primary" : "text-muted hover:bg-line hover:text-ink",
          collapsed && "justify-center px-0"
        )
      }
    >
      <item.Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && badge ? <span className="rounded-full bg-line px-2 py-0.5 text-xs font-semibold text-ink">{badge}</span> : null}
      {collapsed && <span className="sr-only">{item.label}</span>}
    </NavLink>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { isAdmin } = useAuth();
  const { ids } = useSaved();
  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-300 lg:flex",
        collapsed ? "w-[76px]" : "w-[264px]"
      )}
    >
      <div className={cn("flex h-16 items-center", collapsed ? "justify-center" : "px-5")}>
        <Link to="/app" className="font-serif text-2xl text-ink no-underline">
          {collapsed ? "t" : "travely"}
        </Link>
      </div>
      <nav aria-label="App" className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
        {MAIN_NAV.map((item) => (
          <Item key={item.to} item={item} collapsed={collapsed} badge={item.to === "/app/saved" ? ids.size : undefined} />
        ))}
        {isAdmin && (
          <>
            <p className={cn("m-0 mt-6 px-3 pb-1 text-xs font-semibold text-muted", collapsed && "sr-only")}>Admin</p>
            {collapsed && <span className="mx-3 my-3 h-px bg-line" aria-hidden="true" />}
            {ADMIN_NAV.map((item) => (
              <Item key={item.to} item={item} collapsed={collapsed} />
            ))}
          </>
        )}
      </nav>
      <div className="flex flex-col gap-1 border-t border-line p-3">
        <Item item={SETTINGS_NAV} collapsed={collapsed} />
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-muted hover:bg-line hover:text-ink",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <ChevronsRight className="h-5 w-5" aria-hidden="true" /> : <ChevronsLeft className="h-5 w-5" aria-hidden="true" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
