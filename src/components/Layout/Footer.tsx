import { Link } from "react-router-dom";
import {
  MapPinIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
} from "lucide-react";

const Footer = () => {
  // Smooth scroll function (same as navbar)
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Handle logo click - scroll to top of page
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Quick links data - mapped for better maintainability
  const quickLinks = [
    { title: "How It Works", path: "/#how-it-works", id: "how-it-works" },
    { title: "Destinations", path: "/#destinations", id: "destinations" },
    { title: "Services", path: "/#services", id: "services" },
    { title: "About Us", path: "/#about", id: "about" },
  ];

  // Support links data
  const supportLinks = [
    { title: "FAQs", href: "#" },
    { title: "Contact Us", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
    { title: "Cookie Policy", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={handleLogoClick}
            >
              <MapPinIcon className="h-7 w-7 text-blue-400" />
              <span className="text-xl font-bold">Travely</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Discover your perfect travel destination with personalized
              recommendations based on your preferences and budget.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.path}
                    onClick={(e) => handleSmoothScroll(e, link.id)}
                    className="hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              {supportLinks.map((link) => (
                <li key={link.title}>
                  <a
                    href={link.href}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for travel tips and exclusive offers.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md bg-white focus:outline-none flex-1 text-gray-900"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition-colors px-4 py-2 rounded-r-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Travely. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
