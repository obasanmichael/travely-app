import React from "react";
import Hero from "../components/home/Hero";
import Services from "../components/home/Services";
import AboutUs from "../components/home/AboutUs";
import HowItWorks from "../components/home/HowItWorks";
import PopularDestinations from "../components/home/PopularDestinations";
const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <PopularDestinations />
      <Services />
      <AboutUs />
    </div>
  );
};
export default Home;
