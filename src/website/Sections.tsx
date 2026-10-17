import * as Accordion from "@radix-ui/react-accordion";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ChevronDown, ClipboardList, Heart, ListChecks, ReceiptText, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { useRef } from "react";
import type { Destination, PublicSample } from "../api/client";
import { SeasonRibbon } from "../components/SeasonRibbon";
import { PlaceCard } from "../features/places/PlaceCard";
import { formatNaira } from "../lib/format";
import { ButtonLink } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
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

const STEPS = [
  { Icon: ClipboardList, title: "Tell us about your trip", body: "Where you're starting, when, how long, who's going, your budget and what you enjoy. It takes about a minute." },
  { Icon: ReceiptText, title: "We price the whole thing", body: "Getting there, getting around, food and a place to stay, built from published price data into an honest range." },
  { Icon: ListChecks, title: "Pick with reasons", body: "Every place says why it fits, what it costs against your budget, and which months are best to go." },
];

export function HowItWorks() {
  return (
    <section id="how" className={SECTION}>
      <Reveal inView>
        <h2 className={H2}>Three steps from a budget to a plan.</h2>
      </Reveal>
      <ol className="m-0 mt-14 grid list-none gap-6 p-0 md:grid-cols-3">
        {STEPS.map(({ Icon, title, body }, index) => (
          <li key={title}>
            <Reveal inView index={index} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="absolute -right-3 -top-6 font-serif text-[9rem] leading-none text-line transition-colors group-hover:text-primary-wash" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary-wash text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="relative m-0 mt-8 text-xl font-bold text-ink">{title}</h3>
                <p className="relative m-0 mt-3 text-[15px] leading-relaxed text-muted">{body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
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

const TILE = "relative overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift";

export function Why({ sample }: { sample: PublicSample | null }) {
  return (
    <section id="why" className="bg-bg">
      <div className={SECTION}>
        <Reveal inView>
          <h2 className={H2}>Everything a trip decision needs, in one place.</h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-6">
          <Reveal inView className="md:col-span-4">
            <div className={`${TILE} h-full`}>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <ReceiptText className="h-4 w-4" aria-hidden="true" /> Real cost ranges
              </p>
              <h3 className="m-0 mt-3 max-w-[24ch] text-2xl font-bold text-ink">Know what a trip costs before you commit to it.</h3>
              <p className="mb-0 mt-2 max-w-[52ch] text-[15px] text-muted">
                {sample
                  ? `Here is the real estimate for ${sample.pick.destination.name}: ${sample.travellers} people, a day trip from ${sample.origin}.`
                  : "Every trip is priced as a range from published data, with each part shown separately."}
              </p>
              {sample && <Bars sample={sample} />}
            </div>
          </Reveal>
          <Reveal inView index={1} className="md:col-span-2">
            <div className={`${TILE} h-full`}>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sun className="h-4 w-4" aria-hidden="true" /> Best time to go
              </p>
              <h3 className="m-0 mt-3 text-xl font-bold text-ink">Never arrive in the rains by accident.</h3>
              {sample && (
                <div className="mt-6">
                  <SeasonRibbon scores={sample.pick.destination.month_scores} interactive size="lg" />
                </div>
              )}
            </div>
          </Reveal>
          <Reveal inView index={1} className="md:col-span-2">
            <div className={`${TILE} h-full`}>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" /> Matched to you
              </p>
              <h3 className="m-0 mt-3 text-xl font-bold text-ink">Places that suit what you enjoy.</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Waterfalls", "Hiking", "History", "Beaches", "Food", "Wildlife", "Nightlife", "Photography"].map((label, i) => (
                  <span key={label} className={`rounded-full px-3 py-1.5 text-sm font-medium ${i % 3 === 0 ? "bg-sun text-night" : "bg-primary-wash text-primary"}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal inView index={2} className="md:col-span-2">
            <div className={`${TILE} h-full`}>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" /> No surprises
              </p>
              <h3 className="m-0 mt-3 text-xl font-bold text-ink">Every number shows its source.</h3>
              <p className="mb-0 mt-2 text-[15px] text-muted">
                Transport and food prices come from the National Bureau of Statistics. Climate comes from NASA. Missing prices are
                marked as missing, never made up.
              </p>
            </div>
          </Reveal>
          <Reveal inView index={3} className="md:col-span-2">
            <div className={`${TILE} h-full bg-gradient-to-br from-primary to-primary-strong text-white`}>
              <p className="m-0 flex items-center gap-2 text-sm font-semibold text-white/80">
                <Heart className="h-4 w-4" aria-hidden="true" /> Save and compare
              </p>
              <h3 className="m-0 mt-3 text-xl font-bold">Keep your shortlist and come back to it.</h3>
              <p className="mb-0 mt-2 text-[15px] text-white/80">Save places and reopen past searches from any device.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function PlacesRow({ places }: { places: Destination[] }) {
  if (places.length === 0) return null;
  return (
    <section id="places" className={SECTION}>
      <Reveal inView>
        <h2 className={H2}>Places worth a look.</h2>
      </Reveal>
      <p className="m-0 mt-4 text-muted">Yellow months on each ribbon are the best time to go.</p>
      <ul className="m-0 mt-10 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {places.slice(0, 6).map((place, index) => (
          <li key={place.id}>
            <Reveal inView index={index}>
              <PlaceCard place={place} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

const FAQS = [
  { q: "Where do the prices come from?", a: "Transport and food costs come from the National Bureau of Statistics, published monthly. Places to stay and entry fees are checked by our team against each venue's own published rates, and every figure keeps its source and date. Anything we haven't verified is labelled, never guessed." },
  { q: "Can I book trips on Travely?", a: "Not yet. Travely helps you decide where to go and what to budget. Costs are estimates to plan with, not quotes." },
  { q: "How current is the information?", a: "Official price series are refreshed every month and our own checks are dated, so you can see how fresh each number is. Older data lowers the confidence shown on an estimate." },
  { q: "Do I need an account?", a: "No. You can plan a trip as a guest. Create an account to keep your saved places and past trips on every device, and anything you saved as a guest comes with you." },
  { q: "What happens to my data?", a: "We only keep what the app needs: your account, your searches and your saved places. You can download or delete all of it from Settings at any time." },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
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
          <p className="m-0 font-serif text-2xl text-ink">travely</p>
          <p className="m-0 mt-2 max-w-[40ch] text-sm text-muted">Costs are estimates to help you plan, not quotes.</p>
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
