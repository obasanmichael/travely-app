import React from "react";
import { Compass, Sparkles } from "lucide-react";
import { ButtonLink } from "../ui/Button";

interface WelcomeHeroProps {
  userName: string | null;
  hasRecommendations: boolean;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userName,
  hasRecommendations,
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-default bg-surface-raised shadow-card">
    <div
      className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
    <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-travel-400/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sunset-400/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

    <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-travel-700 dark:text-travel-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Personalized for Nigeria
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          {userName ? `Welcome back, ${userName}` : "Welcome, Traveler"}
        </h1>
        <p className="text-secondary max-w-lg text-sm md:text-base leading-relaxed">
          Discover destinations tailored to your budget, interests, and travel
          style across Nigeria.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
        <ButtonLink to="/survey" size="lg">
          <Compass className="w-4 h-4" />
          {hasRecommendations ? "Update preferences" : "Start your journey"}
        </ButtonLink>
      </div>
    </div>
  </div>
);
