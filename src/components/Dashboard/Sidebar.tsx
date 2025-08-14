import {
  ListChecks,
  Search,
  Settings,
  History,
  LogOut,
  MapPinIcon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router";

interface Props {
  onLogout: () => void;
}

const Sidebar: React.FC<Props> = ({ onLogout }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { label: "Recommendations", icon: History, href: "/recommendations" },
    { label: "Take Survey", icon: ListChecks, href: "/survey" },
    { label: "Explore Destinations", icon: Search, href: "/explore" },
    {
      label: "Settings & Profile",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden p-1 border-b bg-white shadow-sm sticky top-0 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-2">
          {/* <MapPinIcon className="h-6 w-6 text-blue-500" /> */}
          {/* <span className="font-bold text-xl text-blue-700">Travely</span> */}
        </div>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-blue-50 border-r border-blue-100 h-screen flex flex-col shadow-lg
          ${isCollapsed ? "w-20" : "w-64"}
          fixed lg:static top-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center space-x-2">
            <MapPinIcon
              className={`${isCollapsed ? "h-4 w-4" : "h-7"} text-blue-500`}
            />
            {!isCollapsed && (
              <div className="text-blue-700 font-bold text-2xl">Travely</div>
            )}
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded hover:bg-gray-200 hidden lg:block"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded hover:bg-gray-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              to={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition
                ${
                  location.pathname === href
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className="w-5 h-5 text-gray-600" />
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={() => {
              onLogout();
              setIsMobileOpen(false);
            }}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-50 transition text-red-600"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
