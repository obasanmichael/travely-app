import React from "react";
import Sidebar from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Outlet } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

const DashboardLayout: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="flex h-dvh min-h-screen overflow-hidden bg-surface-base">
      <Sidebar onLogout={onLogout} />

      <div className="flex flex-1 flex-col min-w-0 min-h-0 pt-[57px] lg:pt-0">
        <DashboardHeader />
        <main className="flex-1 min-h-0 overflow-y-auto px-6 md:px-8 lg:px-10 py-6 lg:py-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
