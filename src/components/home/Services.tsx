import React from "react";
import {
  MapIcon,
  DollarSignIcon,
  UmbrellaIcon,
  HotelIcon,
  CalendarIcon,
  UserIcon,
} from "lucide-react";
const Services: React.FC = () => {
  const services = [
    {
      icon: <MapIcon className="h-6 w-6 text-blue-500" />,
      title: "Destination Matching",
      description:
        "Find destinations that perfectly match your travel style and preferences.",
    },
    {
      icon: <DollarSignIcon className="h-6 w-6 text-blue-500" />,
      title: "Budget Planning",
      description:
        "Get recommendations that respect your budget with transparent pricing.",
    },
    {
      icon: <UmbrellaIcon className="h-6 w-6 text-blue-500" />,
      title: "Activity Recommendations",
      description:
        "Discover activities and attractions that align with your interests.",
    },
    {
      icon: <HotelIcon className="h-6 w-6 text-blue-500" />,
      title: "Accommodation Options",
      description:
        "Find the perfect place to stay based on your comfort preferences.",
    },
    {
      icon: <CalendarIcon className="h-6 w-6 text-blue-500" />,
      title: "Seasonal Advice",
      description: "Learn the best time to visit your chosen destinations.",
    },
    {
      icon: <UserIcon className="h-6 w-6 text-blue-500" />,
      title: "Personalized Itineraries",
      description:
        "Get custom travel plans designed around your unique preferences.",
    },
  ];
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We help you discover the perfect destination tailored to your
            preferences
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex"
            >
              <div className="mr-4 mt-1">{service.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Services;
