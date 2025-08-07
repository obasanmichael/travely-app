import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";
const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-40"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your Perfect{" "}
            <span className="text-blue-400">Travel Destination</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 opacity-90">
            Personalized travel recommendations based on your preferences and
            budget
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              Get Started
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium text-lg transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </section>
  );
};
export default Hero;
