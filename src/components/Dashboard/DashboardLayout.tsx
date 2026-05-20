import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardThemeProvider } from "./DashboardThemeProvider";
import { Outlet } from "react-router-dom";
import { isDashboardPath } from "../../context/ThemeContext";

interface Props {
  onLogout: () => void;
}

function applyDashboardThemeOnExit() {
  document.documentElement.classList.remove("dark");
  document.documentElement.style.colorScheme = "light";
}

const DashboardLayout: React.FC<Props> = ({ onLogout }) => {
  useEffect(() => {
    return () => {
      if (!isDashboardPath(window.location.pathname)) {
        applyDashboardThemeOnExit();
      }
    };
  }, []);

  return (
    <DashboardThemeProvider>
      <div className="flex min-h-screen bg-surface-base">
        <Sidebar onLogout={onLogout} />

        <div className="flex-1 flex flex-col min-w-0 pt-[57px] lg:pt-0">
          <DashboardHeader />
          <main className="flex-1 overflow-auto px-6 md:px-8 lg:px-10 py-6 lg:py-8">
            <div className="max-w-6xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
};

export default DashboardLayout;
