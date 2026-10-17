import { useFeatured } from "../features/places/useFeatured";
import { Hero } from "./Hero";
import { LandingNav } from "./LandingNav";
import { ExampleTrip, Faq, FinalCta, HowItWorks, NumbersStrip, PlacesRow, SiteFooter, Why } from "./Sections";
import { useSample } from "./useSample";

export function Landing() {
  const featured = useFeatured(12);
  const sample = useSample();
  // The strip leads with the first few places; the cards further down start with the rest.
  const strip = featured.slice(0, 6);
  const rest = featured.slice(6);
  return (
    <div className="bg-bg">
      <LandingNav />
      <main>
        <Hero places={strip} />
        <NumbersStrip sample={sample} />
        <HowItWorks sample={sample} />
        <ExampleTrip sample={sample} />
        <Why sample={sample} />
        <PlacesRow places={rest} />
        <Faq />
        <FinalCta photos={rest} />
      </main>
      <SiteFooter />
    </div>
  );
}
