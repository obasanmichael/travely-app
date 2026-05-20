import React from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "../ui/ThemeToggle";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/recommendations": {
    title: "Recommendations",
    subtitle: "Your personalized Nigerian destinations",
  },
  "/survey": {
    title: "Travel Quiz",
    subtitle: "Tell us how you like to explore",
  },
  "/explore": {
    title: "Explore",
    subtitle: "Discover destinations across Nigeria",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Profile, preferences, and account",
  },
};

export const DashboardHeader: React.FC = () => {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] ?? {
    title: "Dashboard",
    subtitle: "Your travel hub",
  };

  return (
    <header className="sticky top-0 z-30 px-6 md:px-8 lg:px-10 py-5 bg-surface-base/90 backdrop-blur-md border-b border-default">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="min-w-0 pl-0.5">
          <h1 className="text-lg font-semibold text-primary truncate">
            {page.title}
          </h1>
          <p className="text-xs text-muted truncate mt-0.5">{page.subtitle}</p>
        </div>
        <div className="lg:hidden shrink-0">
          <ThemeToggle collapsed />
        </div>
      </div>
    </header>
  );
};
