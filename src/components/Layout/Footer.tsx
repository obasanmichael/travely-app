import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-500">
              &copy; {new Date().getFullYear()} TravelyNG. All rights reserved.
            </p>
          </div>
          <div className="flex justify-center md:order-2">
            <span className="text-sm text-gray-500">
              Travel Nigeria - Explore the Beauty Within
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
