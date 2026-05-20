import {
  ListChecks,
  Search,
  Settings,
  History,
  LogOut,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../ui/ThemeToggle";

interface Props {
  onLogout: () => void;
}

const menuItems = [
  { label: "Recommendations", icon: History, href: "/recommendations" },
  { label: "Take Survey", icon: ListChecks, href: "/survey" },
  { label: "Explore", icon: Search, href: "/explore" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const Sidebar: React.FC<Props> = ({ onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  const navLinkClass = (href: string) => {
    const isActive = location.pathname === href;
    return `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-accent-soft text-travel-700 dark:text-travel-300 font-semibold"
        : "text-secondary hover:bg-surface-muted hover:text-primary"
    } ${isCollapsed ? "justify-center px-2" : ""}`;
  };

  const sidebarWidth = isCollapsed ? "w-[72px]" : "w-64";

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-surface-sidebar border-b border-default">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-surface-muted text-primary transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-travel-600 dark:text-travel-400" />
          <span className="font-bold text-lg text-primary tracking-tight">
            Travely
          </span>
        </div>
        <div className="w-10" />
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobile}
          aria-hidden
        />
      )}

      <aside
        className={`${sidebarWidth} shrink-0 flex flex-col bg-surface-sidebar border-r border-default
          fixed lg:sticky lg:top-0 z-50 h-dvh
          transition-[width,transform] duration-300 ease-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand header */}
        <div
          className={`shrink-0 flex items-center border-b border-default ${
            isCollapsed ? "flex-col gap-3 px-2 py-4" : "justify-between px-4 py-4"
          }`}
        >
          <Link
            to="/recommendations"
            className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? "justify-center" : ""}`}
            onClick={closeMobile}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-travel-500 to-travel-700 flex items-center justify-center shadow-sm shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="font-bold text-lg text-primary tracking-tight leading-none">
                  Travely
                </div>
                <div className="text-[10px] text-muted font-medium uppercase tracking-wider mt-0.5">
                  Nigeria
                </div>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-surface-muted text-muted hidden lg:flex transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg hover:bg-surface-muted text-muted lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              Menu
            </p>
          )}
          <ul className="space-y-1">
            {menuItems.map(({ label, icon: Icon, href }) => (
              <li key={href}>
                <Link
                  to={href}
                  className={navLinkClass(href)}
                  onClick={closeMobile}
                  title={isCollapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm">{label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer actions — always pinned at bottom */}
        <div className="shrink-0 px-3 py-4 border-t border-default bg-surface-sidebar space-y-1">
          <ThemeToggle collapsed={isCollapsed} />
          <button
            type="button"
            onClick={() => {
              onLogout();
              closeMobile();
            }}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
