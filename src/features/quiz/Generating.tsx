import { useEffect, useState } from "react";
import { SeasonRibbon } from "../../components/SeasonRibbon";

const MESSAGES = ["Pricing getting there and back…", "Pricing food and getting around…", "Checking the season for each place…", "Matching places to what you enjoy…"];
const DEMO = [1, 1, 0.9, 0.6, 0.35, 0.25, 0.2, 0.3, 0.4, 0.7, 0.95, 1];

export function Generating() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => Math.min(i + 1, MESSAGES.length - 1)), 600);
    return () => clearInterval(timer);
  }, []);
  return (
    <div role="status" aria-live="polite" className="mx-auto flex max-w-md flex-col items-center gap-8 py-24 text-center">
      <div className="w-full">
        <SeasonRibbon scores={DEMO} animate size="lg" />
      </div>
      <h2 className="m-0 font-serif text-4xl tracking-tight text-ink">Finding your places</h2>
      <p className="m-0 min-h-6 text-muted">{MESSAGES[index]}</p>
    </div>
  );
}
