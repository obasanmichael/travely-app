import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../theme/ThemeToggle";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { cn } from "../ui/cn";

const LINKS = [
  { id: "how", label: "How it works" },
  { id: "example", label: "Example" },
  { id: "why", label: "Why Travely" },
  { id: "places", label: "Places" },
  { id: "faq", label: "FAQ" },
];

/** The section currently under the top of the screen, so the nav can show where you are. */
function useActiveSection(): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const targets = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    if (typeof IntersectionObserver === "undefined" || targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function LandingNav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-40 flex justify-center px-3 sm:top-5">
      <div
        className={cn(
          "flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-full border py-1.5 pl-4 pr-1.5 text-white backdrop-blur-xl transition-all duration-500 ease-out",
          scrolled || open
            ? "max-w-4xl border-white/15 bg-night/85 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.55)]"
            : "max-w-5xl border-white/10 bg-white/[0.06]"
        )}
      >
        <Logo tone="light" size="sm" />

        <nav aria-label="Main" className="relative hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
          {LINKS.map((link) => {
            const lit = hover === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onMouseEnter={() => setHover(link.id)}
                onFocus={() => setHover(link.id)}
                onBlur={() => setHover(null)}
                aria-current={active === link.id ? "location" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium no-underline transition-colors duration-200",
                  lit || active === link.id ? "text-white" : "text-white/60"
                )}
              >
                {lit && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 -z-0 rounded-full bg-white/10"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative">{link.label}</span>
                {active === link.id && !lit && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sun"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <div className="hidden text-white/80 sm:block">
            <ThemeToggle />
          </div>
          <ButtonLink to="/signin" variant="ghost" size="sm" className="text-white hover:bg-white/10 max-sm:hidden">
            Sign in
          </ButtonLink>
          <ButtonLink to="/app/plan" variant="sun" size="sm">
            Plan my trip
          </ButtonLink>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-white hover:bg-white/10 md:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 -z-10 flex flex-col justify-center gap-1 bg-night px-8 pb-10 pt-24 md:hidden"
          >
            {LINKS.map((link, index) => (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.06, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                className="py-2 font-serif text-5xl tracking-tight text-white no-underline"
              >
                {link.label}
              </motion.a>
            ))}
            <Link to="/signin" className="mt-6 text-lg font-semibold text-white/70 no-underline" onClick={() => setOpen(false)}>
              Sign in
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
