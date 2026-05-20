import React from "react";
import { Brain, Filter, Map } from "lucide-react";
import { Card, CardHeader } from "../ui/Card";

const features = [
  {
    icon: Brain,
    title: "Fuzzy Logic",
    description: "Smart budget classification that understands your spending range.",
  },
  {
    icon: Filter,
    title: "Content-Based Filtering",
    description: "Recommendations shaped by your unique travel preferences.",
  },
  {
    icon: Map,
    title: "Destination Matching",
    description: "Activities and locations aligned with how you like to explore.",
  },
];

export const AboutSection: React.FC = () => (
  <Card padding="md">
    <CardHeader
      title="How we find your perfect trip"
      description="Our recommendation engine combines multiple techniques for accurate, personalized results."
    />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="p-4 rounded-xl bg-surface-muted border border-subtle"
        >
          <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center mb-3">
            <Icon className="w-5 h-5 text-travel-600 dark:text-travel-400" />
          </div>
          <h3 className="font-medium text-primary text-sm mb-1">{title}</h3>
          <p className="text-xs text-secondary leading-relaxed">{description}</p>
        </div>
      ))}
    </div>
  </Card>
);
