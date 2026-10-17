import * as Accordion from "@radix-ui/react-accordion";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { ArrowRight, ChevronDown, ClipboardList, Heart, ListChecks, ReceiptText, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import type { Destination, PublicSample } from "../api/client";
import { CostMeter } from "../components/CostMeter";
import { SeasonRibbon } from "../components/SeasonRibbon";
import { formatNaira, monthName } from "../lib/format";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { TicketCard } from "./TicketCard";
import { useCountUp } from "./useCountUp";

const SECTION = "mx-auto w-full max-w-7xl px-5 py-24 sm:px-8";
const H2 = "m-0 max-w-[18ch] font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-tight text-ink";

function Stat({ value, label, start }: { value: number; label: string; start: boolean }) {
  const shown = useCountUp(value, start);
  return (
    <div>
      <p className="m-0 font-serif text-5xl tabular-nums text-ink">{shown.toLocaleString("en-NG")}</p>
      <p className="m-0 mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export function NumbersStrip({ sample }: { sample: PublicSample | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section ref={ref} aria-label="Travely in numbers" className="border-b border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-3 sm:px-8">
        <Stat value={sample?.places ?? 0} label="places across the country" start={seen && !!sample} />
        <Stat value={sample?.states ?? 0} label="states and territories covered" start={seen && !!sample} />
        <div>
          <p className="m-0 font-serif text-5xl text-ink">Official</p>
          <p className="m-0 mt-1 text-sm text-muted">price data, refreshed every month</p>
        </div>
      </div>
    </section>
  );
}

const COSTED = ["Getting there", "Getting around", "Food", "A place to stay", "Entry fees"];

const STEPS = [
  { Icon: ClipboardList, title: "Tell us about your trip", body: "Where you're starting, when, how long, who's going, your budget and what you enjoy. It takes about a minute." },
  { Icon: ReceiptText, title: "We price the whole thing", body: "Getting there, getting around, food and a place to stay, built from published price data into an honest range." },
  { Icon: ListChecks, title: "Pick with reasons", body: "Every place says why it fits, what it costs against your budget, and which months are best to go." },
];

export function HowItWorks({ sample }: { sample: PublicSample | null }) {
  const reduce = useReducedMotion();
  const track = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  const extras = [
    <div key="1" className="mt-5 flex flex-wrap gap-2">
      {["Lagos", "December", "3 days", "2 people", "₦400,000"].map((chip) => (
        <span key={chip} className="rounded-full border border-line bg-surface px-3 py-1 text-sm text-ink">
          {chip}
        </span>
      ))}
    </div>,
    <div key="2" className="mt-5 flex flex-wrap gap-2">
      {COSTED.map((part) => (
        <span key={part} className="rounded-full bg-primary-wash px-3 py-1 text-sm font-medium text-primary">
          {part}
        </span>
      ))}
    </div>,
    sample ? (
      <div key="3" className="mt-5 max-w-sm">
        <SeasonRibbon scores={sample.pick.destination.month_scores} />
      </div>
    ) : null,
  ];

  return (
    <section id="how" className={`${SECTION} scroll-mt-16`}>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal inView>
            <h2 className={H2}>Three steps from a budget to a plan.</h2>
            <p className="mb-8 mt-5 max-w-[40ch] text-lg text-muted">No spreadsheets, no twenty open tabs. Your answers in, a priced shortlist out.</p>
            <ButtonLink to="/app/plan" variant="primary" size="lg">
              Start now <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </ButtonLink>
          </Reveal>
        </div>
        <ol ref={track} className="relative m-0 list-none p-0 pl-16">
          <span className="absolute bottom-3 left-[1.375rem] top-3 w-px bg-line" aria-hidden="true" />
          <motion.span
            className="absolute bottom-3 left-[1.375rem] top-3 w-0.5 origin-top rounded-full bg-primary"
            style={reduce ? undefined : { scaleY: fill }}
            aria-hidden="true"
          />
          {STEPS.map(({ Icon, title, body }, index) => (
            <li key={title} className="relative pb-20 last:pb-0">
              <span className="absolute -left-16 top-0 grid h-11 w-11 place-items-center rounded-full border border-line bg-bg font-serif text-xl text-ink" aria-hidden="true">
                {index + 1}
              </span>
              <Reveal inView>
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="m-0 mt-3 text-2xl font-bold tracking-tight text-ink">{title}</h3>
                <p className="m-0 mt-2 max-w-[46ch] text-[17px] leading-relaxed text-muted">{body}</p>
                {extras[index]}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const COMPONENT_LABEL: Record<string, string> = {
  intercity_transport: "Getting there and back",
  local_transport: "Getting around",
  food: "Food",
  accommodation: "Where to stay",
  entry_fees: "Entry fees",
};

function Bars({ sample }: { sample: PublicSample }) {
  const reduce = useReducedMotion();
  const parts = sample.pick.cost.components.filter((c) => c.high > 0);
  const max = Math.max(...parts.map((c) => c.high), 1);
  return (
    <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
      {parts.map((part, index) => (
        <li key={part.name}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-ink">{COMPONENT_LABEL[part.name] ?? part.name}</span>
            <span className="tabular-nums text-muted">
              {formatNaira(part.low)}–{formatNaira(part.high)}
            </span>
          </div>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={reduce ? false : { width: 0 }}
              whileInView={{ width: `${(part.high / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.12, ease: "easeOut" }}
              style={reduce ? { width: `${(part.high / max) * 100}%` } : undefined}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ExampleTrip({ sample }: { sample: PublicSample | null }) {
  if (!sample) return null;
  const { pick } = sample;
  return (
    <section id="example" className="scroll-mt-16 border-y border-line bg-surface">
      <div className={`${SECTION} grid items-center gap-14 lg:grid-cols-2 lg:gap-20`}>
        <div>
          <Reveal inView>
            <h2 className={H2}>See a trip priced to the naira.</h2>
            <p className="mb-0 mt-5 max-w-[46ch] text-lg text-muted">
              A real result: {sample.travellers} people, a day trip from {sample.origin} to {pick.destination.name} in {monthName(sample.month)}, on a budget of{" "}
              {formatNaira(sample.budget)}. Every part of the cost is a range, shown on its own.
            </p>
            <Bars sample={sample} />
          </Reveal>
        </div>
        <Reveal inView index={1}>
          <aside aria-label="Example trip" className="mx-auto w-full max-w-md overflow-hidden rounded-[32px] border border-line bg-bg">
            <div className="relative aspect-[4/3] bg-primary-wash">
              {pick.destination.photo && <img src={pick.destination.photo.url} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="flex flex-col gap-5 p-6">
              <div>
                <p className="m-0 font-serif text-3xl leading-none tracking-tight text-ink">{pick.destination.name}</p>
                <p className="m-0 mt-1.5 text-sm text-muted">{pick.destination.state}</p>
              </div>
              <SeasonRibbon scores={pick.destination.month_scores} month={sample.month} />
              <CostMeter low={pick.cost.total.low} high={pick.cost.total.high} budget={sample.budget} />
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

/** A tile whose surface lights up under the pointer. */
function Tile({ className, children }: { className?: string; children: ReactNode }) {
  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - box.top}px`);
  };
  return (
    <div onPointerMove={follow} className={cn("group relative h-full overflow-hidden rounded-[28px] border border-line bg-surface p-7", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgb(43 179 168 / 0.14), transparent 70%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export function Why({ sample }: { sample: PublicSample | null }) {
  return (
    <section id="why" className="scroll-mt-16 bg-bg">
      <div className={SECTION}>
        <Reveal inView>
          <h2 className={H2}>Everything a trip decision needs, in one place.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Reveal inView>
            <Tile>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sun className="h-4 w-4" aria-hidden="true" /> Best time to go
              </p>
              <h3 className="m-0 mt-3 text-2xl font-bold text-ink">Never arrive in the rains by accident.</h3>
              <p className="mb-0 mt-2 max-w-[48ch] text-[15px] text-muted">Every place shows its twelve months at a glance. Hover a month to see the verdict.</p>
              {sample && (
                <div className="mt-6">
                  <SeasonRibbon scores={sample.pick.destination.month_scores} interactive size="lg" />
                </div>
              )}
            </Tile>
          </Reveal>
          <Reveal inView index={1}>
            <Tile>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Matched to you
              </p>
              <h3 className="m-0 mt-3 text-2xl font-bold text-ink">Places that suit what you enjoy.</h3>
              <p className="mb-0 mt-2 max-w-[48ch] text-[15px] text-muted">Tell us what you love and what you only like. We match on that, not on what's popular.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Waterfalls", "Hiking", "History", "Beaches", "Food", "Wildlife", "Nightlife", "Photography"].map((label, i) => (
                  <span key={label} className={`rounded-full px-3 py-1.5 text-sm font-medium ${i % 3 === 0 ? "bg-sun text-night" : "bg-primary-wash text-primary"}`}>
                    {label}
                  </span>
                ))}
              </div>
            </Tile>
          </Reveal>
          <Reveal inView>
            <Tile>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> No surprises
              </p>
              <h3 className="m-0 mt-3 text-2xl font-bold text-ink">Every number shows its source.</h3>
              <p className="mb-0 mt-2 max-w-[48ch] text-[15px] text-muted">
                Transport and food prices come from the National Bureau of Statistics. Climate comes from NASA. Missing prices are
                marked as missing, never made up.
              </p>
            </Tile>
          </Reveal>
          <Reveal inView index={1}>
            <Tile className="border-transparent bg-primary text-white">
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-white/80">
                <Heart className="h-4 w-4" aria-hidden="true" /> Save and compare
              </p>
              <h3 className="m-0 mt-3 text-2xl font-bold">Keep your shortlist and come back to it.</h3>
              <p className="mb-0 mt-2 max-w-[48ch] text-[15px] text-white/80">Save places and reopen past searches from any device.</p>
            </Tile>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function PlacesRow({ places }: { places: Destination[] }) {
  if (places.length === 0) return null;
  return (
    <section id="places" className={`${SECTION} scroll-mt-16`}>
      <Reveal inView>
        <h2 className={H2}>Places worth a look.</h2>
      </Reveal>
      <p className="m-0 mt-4 text-muted">Yellow months on each ticket are the best time to go. Tilt one to see.</p>
      <ul className="m-0 mt-12 grid list-none gap-x-8 gap-y-12 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {places.slice(0, 6).map((place, index) => (
          <li key={place.id} className={index % 3 === 1 ? "lg:mt-14" : ""}>
            <Reveal inView index={index % 3}>
              <TicketCard place={place} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FAQS = [
  { q: "Where do the prices come from?", a: "Transport and food costs come from the National Bureau of Statistics, published monthly. Places to stay and entry fees are checked by our team against each venue's own published rates, and every figure keeps its source and date. Anything we haven't verified is labelled, never guessed." },
  { q: "Which countries does Travely cover?", a: "Only Nigeria for now, with places in every state. We're building toward more countries, and each one will launch with the same official price data and honest ranges rather than guesses." },
  { q: "Can I book trips on Travely?", a: "Not yet. Travely helps you decide where to go and what to budget. Costs are estimates to plan with, not quotes." },
  { q: "How current is the information?", a: "Official price series are refreshed every month and our own checks are dated, so you can see how fresh each number is. Older data lowers the confidence shown on an estimate." },
  { q: "Do I need an account?", a: "No. You can plan a trip as a guest. Create an account to keep your saved places and past trips on every device, and anything you saved as a guest comes with you." },
  { q: "What happens to my data?", a: "We only keep what the app needs: your account, your searches and your saved places. You can download or delete all of it from Settings at any time." },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
      <Reveal inView>
        <h2 className={H2}>Questions, answered.</h2>
      </Reveal>
      <Accordion.Root type="single" collapsible className="mt-10 divide-y divide-line border-y border-line">
        {FAQS.map((item) => (
          <Accordion.Item key={item.q} value={item.q}>
            <Accordion.Header className="m-0">
              <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink">
                {item.q}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[acc-up_250ms_ease-out] data-[state=open]:animate-[acc-down_300ms_ease-out]">
              <p className="m-0 pb-6 pr-8 leading-relaxed text-muted">{item.a}</p>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </section>
  );
}

export function FinalCta({ photos }: { photos: Destination[] }) {
  const shots = photos.filter((p) => p.photo).slice(0, 3);
  return (
    <section className="px-5 pb-24 sm:px-8">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-night px-8 py-20 text-center text-white sm:px-16">
        <div className="absolute inset-0 -z-10 grid grid-cols-3 opacity-25" aria-hidden="true">
          {shots.map((p) => (
            <img key={p.id} src={p.photo!.url} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/80 to-night/60" />
        <h2 className="mx-auto m-0 max-w-[16ch] font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-tight">Your next trip is a minute away.</h2>
        <p className="mx-auto mb-0 mt-5 max-w-[44ch] text-lg text-white/75">Answer a few questions and see places that fit, with honest costs.</p>
        <div className="mt-9 flex justify-center">
          <ButtonLink to="/app/plan" variant="sun" size="lg">
            Plan my trip
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="m-0 mt-2 max-w-[40ch] text-sm text-muted">Costs are estimates to help you plan, not quotes. Nigeria today, more countries soon.</p>
        </div>
        <p className="m-0 max-w-[60ch] text-[13px] leading-relaxed text-muted">
          Places from <a className="underline" href="https://www.wikidata.org">Wikidata</a>, photos from{" "}
          <a className="underline" href="https://commons.wikimedia.org">Wikimedia Commons</a>, climate from{" "}
          <a className="underline" href="https://power.larc.nasa.gov">NASA POWER</a>, prices from the{" "}
          <a className="underline" href="https://nigerianstat.gov.ng">National Bureau of Statistics</a> and our own checks.
        </p>
      </div>
    </footer>
  );
}
