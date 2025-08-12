import React from "react";
import { ClipboardListIcon, SearchIcon, ThumbsUpIcon } from "lucide-react";
const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <ClipboardListIcon className="h-10 w-10 text-blue-500" />,
      title: "Share Your Preferences",
      description:
        "Tell us about your ideal vacation - budget, activities, accommodation preferences, and more.",
    },
    {
      icon: <SearchIcon className="h-10 w-10 text-blue-500" />,
      title: "Get Matched",
      description:
        "Our algorithm analyzes thousands of destinations to find your perfect match based on your criteria.",
    },
    {
      icon: <ThumbsUpIcon className="h-10 w-10 text-blue-500" />,
      title: "Travel Confidently",
      description:
        "Review personalized recommendations, complete with pricing, activities, and detailed information.",
    },
  ];
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Travely Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Finding your perfect travel destination has never been easier
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-100 transform transition-transform duration-400 hover:translate-y-3"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
