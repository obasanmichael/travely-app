import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, X as CloseIcon, MapPinIcon } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px", // Trigger when section is 20% from top
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Smooth scroll function
  const handleNavLinkClick = (
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
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const navLinks = [
    {
      title: "How It Works",
      path: "/#how-it-works",
      id: "how-it-works",
    },
    {
      title: "Destinations",
      path: "/#destinations",
      id: "destinations",
    },
    {
      title: "Services",
      path: "/#services",
      id: "services",
    },
    {
      title: "About Us",
      path: "/#about",
      id: "about",
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 backdrop-blur-md bg-white/70 shadow-sm"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div
          className={`flex items-center justify-between mx-auto ${
            isScrolled ? "max-w-6xl" : "max-w-7xl"
          }`}
        >
          <Link
            to="/"
            className="flex items-center space-x-2 z-10"
            onClick={handleLogoClick}
          >
            <MapPinIcon className="h-7 w-7 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">Travely</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div
              className={`flex rounded-full ${
                isScrolled
                  ? "bg-white/80 shadow-sm border border-gray-100"
                  : "bg-white/10"
              } px-2 py-1`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.path}
                  onClick={(e) => handleNavLinkClick(e, link.id)}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    activeSection === link.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.title}
                </a>
              ))}
            </div>
            <div className="ml-4">
              {isAuthenticated ? (
                <button
                  onClick={onLogout}
                  className="px-5 py-2 rounded-lg bg-red-300 text-white font-medium hover:bg-red-500 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="px-5 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 z-10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-0 left-0 w-full h-screen bg-white z-0 pt-24">
          <div className="container mx-auto text-center flex-col px-4 py-3 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.title}
                href={link.path}
                onClick={(e) => handleNavLinkClick(e, link.id)}
                className={`block py-3 text-lg font-medium ${
                  activeSection === link.id ? "text-blue-600" : "text-gray-700"
                }`}
              >
                {link.title}
              </a>
            ))}
            <div className="pt-4 border-t flex justify-center border-gray-100">
              {isAuthenticated ? (
                <button
                  className="block py-2 px-5 rounded-lg bg-red-500 text-white text-center font-medium"
                  onClick={onLogout}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block py-3 px-5 rounded-full bg-blue-500 text-white text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
