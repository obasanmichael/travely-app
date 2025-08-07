import React from "react";
const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Travely
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              At Travely, we believe everyone deserves to find their perfect
              travel destination without the stress of endless research and
              uncertainty.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Founded by a team of passionate travelers and tech enthusiasts,
              we've built a platform that combines advanced recommendation
              algorithms with human expertise to match you with destinations
              you'll love.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to make travel planning simple, personalized, and
              enjoyable, helping you discover places that perfectly match your
              preferences, budget, and travel style.
            </p>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Our Values
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700">
                    Personalization over generic recommendations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700">
                    Transparency in pricing and information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700">
                    Inclusivity for all types of travelers
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Traveler exploring mountains"
                  className="rounded-lg h-48 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Couple on beach vacation"
                  className="rounded-lg h-64 w-full object-cover"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Scenic landscape view"
                  className="rounded-lg h-64 w-full object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Urban exploration"
                  className="rounded-lg h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutUs;
