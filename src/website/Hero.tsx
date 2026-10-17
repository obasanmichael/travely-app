import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Destination } from "../api/client";
import { ButtonLink } from "../ui/Button";
import { TicketCard } from "./TicketCard";

const HEADLINE = "Trips that fit your budget and your taste.";
const RISE = [0.2, 0.7, 0.2, 1] as const;

function Headline() {
  const reduce = useReducedMotion();
  return (
    <h1 className="m-0 max-w-[13ch] font-serif text-[clamp(3.25rem,9.5vw,8.5rem)] leading-[0.94] tracking-[-0.035em]">
      {HEADLINE.split(" ").map((word, index) => (
        <span key={index}>
          {/* Each word slides up out of its own mask: one entrance for the whole page. */}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + index * 0.07, ease: RISE }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </h1>
  );
}

/** A slow, endless strip of real places. Pauses under the pointer; plain scrollable row when motion is reduced. */
function Strip({ places }: { places: Destination[] }) {
  const reduce = useReducedMotion();
  if (places.length === 0) return null;
  // Enough copies that the strip is always wider than the screen.
  const unit = places.length >= 6 ? places : [...places, ...places, ...places];
  const copies = [0, 1];
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.7, ease: RISE }}
      className={reduce ? "overflow-x-auto" : "overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"}
    >
      <ul className={`m-0 flex w-max list-none gap-6 p-0 pb-10 pt-4 hover:[animation-play-state:paused] ${reduce ? "" : "animate-marquee"}`}>
        {copies.flatMap((copy) =>
          unit.map((place, index) => (
            <li key={`${copy}-${index}`} className={`w-[min(68vw,17rem)] shrink-0 ${index % 2 ? "mt-12" : ""}`} aria-hidden={copy === 1 || undefined}>
              <TicketCard place={place} decorative={copy === 1} />
            </li>
          ))
        )}
      </ul>
    </motion.div>
  );
}

export function Hero({ places }: { places: Destination[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      <div className="absolute -left-40 top-10 -z-10 h-[34rem] w-[34rem] rounded-full bg-primary/25 blur-[140px]" aria-hidden="true" />
      <div className="absolute -right-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-sun/10 blur-[140px]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 pb-6 pt-36 sm:px-8 sm:pt-44">
        <Headline />
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: RISE }}
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-[44ch]">
            <p className="m-0 text-lg leading-relaxed text-white/70">
              Answer a few questions. Get places you'll love, what the trip will really cost from official price data, and the best month to go.
            </p>
            <p className="m-0 mt-3 text-sm text-white/50">Travely covers Nigeria today. More countries are coming soon.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink to="/app/plan" variant="sun" size="lg">
              Plan my trip <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <a href="#how" className="rounded-full px-5 py-3 text-base font-semibold text-white no-underline hover:bg-white/10">
              See how it works
            </a>
          </div>
        </motion.div>
      </div>
      <div className="mt-10">
        <Strip places={places} />
      </div>
    </section>
  );
}
