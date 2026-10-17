import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Destination, PublicSample } from "../api/client";
import { CostMeter } from "../components/CostMeter";
import { SeasonRibbon } from "../components/SeasonRibbon";
import { formatNaira, monthName } from "../lib/format";
import { ButtonLink } from "../ui/Button";

export function Hero({ backdrop, sample }: { backdrop?: Destination; sample: PublicSample | null }) {
  const reduce = useReducedMotion();
  const pick = sample?.pick;
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {backdrop?.photo && (
        <img
          src={backdrop.photo.url}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full animate-kenburns object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_15_28/0.88)_0%,rgb(10_15_28/0.55)_45%,rgb(10_15_28/0.15)_100%),linear-gradient(to_bottom,rgb(10_15_28/0.55)_0%,transparent_30%,transparent_70%,rgb(10_15_28/0.7)_100%)]" />
      <div className="absolute -right-32 top-24 -z-10 h-96 w-96 rounded-full bg-primary/30 blur-[120px]" />

      <div className="mx-auto grid min-h-[92svh] max-w-7xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="m-0 mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur"
          >
            <span className="h-2 w-2 rounded-full bg-sun" aria-hidden="true" />
            Real prices. Real seasons. No guesswork.
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="m-0 max-w-[14ch] font-serif text-[clamp(3rem,8vw,6.25rem)] leading-[0.98] tracking-tight"
          >
            Trips that fit your budget and your taste.
          </motion.h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mb-0 mt-7 max-w-[46ch] text-lg leading-relaxed text-white/75"
          >
            Answer a few questions. Get places you'll love, what the trip will really cost, and the best month to go.
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <ButtonLink to="/app/plan" variant="sun" size="lg">
              Plan my trip <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
            <a href="#how" className="rounded-full px-5 py-3 text-base font-semibold text-white no-underline hover:bg-white/10">
              See how it works
            </a>
          </motion.div>
        </div>

        {pick && sample && (
          <motion.aside
            aria-label="Example trip"
            initial={reduce ? false : { opacity: 0, y: 40, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative mx-auto w-full max-w-md lg:ml-auto"
          >
            <div className="animate-float overflow-hidden rounded-[28px] border border-white/15 bg-surface text-ink shadow-[0_40px_80px_-20px_rgb(0_0_0/0.6)]">
              <div className="relative aspect-[4/3] bg-primary-wash">
                {pick.destination.photo && <img src={pick.destination.photo.url} alt="" className="h-full w-full object-cover" />}
                <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-bold text-night">Example result</span>
              </div>
              <div className="flex flex-col gap-4 p-5">
                <div>
                  <p className="m-0 text-xl font-bold">{pick.destination.name}</p>
                  <p className="m-0 text-sm text-muted">{pick.destination.state}</p>
                </div>
                <SeasonRibbon scores={pick.destination.month_scores} month={sample.month} />
                <CostMeter low={pick.cost.total.low} high={pick.cost.total.high} budget={sample.budget} />
                <p className="m-0 text-[13px] text-muted">
                  {sample.travellers} people, a day trip from {sample.origin}, {formatNaira(sample.budget)}, {monthName(sample.month)}.
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
      {backdrop?.photo && (
        <a
          href={backdrop.photo.file_page_url}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-3 left-5 text-[11px] text-white/50 no-underline hover:text-white/80 sm:left-8"
        >
          Photo: {backdrop.photo.author}, {backdrop.photo.licence}
        </a>
      )}
    </section>
  );
}
