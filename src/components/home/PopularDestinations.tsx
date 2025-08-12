import React from "react";
import { StarIcon } from "lucide-react";
import japanPhoto from "../../assets/kyoto-japan.avif";
const PopularDestinations: React.FC = () => {
  const destinations = [
    {
      name: "Bali, Indonesia",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80",
      rating: 4.8,
      priceRange: "$150 - $250",
      tags: ["Beach", "Culture", "Relaxation"],
    },
    {
      name: "Santorini, Greece",
      image:
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
      rating: 4.9,
      priceRange: "$300 - $400",
      tags: ["Scenic", "Romantic", "Luxury"],
    },
    {
      name: "Kyoto, Japan",
      image: japanPhoto,
      rating: 4.7,
      priceRange: "$200 - $300",
      tags: ["Cultural", "Historic", "Temples"],
    },
    {
      name: "Barcelona, Spain",
      image:
        "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      rating: 4.6,
      priceRange: "$350 - $450",
      tags: ["Architecture", "Nightlife", "Food"],
    },
  ];
  return (
    <section id="destinations" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore some of our most loved travel destinations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform duration-400 hover:-translate-y-3"
            >
              <div className="relative h-56">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-[2px] p-4">
                  <h3 className="text-xl font-bold text-white">
                    {destination.name}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-800 font-medium">
                      {destination.rating}
                    </span>
                  </div>
                  <span className="text-gray-600 text-sm">
                    {destination.priceRange}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default PopularDestinations;
