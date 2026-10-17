import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme/ThemeToggle";
import { Button, ButtonLink } from "../ui/Button";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#why", label: "Why Travely" },
  { href: "#places", label: "Places" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
        scrolled || open ? "border-b border-white/10 bg-night/92 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="font-serif text-2xl text-white no-underline">
          travely
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-medium text-white/75 no-underline hover:text-white">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden text-white/80 sm:block">
            <ThemeToggle />
          </div>
          <ButtonLink to="/signin" variant="ghost" size="sm" className="text-white hover:bg-white/10 max-sm:hidden">
            Sign in
          </ButtonLink>
          <ButtonLink to="/app/plan" variant="sun" size="sm">
            Plan my trip
          </ButtonLink>
          <Button
            variant="ghost"
            size="sm"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="h-9 w-9 px-0 text-white hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-5 pb-5 md:hidden">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-white no-underline hover:bg-white/10">
              {link.label}
            </a>
          ))}
          <Link to="/signin" className="rounded-xl px-3 py-3 text-base font-medium text-white no-underline hover:bg-white/10">
            Sign in
          </Link>
        </nav>
      )}
    </header>
  );
}
