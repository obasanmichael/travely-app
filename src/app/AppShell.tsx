import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomBar } from "./BottomBar";
import { GuestBanner } from "./GuestBanner";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useSaved } from "../features/saved/savedContext";

const COLLAPSE_KEY = "travely-sidebar-collapsed";

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

export function AppShell() {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const { error } = useSaved();
  const toggle = () =>
    setCollapsed((current) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, current ? "0" : "1");
      } catch {
        // The sidebar still collapses for this session.
      }
      return !current;
    });

  return (
    <div className="flex min-h-dvh bg-bg">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <GuestBanner />
        {error && (
          <p role="alert" className="m-0 bg-danger-wash px-4 py-2 text-center text-sm text-danger">
            {error}
          </p>
        )}
        <div id="content" className="flex-1 px-4 pb-28 pt-8 sm:px-8 lg:pb-12">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </div>
      </div>
      <BottomBar />
    </div>
  );
}
