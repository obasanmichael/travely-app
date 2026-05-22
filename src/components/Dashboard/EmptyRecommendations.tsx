import React from "react";
import { MapPin, Route } from "lucide-react";
import { Card } from "../ui/Card";
import { ButtonLink } from "../ui/Button";

export const EmptyRecommendations: React.FC<{ message?: string }> = ({
  message,
}) => (
  <Card className="text-center" padding="lg">
    <div className="mx-auto w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mb-5">
      <MapPin className="w-8 h-8 text-travel-600 dark:text-travel-400" />
    </div>
    <h2 className="text-xl font-semibold text-primary mb-2">
      Your adventure awaits
    </h2>
    <p className="text-secondary text-sm max-w-md mx-auto mb-6 leading-relaxed">
      {message ??
        "Complete our travel quiz and we'll match you with Nigerian destinations that fit your budget, climate preferences, and activities."}
    </p>
    <ButtonLink to="/survey" size="lg">
      <Route className="w-4 h-4" />
      Take the travel quiz
    </ButtonLink>
  </Card>
);
