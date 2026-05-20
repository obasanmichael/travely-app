import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, X as CloseIcon, MapPinIcon } from "lucide-react";
import { navLinks } from "../..";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();
  const isHome = location.pathname === "/";
  const onHero = isHome && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleNavLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const offsetTop = targetSection.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        onHero
          ? "py-5 bg-transparent"
          : isScrolled
            ? "py-3 backdrop-blur-md bg-white/90 shadow-sm"
            : "py-5 bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-3 md:px-5">
        <div className="flex items-center justify-between mx-auto">
          <Link
            to="/"
            className="flex items-center space-x-2 z-10"
            onClick={handleLogoClick}
          >
            <MapPinIcon
              className={`h-7 w-7 ${
                onHero ? "text-blue-400" : "text-blue-500"
              }`}
            />
            <span
              className={`text-2xl font-bold ${
                onHero ? "text-white" : "text-gray-800"
              }`}
            >
              Travely
            </span>
          </Link>

          <nav className="hidden lg:flex items-center">
            <div
              className={`flex rounded-full px-2 py-1 transition-colors ${
                onHero
                  ? "bg-white/10 backdrop-blur-sm"
                  : isScrolled
                    ? "bg-white/80 shadow-sm border border-gray-100"
                    : "bg-gray-100/80"
              }`}
            >
              {navLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.path}
                  onClick={(e) => handleNavLinkClick(e, link.id)}
                  className={`relative px-5 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                    activeSection === link.id
                      ? onHero
                        ? "text-white bg-white/20"
                        : "text-blue-600 bg-blue-50"
                      : onHero
                        ? "text-white/90 hover:text-white"
                        : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="ml-4 hidden lg:block">
            {isAuthenticated ? (
              <button
                onClick={onLogout}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  onHero
                    ? "bg-white/15 text-white border border-white/30 hover:bg-white/25"
                    : "bg-white border border-gray-200 text-gray-800 hover:bg-gray-50"
                }`}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className={`px-5 py-2 rounded-full font-medium transition-colors ${
                  onHero
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          <button
            className={`lg:hidden z-10 ${
              onHero ? "text-white" : "text-gray-700"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-0 left-0 w-full h-screen bg-white z-0 pt-24">
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
